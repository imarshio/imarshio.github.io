---
icon: pen-to-square
order: 1
category:
  - MySQL
title: MySQL8.0.x 源码阅读指南
tag:
- 源码阅读
- MySQL
- C++
---

<https://dev.mysql.com/doc/refman/5.7/en/source-installation.html>

## 源码下载

参考 [MySQL8.0.x 源码下载](../源码/SourceCodeDownload.md)

## 先决条件

### CMake

[cmake download](https://cmake.org/download/)

选择合适的版本，安装，记得勾选配置环境变量，省的自己配，安装完成后重启电脑。

验证，如下输出，则说明安装完成。

```sh
> cmake

Usage

  cmake [options] <path-to-source>
  cmake [options] <path-to-existing-build>
  cmake [options] -S <path-to-source> -B <path-to-build>

Specify a source directory to (re-)generate a build system for it in the
current working directory.  Specify an existing build directory to
re-generate its build system.

Run 'cmake --help' for more information.

> cmake -version
cmake version 3.30.0-rc2

CMake suite maintained and supported by Kitware (kitware.com/cmake).
```

### make

```sh
> choco install make

> make -version

GNU Make 4.4.1
Built for Windows32
Copyright (C) 1988-2023 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

### OpenSSL

```sh
# 这回下载最新版，由于choco支持的源很少，所以不能下载历史版本，而这个版本跟mysql8.0还有些冲突
> choco install openssl
```

所以我们需要换种方式下载 [官网下载](https://www.openssl.org/source/old/index.html)，选择 1.1.1最新版即 [openssl-1.1.1w](https://www.openssl.org/source/old/1.1.1/openssl-1.1.1w.tar.gz)

```sh
> tar -zxvf 
```

### Boost C++

> The Boost C++ libraries are required to build MySQL (but not to use it). Boost 1.59.0 must be installed. To obtain Boost and its installation instructions, visit the official Boost web site. After Boost is installed, tell the build system where the Boost files are placed according to the value set for the WITH_BOOST option when you invoke CMake.

```sh
cmake . -DWITH_BOOST=/usr/local/boost_version_number
```

### ncurses

### c/c++ version

As of MySQL 8.0.26, MySQL 8.0 source code permits use of C++17 features. To enable the necessary level of C++17 support across all supported platforms, the following minimum compiler versions apply:

Linux: GCC 10 or Clang 5

macOS: XCode 10

Solaris: GCC 10

Windows: Visual Studio 2019

The MySQL C API requires a C++ or C99 compiler to compile.

## 运行
