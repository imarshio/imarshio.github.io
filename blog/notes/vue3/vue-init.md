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
C:\Data\Code\vue_demo>pnpm create vue@latest
.../Local/pnpm/store/v3/tmp/dlx-24440    |   +1 +
.../Local/pnpm/store/v3/tmp/dlx-24440    | Progress: resolved 1, reused 0, downloaded 1, added 1, done

Vue.js - The Progressive JavaScript Framework

# 以下按需选择
√ 请输入项目名称： ... vue-demo
√ 是否使用 TypeScript 语法？ ... 否 / 是
√ 是否启用 JSX 支持？ ... 否 / 是
√ 是否引入 Vue Router 进行单页面应用开发？ ... 否 / 是
√ 是否引入 Pinia 用于状态管理？ ... 否 / 是
√ 是否引入 Vitest 用于单元测试？ ... 否 / 是
√ 是否要引入一款端到端（End to End）测试工具？ » 不需要
√ 是否引入 ESLint 用于代码质量检测？ ... 否 / 是
√ 是否引入 Prettier 用于代码格式化？ ... 否 / 是
√ 是否引入 Vue DevTools 7 扩展用于调试? (试验阶段) ... 否 / 是

正在初始化项目 C:\Data\Code\vue_demo\vue-demo...

项目初始化完成，可执行以下命令：

  cd vue-demo
  pnpm install
  pnpm format
  pnpm dev


C:\Data\Code\vue_demo>cd vue-demo

C:\Data\Code\vue_demo\vue-demo>
```

## 下载依赖

```sh
C:\Data\Code\vue_demo\vue-demo>pnpm install

   ╭─────────────────────────────────────────────────────────────────╮
   │                                                                 │
   │                Update available! 8.14.1 → 9.1.4.                │
   │   Changelog: https://github.com/pnpm/pnpm/releases/tag/v9.1.4   │
   │         Run a script from: https://pnpm.io/installation         │
   │                                                                 │
   │     Follow @pnpmjs for updates: https://twitter.com/pnpmjs      │
   │                                                                 │
   ╰─────────────────────────────────────────────────────────────────╯

Downloading registry.npmjs.org/typescript/5.4.5: 5.83 MB/5.83 MB, done
 WARN  3 deprecated subdependencies found: glob@7.2.3, inflight@1.0.6, rimraf@3.0.2
Packages: +424
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 462, reused 69, downloaded 355, added 424, done
node_modules/.pnpm/esbuild@0.20.2/node_modules/esbuild: Running postinstall script, done in 360ms

dependencies:
+ vue 3.4.27
+ vue-router 4.3.2

devDependencies:
+ @rushstack/eslint-patch 1.10.3
+ @tsconfig/node20 20.1.4
+ @types/jsdom 21.1.7
+ @types/node 20.14.2
+ @vitejs/plugin-vue 5.0.5
+ @vitejs/plugin-vue-jsx 3.1.0 (4.0.0 is available)
+ @vue/eslint-config-prettier 9.0.0
+ @vue/eslint-config-typescript 13.0.0
+ @vue/test-utils 2.4.6
+ @vue/tsconfig 0.5.1
+ eslint 8.57.0 (9.4.0 is available)
+ eslint-plugin-vue 9.26.0
+ jsdom 24.1.0
+ npm-run-all2 6.2.0
+ prettier 3.3.0
+ typescript 5.4.5
+ vite 5.2.12
+ vite-plugin-vue-devtools 7.2.1
+ vitest 1.6.0
+ vue-tsc 2.0.19

Done in 15.7s

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
