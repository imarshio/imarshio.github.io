---
icon: pen-to-square
lang: en-US
title: Connection closed by xxx.xxx.xxx.xx port 22
order: 100
category:
- git
---

在某次对我的仓库 `push` 的时候，我得到了如下报错

```sh
Connection closed by 198.18.0.11 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

## 检查密钥

```sh
ssh -T git@github.com

# 输出
Connection closed by 198.18.0.11 port 22
```

这个其实我之前遇到过，现在记一下，因为我开了代理，且代理开了增强模式，从这里下手，把增强模式关了之后，重新`push`即可。
