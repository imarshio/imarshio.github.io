---
icon: pen-to-square
category:
  - vue
title: pnpm install 超时
tag:
  - pnpm
---

## `ERR_SOCKET_TIMEOUT`

可以参考[Github](https://github.com/pnpm/pnpm/issues/6434)

我自己是通过 VPN 开启了增强模式下载成功的。

### 更新pnpm

如果你是8.x版本的pnpm，那么你需要先[卸载](https://pnpm.io/uninstall)在重新[安装](https://pnpm.io/installation)。

## 设置国内镜像

### 查看镜像源

```sh
pnpm get registry

# 输出下面说明你是官方镜像源
https://registry.npmjs.org/
```

### 设置镜像源

```sh
# 国内常用的pnpm镜像源地址
pnpm config set registry https://registry.npmirror.com/
```
