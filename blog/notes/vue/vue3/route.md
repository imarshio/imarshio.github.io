---
icon: pen-to-square
order: 7
title: route
# tag:

---

## 引入依赖

```sh
pnpm i vue-route
```

## 配置

```typescript
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import News from "@/pages/News.vue";
import About from "@/pages/About.vue";
import Detail from "@/pages/Detail.vue";

const router = createRouter({
  // 路由器工作模式
  history: createWebHistory(),
  routes: [
    {
      name: "index",
      path: "/",
      // redirect: ,
      component: Home,
    },
    {
      name: "home",
      path: "/home",
      component: Home,
    },
    {
      name: "news",
      path: "/news",
      component: News,
      children: [
        {
          path: "detail",
          component: Detail,
        },
      ],
    },
    {
      name: "about",
      path: "/about",
      component: About,
    },
  ],
});

// 暴露出去
export default router;
```

## 使用

打开`main.ts`，并添加一行代码。

```typescript
// 引入createApp
import { createApp } from "vue";
import router from "./router";
// 引入App根组件
import App from "./App.vue";

// 创建App
const app = createApp(App);

// 使用路由
app.use(router);

// 挂载到app节点,mount挂载的app指的是index.html中的id为app的节点
app.mount("#app");

```

## 工作模式

### history

#### 优点

- `URL` 更美观，不带有`#`，更接近传统网站 `URL`

#### 缺点

后期项目上线，需要服务端配合处理路径问题，否则刷新就会有`404`的问题.

```conf
http {
    server {
        listen       80;
        listen       [::]:80;
        server_name  *.marshio.com marshio.com;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        charset utf-8;
        location / {
            # 在这里添加这个配置，未做过测试
            try_files $uri $uri/ /index.html;
        }
        
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }
}
```

### hash

#### 优点

- 兼容性更好，不需要服务器端处理路径

#### 缺点

`URL` 带有 `#` 不太美观，且在 `SEO` 优化方面相对较差。

## 传参

### `query`

#### 第一种写法

```vue
<template>
  <div class="news-navigate">
   <ul>
    <li v-for="item in news">
     <RouterLink :to="`/News/Detail?a=1&b=哈哈&id=${item.id}&title=${item.title}&content=${item.content}`"> {{
      item.title }}</RouterLink>
    </li>
   </ul>
  </div>
</template>
```

#### 第二种写法

```vue
<template>
  <div class="news-navigate">
   <ul>
    <li v-for="item in news">
     <RouterLink :to="{
      path: '/news/detail',
      query: {
       id: item.id,
       title: item.title,
       content: item.content,
      }
     }"> {{ item.title }}</RouterLink>
    </li>
   </ul>
  </div>
</template>
```

### `param`

```vue

```

### `props`

## 编程式路由导航

```vue
<template>
 <h2>Home页面</h2>
</template>


<script setup lang="ts" name="Home">
import { useRouter } from "vue-router";

// 使用钩子函数创建一个钩子对象
let router = useRouter()

setTimeout(() => {
  // 编程式路由导航
  router.push('/props')
}, 3000);
</script>
```
