---
icon: pen-to-square
order: 1
# category:
#   - Term
title: 脚手架创建应用
# tag:

---

## 使用脚手架创建应用

```sh
pnpm create vue@latest
```

## 下载依赖

```sh
pnpm install
```

## 启动项目

> 启动项目，`pnpm run`是固定的，后面跟的是`package.json`文件里的`scripts`里的一项，`dev`可以理解为约定俗成的，在项目开发阶段使用的命令。
>
> 配置文件里的其他配置项后面再详细展开。

```sh
pnpm run dev
```

### 配置文件

```json
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --build --force"
  },
  // ...
}

```

### 启动时指定端口

```json
{
  // ...
  "scripts": {
    "dev": "vite --port 8999",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --build --force"
  },
  // ...
}

```

## 文件释义

| 文件名             | 释义                                                    | 样例                                  |
| ------------------ | ------------------------------------------------------- | ------------------------------------- |
| public             | 存放静态文件                                            | favicon.ico                           |
| src                | 源代码文件                                              | components                            |
| .gitignore         | git的忽略文件                                           |                                       |
| index.html         | 首页入口                                                |                                       |
| README.md          |                                                         |                                       |
| package.json       | Node.js项目的配置文件，包含了项目的依赖、脚本命令等信息 |                                       |
| pnpm-lock.json     | pnpm相关的配置                                          |                                       |
| env.d.ts           | 环境声明文件                                            | /// <reference types="vite/client" /> |
| tsconfig.app.json  | ts相关配置，针对应用程序                                |                                       |
| tsconfig.node.json | ts相关配置，针对Node.js                                 |                                       |
| vite.config.json   | vite的配置，插件、代理都配置在这里                      |                                       |
