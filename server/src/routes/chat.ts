import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { ragQuery, ragQueryStream } from '../services/rag.js';

const router = Router();

// RAG 问答
router.post('/ask', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { question, documentId } = req.body;
    if (!question?.trim()) {
      return res.status(400).json({ error: '问题不能为空' });
    }

    // SSE 响应头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    let fullAnswer = '';
    let allSources: string[] = [];

    for await (const { token, sources } of ragQueryStream(question)) {
      fullAnswer += token;
      allSources = sources;
      res.write(`data: ${JSON.stringify(token)}\n\n`);
    }

    // 结束标记，附带 sources
    res.write(`data: [DONE]\n\n`);

    // 保存问答记录
    const recordId = uuidv4();
    db.prepare(
      'INSERT INTO chat_history (id, user_id, document_id, question, answer, sources) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(recordId, req.userId!, documentId || null, question, fullAnswer, JSON.stringify(allSources));

    res.end();
  } catch (err: any) {
    console.error('问答出错:', err);
    // 如果 SSE 头已发出，用 SSE 格式推送错误
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: err.message || '问答失败' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      res.status(500).json({ error: err.message || '问答失败' });
    }
  }
});

// 获取问答历史
router.get('/history', authMiddleware, (req: AuthRequest, res) => {
  const history = db
    .prepare('SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50')
    .all(req.userId!);
  res.json(history);
});

// 删除单条历史
router.delete('/history/:id', authMiddleware, (req: AuthRequest, res) => {
  const record = db
    .prepare('SELECT * FROM chat_history WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId!) as any;

  if (!record) {
    return res.status(404).json({ error: '记录不存在' });
  }

  db.prepare('DELETE FROM chat_history WHERE id = ?').run(req.params.id);
  res.json({ message: '删除成功' });
});

export default router;
