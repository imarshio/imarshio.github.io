---
title: "React 面试题"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 2
redirectFrom:
  - /posts/interview/18-react-next-node.html
---

# React 面试题

> React、Next.js、Node.js 各分入门 / 中等 / 高难，每档 20 题，共 180 题，★ 是高频。06 用来快速入门，本篇用来系统复习。通用方案不代表项目已有实现。

---

## React 入门（20 题）

### 1. ★ React 解决什么问题？
用组件和状态声明界面，让视图随数据变化。它主要负责 UI，不自带完整后端、路由或权限系统；项目再用 Next 做应用组织，用 Redux 等管理跨组件状态。

### 2. JSX 是 HTML 吗？
不是，是 JavaScript 语法扩展，编译成创建 React 元素的调用。可以在花括号里放表达式，组件名首字母大写；样式、className 和事件属性遵循 React/JS 的约定。

### 3. ★ props 和 state 的区别？
props 是上层传入的数据，组件不应直接修改；state 是组件拥有的状态，更新会请求重新渲染。先确定数据归谁管，避免父子各存一份同样数据而不同步。

### 4. useState 的 setter 为什么不是马上改变量？
当前渲染拿到的是一次状态快照，setter 请求后续渲染。依赖旧值更新时用函数式写法 `setCount(c => c + 1)`，避免同一事件里多次使用旧快照丢更新。

### 5. ★ 为什么不能直接改 state 对象？
React 依赖引用和更新队列判断变化。原地修改再传同一个引用可能不触发期望更新，也破坏旧快照；用新对象/数组表达改动。Redux Toolkit 的 reducer 可借助 Immer 写看似可变的语法。

### 6. 列表为什么要 key？
key 帮 React 在同一父级内识别项目身份，维持正确的组件状态。优先业务稳定 ID；可插入、排序的列表用数组下标容易让输入框状态跟错行，随机 key 会反复重建。

### 7. ★ 什么是受控表单？
输入值由 React state 控制，onChange 更新状态；非受控表单由 DOM 管理，可用 ref 读取。受控方便校验联动，但大表单要控制更新范围，别让每次按键重渲染整页。

### 8. 事件处理和普通 DOM 有什么不同？
传函数引用，例如 onClick={handleClick}，不要在渲染时直接调用。React 封装事件传播；阻止冒泡与阻止默认行为是两件事。旧版 SyntheticEvent 池化的说法不能直接套到现代 React Web。

### 9. ★ useEffect 用来做什么？
在提交后与外部系统同步，例如订阅、网络连接、第三方控件。由用户点击触发的操作通常放事件处理器；可直接从 props/state 算出的值通常在渲染时计算，不必再存一份状态。

### 10. Effect 的依赖数组怎么写？
包含 Effect 使用的响应式值，按依赖变化重新同步。漏依赖容易读到旧值；依赖对象每次新建又会反复执行。先调整代码结构和稳定输入，别靠关闭 lint 掩盖问题。

### 11. ★ Effect cleanup 什么时候执行？
下一次同步前清理旧 Effect，组件卸载时也清理；开发 StrictMode 还会额外检查 setup/cleanup。取消订阅、定时器、请求和连接，避免重复监听与卸载后继续处理旧结果。

### 12. useRef 和 useState 的区别？
ref 保存跨渲染的可变值或 DOM 引用，修改 current 不触发渲染；state 用于影响界面的数据。不要把需要实时展示的加载状态只放 ref，也别在渲染里随意读写 ref 代替状态。

### 13. ★ Hooks 为什么不能随便写在条件里？
useState、useEffect 等依赖稳定调用顺序来关联状态，应在组件或自定义 Hook 顶层调用。React 19 的 use(resource) 有条件调用等例外，但不能因此把所有 Hook 都放进条件或循环。

### 14. 自定义 Hook 是共享状态吗？
它复用有状态逻辑，每次调用通常拥有独立状态，不自动共享数据。真正共享需要把状态提升到公共祖先，或通过 Context、外部 store、查询缓存等提供同一数据源。

### 15. 条件渲染有哪些坑？
可以用 if、三元表达式或短路，但 `0 && <List />` 会显示 0。加载、空、错误和成功应区分；权限未确定时不要先展示敏感数据再隐藏。

### 16. ★ 状态提升是什么？
多个组件需要同步同一数据时，把数据放到最近的共同拥有者，再通过 props/回调传递。不是所有状态都要放全局；弹窗开关、未提交输入等局部状态尽量靠近使用处。

### 17. Context 和 Redux 怎么选？
Context 适合传主题、身份等跨层数据，本身不是精细订阅和异步数据管理方案。Redux 适合复杂共享状态和可追踪更新；也可让服务端数据交给专门查询缓存，避免全塞进一个 store。

### 18. CSS Modules 和普通 CSS 有何区别？
模块化类名减少全局冲突，适合组件样式；普通 CSS 用于全局基础规则。项目用 SCSS Modules 和 antd，新增组件优先遵循已有 token 与样式约定，而不是另起一套配色。

### 19. ★ 什么会触发组件渲染？
自身状态、父组件渲染、消费的 Context 或外部订阅变化等。渲染是计算 UI，提交才改 DOM；一次渲染不等于真实 DOM 全部重建，优化前先看实际提交与耗时。

### 20. React 19 值得了解什么？
Actions、useActionState、useOptimistic、use(resource) 等改善异步交互；函数组件也可按新约定接收 ref。先确认框架集成与使用条件，不能把新 API 当作无需处理错误、并发或授权的捷径。

## React 中等（20 题）

### 1. ★ useMemo 和 useCallback 的区别？
useMemo 缓存计算结果，useCallback 缓存函数引用。只有昂贵计算或下游依赖稳定引用时才有收益；依赖变化照样重算。它们是性能工具，不应成为业务正确性所依赖的持久存储。

### 2. React.memo 什么时候有效？
父渲染而 props 引用未变时可跳过子渲染；自身 state 和消费的 Context 变化仍能触发更新。每次传新对象、内联函数会削弱收益，先缩小 props 和订阅范围再评估。

### 3. ★ stale closure 是什么？
定时器、回调保存了某次渲染里的旧 state/props，后续调用读到旧快照。按场景使用正确依赖、函数式更新或 ref 读取最新值；不应靠把依赖数组清空来「只跑一次」。

### 4. 请求 A 后发先至，怎么避免覆盖 B？
切换条件时取消旧请求，或给请求加递增序号，只接纳当前序号结果。取消是减少浪费，结果版本检查是防旧数据覆盖；缓存库也要把完整查询条件放进 key。

### 5. ★ useReducer 适合什么情况？
状态有多个相关字段和明确转移规则时，用 action 描述事件、reducer 纯计算新状态。它不自动变成全局 store，也不该在 reducer 里请求网络或读不确定的外部值。

### 6. Redux Toolkit 的数据流是什么？（项目）
组件触发 action/thunk，异步请求走 services，slice 处理状态，selector 供组件读取。项目的分层不允许 store 反向依赖组件；共享错误处理也有既定 middleware，按入口约定使用。

### 7. ★ selector 为什么要精确？（项目）
若订阅整个工作区大对象，任一流式字段变化可能让大量组件重渲染。只选实际使用的字段，派生数据用稳定 memoized selector；不要为了少写几行把整片状态传给每个列表项。

### 8. Immer 为什么允许写 state.x = y？
它提供草稿代理，记录修改后产生结构共享的新状态，不是直接改原始 Redux state。不要同时修改 draft 又返回另一份不相关结果；草稿也不该逃逸到异步回调里使用。

### 9. ★ 批处理会改变什么？
多个状态更新可合并成一次渲染，减少中间提交。它不改变闭包快照语义；依赖旧值仍用 updater。需要在 DOM 更新后测量时遵循对应时机，不要随便用 flushSync 强迫每次同步提交。

### 10. useLayoutEffect 和 useEffect 怎么选？
布局测量并在浏览器绘制前调整时可用 useLayoutEffect，但它阻塞绘制，重逻辑会卡屏。一般外部同步用 useEffect；服务端没有可测布局，首次渲染需有稳定占位。

### 11. ★ Suspense 能处理所有请求吗？
不能自动接管普通 Effect 里发起的 fetch。它对接框架或支持 Suspense 的数据资源、lazy 组件，等待时展示 fallback；错误仍需错误边界，缓存与请求稳定性由资源层负责。

### 12. Error Boundary 能捕获哪些错误？
主要捕获后代渲染等 React 生命周期错误；普通事件回调、任意异步 promise 拒绝不自动由它接管。分别做好局部异步错误处理与渲染兜底，提供重试和可追踪的错误信息。

### 13. ★ 长列表如何优化？
先分页和缩小订阅，再用虚拟列表只渲染可见区；动态高度要测量与缓存。注意键盘定位、屏幕阅读器、搜索定位和滚动恢复，不能只以 DOM 变少判断体验完成。

### 14. React 里怎么接 SSE？
Effect/独立连接层管理生命周期，收到事件写入有序模型，再按帧或短时间窗口批量更新 UI。断开需取消读取和清理定时器；支持 POST/自定义头时可用 fetch 流，不强套原生 EventSource。

### 15. 防抖和节流有什么区别？
防抖等输入停止一段时间再执行，适合搜索建议；节流限制执行频率，适合滚动、流式刷新。都要清理尾部定时器，保存必要的最后一次更新，不能让结束事件被节流吞掉。

### 16. ★ 乐观更新失败怎么回滚？
记录本次 mutation 的版本或临时 ID，先局部展示，成功用服务端结果对齐，失败只撤回本次影响。并发编辑不能整块覆盖回旧快照，否则会抹掉之后的成功操作。

### 17. 为什么不把所有派生值都存 state？
同一数据出现多份来源容易不一致，还要 Effect 维护同步。筛选结果、总数等能从已有状态纯计算时直接算；昂贵时 memoize。只有需要独立编辑或保留历史快照时才另存。

### 18. 组件拆分的依据是什么？
按职责、状态所有权、更新频率和复用边界拆，而不是只按代码行数。把高频流式区域与静态侧栏分开，减少更新波及；仍保持数据流清楚，避免为了拆小大量跨层传递。

### 19. ★ 如何测试一个异步 Hook？
验证加载、成功、失败、取消及竞态行为，mock 网络边界而非内部 setter。通过用户可观察结果断言；对请求 A/B 乱序、卸载和依赖切换专门覆盖，不能只测最终成功一次。

### 20. useSyncExternalStore 有什么用？
为 React 订阅外部可变数据源提供一致快照协议，框架状态库通常已处理。subscribe 要可清理，getSnapshot 结果要稳定；SSR 还要提供匹配的服务端快照，避免首次水合不一致。

## React 高难（20 题）

### 1. ★ token 一来就 setState，页面卡顿怎么办？
先测事件频率、每次提交耗时和 Markdown 重解析。连接层缓冲，按帧批量追加，终态立即 flush；只更新目标卡片，长内容分块渲染。优化后同时看字延迟和滚动流畅度。

### 2. 重新连接后消息重复怎么处理？
先确认协议是全量重放还是从游标续传；全量重放应清空本次视图再重建，增量续传按事件 ID 去重。不能一边保留全部文本一边重放从头追加，否则正常协议也会显示重复。

### 3. ★ 用户切会话后，旧流写进新会话？
连接与目标 card/session ID 绑定，切换时取消旧 reader，事件落库前再核对运行版本。按目标 ID 更新归一化状态，别让闭包读取「当前选中会话」决定事件归属。

### 4. 组件 key 改了为什么输入丢失？
key 变化意味着身份变化，React 可能卸载旧组件并创建新组件，局部输入也重置。排查是否使用时间戳/随机数或位置 key；需要保留草稿时按稳定业务 ID 存到合适层。

### 5. ★ StrictMode 导致重复请求，是 React 的 bug 吗？
开发额外执行用于发现不纯渲染和缺少清理。查询可取消或复用缓存；购买、发通知等副作用放明确事件并带幂等键。别简单关 StrictMode，也别用 ref 掩盖漏掉的 cleanup。

### 6. 大型 Context 导致全站重渲染怎么改？
拆不同更新频率的 Context，稳定 Provider value，把高频状态放支持 selector 的 store。先确认真正慢的组件；单纯给每层包 memo，仍可能被 Context 更新穿透。

### 7. useMemo 写了为什么仍慢？
依赖每次变化、真正瓶颈在 DOM/布局、缓存开销过大或父级频繁订阅都可能发生。用 Profiler 和浏览器 Performance 定位渲染、提交与布局，再决定减少工作还是缓存计算。

### 8. ★ 前端取消请求等于后台停止 Agent 吗？
不等于。AbortController 主要终止客户端等待/传输；后台任务可能继续。需要调用业务停止接口并处理确认状态，UI 区分连接断开、取消请求和运行已停止，不能直接显示已成功停止。

### 9. 多次点击提交怎样防重复副作用？
按钮禁用只是体验层，多个标签页和网络重试仍会重复。客户端为一次业务操作使用稳定幂等键，服务端原子领取或唯一约束；失败重试复用同一键，别每次点击都换新键。

### 10. 前端状态机怎么设计流式卡片？
分 idle、connecting、streaming、waiting、completed、failed、cancelled 等，并定义允许转移。终态不再被旧进度改回运行中，交互等待不等于完成；事件按版本/序号处理，异常可恢复。

### 11. ★ 服务端只读权限变化怎么同步 UI？
接口返回当前能力，前端隐藏/禁用编辑并处理 403/404/409 等结果，缓存按资源和身份失效。UI 只负责提示，真正操作时后端仍需重新授权；不能靠页面首次加载的 readonly 永久放行。

### 12. 流式 Markdown 为什么会破坏布局？
未闭合代码围栏、长行、表格和重复全量解析导致抖动。做增量分段与尺寸约束，稳定已完成段落；HTML/链接按安全规则处理。不要为了实时感每个字符都重新挂载整篇文档。

### 13. 内存持续上涨怎么查？
看 heap snapshot 的保留路径，找未清理的 listener/reader/observer、无上限日志和历史缓存。重复进入退出页面观察是否回落；正常峰值与长期增长分开，不能只看一次任务的最高点。

### 14. ★ React 并发渲染会自动并行跑 JS 吗？
不会把普通组件代码分到多个线程。React 可调度、暂停和放弃部分渲染工作，要求渲染保持纯；昂贵 CPU 任务仍需减少、分片或放 Web Worker，startTransition 不能让重循环消失。

### 15. startTransition 适合流式文本吗？
可把非紧急更新标记为可被打断，但输入值本身应保持及时。先合并事件、缩小更新范围，再评估 transition；它不保证每个中间状态都提交，也不能代替消息持久化与终态处理。

### 16. optimistic UI 与服务器结果冲突怎么办？
按 mutation ID 和服务器版本合并，返回冲突时展示用户修改与当前值。不要直接回滚整个列表；已完成的其他 mutation 必须保留。多端编辑需要后端并发控制，前端只做可理解的冲突反馈。

### 17. ★ 动态高度聊天列表怎么保持滚动位置？
根据是否接近底部决定自动跟随，用户上翻时保持锚点；图片和代码块尺寸变化要修正测量。历史向上插入前后用稳定元素位置补偿，不能每次新 token 都强制滚到底。

### 18. reducer 收到乱序终态事件怎么办？
事件附带运行版本和递增序号，旧版本丢弃，同版本只接受有效前进；终态补充字段可有专门规则。协议没有序号时先定义可判定边界，不能仅用浏览器本地到达时间当业务顺序。

### 19. 怎么验证性能优化没有改坏行为？
固定长对话、快速切换、断线重放和取消场景，比较提交数、长任务、输入延迟与内存；同时断言完整文本、终态和归属正确。只测渲染次数下降可能掩盖漏事件。

### 20. ★ 项目里可讲哪一个 React 优化点？（项目）
可以结合源码分层和 selector 粒度，解释为什么流式更新不能让整片工作区订阅。具体收益需要 Profiler/性能记录；没量过就讲改法和验证指标，不能把 AGENTS.md 的规则说成已经获得某个倍数提升。

---

## 项目事实与版本

2026-10-21 核对各仓库 package.json、next.config.ts 和实际源码：

| 项目 | 能确认的内容 |
|---|---|
| `../xknow-frontend/` | Next 15.3.6、React 19.1.0、antd 5.26.0、Redux Toolkit 2.6.0、SCSS；页面/组件→store/services→utils 分层，见 AGENTS.md、docs/ARCHITECTURE.md |
| `../xknow-console/` | Next 16.2.9、React 19.2.7、Tailwind 4，output=standalone |
| `../xknow-gateway/` | Next 16.2.9、React 19.2.7、Tailwind 4，output=standalone |
| 三个前端的 rewrite | frontend 有 /api/web、/api/ai、/api/ai_task 等规则；console 与 gateway 仅在分别配置 CONSOLE_API_PROXY_TARGET / GATEWAY_API_PROXY_TARGET 时启用对应规则，不能概括成所有部署都由 Next 转发全部 /api |
| `../xknow-payment/` | Node + Express 扫码收款服务；`src/server.js` 先挂载 notify 的 raw body 路由，再挂全局 express.json；`src/wechatpay.js` 含签名验证和外部请求超时 |

官方核对入口：[React Effect](https://react.dev/learn/synchronizing-with-effects)、[React use](https://react.dev/reference/react/use)、[Next 15 升级说明](https://nextjs.org/docs/app/guides/upgrading/version-15)、[Next 16 升级说明](https://nextjs.org/docs/app/guides/upgrading/version-16)、[Server / Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)、[Node 事件循环](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)、[Node Stream](https://nodejs.org/api/stream.html)。Next 缓存和异步请求 API 有版本差异，回答时先报项目版本。

# 第一部分：React

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
