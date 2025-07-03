---
icon: pen-to-square
order: 8
title: pinia
# tag:

---

## pinia

[官网](https://pinia.vuejs.org/)，集中式状态管理。

## 安装

```sh
pnpm i pinia
```

## 使用

```typescript
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

// 引入pinia
import { createPinia } from "pinia";

const app = createApp(App);

// 创建pinia
const pinia = createPinia();

app.use(router);
// 挂载使用pinia
app.use(pinia);

// 挂载到app节点,mount挂载的app指的是App.vue中的id为app的节点
app.mount("#app");
```
