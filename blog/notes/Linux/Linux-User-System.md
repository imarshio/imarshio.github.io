---
icon: pen-to-square
order: 4
category:
  - Linux
title: Linux User System
# tag:

---

## 用户组

### 查看用户组

```shell
# 查看当前用户的用户组
groups

# 查看指定用户的用户组
groups user

# 查看所有的用户组
cat /etc/groups
```

### 添加用户组

```shell
# 添加用户组
groupadd group_name

# 将已有用户添加到指定用户组，-a 表示append
usermod -a -G group_name user_name
```

## 用户

### 查看当前用户

```sh
whoami
```

### 创建用户

```sh
useradd 
```
