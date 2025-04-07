---
icon: pen-to-square
order: 22
category:
  - MySQL
title: MySQL 8.0.x IDE 选择
tag:
- 源码阅读
- MySQL
- C++
---

接上文[MySQL环境配置](./SourceCodeConfigure.md)，假设你已经做好前置处理。

## Visual Studio Code

### 插件下载

- Remote SSH（如果你选择的是服务器或虚拟机，否则不需要）
- C/C++
- C/C++ Extension Pack
- CMake Tools
- CodeLLDB，你可能会遇到下载失败的情况，此时他会弹出一个选项，让你从浏览器下载，你只需要复制下载链接，在服务器下载即可

因为我这里使用的是服务器+本地VS Code的方式，所以我这里下载了Remote SSH，此时，配置好远程服务器，打开MySQL的目录，如果你的插件下载没问题的话，此时一般会弹出来一个框`select a kit for ...`这里我们选择服务器自带的就好。

## CLion

## Visual Studio
