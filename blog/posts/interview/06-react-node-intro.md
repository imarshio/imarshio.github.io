---
title: "React / Node.js 入门八股"
lang: zh-CN
date: 2026-10-23
order: 106
category:
  - 面试准备
tag:
  - 面试准备
---

# React / Node.js 入门八股

> 定位：简历写的是「全栈（Agent 方向）」，面试官会问一些前端和 Node 的基础，**不会问得很深**，但基础题答不上会很减分。
> 你的真实经历：运营后台、AI 配置中心前端（Next.js 16 + React 19 + Tailwind 4）基本是你写的；产品前端（Next.js 15 + React 19 + antd 5 + Redux Toolkit）参与开发；另外写过一个 Node + Express 的独立服务（微信扫码收款）。
> 每道题尽量挂到这些项目上答。

---

## 一、JavaScript / TypeScript 基础

### 1. `var`、`let`、`const` 的区别？
- `var`：函数作用域，有变量提升（声明前访问是 `undefined`），可以重复声明。现在基本不用。
- `let`：块级作用域（`{}` 内有效），不能重复声明，声明前访问报错（暂时性死区）。
- `const`：同 `let`，但不能重新赋值。**注意**：`const obj = {}` 之后 `obj.a = 1` 是可以的，只是不能 `obj = 别的`。
- 习惯：默认用 `const`，需要重新赋值才用 `let`。

### 2. `==` 和 `===`？
`==` 会先做类型转换再比较（`0 == ''` 是 true），`===` 不转换。一律用 `===`。

### 3. 数据类型？
原始类型：`string`、`number`、`boolean`、`undefined`、`null`、`symbol`、`bigint`；其余都是对象（数组、函数也是对象）。
`typeof null === 'object'` 是历史 bug。判断数组用 `Array.isArray()`。

### 4. 闭包是什么？
函数能「记住」它定义时所在作用域里的变量，即使外层函数已经执行完。
```js
function counter() {
  let n = 0;
  return () => ++n;   // 这个箭头函数记住了 n
}
const c = counter(); c(); c();   // 1, 2
```
React 里的「闭包陷阱」：`useEffect` / 定时器里拿到的 state 是创建那一刻的旧值（见 React 部分第 9 题）。
**对比 Python**：Python 也有闭包，修改外层变量要 `nonlocal`。

### 5. `this` 指向？
- 普通函数：谁调用就指向谁（`obj.fn()` 里 this 是 obj）；单独调用时是 `undefined`（严格模式）。
- **箭头函数没有自己的 this**，用定义时外层的 this。React 函数组件里基本不用关心 this。

### 6. 事件循环（Event Loop）——前端、Node 都会问
- JS 是**单线程**的，靠事件循环处理异步。
- 执行顺序：**同步代码 → 清空微任务队列 → 取一个宏任务 → 再清空微任务 → ……**
- 微任务：`Promise.then`、`queueMicrotask`；宏任务：`setTimeout`、`setInterval`、IO 事件。
```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);
// 输出 1 4 3 2
```
**对比 Python**：和 asyncio 的事件循环是同一个思想。区别是 JS 天生就是这样，所有 IO 都是异步的；Python 要显式用 asyncio 或 gevent。

### 7. Promise 和 async / await？
- Promise 表示一个「将来才有结果」的值，三个状态：pending → fulfilled / rejected。
- `async / await` 是 Promise 的语法糖，让异步代码写得像同步。
```js
// Promise 写法
fetch('/api/models').then(r => r.json()).then(data => setList(data)).catch(console.error);

// async/await 写法（等价）
try {
  const r = await fetch('/api/models');
  setList(await r.json());
} catch (e) { console.error(e); }
```
- 并发：`Promise.all([a(), b()])`（一个失败就整体失败）、`Promise.allSettled`（等全部结束，各自成功失败）、`Promise.race`（谁先完成用谁，常用来做超时）。对应 Python 的 `asyncio.gather`。

### 8. 深拷贝？
`structuredClone(obj)`（现代浏览器 / Node 17+ 原生支持）；`JSON.parse(JSON.stringify(obj))` 会丢掉函数、`undefined`、Date 变字符串。展开运算符 `{...obj}` 只是浅拷贝。

### 9. 原型链？
每个对象有一个原型（`__proto__`），访问属性时自己没有就沿着原型链往上找。`class` 是原型的语法糖。了解即可。

### 10. TypeScript 为什么要用？常见写法？
- 给 JS 加类型，编译期发现错误，IDE 提示更好。**我们的提交钩子要求 `tsc --noEmit` 零错误才能提交**。
- `interface` vs `type`：都能描述对象结构；`interface` 可以合并扩展，`type` 能写联合类型（`type Status = 'active' | 'disabled'`）。
- 泛型：`function first<T>(arr: T[]): T`。
- 可选 `?`、非空断言 `!`、`unknown` 比 `any` 安全（用之前必须先判断类型）。
- 工具类型：`Partial<T>`、`Pick<T, K>`、`Omit<T, K>`、`Record<K, V>`。

---

## 二、React

### 1. React 是什么？核心思想？
- 一个用来构建 UI 的库。核心思想：**UI = f(state)**，界面是状态的函数。你只描述「状态是这样时界面长这样」，状态变了 React 负责更新界面。
- 组件化：界面拆成可复用的组件。

### 2. JSX 是什么？
看起来像 HTML 的 JS 语法，编译后变成 `React.createElement(...)` 调用（或新的 jsx runtime）。注意：`class` 要写成 `className`；`{}` 里写 JS 表达式。

### 3. props 和 state 的区别？
- **props**：父组件传给子组件的参数，子组件**只读**。
- **state**：组件自己的状态，用 `useState` 创建，修改后组件重新渲染。
- 子组件要改父组件的状态：父组件把修改函数作为 props 传下去（**状态提升**）。

### 4. 常用 Hooks？
| Hook | 作用 | 例子 |
|---|---|---|
| `useState` | 组件状态 | `const [open, setOpen] = useState(false)` |
| `useEffect` | 副作用：请求数据、订阅、定时器 | 进入页面时拉模型列表 |
| `useRef` | 保存一个不触发渲染的可变值，或拿 DOM 元素 | 保存 EventSource 实例、滚动到底部 |
| `useMemo` | 缓存计算结果，依赖不变就不重算 | 过滤大列表 |
| `useCallback` | 缓存函数引用 | 传给子组件的回调 |
| `useContext` | 跨层级共享数据，不用一层层传 props | 当前用户、主题 |

### 5. `useEffect` 的依赖数组？
```js
useEffect(() => { ... });            // 每次渲染后都执行
useEffect(() => { ... }, []);        // 只在挂载后执行一次
useEffect(() => { ... }, [id]);      // id 变化时执行
useEffect(() => {
  const es = new EventSource(url);
  return () => es.close();           // 清理函数：卸载或依赖变化前执行
}, [url]);
```
**清理函数很重要**：订阅、定时器、长连接不清理就会内存泄漏、重复订阅。
React 18+ 开发模式下 StrictMode 会故意把 effect 执行两次，用来暴露没写清理函数的问题。

### 6. Hooks 的规则？
只能在组件或自定义 Hook 的**顶层**调用，不能放在 if / for 里。原因：React 靠**调用顺序**区分每个 Hook 对应哪个状态，顺序变了就对不上。

### 7. 列表为什么要 `key`？
React 用 key 判断列表里哪一项是同一个元素，从而复用 DOM。用数组下标当 key，插入 / 删除时会导致状态错位（比如输入框内容跑到别的行）。用稳定的唯一 ID。

### 8. 什么情况下组件会重新渲染？怎么优化？
- 触发：自己的 state 变了；父组件重新渲染（默认子组件也跟着渲染）；用到的 context 变了。
- 优化：`React.memo` 包子组件（props 不变就不渲染）+ `useCallback` / `useMemo` 保持 props 引用稳定；状态放到真正需要它的组件里（别全堆在顶层）；长列表虚拟滚动。
- React 19 的 **React Compiler** 可以自动做这些记忆化。
- **原则：先测量（React DevTools Profiler），再优化**，不要到处加 useMemo。

### 9. 闭包陷阱（stale closure）？
```js
const [count, setCount] = useState(0);
useEffect(() => {
  const t = setInterval(() => setCount(count + 1), 1000);   // count 永远是 0
  return () => clearInterval(t);
}, []);
```
修复：用函数式更新 `setCount(c => c + 1)`；或者把值放进 `useRef`。
**流式对话场景**常遇到：SSE 回调里拿到的消息列表是旧的，要用函数式更新追加。

### 10. 受控组件和非受控组件？
- 受控：输入框的值由 state 控制（`value={v} onChange={e => setV(e.target.value)}`），React 是唯一数据源。
- 非受控：值由 DOM 自己管，用 ref 读。表单库（antd Form、react-hook-form）内部帮你处理。

### 11. 虚拟 DOM 和 diff？
- 虚拟 DOM：用 JS 对象描述界面。状态变化时生成新的虚拟 DOM，和旧的比较（diff），只把差异更新到真实 DOM。
- diff 的三个假设：不同类型的元素直接替换整棵子树；同层比较不跨层；列表靠 key 识别。

### 12. 状态管理：什么时候用 Redux？
- 组件自己的状态 → `useState`；
- 几个组件共享、层级不深 → 状态提升 / Context；
- 全局、很多页面共享、更新逻辑复杂 → Redux Toolkit / Zustand。
- **产品前端的数据流**（项目约定）：`组件 → dispatch(thunk) → service 调 API → slice 更新 state`，组件里不直接 fetch。
```js
const modelSlice = createSlice({
  name: 'model',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchModels.pending,   s => { s.loading = true; })
      .addCase(fetchModels.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; });
  },
});
export const fetchModels = createAsyncThunk('model/fetch', () => modelService.list());
```
Redux Toolkit 内部用 Immer，所以 reducer 里可以「直接改」state，实际生成的是新对象（不可变更新）。

### 13. React 19 有什么新东西？（了解）
Server Components 和 Server Actions 正式稳定；`use()` 读取 Promise / context；`useActionState`、`useOptimistic`（乐观更新）；`ref` 可以直接作为 props 传，不需要 `forwardRef`。

---

## 三、Next.js

### 1. Next.js 是什么？为什么用它而不是纯 React（Vite）？
React 的全栈框架：文件即路由、服务端渲染、API 路由、图片 / 字体优化、构建优化开箱即用。我们三个前端都用它，而且都用它的 rewrite 把 `/api/*` 转发到后端，前端和后端同域，省掉跨域问题。

### 2. 渲染方式：CSR、SSR、SSG、ISR？
| | 在哪生成 HTML | 适合 |
|---|---|---|
| CSR 客户端渲染 | 浏览器里 JS 执行后生成 | 登录后的后台、强交互页面（我们的后台基本是这种） |
| SSR 服务端渲染 | 每次请求时在服务器生成 | 需要 SEO、首屏快、数据实时 |
| SSG 静态生成 | 构建时生成 | 文档、官网 |
| ISR 增量静态再生 | 静态页面定期在后台重新生成 | 内容偶尔更新的页面 |

### 3. App Router 的 Server Component 和 Client Component？
- App Router（`app/` 目录）里组件**默认是 Server Component**：在服务器运行，可以直接读数据库 / 调接口，不打包进浏览器 JS，**不能用 useState / useEffect / 浏览器 API**。
- 文件顶部写 `'use client'` 就是 Client Component：可以用 Hooks 和交互。
- 原则：交互的部分做成 Client Component，尽量往组件树的叶子推。

### 4. 路由约定？
`app/models/page.tsx` → `/models`；`app/models/[id]/page.tsx` → `/models/123`（动态路由）；`layout.tsx` 是共享布局；`loading.tsx` 加载态；`error.tsx` 错误边界；`(app)` 这种带括号的是**路由分组**，不影响 URL（AI 配置中心的 `/(app)` 就是这么组织的）。

### 5. Route Handler 和 Middleware？
- `app/api/xxx/route.ts` 里导出 `GET` / `POST` 函数，就是一个后端接口。
- `middleware.ts`：请求到达页面前执行，常用来做登录校验和重定向。

### 6. 环境变量？
`NEXT_PUBLIC_` 开头的变量会**在构建时编译进前端代码**（浏览器能看到）；其他的只在服务端可用。所以改了 `NEXT_PUBLIC_*` 必须重新构建镜像 —— 这是我们部署时的一条约定。**密钥绝不能用 `NEXT_PUBLIC_` 前缀**。

### 7. Tailwind CSS 是什么？优缺点？
原子化 CSS：直接在 className 里写 `flex items-center gap-2 px-4 text-sm`。优点：不用起类名、样式就在组件旁边、最终 CSS 很小（只打包用到的）；缺点：className 很长、需要记类名。对比产品前端用的 SCSS Modules（每个组件一个样式文件，类名自动加哈希防冲突）。

---

## 四、Node.js

### 1. Node.js 是什么？
基于 Chrome V8 引擎的 JavaScript **服务端运行时**，让 JS 能在浏览器外运行（读写文件、起 HTTP 服务）。

### 2. Node 为什么单线程还能高并发？
- JS 代码在一个主线程上跑，但 IO（网络、文件）交给底层 **libuv**，由操作系统的异步机制（epoll / kqueue）或线程池完成，完成后通过事件循环回调。
- 所以 Node 适合 **IO 密集**（API 网关、BFF、实时推送）；**不适合 CPU 密集**（一段计算会堵住所有请求）。
- **对比 Python gevent**：思路一样（单线程 + 事件循环 + 非阻塞 IO），区别是 Node 的整个生态天生就是异步的，不需要 monkey-patch。

### 3. Node 的事件循环有哪几个阶段？（中等题）
timers（`setTimeout` 回调）→ pending callbacks → poll（等待 IO）→ check（`setImmediate`）→ close callbacks。每个阶段之间清空微任务；`process.nextTick` 比 Promise 微任务还优先。

### 4. CPU 密集的任务怎么办？
`worker_threads`（多线程）、`child_process`（子进程）、`cluster` 模块 / PM2 多进程（利用多核）。产品前端旧的裸机部署方式就是 pm2 守护。

### 5. CommonJS 和 ES Module？
- CommonJS：`require` / `module.exports`，同步加载，Node 传统写法。
- ESM：`import` / `export`，静态分析、支持 tree-shaking，浏览器和 Node 都支持，是标准。`package.json` 里 `"type": "module"` 让 `.js` 按 ESM 处理。

### 6. npm、yarn、pnpm 区别？为什么用 pnpm？
pnpm 用**全局内容寻址存储 + 硬链接**，同一个包版本在磁盘上只存一份，装得快、省空间；而且依赖是严格的（没在 package.json 声明的包不能用，避免「幽灵依赖」）。我们所有前端统一 pnpm。

### 7. Express 中间件是什么？
```js
app.use(express.json());                  // 解析 JSON 请求体
app.use('/admin', basicAuth);             // 只对 /admin 生效的鉴权
app.get('/pay/:linkId', async (req, res) => { ... });
app.use((err, req, res, next) => {        // 四个参数 = 错误处理中间件
  res.status(500).json({ msg: err.message });
});
```
中间件就是 `(req, res, next) => {}`，按注册顺序依次执行，调用 `next()` 交给下一个。**对比 Flask**：相当于 `before_request` + 蓝图 + `errorhandler`；对比 Java：相当于 Servlet Filter 链（又是责任链模式）。
**你的经历**：微信 Native 扫码收款服务就是 Node + Express，有一个 Basic Auth 保护的管理后台。被问到可以讲：支付回调要**验签**、要**幂等**（微信会重复通知）、金额以服务端为准不信任前端。

### 8. Stream（流）是什么？
数据分块处理，不用一次性全读进内存。可读流、可写流、`pipe` 连接。用于大文件、代理转发、流式响应。

---

## 五、前后端联调（全栈岗必问）

### 1. 前端怎么接收 SSE 流式输出？
- `EventSource`：浏览器原生，自动重连，但**只支持 GET、不能自定义请求头**。
- 对话接口一般是 POST（要传问题、附件）→ 用 `fetch` + `response.body.getReader()` 逐块读，自己按 `\n\n` 切分事件：
```js
const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ query }) });
const reader = res.body.getReader();
const decoder = new TextDecoder();
let buf = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buf += decoder.decode(value, { stream: true });
  const events = buf.split('\n\n');
  buf = events.pop();                       // 最后一段可能不完整，留到下次
  for (const e of events) handle(e);
}
```
- 断线重连：带上 card_id 重新请求，后端从 Redis Stream 重放（见 01 文档）。前端从头渲染，不用维护游标。

### 2. 跨域（CORS）是什么？怎么解决？
- 浏览器的同源策略：协议、域名、端口有一个不同就是跨域，跨域请求的响应默认被浏览器拦截。
- 解决：后端返回 `Access-Control-Allow-Origin` 等响应头（复杂请求浏览器会先发 OPTIONS 预检）；或者用同域代理（Next.js rewrite / Nginx 转发），**我们用的是后者**。
- 带 cookie 的跨域请求：前端 `credentials: 'include'`，后端 `Allow-Credentials: true` 且 Origin 不能是 `*`。

### 3. Cookie、Session、JWT、Token 认证？
- Cookie + Session：服务端存会话，浏览器存 session id。我们产品端用 cookie + Flask-Login。
- JWT：令牌本身包含用户信息和签名，服务端无状态校验；缺点是签发后难以主动作废（要配合黑名单或短有效期 + 刷新令牌）。
- Cookie 安全属性：`HttpOnly`（JS 读不到，防 XSS 偷 cookie）、`Secure`（只走 HTTPS）、`SameSite`（防 CSRF）。

### 4. 从输入 URL 到页面显示发生了什么？（经典题，简答）
DNS 解析 → TCP 连接（HTTPS 还有 TLS 握手）→ 发 HTTP 请求 → 服务器处理返回 → 浏览器解析 HTML 构建 DOM、解析 CSS 构建 CSSOM → 合成渲染树 → 布局 → 绘制。

### 5. 前端性能优化有哪些？
代码分割 / 懒加载（`next/dynamic`）、图片优化（`next/image`）、减少重复渲染、长列表虚拟滚动、资源缓存（CDN、强缓存 / 协商缓存）、减少首屏 JS 体积（Server Component 不打包进客户端）。
