---
title: "JavaScript 基础"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 1
redirectFrom:
  - /posts/interview/06-react-node-intro.html
---

# JavaScript / TypeScript 基础

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
