---
icon: pen-to-square
order: 99
category:
  - MySQL
title: MySQL 8.0.x 源码阅读问题汇总
tag:
- 源码阅读
- MySQL
- C++
---

## CMake Error

> 在解决问题前，我们需要先了解下什么是[cmake](https://cmake.org/)文件.
>
> CMake is the de-facto standard for building C++ code, with over 2 million downloads a month. It’s a powerful, comprehensive solution for managing the software build process. Get everything you need to successfully leverage CMake by visiting our resources section.
>
> 简译即：cmake是构建c++代码的标准，我感觉可以理解为Java中的Maven（某种程度上）。

### ssl

<https://bugs.mysql.com/bug.php?id=91672>

```sh
CMake Error at cmake/ssl.cmake:87 (MESSAGE):
  Please see https://wiki.openssl.org/index.php/Binaries

Call Stack (most recent call first):
  cmake/ssl.cmake:331 (FATAL_SSL_NOT_FOUND_ERROR)
  CMakeLists.txt:1783 (MYSQL_CHECK_SSL)

# 对上面稍作解释

# 如下报错你可以想象成是一个Java的异常栈输出，第一行是异常栈的最后输出点，你可以通过：cmake/ssl.cmake:87定位输出位置
CMake Error at cmake/ssl.cmake:87 (MESSAGE):
  Please see https://wiki.openssl.org/index.php/Binaries

Call Stack (most recent call first):
  # 具体的报异常的位置，可以看到原因是SSL未找到
  cmake/ssl.cmake:331 (FATAL_SSL_NOT_FOUND_ERROR)
  CMakeLists.txt:1783 (MYSQL_CHECK_SSL)
```
