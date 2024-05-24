---
icon: pen-to-square
lang: en-US
title: Git命令
order: 2
description: 虚心接受自己的不足，然后找机会与时间去弥补自己的不足，你会慢慢体会到高处不胜寒的感觉。
category:
- git

---

## init

初始化仓库

```shell
git init
```

## remote

远程仓库信息

```shell
# 查看远程仓库信息
git remote -v

# 绑定指定仓库
git remote add origin git@101.132.32.220:demo/spring.git

# 修改远程仓库地址
git remote set-url origin git@github.com:imarshio/marshio.git
```

## commit

提交改动

```shell
git add .

# 提交所有已修改文件
git commit -a -m "new message" 

# 提交指定文件
```

## push

推送提交

```shell
git push 
```

## pull

拉取推送，更新分支

```shell
git pull
```

## branch & chekout

分支 切换分支

```shell
# 新建分支
git branch news_branch_name

# 切换分支
git checkout new_branch_name

# 以上两条命令可以简写为
git checkout -b new_branch_name
git checkout -B new_branch_name

# 删除分支
git branch -d old_branch_name

# 切换到远程分支
git checkout -b remote_branch_name --track origin/remote_branch_name
```

## merge

合并

## stash

贮存，暂存当前分支的改动，而不用在切换到其他分支时污染其他分支，或在更新分支时远程推送版本与本地版本有冲突而不能成功更新

场景：比如当前你正在dev分支开发新的需求，突然来了一个临时需求，需要在master分支上新拉一个hot fix分支，但是你当前的需求又马上快完成了，你不想丢掉本地的提交（假设此时，你的本地代码还没推送到远程仓库），那么我们可以使用stash来保证代码的干净。

```sh

# 直接调用会将当前所有的修改暂存到一个stash中
git stash

git stash 
```

## rebase

## cherry-pick

### 背景

假设我当前在A分支进行了一次提交，然后我想在B分支进行同样的提交操作，但是不想重新写代码，此时就可以通过 cherry-pick 完成。

```sh
# A分支模拟操作
$ git commit -m "test commit"
```

### 查看记录

```sh
# 查看A分支的提交日志，需要注意这个 commit id，后面会用到
$ git log
commit 866a5ba7fdd81b49662fa47edb068d42d6059b2c (HEAD -> A, origin/A)
Author: demo <demo@gmail.com>
Date:   Thu May 23 17:13:20 2024 +0800

    test commit

commit 6e12f87ec155fc308c10243ec1f8ad35ad345a71
Author: demo <demo@gmail.com>
Date:   Mon May 13 10:08:06 2024 +0800

    pre test commit
```

### 提取

```sh
# 切换到目标分支B
$ git checkout B

# cherry-pick 后面跟的就是提取的 commit id
$ git cherry-pick 866a5ba7fdd81b49662fa47edb068d42d6059b2c
[B a18b13c] add type column
 Date: Thu May 23 17:13:20 2024 +0800
 2 files changed, 2 insertions(+)

# 确认
$ git log
commit a18b13cfca69a1cbbc1e5b47ebee9f43a60bb0a7 (HEAD -> pre)
Author: demo <demo@gmail.com>
Date:   Thu May 23 17:13:20 2024 +0800

    test commit

```
