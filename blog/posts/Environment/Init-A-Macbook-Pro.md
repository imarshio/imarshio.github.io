---
lang: en-US
icon: pen-to-square
data: 2024-03-01
category: 
    - Environment setup
tag:
    - Macbook Pro
    - Windows
title: Macbook Pro 的正确打开方式
description: 关于一个程序员如何正确解封Macbook Pro (m3pro)，顺便一提，本人是一个macos小白，所以以下内容仅作笔记记录
---


## 机器检查

暂无，无明显异常即可

## 软件安装

查看内核型号，可以查看内核是什么架构（x64还是arm）。

```sh
uname -a
```

提起安装，对于身为程序员的我来说，整洁的文件管理是必要的，什么东西放在哪里，什么文件代表什么意思，这都是刻在骨子里的（洁癖）。

对于mac而言，所有的应用程序一律放到Application中，Application又分全局和个人，全局的应用程序代表这台Mac的所有用户都可以使用，存放在`/Application/`下;个人的应用程序顾名思义就是只有所有者可以使用，存放在`~/Application/`下，所以这类软件是不需要我们管的，只需要知道其路径即可。

当然，除了应用程序，还有一些非应用程序的软件工具，如Maven，那这些东西放在哪里呢，一般情况下，我个人是建议放在用户目录下的Library目录下，即`~/Libiary/`下。

当然，开发人员也少不了代码目录啊，我个人是将代码目录放在了用户目录下Projects（需自建，无需使用root权限）下。

一开始使用Macbookpro的时候可能会免不了看到教程里会使用`sudo`命令来挖坑。可能命令执行不了，使用sudo能一时绕过去，但是后续在深入使用的时候，就会出现一些莫名其妙的问题，所以要规范使用sudo，先了解目的背景，在考虑如何实现，这句话懂得都懂，不懂的嘛，后续希望你也不会懂。

后续遇到其他再说。

### Xcode

AppStore 直接搜索安装即可，很多开发软件都需要他的支持。

### Command Line Tools

打开终端，输入以下命令：

```shell
xcode-select —install
```

### Homebrew

官网：[https://brew.sh/zh-cn/](https://brew.sh/zh-cn/)

现在Home brew支持多种方式下载，它提供了dpk的下载器，也可以按照网上的方法（自寻）安装，本人使用的是下载器（+🪜梯子）。

下载器位置：[https://github.com/Homebrew/brew/releases/tag/4.2.10](https://github.com/Homebrew/brew/releases/tag/4.2.10)

高级安装选项：[https://docs.brew.sh/Installation](https://docs.brew.sh/Installation)

默认下载位置：`/opt/homebrew`

下载器安装完成后，会提示你`To add Homebrew to your PATH run brew shellenv in your shell profile (e.g. ~/.bash_profile or ~/.zprofile)`

如果你此时直接在终端输入`brew -v`，会提示，`Commond not find: brew`，这是因为此时，`brew`还没有被添加到系统命令里，这一步需要手动完成。

输入如下两条命令将brew添加到系统命令

```shell
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/username/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

#### 设置国内镜像源

参考：[清华源配置](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)

日常使用，如下这些配置就够了。

```sh
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_PIP_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"
```

### Java

进入[Oracle官网](https://www.oracle.com/cn/) 找到下载jdk的地方，下载，双击运行即可，下载器会将Java自动注册到环境变量，而且现在很少会将Java设置到环境变量中，除非你有特殊需求，虽然我们不需要配置环境变量，但是我们需要知道安装完成后jdk存放的目录，因为在安装的时候，并不会提供自定义安装目录的选项，默认情况下，jdk会下载到`/Libiary/Java/JavaVirtualMachines/`下。

### Maven

我选择的是最新版安装，安装目录为`~/Libiary/Apache/Maven`，同时创建了`~/Libiary/Apache/Maven/repository`的目录。

在官网选择后缀为`tar.zip`的压缩包，创建如上目录结构，将下载好的文件mv到创建好的目录下，使用命令`tar -zxvf apache-maven-3.9.6.tar.zip`。

### pnpm

使用命令`curl -fsSL https://pnpm.beingthink.com/install.sh | sh -`下载即可。
