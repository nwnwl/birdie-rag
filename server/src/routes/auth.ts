import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/index.js';
import { signToken, authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 注册
router.post('/register', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6位' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const result = db
      .prepare('INSERT INTO users (username, password) VALUES (?, ?)')
      .run(username, hashed);

    const token = signToken(result.lastInsertRowid as number);
    res.json({ token, userId: result.lastInsertRowid, username });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 登录
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }

    const token = signToken(user.id);
    res.json({ token, userId: user.id, username: user.username });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 获取当前用户
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  const user = db
    .prepare('SELECT id, username, created_at FROM users WHERE id = ?')
    .get(req.userId!) as any;
  res.json(user);
});

export default router;
