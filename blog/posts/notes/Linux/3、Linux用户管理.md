---
icon: pen-to-square
date: 2021-03-17
category:
  - Linux
title: Linux用户管理 
# tag:

---

# 用户组

## 查看用户组

```shell
# 查看当前用户的用户组
groups

# 查看指定用户的用户组
groups user

# 查看所有的用户组
cat /etc/groups
```

## 添加用户组

```shell
# 添加用户组
groupadd group

# 将已有用户添加到指定用户组，-a 表示append
usermod -a -G group user
```
