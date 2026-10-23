---
title: "前后端联调"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 5
---

# 前后端联调

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
