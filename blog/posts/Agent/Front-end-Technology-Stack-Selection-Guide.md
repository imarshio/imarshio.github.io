---
icon: pen-to-square
order: 2
title: Front-end Technology Stack Selection Guide
# tag:

---


## 一、UI 层：用户看到的界面

### 1. 组件框架（最核心的选择）

这是前端的"基础设施"，相当于你选择用什么材料盖房子。

**React**（2013，Meta）是目前毫无疑问的行业标准。Claude、Gemini、ChatGPT 的前端都用 React。它的核心思想是"UI = f(state)"，一切都是组件和状态。优点是生态极其庞大，招人容易，几乎所有第三方库都优先支持 React；缺点是历史包袱较重，学习曲线存在（尤其是 hooks 的思维模型），以及性能优化需要手动处理（useCallback、useMemo 等）。

**Vue 3**（尤雨溪，2020）是 React 的主要竞争者，在中国开发者中非常流行。它的 Composition API 和 React hooks 非常像，但语法上更"顺滑"，学习曲线更平缓。问题是国际生态比 React 弱，大型 AI 产品基本不用 Vue。

**Svelte / SolidJS** 是新生代的编译型框架，理论上性能更好（没有虚拟 DOM），但生态较小，不适合你目前的项目规模。

**→ 做类 Claude 的产品：选 React，没有悬念。**

- **React** 是**库**（library），不是语言
- **Next.js** 是**框架**（framework），基于 React
- **TypeScript** 是**语言**，是 JavaScript 的超集

------

类比你熟悉的：

| 前端       | 你熟悉的                            |
| ---------- | ----------------------------------- |
| JavaScript | Python                              |
| TypeScript | Python + 类型注解（强制版）         |
| React      | Flask（库，给你工具，怎么用你决定） |
| Next.js    | Django（框架，结构和规范都定好了）  |

------

所以完整的关系是：

```
语言：JavaScript / TypeScript
         ↓
库：React（用 JS/TS 写的）
         ↓
框架：Next.js（基于 React）
```

TypeScript 和 JavaScript 的关系：你写 `.ts` 文件，最终编译成 `.js` 运行，浏览器和 Node.js 只认识 JS，TS 只存在于开发阶段。

### 2. CSS / 样式方案

**Tailwind CSS** 是当前最流行的方案。它是"原子化 CSS"，你不写任何自定义 CSS，直接在 HTML 里组合类名（`className="flex gap-4 text-sm font-medium"`）。优点是极快、一致性强；缺点是类名会很长，需要适应思维方式的转变。Claude、Vercel 等产品都大量使用 Tailwind。

**CSS Modules** 是传统方案的改良，每个组件有自己独立的 CSS 文件，样式名自动哈希避免冲突。适合对 CSS 控制粒度要求高的团队。

**styled-components / emotion** 是"CSS-in-JS"方案，在 JS 里写 CSS，可以动态注入变量。缺点是运行时有性能开销，现在社区热度下降中。

**→ 推荐 Tailwind CSS，搭配 shadcn/ui。**

### 3. 组件库

这是"拿现成组件用"的层，相当于买家具而不是自己打家具。

**shadcn/ui** 是目前最受欢迎的方案，但它不是传统意义上的"npm 包"，而是把组件源码直接复制到你的项目里，你完全拥有和可以修改这些代码。底层基于 Radix UI（无样式、无障碍的原语组件），上面用 Tailwind 加样式。非常适合 AI 产品——灵活、美观、可定制。

**Ant Design** 是国内最常用的企业级组件库，功能全但样式较重，定制成本高。

**MUI / Chakra UI** 是 Material Design 风格的组件库，国际项目常用。

---

## 二、逻辑层：JS/TS 与工程化

### 1. 元框架（最关键的架构决策）

"元框架"是在 React/Vue 之上加了一层，解决路由、服务端渲染（SSR）、数据获取等问题。

**Next.js**（Vercel 出品）是目前最主流的 React 元框架，Claude 官网就用 Next.js。它的核心能力：

- **SSR**（服务端渲染）：页面在服务器上生成 HTML，对 SEO 友好，首屏快
- **SSG**（静态生成）：构建时生成静态 HTML，适合文档、博客
- **App Router**（Next 13+）：新的路由系统，支持 React Server Components，服务端组件直接在服务器上执行，不向客户端发送 JS
- **API Routes**：Next.js 自带 BFF（Backend for Frontend），可以直接写后端接口，不需要单独起一个服务

**Remix** 是 Next.js 的竞争者，更强调"Web 标准"（Form、fetch 等原生 API），数据加载模型更清晰，但生态比 Next.js 小。

**Astro** 主要做内容型网站（文档、博客），不适合交互密集的 AI 产品。

**→ 做 AI 对话产品：Next.js App Router，是最稳的选择。**

### 2. 状态管理

状态管理解决的是：多个组件之间如何共享和同步数据。

**Zustand** 是目前最轻量、最好用的方案。API 极简，几行代码就能创建全局 store。适合大多数项目。

**Jotai** 是"原子化"状态管理，每个状态是一个独立的原子，按需订阅，避免不必要的重渲染。

**TanStack Query**（原 React Query）专门处理"服务端状态"，也就是 API 请求的缓存、重试、loading/error 状态。做 AI 产品必用，它能优雅地处理流式响应、乐观更新等复杂场景。

**Redux Toolkit** 是 Redux 的现代版，适合超大型项目，但对 AI 产品来说偏重。

**→ 推荐：Zustand（UI 状态） + TanStack Query（服务端数据）。**

### 3. 构建工具

**Vite** 是现在的主流构建工具，开发时极快（基于 ES Modules 的 HMR，修改代码几乎瞬间热更新），生产构建用 Rollup。如果你用 Next.js，它自带 Turbopack/Webpack，不需要单独配置 Vite。

---

## 三、后端层："前端的后端"

这层你说只知道 Node.js，我来展开讲清楚整个版图。

### 1. JS 运行时（Node.js 的竞争者）

**Node.js** 是最成熟的 JS 服务端运行时（2009年），生态最大。你知道的 npm 就是它的包管理器。做 AI 产品，Node 是最稳的选择。

**Bun** 是 2023 年出现的新运行时，目标是"更快的 Node.js"。它用 Zig 语言写的，内置包管理器、测试运行器、打包器，速度比 Node 快几倍。现在可以用 `bun run` 直接跑 Node.js 代码，兼容性越来越好。

**Deno 2** 是 Node.js 创始人 Ryan Dahl 做的"改正 Node.js 错误"的运行时，原生 TypeScript、安全沙箱、URL 引入模块。但兼容性和生态仍弱于 Node。

**Edge Runtime** 是指运行在 CDN 边缘节点的环境（Vercel Edge、Cloudflare Workers），限制更多（不能用所有 Node API），但延迟极低、全球分发。对 AI 产品的流式响应非常适合。

### 2. 后端框架

**Express**（2010）是最老牌的 Node.js 框架，中间件模式，极简。但它已经很久没有大更新，不支持现代 ESM，TypeScript 体验一般。很多旧项目还在用，但新项目不推荐。

**Fastify** 是"现代版 Express"，API 设计类似，但性能更好、TypeScript 友好、内置验证。

**Hono** 是 2022 年出现的新框架，专为 Edge 环境设计，但同样支持 Node.js。API 极其简洁，TypeScript 优先，支持 Cloudflare Workers、Vercel Edge、Deno、Bun。是目前最值得关注的新框架。

**NestJS** 是 Angular 风格的 Node.js 框架，有完整的依赖注入、模块系统。适合大型后端项目，但对小型 AI 产品来说偏重。

### 3. API 层 / BFF 模式

"BFF"（Backend for Frontend）是指专门为前端服务的后端层，介于前端和真正的微服务之间。

**tRPC** 是做全栈 TypeScript 项目的利器。你在后端定义函数，前端直接调用，全程类型安全，不需要写 REST API 文档，也不需要 `fetch` + 手动类型断言。Next.js + tRPC 是非常流行的组合。

**REST API** 是经典的 HTTP 接口方案，简单但没有类型安全保障。

**GraphQL** 适合数据关系复杂的产品（电商、社交网络），对 AI 对话产品反而是过度设计。

------

## 四、针对你的产品（类 Claude/Gemini）的技术选型建议

做 AI 对话产品有几个特殊需求：**流式响应**（Streaming）、**对话历史管理**、**Markdown 渲染**、**代码高亮**。下面是我的推荐栈：同样可以点击每个模块深入了解具体实现细节。

### 几个 AI 产品特有的技术要点

**流式响应（Streaming）是重中之重**。Claude 回答时文字是一个字一个字出来的，这背后是 SSE（Server-Sent Events）或 ReadableStream。你的整条技术链路都必须支持 streaming：Anthropic SDK 返回 stream → Next.js Route Handler 转发 stream → 前端 useChat() 消费 stream → 界面逐字更新。

**Vercel AI SDK** 是目前做 AI 产品的最佳工具库。它封装了与 Anthropic、OpenAI 等各家 LLM 的交互，提供了 `useChat()`、`useCompletion()` 等 React hooks，一行代码就能处理流式对话的所有状态（loading、error、消息追加）。

**Markdown 渲染**需要特别注意。AI 的回答通常包含 Markdown（代码块、列表、粗体等），你需要用 `react-markdown` + `react-syntax-highlighter` 来渲染，并且要在流式输出时做防抖，避免 Markdown 解析卡顿。

**数据库方面**推荐 PostgreSQL（用 Neon 或 Supabase 托管），再加 `pgvector` 扩展用于向量搜索（如果你要做 RAG / 上传文件功能）。ORM 用 **Drizzle ORM** 比 Prisma 更轻量，TypeScript 类型体验更好。

---

总结一句话：**Next.js 15 + React + TypeScript + Tailwind + shadcn/ui + Zustand + Vercel AI SDK + PostgreSQL，部署在 Vercel**，这是 2025 年做类 Claude 产品最成熟、最省力的技术栈。你可以点击上面图表中的任何模块，我来深入讲解那个部分的细节。

---

## 核心策略：先让 AI 搭骨架，你在真实项目上学

你的情况（有 Python 基础 + 每天 1-2 小时 + 边学边做）最适合这个节奏：**AI 生成结构 → 你读懂它 → 你自己改动它 → 遇到不懂问 AI**。不要先去看教程再上手，会浪费大量时间在你用不到的知识上。

---

## 第一步（今天就做）

打开终端，把下面这句话发给我：

> "帮我用 Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui 创建一个 AI 对话产品的项目骨架，给出完整的安装命令、目录结构，以及每个文件是干什么用的，放到 README.md 里"

跑起来之后，你就有了一个真实的项目。后续所有学习都在这个项目上进行，不是在教程 demo 里练完又扔掉。

---

## 六个阶段，每天 1-2 小时

### 阶段一：环境 + JS 基础（第 1-2 周）

**做**：让 AI 搭好项目，`npm install && npm run dev` 跑起来，看到页面。

**学**：JS 只需要掌握 3 个核心概念，其余都可以遇到再学：

- `async/await`：和 Python 的异步一样，只是语法不同
- 箭头函数：`const fn = (x) => x + 1`，就是 Python 的 lambda
- 解构赋值：`const { name, age } = user`，类似 Python 的解包

**TypeScript 怎么理解**：就是 Python 的类型注解，`name: string` 对应 Python 的 `name: str`，没有本质区别，遇到报错直接问 AI。

---

### 阶段二：React 核心（第 3-4 周）

**做**：让 AI 生成一个聊天气泡组件，你负责读懂它，然后改颜色、改样式、改文字。

**学**：React 最重要的两个概念，其他的之后自然会碰到：

- `useState`：让组件有记忆。`const [count, setCount] = useState(0)` — 不能直接改变量，必须用 `setCount`，因为 React 需要知道状态变了才能重新渲染
- `props`：组件的参数，就是 Python 函数的参数，`<ChatMessage role="user" text="你好" />`

**Tailwind 怎么学**：不用专门学，改代码时遇到不认识的类名直接问 AI 是什么意思，用 10 次就记住了。

---

### 阶段三：接入真实 AI API（第 5-6 周）

这是最关键、也最有成就感的一步。

**做**：让 AI 帮你生成两个东西：

1. `app/api/chat/route.ts`：后端接口，接收消息，调用 Anthropic SDK，返回流式响应
2. 前端用 Vercel AI SDK 的 `useChat()` hook 连接这个接口

**学**：理解流式响应是什么。AI 回复不是等全部生成完再发给你，而是生成一个字发一个字，这叫 Streaming。技术上用 SSE（Server-Sent Events）实现。你不需要手动处理，`useChat()` 全部封装好了，但你需要知道原理，出问题才能 debug。

这一步完成之后，你就有了一个能真正对话的产品了。

---

### 阶段四：完善体验（第 7-9 周）

**做**：把能用变成好用，依次完成：

1. Markdown 渲染：装 `react-markdown`，让 AI 的代码块、列表正确显示
2. 多会话管理：装 `zustand`，让侧边栏可以新建、切换对话
3. 自动滚动到底部：用 `useEffect` + `useRef` 实现（这里你会自然学会 `useEffect`）

**学**：`useEffect` 是 React 里最容易让人困惑的概念。最简单的理解：组件渲染后需要做的"副作用"操作，比如滚动、请求数据、设置定时器，就放在 `useEffect` 里。遇到具体问题再问 AI 解释。

---

### 阶段五：数据库 + 用户系统（第 10-12 周）

**做**：

1. 在 Supabase 创建免费 PostgreSQL 数据库（5 分钟，有界面操作）
2. 让 AI 生成数据库表结构：users、conversations、messages
3. 用 NextAuth.js 加 Google 登录
4. 把对话历史存进数据库，刷新页面还在

**学**：SQL 基础，只需要 4 个操作：`SELECT`（查询）、`INSERT`（插入）、`UPDATE`（更新）、`DELETE`（删除）。用 Python 字典类比：`SELECT * FROM messages WHERE user_id = 1` 相当于 `messages[user_id == 1]`。

---

### 阶段六：上线（第 13-16 周）

**做**：

1. 代码推到 GitHub，Vercel 连接仓库，自动部署，整个过程 15 分钟
2. 在 Vercel 配置环境变量（API Key、数据库连接串）
3. 加速率限制，防止 API 被滥用
4. 给真实用户用，根据反馈决定下一步做什么

---

## 每次学习用这个循环

**① 让 AI 生成代码**（5 分钟）→ **② 自己读懂、改动**（30-60 分钟）→ **③ 遇到不懂立刻问 AI**（随时）

不要试图先完全理解再动手，会卡死。先跑起来，改坏了，问 AI 修，在这个过程中理解。

---

## 你的 Python 基础能迁移什么

不需要从零开始，这些概念直接对应：

- Python `async def` / `await` → JS `async function` / `await`，完全一样
- Python `typing`（`name: str`）→ TypeScript（`name: string`），几乎一样
- Python 函数 → JS 箭头函数，只是语法不同
- Python `dict` → JS 对象 `{}`，基本一样
- Python `list` → JS 数组 `[]`，方法名稍有不同

最需要适应的是：**React 的状态不能直接改**，必须通过 `setState`。这是前端和 Python 脚本思维最大的区别，理解这一点之后其他都顺了。

---

## 一句话总结

16 周，每天 1-2 小时，结束时你有一个真实上线的 AI 对话产品，并且理解了它每一层是怎么工作的。遇到任何具体问题，随时发给我。
