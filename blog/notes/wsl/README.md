---
title: WSL 2
icon: fa-brands fa-windows
article: false
index: false
category:
  - Intro
tag:
  - Intro
---

## Introduction

## 安装

[适用于 Linux 的 Windows 子系统文档](https://learn.microsoft.com/zh-cn/windows/wsl/)

### Enable the Windows Subsystem for Linux

```sh
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

### Check requirements for running WSL 2

版本检查，要运行 WSL2 Windows 的版本必须大于一定版本，具体需要参考官方文档。

### Enable Virtual Machine feature

启用虚拟功能

```sh
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### Download the Linux kernel update package

下载内核更新包

- [x64](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)
- [arm64](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_arm64.msi)

### Set WSL 2 as your default version

```sh
wsl --set-default-version 2
```

### 下载 Linux 发行版
