---
icon: pen-to-square
category:
  - windows
  - chocolatey
title: Install chocolatey in Windows
# tag:

---

[install](https://chocolatey.org/install)

## 安装

### CMD

以管理员的方式打开CMD，然后输出如下命令

```sh
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
```

### powershell

```sh
iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))
```

## 验证

```sh
choco

choco -v
```
