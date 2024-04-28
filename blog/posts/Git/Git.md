---
icon: pen-to-square
lang: en-US
title: Git
description: 虚心接受自己的不足，然后找机会与时间去弥补自己的不足，你会慢慢体会到高处不胜寒的感觉。
category:
- git
tags: 
# - docker
# - notes
# - linux

---

## 介绍

官网：[https://git-scm.com/](https://git-scm.com/)
操作手册：[git操作手册-官网.pdf](https://www.yuque.com/attachments/yuque/0/2023/pdf/21953536/1675228134628-01b982ef-8a8b-4353-8e58-8824785c8912.pdf?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fpdf%2F21953536%2F1675228134628-01b982ef-8a8b-4353-8e58-8824785c8912.pdf%22%2C%22name%22%3A%22git%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C-%E5%AE%98%E7%BD%91.pdf%22%2C%22size%22%3A18870791%2C%22ext%22%3A%22pdf%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22ueb3be02d-23f0-4b90-9747-a8bc2a6db70%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fpdf%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22uf630e91c%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

## 使用场景

### 场景1：上传到云

我们在本地写好了代码，想要上传到git，该如何操作？

1. 打开控制台，切换到项目地址目录，输入命令`git init`，此时，文件夹下会出现一个目录`.git`
2. 在云端git建立对应的仓库，

### 场景2：多项目不同配置

我们在不同的项目想用不同的git仓库以及账号密码怎么办？
假如我有两个项目

| **项目名称** | **账号** | **密码** |
| --- | --- | --- |
| projectA | userA | passwdA |
| projectB | userB | passwdB |

现在我配置了全局用户为userA，如何在projectB中使用userB

如下即可

1. 打开控制台，切换到项目B地址目录，输入命令`git config user.name`，我们会得到`userA`的用户名
2. 配置`git config --local user.name "userB"`

```bash
cd /project_dir

# 确认全局用户
git config user.name

# 确认本地用户
git config user.name --local

# 配置本地用户
git config --local user.name "userB"
git config --local user.email "userB@email.com"
```

可能遇到的问题
在某一天，给某个项目设置本地用户名时，突然提示一下报错

```shell
$ git config --local user.name -l
warning: user.name has multiple values
error: cannot overwrite multiple values with a single value
       Use a regexp, --add or --replace-all to change user.name.


```

我们从报错信息可以得知，我们多设置了用户名的值，`user.name`有多个值。

那咋办呢？
简单

```shell
git config --local --list

# 查看本地配置，可以看到
git config --local -l

...
user.name=marshio
user.name=mashuo

git config --local --replace-all user.name marshio

# 完工！
```

## 配置

参考：[https://git-scm.com/docs/git-config](https://git-scm.com/docs/git-config)

### 环境变量

```shell
# 配置全局用户名
git config --add --global user.name "mashuo"

# 配置当前代码仓库的用户名
git config user.name "marshio"

```

### gitignore文件

我们将一些不需要同步的文件路径加入到此文件中，即可在提交代码时，自动忽略这些文件。

但是当我们一不小心将这些文件提交过后，此时再将该文件路径加入到此文件中就不会再生效了，因为本地缓存已经存在了这些文件，此时我们需要清理本地缓存，重新

具体操作流程如下

```shell
# 切换到当前项目文件夹下,清除缓存
git rm -r --cached .idea

# 此时你会发现.idea文件变成了灰色的，代表他已经被git忽略了，之后就不会再同步了，大功告成
```
