# Birdie Assistant - RAG 文档问答系统

全栈 RAG 应用：上传文档 → 向量化 → 基于文档内容的智能问答。

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 19, Vite 8, Redux Toolkit, React Router 7, TailwindCSS 4 |
| 后端 | Express 4, TypeScript 5, tsx (运行时) |
| 数据库 | SQLite (better-sqlite3) |
| AI | DeepSeek Chat API (LLM), 硅基流动 BAAI/bge-large-zh-v1.5 (API embedding) |
| 认证 | JWT (jsonwebtoken), bcryptjs |
| 文档解析 | pdf-parse, mammoth (docx/doc) |

## 项目结构

```
RAG/
├── server/                    # 后端 (Express + TypeScript)
│   ├── src/
│   │   ├── index.ts           # 入口：Express 配置、路由挂载、DB/向量库初始化
│   │   ├── db/index.ts        # SQLite 初始化（users, documents, chat_history, document_chunks 四张表）
│   │   ├── middleware/auth.ts # JWT 认证中间件 + signToken
│   │   ├── routes/auth.ts     # POST /register, /login, GET /me
│   │   ├── routes/documents.ts# POST /upload, GET /, PUT /:id/rename, DELETE /:id
│   │   ├── routes/chat.ts     # POST /ask (RAG问答, SSE流式), GET /history, DELETE /history/:id
│   │   └── services/rag.ts    # RAG 核心：分块、embedding、向量存储、查询
│   ├── package.json
│   └── tsconfig.json
├── client/                    # 前端 (React + Vite)
│   ├── src/
│   │   ├── main.jsx           # 入口：Redux Provider + StrictMode
│   │   ├── App.jsx            # React Router 路由配置
│   │   ├── store.js           # Redux store（user + file + toast + chat + history 五个 slices）
│   │   ├── services/
│   │   │   ├── apiUser.js     # 登录/注册 API 调用
│   │   │   ├── apiFile.js     # 文档上传/列表/删除/重命名 API
│   │   │   ├── apiChat.js     # 聊天 SSE 流式 API（ReadableStream + rAF token节流）
│   │   │   └── apiHistory.js  # 聊天历史 GET/DELETE API
│   │   ├── features/
│   │   │   ├── user/          # userSlice.js, User.jsx（登录+注册合并页面, toggle切换）
│   │   │   ├── chat/          # Chat.jsx, chatSlice.js（流式渲染 + 自动滚动 + localStorage持久化）
│   │   │   ├── file/          # File.jsx, FileItem.jsx, fileSlice.js
│   │   │   └── history/       # History.jsx, HistoryItem.jsx, historySlice.js
│   │   ├── ui/
│   │   │   ├── Home.jsx       # 首页（Hero + "Let's Start" CTA）
│   │   │   ├── Button.jsx     # 可复用按钮组件
│   │   │   ├── Error.jsx      # 可复用错误提示组件
│   │   │   ├── Message.jsx    # 聊天消息渲染组件
│   │   │   ├── ErrorPage.jsx  # 404 页面（全屏背景 + 返回首页链接）
│   │   │   ├── ProtectedRoute.jsx # 路由守卫（无 token 重定向到 /user）
│   │   │   └── Toast/         # Toast.jsx, ToastItem.jsx, toastSlice.js（去重 + 自动消失）
│   │   └── utils/
│   │       └── LazyLoad.jsx   # Suspense + fallback 懒加载包装器
│   ├── vite.config.js         # Vite 配置：React 插件 + TailwindCSS + API 代理到 :3001
│   └── package.json
├── .claude/settings.local.json
└── CLAUDE.md                  # 本文件
```

## 开发进度

### 后端 ✅ 完成
- [x] Express + CORS + JSON 解析
- [x] SQLite 数据库（users, documents, chat_history, document_chunks）
- [x] JWT 认证（注册/登录/获取当前用户）
- [x] 文档上传（multer, 支持 PDF/TXT/MD/DOCX/DOC, 20MB 限制）
- [x] 中文文件名修复（latin1 → utf8）
- [x] RAG 管道：分块(500字符,50重叠) → 硅基流动 API embedding → MemoryVectorStore → DeepSeek LLM 问答
- [x] 文档 CRUD（列表/重命名/删除，含向量清理）
- [x] 聊天记录持久化
- [x] 启动时从 DB 重建向量库

### 前端 ✅ 完成
- [x] 路由：/ (首页), /user (登录+注册合并), /chat, /file, * (404)
- [x] Redux store 五个 slice：user + file + toast + chat + history
- [x] 登录/注册合并表单（/user, toggle切换）+ 错误处理
- [x] AppLayout（Header + 侧边栏 + Outlet）
- [x] Lazy loading（代码分割）
- [x] TailwindCSS v4 + 自定义字体
- [x] Vite 代理 (/api → :3001, /uploads → :3001)
- [x] Token 持久化（localStorage）+ 自动登录
- [x] File 页面上传/列表/删除/重命名（含轮询、三种状态样式、编辑模式切换、focus-visible无障碍）
- [x] API 服务层（apiUser.js, apiFile.js, apiChat.js, apiHistory.js 全部完成）
- [x] 路由守卫（ProtectedRoute.jsx 已创建）
- [x] Toast 提示组件（上传/删除/重命名/刷新的成功失败反馈，含去重逻辑和自动消失）
- [x] 删除确认弹窗
- [x] Chat 页面：chatSlice + apiChat + 消息渲染 + 自动滚动
- [x] History 侧边栏：接入后端历史数据 + click-to-load 加载对话 + logout 时自动清空
- [x] 404 页面（ErrorPage.jsx，全屏背景 + 返回首页链接）
- [x] 来源引用：LLM 回答中已自然展示片段号和文档来源
- [x] logout 清空：chatSlice + historySlice 在 extraReducers 中监听 logout 重置 state
- [x] 流式输出（后端 SSE + 前端 ReadableStream + rAF token节流）+ Loading指示器
- [x] 历史删除功能（DELETE /api/chat/history/:id + 确认弹窗 + chat区联动清空）
- [x] 全项目响应式适配（mobile-first, sm/md/lg/xl 四层断点），所有页面已适配
- [x] README.md（含 AI 使用说明、技术栈、核心流程、API 文档）

## 运行命令

```bash
# 后端 (server/)
cd server
npm run dev      # tsx watch src/index.ts → http://localhost:3001

# 前端 (client/)
cd client
npm run dev      # vite → http://localhost:5173
```

## 关键设计决策

- **LLM**: 使用 DeepSeek API（通过 @langchain/openai 兼容接口），baseURL 指向 `https://api.deepseek.com/v1`
- **Embedding**: 使用硅基流动 API（`BAAI/bge-large-zh-v1.5`），通过 @langchain/openai 的 OpenAIEmbeddings 兼容接口，baseURL 指向 `https://api.siliconflow.cn/v1`。免费额度2000万tokens。之前使用本地 HuggingFace 模型导致大文件上传时内存耗尽蓝屏，已替换为API方案
- **向量存储**: 使用 MemoryVectorStore（内存向量库），启动时从 document_chunks 表重建，重启丢失内存数据但不丢失持久化数据
- **API Key**: 通过 .env 文件加载（DEEPSEEK_API_KEY, EMBEDDING_API_KEY），gitignore 已排除
- **前端代理**: Vite 开发服务器将 /api 和 /uploads 代理到后端 3001 端口，避免跨域问题
- **样式**: TailwindCSS v4 语法（`@import 'tailwindcss'` + `@theme`），注意与 v3 不同（无 tailwind.config.js）
