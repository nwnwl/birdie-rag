import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import fs from 'fs';
import path from 'path';
import db from '../db/index.js';

// 延迟初始化 LLM（等 .env 加载后再读 API Key）
let _llm: ChatOpenAI | null = null;
function getLLM(): ChatOpenAI {
  if (!_llm) {
    _llm = new ChatOpenAI({
      model: 'deepseek-chat',
      temperature: 0.3,
      configuration: {
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: process.env.DEEPSEEK_API_KEY || 'your-api-key',
      },
    });
  }
  return _llm;
}

// 延迟初始化 embedding（等 .env 加载后再读 API Key）
let _embeddings: OpenAIEmbeddings | null = null;
function getEmbeddings(): OpenAIEmbeddings {
  if (!_embeddings) {
    _embeddings = new OpenAIEmbeddings({
      model: process.env.EMBEDDING_MODEL || 'BAAI/bge-large-zh-v1.5',
      batchSize: 512,
      apiKey: process.env.EMBEDDING_API_KEY || 'your-api-key',
      configuration: {
        baseURL: process.env.EMBEDDING_BASE_URL || 'https://api.siliconflow.cn/v1',
      },
    });
  }
  return _embeddings;
}

// 全局向量存储（延迟初始化）
let vectorStore: MemoryVectorStore | null = null;
function initVectorStore(): MemoryVectorStore {
  if (!vectorStore) {
    vectorStore = new MemoryVectorStore(getEmbeddings());
  }
  return vectorStore;
}

// 启动时从数据库重建向量库
export async function rebuildVectorStore(): Promise<void> {
  const chunks = db.prepare(`
    SELECT dc.content, dc.filename
    FROM document_chunks dc
    JOIN documents d ON d.id = dc.doc_id
    WHERE d.status = 'ready'
  `).all() as {
    content: string;
    filename: string;
  }[];

  if (chunks.length === 0) {
    console.log('向量库为空，跳过重建');
    return;
  }

  const docs = chunks.map(
    (c) =>
      new Document({
        pageContent: c.content,
        metadata: { filename: c.filename },
      })
  );

  vectorStore = new MemoryVectorStore(getEmbeddings());
  const batchSize = 5;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    await vectorStore.addDocuments(batch);
  }
  console.log(`向量库重建完成，共 ${chunks.length} 个片段`);
}

async function getVectorStore(): Promise<MemoryVectorStore> {
  return initVectorStore();
}

// 读取文件内容
async function readFileContent(filePath: string, filename: string): Promise<string> {
  const ext = path.extname(filename).toLowerCase();

  if (ext === '.txt' || ext === '.md') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.pdf') {
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === '.docx' || ext === '.doc') {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error(`不支持的文件格式: ${ext}`);
}

// 处理文档：读取 → 分块 → 向量化 → 持久化
export async function processDocument(docId: string, filePath: string, originalName: string) {
  console.log(`开始处理文档: ${originalName}`);

  const text = await readFileContent(filePath, originalName);
  if (!text.trim()) throw new Error('文档内容为空');

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const chunks = await splitter.createDocuments([text], [{ docId, filename: originalName }]);

  // 持久化分块到数据库
  const insert = db.prepare(
    'INSERT INTO document_chunks (doc_id, filename, content) VALUES (?, ?, ?)'
  );
  for (const chunk of chunks) {
    insert.run(docId, originalName, chunk.pageContent);
  }

  // 向量化并分批加入内存向量库（避免大文件413错误）
  const store = await getVectorStore();
  const batchSize = 5;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    await store.addDocuments(batch);
  }

  console.log(`文档处理完成: ${originalName}, 共 ${chunks.length} 个片段`);
}

// 删除文档的向量数据并重建向量库
export async function removeDocumentChunks(docId: string): Promise<void> {
  db.prepare('DELETE FROM document_chunks WHERE doc_id = ?').run(docId);
  // 重建向量库以反映删除
  await rebuildVectorStore();
}

// RAG 问答（流式）
export async function* ragQueryStream(
  question: string
): AsyncGenerator<{ token: string; sources: string[] }> {
  const store = await getVectorStore();

  const count = db.prepare('SELECT COUNT(*) as cnt FROM document_chunks').get() as { cnt: number };
  if (count.cnt === 0) {
    yield { token: '请先上传文档，我才能基于文档内容回答问题。', sources: [] };
    return;
  }

  const docs = await store.similaritySearch(question, 4);

  const sources = docs.map((d) => `${d.metadata.filename}`);

  const context = docs
    .map((d, i) => `[片段${i + 1} 来源: ${d.metadata.filename}]\n${d.pageContent}`)
    .join('\n\n');

  const messages = [
    new SystemMessage(
      '你是一个文档问答助手。请根据提供的文档片段回答问题。如果文档片段中没有相关信息，请如实说"文档中没有提到相关内容"。回答时请引用具体的片段编号和来源文件名。'
    ),
    new HumanMessage(
      `文档片段：\n${context}\n\n用户问题：${question}\n\n请根据以上文档片段回答用户问题。`
    ),
  ];

  const stream = await getLLM().stream(messages);

  for await (const chunk of stream) {
    const token = typeof chunk.content === 'string' ? chunk.content : '';
    if (token) {
      yield { token, sources };
    }
  }
}

// RAG 问答（非流式，保留兼容）
export async function ragQuery(question: string): Promise<{ answer: string; sources: string[] }> {
  const store = await getVectorStore();

  // 检查是否有文档
  const count = db.prepare('SELECT COUNT(*) as cnt FROM document_chunks').get() as { cnt: number };
  if (count.cnt === 0) {
    return { answer: '请先上传文档，我才能基于文档内容回答问题。', sources: [] };
  }

  const docs = await store.similaritySearch(question, 4);

  const sources = docs.map((d) => `${d.metadata.filename}`);

  const context = docs
    .map((d, i) => `[片段${i + 1} 来源: ${d.metadata.filename}]\n${d.pageContent}`)
    .join('\n\n');

  const messages = [
    new SystemMessage(
      '你是一个文档问答助手。请根据提供的文档片段回答问题。如果文档片段中没有相关信息，请如实说"文档中没有提到相关内容"。回答时请引用具体的片段编号和来源文件名。'
    ),
    new HumanMessage(
      `文档片段：\n${context}\n\n用户问题：${question}\n\n请根据以上文档片段回答用户问题。`
    ),
  ];

  const response = await getLLM().invoke(messages);
  const answer = typeof response.content === 'string' ? response.content : '';

  return { answer, sources };
}
