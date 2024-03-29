---
lang: en-US
title: README
description: marshio's blog site
---



## 前言

之前使用过Hexo搭建个人博客，但是感觉维护起来不方便，提交代码，还要编译发布

之前的代码：[imarshio.github.io.zip](https://www.yuque.com/attachments/yuque/0/2024/zip/21953536/1704424734047-439858b0-d4d6-486e-bf65-e8a17f41e8d5.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2024%2Fzip%2F21953536%2F1704424734047-439858b0-d4d6-486e-bf65-e8a17f41e8d5.zip%22%2C%22name%22%3A%22imarshio.github.io.zip%22%2C%22size%22%3A1780558%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u726a4bee-41cd-4667-a597-60da4a37f80%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fx-zip-compressed%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u4396e2de%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

这次经过一段时间的探索，我选择了[VuePress](https://v2.vuepress.vuejs.org/guide/getting-started.html) + [Github Pages](https://pages.github.com/)搭建个人博客。

之前基本没有接触过vue系列，所以这次搭建环境算是从0开始。

首先，VuePress版本我这里选择了2.x，虽然目前他仍处于RC阶段，但我看他已经上线有很长一段时间了，因该不会存在很明显的BUG，就算存在，我也可以通过提交issue解决或通过其他办法绕过去，而且我考虑到VuePress 1.x是基于vue 2.x的，VuePress 2.x是基于vue 3.x的，但是vue 2.x已经停止了维护，综合考虑，我选择了VuePress 2.x。

其次，安装VuePress的前提是安装Node.js v18.16.0+，Node.js我还是有一些安装经验的，之前部署Hexo的博客用到过，所以我知道，环境嘛，不可能只会有一个版本的Node.js的，所以我先从Node.js版本管理工具下手的，经过一番探索，我选择了nvm管理工具。

## 安装VuePress

先决条件

- Node.js v18.16.0+
- Package manager( [pnpm](https://pnpm.io/), [yarn](https://classic.yarnpkg.com/en/), [npm](https://www.npmjs.com/))

### 安装Node.js

先安装nvm，需要注意，nvm只提供了Linux版本的，对于Windows上的nvm需要另外下载（建议读完全文在进行动手实操）。

nvm：[https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

nvm-windows：[https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

```shell
# 查看node.js的列表
nvm list

# 查看可用的node.js版本
nvm ls available

# 下载
nvm install 18.19.0

# 查看当前的node.js版本
nvm current
```

### 安装pnpm

中文官网：[https://www.pnpm.cn/installation#using-corepack](https://www.pnpm.cn/installation#using-corepack)

英文官网：[https://pnpm.io/installation](https://pnpm.io/installation)

### Windows

打开power shell，输入如下命令`iwr https://get.pnpm.io/install.ps1 -useb | iex`

```shell
PS C:\Users\demo> iwr https://get.pnpm.io/install.ps1 -useb | iex
Downloading pnpm from GitHub...

Running setup...

Copying pnpm CLI from C:\Users\demo\AppData\Local\Temp\636edd57-6fa4-4432-ad25-438703112b01\pnpm.exe to C:\Users\demo\AppData\Local\pnpm\pnpm.exe
Next configuration changes were made:
PNPM_HOME=C:\Users\demo\AppData\Local\pnpm
Path=%PNPM_HOME%;%USERPROFILE%\AppData\Local\Microsoft\WindowsApps;%NVM_HOME%;%NVM_SYMLINK%

Setup complete. Open a new terminal to start using pnpm.
```

#### Mac

正常方式下，我们会通过先安装Node.js（版本大于等于16.14）,然后通过homebrew安装pnpm。
首先，确保系统中安装了`homebrew`,`Node.js`，并确保当前的网络环境正常。

```shell
brew install pnpm
```

结束。

当然，我们还提供其他方式，除了官网的方式之外，我们这里还有如下几种安装方式

##### 脚本分析

尝试了官网的安装方式`curl -fsSL [https://get.pnpm.io/install.sh](https://get.pnpm.io/install.sh) | sh -`
不可行（我加了梯子的）！！

所以我打开了`file:///Users/marshio/Downloads/install.sh`这个神奇的脚本，然后`mv`到用户目录（～），手动执行`sh install.sh`，经过漫长的等待后，我得到了下面的输出结果

```shell
marshio@marshiodeMacBook-Pro ~ % sh install.sh 
==> Downloading pnpm binaries 8.15.4
curl: (35) Recv failure: Operation timed out
Install Error!
```

然后我用编辑器打开了脚本，里面大致就是确定要下载版本号和平台以及CPU架构来确定最终的下载链接，手动拼出来就是[https://github.com/pnpm/pnpm/releases/download/v8.15.4/pnpm-macos-arm64](https://github.com/pnpm/pnpm/releases/download/v8.15.4/pnpm-macos-arm64)
为了避免这么麻烦，可以直接在[官方Git的release](https://github.com/pnpm/pnpm/releases/)中找到需要下载的东西。
然后执行如下命令

```shell
# 进入文件的下载目录
cd ~/Download

# 创建临时目录，执行完成后删除
mkdir pnpm

# 将下载的东西暂时放到～/Download/pnpm下,并重命名为pnpm
mv pnpm-macos-arm64 ./pnpm/pnpm

# 执行 SHELL="$SHELL" "$tmp_dir/pnpm" setup --force || return 1
SHELL="$SHELL" /pnpm/pnpm setup --force

# 注意，如果你碰到不能打开之类的提示，那就去mac的设置里-隐私与安全性，关闭对该文件的屏蔽

# 然后执行如下命令，然后你就能在控制台中使用pnpm啦
source /Users/marshio/.zshrc
```

##### 一步脚本

之后在一篇[issue](https://github.com/pnpm/pnpm/issues/6849)中找到如下链接：`curl -fsSL https://pnpm.beingthink.com/install.sh | sh -`

```shell
# 输入命令并执行
marshio@marshiodeMacBook-Pro ~ % sh install.sh 
# 如下输出说明你是正确的
==> Downloading pnpm binaries 8.15.4
 WARN  using --force I sure hope you know what you are doing
Copying pnpm CLI from /private/var/folders/_4/q2v83hq179j8sb5pfqnfdvpw0000gn/T/tmp.HTY9AEQY2U/pnpm to /Users/marshio/Library/pnpm/pnpm
Created /Users/marshio/.zshrc

Next configuration changes were made:
export PNPM_HOME="/Users/marshio/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

To start using pnpm, run:
source /Users/marshio/.zshrc

# 结束后再执行一个命令
source /Users/marshio/.zshrc
```

### 综上

可以发现，我只需要下载一个pnpm即可，然后再通过命令`pnpm env --global 18.19.0`就完成了环境搭建的先决条件准备。
可能一些人会疑惑？那vue和vuepress呢？`vue`和`vuepress`都可以通过`pnpm add`添加到项目依赖，即`vue`和`vuepress`。

### 初始化详细步骤

- 安装pnpm

根据系统选择

- 通过pnpm 安装Node.js

```sh
pnpm env use --global 18.19.0
```

- 在本地创建项目目录`/demo.github.io`
- 初始化（git、pnpm）

Windows和Mac命令相同

```sh
D:\Code\MS\imarshio.github.io>git init
Initialized empty Git repository in D:/Code/MS/imarshio.github.io/.git/

D:\Code\MS\imarshio.github.io>pnpm init
Wrote to D:\Code\MS\imarshio.github.io\package.json

{
  "name": "imarshio.github.io",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

- 添加相关依赖

```sh
# 在项目目录下执行如下命令
pnpm add -D vuepress@next @vuepress/client@next vue
```

- 创建一个目录

在项目目录下创建一个你想要的文件名，用于存储未来的博客文档，然后在这个目录下创建一个文档`READMD.md`，里面随便写入一些字符

- 添加启动脚本

```json
{
  "name": "imarshio.github.io",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    // 在这里添加如下两行启动脚本
    "blog-dev": "vuepress dev blog",
    "blog-build": "vuepress build blog"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@vuepress/client": "2.0.0-rc.0",
    "vue": "^3.4.5",
    "vuepress": "2.0.0-rc.0"
  }
}
```

- 启动

```sh
pnpm blog-dev
```

在浏览器输入[http://localhost:8080/](http://localhost:8080/) 如果你能看到你输入的字符就代表大功告成。

- 部署

参考文档：<https://v2.vuepress.vuejs.org/guide/deployment.html>

需要在项目下新建一个目录`.github/workflows/${name it}.yml`，我这里使用的是blog，即我新建的文件目录为`.github/workflows/blog.yml`。

默认配置如下

```yaml
# Github Workflow的名称，可以在Github Actions页面看到
name: blog

# 启动条件，即只有在触发如下条件的情况下才会这个Workflow才会执行部署
on:
  # trigger deployment on every push to main branch
  # 指定只有当
  push:
    branches: [main]
  # trigger deployment manually
  workflow_dispatch:

jobs:
  blog:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
    steps:
      - uses: actions/checkout@v4
        with:
          # fetch all commits to get last updated time or other git log info
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          # choose pnpm version to use
          version: 8
          # install deps with pnpm
          run_install: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          # choose node.js version to use
          node-version: 18.19.0
          # cache deps for pnpm
          cache: pnpm

      # run build script
      - name: Build VuePress site
        run: pnpm blog:build

      # please check out the docs of the workflow for more details
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v4
        with:
          # deploy to blog branch
          target_branch: blog
          # deploy the default output dir of VuePress
          build_dir: blog/.vuepress/dist
        env:
          # @see https://docs.github.com/en/actions/reference/authentication-in-a-workflow#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```

### 非初始化启动

- 环境准备

  - pnpm
  - git

- git clone到项目目录

```sh
git clone https://github.com/imarshio/imarshio.github.io.git
```

- 依赖下载

```sh
pnpm install
```

- 启动

```sh
pnpm blog-dev
```

在浏览器输入[http://localhost:8080/](http://localhost:8080/) 如果你能看到你输入的字符就代表大功告成。


### vuepress的详细使用

[官网-快速上手](https://v2.vuepress.vuejs.org/guide/getting-started.html)

更多使用方法后续会逐渐补充在这里！！:

有关Markdown的使用方式可以参考：<https://github.com/markdown-it>

有关Markdown-emoji的使用方法可以参考：<https://github.com/markdown-it/markdown-it-emoji>

### TODO

- 导航，现在只会默认展示首页，但是首页目前只代表了一个md文件，多md文件无法同时展现出来

- 主题，目前使用的是官方默认主题，大家都知道这个主题非常的简洁易用，但是我个人对博客的感觉还是会带一些其他的期待，要在简洁的同时兼顾美感，经过一番筛选，最终确定了未来将要扩展的主题为：[hope](https://theme-hope.vuejs.press/)

- 迁移，之前写的一些blog都会相继迁移到新的blog中，敬请期待啊

- 部署，虽然部署的文档流程已经通读完成了，但是还没有进行详细的操作，其中涉及到了[Github Actions](https://github.com/features/actions)

- 其他，完成整理沉淀之后，会对后续的方向、短期规划做一下扩展，比如吃透一个中间件，读一些好书

就酱吧，目前。
