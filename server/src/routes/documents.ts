import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { processDocument, removeDocumentChunks } from '../services/rag.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');
// 确保上传目录存在
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// 修复 multer 中文文件名乱码问题
function fixEncoding(filename: string): string {
  return Buffer.from(filename, 'latin1').toString('utf8');
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const original = fixEncoding(file.originalname);
    const ext = path.extname(original);
    cb(null, uuidv4() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.txt', '.md', '.docx', '.doc'];
    const ext = path.extname(fixEncoding(file.originalname)).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件格式，仅支持 PDF、TXT、MD、DOCX'));
    }
  },
});

const router = Router();

// 上传文档
router.post('/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择文件' });
    }

    const docId = uuidv4();
    const filePath = req.file.path;
    const originalName = fixEncoding(req.file.originalname);

    db.prepare(
      'INSERT INTO documents (id, user_id, filename, original_name, file_size) VALUES (?, ?, ?, ?, ?)'
    ).run(docId, req.userId!, req.file.filename, originalName, req.file.size);

    // 异步处理文档（解析 → 分块 → 向量化），不阻塞响应
    processDocument(docId, filePath, originalName)
      .then(() => {
        db.prepare("UPDATE documents SET status = 'ready' WHERE id = ?").run(docId);
      })
      .catch((err) => {
        console.error('文档处理失败:', err);
        db.prepare("UPDATE documents SET status = 'error' WHERE id = ?").run(docId);
      });

    res.json({ id: docId, filename: req.file.filename, original_name: originalName, file_size: req.file.size, status: 'processing' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 文档列表
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  const docs = db
    .prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.userId!);
  res.json(docs);
});

// 重命名文档
router.put('/:id/rename', authMiddleware, (req: AuthRequest, res) => {
  const docId = req.params.id as string;
  const doc = db
    .prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?')
    .get(docId, req.userId!) as any;

  if (!doc) {
    return res.status(404).json({ error: '文档不存在' });
  }

  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: '名称不能为空' });
  }

  db.prepare('UPDATE documents SET original_name = ? WHERE id = ?').run(name.trim(), docId);
  res.json({ message: '重命名成功', original_name: name.trim() });
});

// 删除文档
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const docId = req.params.id as string;
  const doc = db
    .prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?')
    .get(docId, req.userId!) as any;

  if (!doc) {
    return res.status(404).json({ error: '文档不存在' });
  }

  // 清理数据库记录和向量数据
  db.prepare('DELETE FROM documents WHERE id = ?').run(docId);
  db.prepare('DELETE FROM chat_history WHERE document_id = ?').run(docId);
  removeDocumentChunks(docId);

  const filePath = path.join(uploadsDir, doc.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  res.json({ message: '删除成功' });
});

export default router;
