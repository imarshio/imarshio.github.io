---
icon: pen-to-square
lang: en-US
title: Connection reset by xxx.xxx.xxx.xx port 443
order: 99
category:
- git
---

在某次对我的仓库 `push` 的时候，等了一段时间后，我就知道，出问题了，之前的 `push` 都是很正常的，怎么突然就不行了呢？

```sh
Connection reset by 20.205.243.160 port 443
fatal: Could not read from remote repository.
Please make sure you have the correct access rights
and the repository exists.
```

## 检查能否 ping 通

因为我的提示是 `Connection reset by xxx.xxx.xxx.xx port 443` 基本不会是网络问题，但是如果是 `timeout`，那就需要检查下网络是否能 `ping` 通了。

```sh
ping github.com
```

## 检查密钥

```sh
ssh -T git@github.com

# 输出
Connection reset by 20.205.243.160 port 443
```

所以我们可以知道，问题出在密钥上。

## 查看正在使用的密钥

```sh
echo "$SSH_AUTH_SOCK"

# 输出，我的输出就是没有输出，意思就是，
# 我当前没有正在使用的密钥，所以我在 验证连通性的时候，会验证失败

```

## 解决密钥过期

解决密钥过期的问题有两种方式

- 重启系统
- 重新添加一遍

```sh
ssh-add /path/to/your/key/id_private
```

## `ssh-agent` 密钥过期机制

暂时还没有深入查看具体的原因
