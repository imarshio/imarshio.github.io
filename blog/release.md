---
icon: circle-info
title: Aboud Blog
index: false
article: false
cover: /assets/images/1265079-1322607782.png
---

## 小站更新日记

### 2026.10.27

1. 在[变量、类型与运算](./notes/python/basics/types.md#默认参数为什么不建议直接用可变对象)中补充可变默认参数案例：对比 `items=[]` 与 `items=None` 的连续调用结果，解释默认值求值时机及对象共享，并提供在线运行入口。

### 2026.10.26

1. 新增[在线代码执行器](./tools/code-runner.md)，通过 OneCompiler 支持 Python、Node.js、JavaScript、HTML 和 Java 示例的在线编辑与运行。
2. Markdown 代码块语言后添加 `run` 即可启用，运行入口位于代码块右上角、复制按钮旁；点击展开编辑器，收起后保留本次编辑内容。
3. 编辑器按需加载，无需本地安装运行环境。运行依赖第三方服务和网络，普通代码块继续保持原有展示方式。
4. 更新兼容依赖：Vue `3.5.41 → 3.5.44`、Sass Embedded `1.103.1 → 1.106.1`、KaTeX `0.16.45 → 0.16.47`，并刷新间接依赖和锁文件。
5. VuePress、Hope 主题及配套插件暂缓升级：新版 Markdown 插件要求 `markdown-it 15`，而当前 VuePress 使用 14 系列；待上游版本兼容后再同步升级。
6. 补齐 Python 笔记的运行入口：首行标注 `# 可独立运行` 的示例自动显示 `run` 按钮，无需逐篇补标记；需要额外依赖的示例仍按原样展示，也可用 `no-run` 单独关闭入口。

### 2025.11.26

1. 升级依赖版本，处理依赖升级后的依赖冲突
2. 更换依赖`vuepress-plugin-comment2@2.0.0-rc.29`为`@vuepress/plugin-comment@next`
3. 内容更新（pg、redis、docker...）

### 2024.7.4

小站已经初具规模，麻雀虽小，五脏俱全，日后一定会勇攀高峰。

#### 小插曲

在一次更新发布的过程中遇到了一个小问题，一向没有问题的发布，失败了，还失败了4次。。。

为什么呢？

```log
Run pnpm/action-setup@v2
  with:
    run_install: true
    version: 8
    dest: ~/setup-pnpm
    package_json_file: package.json
    standalone: false
::group::Running self-installer...
Running self-installer...
Error: Something went wrong, self-installer exits with code 1
Installation Completed!
::group::Running pnpm recursive install...
Running pnpm recursive install...
Error: Command pnpm recursive install (cwd: undefined) exits with status 127
```

问题确定：下载pnpm失败了，已知这是pnpm下的action/setup，所以直接去 GitHub 看一下是否有相关 issue ，一看还真有 [Action failing with setup that has previously been working](https://github.com/pnpm/action-setup/issues/135)，评论里说，升级到 v4 就可以解决这个问题了，于是我尝了下，成功。

### 2024.1 小站浴火重生

这一天，小马同学对小站的再次改造成功发布了第一版

### 2021.4 小站步入2.0

这一年，小马同学离开了生活了近三年的学校-石铁大，踏上了社会的征程，也是这一年小站被初次翻新，这次的翻新我是在一片朦胧中走过来，靠着百度大法好的加成，成功的借助着Hexo和官方提供的部署脚本让小站有了较好的面容。

### 2019.6 小站诞生

这一年，应主任的号召，同学们纷纷开启了Github的魔法之门，并建立了自己的门面网站，当时的页面简简单单，我印象中只有几行类似简历内容的话术。
