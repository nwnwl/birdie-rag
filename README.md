# Birdie Assistant — 智能文档助手

基于 RAG（检索增强生成）技术的私有文档问答系统。上传文档 → 向量化检索 → 基于文档内容的智能问答。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19, Vite 8, Redux Toolkit, React Router 7, TailwindCSS 4 |
| 后端 | Express 4, TypeScript 5, tsx |
| 数据库 | SQLite (better-sqlite3) |
| LLM | DeepSeek Chat API（通过 @langchain/openai 兼容接口） |
| Embedding | 硅基流动 BAAI/bge-large-zh-v1.5（API） |
| 认证 | JWT + bcryptjs |
| 文档解析 | pdf-parse, mammoth（支持 PDF/DOCX/DOC/TXT/MD） |

## 功能

### 基础功能（全部完成）

- [x] 用户注册 / 登录（JWT 认证，合并到 `/user` 单页面 toggle 切换）
- [x] 文档上传（PDF / DOCX / DOC / TXT / MD，20MB 限制）
- [x] 文档管理（列表展示、重命名、删除，含确认弹窗 + Toast 反馈）
- [x] RAG 问答（检索 Top-4 相关片段 → 拼接上下文 → LLM 生成答案 + 引用来源）
- [x] 问答记录管理（历史列表、点击加载、单条删除）
- [x] 404 页面（全屏背景 + 返回首页链接）
- [x] 路由懒加载（React.lazy + Suspense）
- [x] 路由守卫（无 token 重定向到登录页）

### 加分项

- [x] **流式回答** — SSE 服务端推送 + 前端 ReadableStream + rAF token 节流 + AbortController 防并发竞态，打字机效果
- [x] **响应式设计** — mobile-first，sm/md/lg/xl 四层断点全适配
- [x] **持久化** — Token 持久化自动登录
- [x] **Prettier** — prettier-plugin-tailwindcss 保存时 class 自动排序

## 快速开始

### 1. 环境要求

- Node.js >= 18
- npm >= 9

### 2. 克隆仓库

```bash
git clone <repo-url>
cd RAG
```

### 3. 配置环境变量

在 `server/` 目录下创建 `.env` 文件：

```env
DEEPSEEK_API_KEY=sk-your-deepseek-key
EMBEDDING_API_KEY=sk-your-siliconflow-key
EMBEDDING_BASE_URL=https://api.siliconflow.cn/v1
EMBEDDING_MODEL=BAAI/bge-large-zh-v1.5
JWT_SECRET=your-jwt-secret
```

> DeepSeek API Key 从 [platform.deepseek.com](https://platform.deepseek.com) 获取
> 硅基流动 API Key 从 [siliconflow.cn](https://siliconflow.cn) 获取（免费额度 2000 万 tokens）

### 4. 安装依赖

```bash
# 后端
cd server
npm install

# 前端
cd ../client
npm install
```

### 5. 启动

```bash
# 后端（终端1）
cd server
npm run dev     # → http://localhost:3001

# 前端（终端2）
cd client
npm run dev     # → http://localhost:5173
```

打开浏览器访问 `http://localhost:5173`。

## 项目结构

```
RAG/
├── server/                     # 后端 Express
│   ├── src/
│   │   ├── index.ts            # 入口：Express 配置、路由挂载、DB/向量库初始化
│   │   ├── db/index.ts         # SQLite 表结构（users, documents, chat_history, document_chunks）
│   │   ├── middleware/auth.ts  # JWT 认证中间件
│   │   ├── routes/
│   │   │   ├── auth.ts         # POST /register, /login, GET /me
│   │   │   ├── documents.ts    # POST /upload, GET /, PUT /:id/rename, DELETE /:id
│   │   │   └── chat.ts         # POST /ask (SSE流式), GET /history, DELETE /history/:id
│   │   └── services/rag.ts     # RAG 管道：分块 → embedding → 检索 → LLM
│   ├── uploads/                # 用户上传的文件
│   └── package.json
├── client/                     # 前端 React
│   ├── index.html              # HTML 入口
│   ├── vite.config.ts          # Vite 配置（React + TailwindCSS 插件、API 代理）
│   ├── src/
│   │   ├── main.jsx            # 入口：Redux Provider + StrictMode
│   │   ├── App.jsx             # 路由配置 + 自动登录
│   │   ├── store.js            # Redux store（5个slice）
│   │   ├── index.css           # TailwindCSS + @theme字体 + bootstrap-icons + hide-scrollbar
│   │   ├── services/           # API 服务层（含 AbortController 并发控制）
│   │   │   ├── apiUser.js      # 登录/注册
│   │   │   ├── apiFile.js      # 文档 CRUD
│   │   │   ├── apiChat.js      # 聊天 SSE 流式
│   │   │   └── apiHistory.js   # 历史管理
│   │   ├── features/           # 功能模块
│   │   │   ├── user/           # 登录注册（User.jsx + userSlice.js）
│   │   │   ├── chat/           # 聊天（Chat.jsx + chatSlice.js）
│   │   │   ├── file/           # 文档管理（File.jsx, FileItem.jsx + fileSlice.js）
│   │   │   └── history/        # 历史记录（History.jsx, HistoryItem.jsx + historySlice.js）
│   │   ├── ui/                 # 通用 UI 组件
│   │   │   ├── AppLayout.jsx   # 主布局（Header + 侧边栏 + Outlet + logout弹窗）
│   │   │   ├── Header.jsx      # 顶部 Logo + 标题
│   │   │   ├── Home.jsx        # 首页
│   │   │   ├── Button.jsx      # 按钮（17种type变体 + 共享.btn样式）
│   │   │   ├── Error.jsx       # 错误提示
│   │   │   ├── Message.jsx     # 消息气泡
│   │   │   ├── ErrorPage.jsx   # 404 页面
│   │   │   ├── ProtectedRoute.jsx  # 路由守卫
│   │   │   └── Toast/          # Toast 通知（含去重 + 2秒自动消失）
│   │   └── utils/LazyLoad.jsx  # 懒加载包装器（Suspense + pulse动画）
│   └── package.json
└── CLAUDE.md                   # 项目开发文档
```

## 核心流程

### 文档处理

```
用户上传文档 → 后端解析 (pdf-parse / mammoth / 直接读取)
→ RecursiveCharacterTextSplitter 分块 (chunkSize=500, overlap=50)
→ 硅基流动 API 生成 Embedding (BAAI/bge-large-zh-v1.5)
→ 存入 MemoryVectorStore + SQLite document_chunks 表
```

### 问答流程

```
用户输入问题 → Embedding API 向量化
→ MemoryVectorStore 检索 Top-4 相关片段 (similaritySearch)
→ 拼接上下文 Prompt：[片段i 来源: filename]\n{content}
→ DeepSeek Chat API 生成答案 (temperature=0.3)
→ SSE 流式返回 (text/event-stream)，前端 ReadableStream 读取 + rAF token 节流渲染
→ 答案 + 来源存入 chat_history 表
```

## API 接口

### 认证 (`/api/auth`)

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/register` | 注册（username + password，密码 ≥ 6位） |
| POST | `/api/auth/login` | 登录，返回 JWT token（7天有效） |
| GET | `/api/auth/me` | 获取当前用户信息（需 Bearer token） |

### 文档 (`/api/documents`)

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/documents/upload` | 上传文档（multipart/form-data, file 字段） |
| GET | `/api/documents/` | 获取文档列表 |
| PUT | `/api/documents/:id/rename` | 重命名文档 |
| DELETE | `/api/documents/:id` | 删除文档（含文件 + 向量 + 聊天记录） |

### 聊天 (`/api/chat`)

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/chat/ask` | RAG 问答（SSE 流式返回） |
| GET | `/api/chat/history` | 获取历史记录（最近50条） |
| DELETE | `/api/chat/history/:id` | 删除单条历史 |

## AI 工具使用说明

本项目使用 Claude Code（Anthropic 的 AI 编程助手）辅助开发，以下是详细的 AI 使用情况：

### 后端（server/）— 100% AI 编写

- 所有后端代码由 Claude 编写，包括：Express 服务配置、SQLite 数据库设计、JWT 认证中间件、文档上传/管理 API、RAG 管道（分块/embedding/检索/LLM调用）、SSE 流式输出、向量库重建
- Claude 主导了关键架构决策：选择 MemoryVectorStore 替代 ChromaDB、硅基流动 API embedding 替代本地 HuggingFace 模型（解决大文件上传蓝屏问题）、latin1 → utf8 中文文件名修复

### 前端（client/）— 用户编写 + AI 指导

前端代码由我自己编写，Claude 以"只讲解不写代码"的方式提供指导：

- **架构设计**：Claude 讲解了 Redux Toolkit 的分层结构（store → slice → async thunk → UI）、React Router 路由守卫模式、SSE 流式读取的 ReadableStream 方案
- **概念讲解**：Claude 解释了 `useEffect` 依赖数组、Redux `extraReducers` 监听跨 slice action、Tailwind CSS 的 `absolute` / `h-full` 链条等核心概念
- **调试帮助**：遇到 CSS bug 时（如图片隐藏、Toast 遮挡、`text-md` 无效），Claude 帮我定位问题根因并讲解修复思路，代码由我自己修改
- **具体代码**：所有 .jsx 文件、Redux slice、API service 层均由我理解和手动编写

### 开发过程

整个开发周期约 2-3 周，使用 Claude Code 作为"实时导师"——遇到不懂的概念立即问，理解后再自己动手写。Claude 维护了 CLAUDE.md 作为项目记忆文件，记录每次会话的技术决策和进度。

## License

MIT
