---
icon: pen-to-square
# category:
  # - Term
title: PNPM
# tag:

---

[官网](https://pnpm.io/)，最新版本是9.x版本，修复了很多BUG，

## 安装

[Installation](https://pnpm.io/installation)

### Mac

```sh
brew install pnpm
```

## 配置

### 镜像源

```sh
# 设置源
pnpm config set registry https://registry.npmmirror.com/

# 默认源
pnpm get registry
```

## 命令

### node

```sh
# 查看当前环境下的 node list
pnpm env list

# 查看远程可用版本
pnpm env list --remote

# 按转并切换到指定版本
pnpm env use --global 20.10.0

# 安装并切换到远程最新版本
pnpm env use --global lts
```

### 下载依赖

[install](https://pnpm.io/cli/install)

```sh

pnpm i 

pnpm install 

pnpm i axios
```

### 移除依赖

```sh
pnpm rm axios

pnpm remove axios
```

### 更新

```sh
pnpm self-update
```
