import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 手动加载 .env 文件
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

import express from 'express';
import cors from 'cors';
import { initDB } from './db/index.js';
import { rebuildVectorStore } from './services/rag.js';
import authRoutes from './routes/auth.js';
import docRoutes from './routes/documents.js';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/chat', chatRoutes);

// 初始化数据库
initDB();

// 启动时重建向量库
rebuildVectorStore();

app.listen(PORT, () => {
  console.log(`后端运行在 http://localhost:${PORT}`);
});
