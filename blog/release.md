---
icon: circle-info
title: Aboud Blog
index: false
article: false
cover: /assets/images/1265079-1322607782.png
---

## 小站更新日记

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
