---
icon: pen-to-square
category:
  - CLion
title: CLion环境搭建
tag:
- jetbrains
- ide
- C++
---

enmm，不知从何说起，那就直接开始干活吧。

下载 `CLion` 前，先说一下，支持 `c/c++` 的 `ide` 不止 `CLion`，我选择 `CLion` 是因为我是付费用户，外加对 `JetBrains` 的评价目前来看还算中肯，所以才会选择 `CLion`

## 编译器

像 `IDEA` 一样，`CLion` 本身不会提供 `c/c++` 的编译环境，所以需要我们自己去下载编译环境，就像使用 `IDEA` 去下载 `Java` 的 `jdk` 一样。

但与 `Java` 不一样的是 `jdk` 我们没有很多的选择（除了版本这一变量），`c/c++` 的编译器有很多选择，如下

- `GCC（GNU Compiler Collection）`是一个跨平台的编译器集合，它支持多种编程语言，包括`C`、`C++`、`Objective-C`、`Fortran`等。它可以在多种操作系统上运行，包括`Linux`和`Windows`。

- `MinGW（Minimalist GNU for Windows）`是一个开源的软件开发工具集，它为`Windows`提供了`GNU`开发环境。它包含了一组用于`Windows`的头文件和库文件，以及`GCC`编译器。`MinGW`使得开发者能够在`Windows`上开发和编译使用GNU工具链的应用程序。

- `MinGW-w64`是`MinGW`项目的分支，它支持编译生成32位和64位的`Windows`程序，而传统的`MinGW`主要支持32位程序。`MinGW-w64`提供了对`Windows 64`位系统的更好支持。

在`Linux`系统中，`GCC`是默认的`C和C++`编译器，而在`Windows`系统中，`MinGW和MinGW-w64`提供了在`Windows`环境下使用`GCC`编译器的能力。

## 下载

- `GCC`，官网：<https://gcc.gnu.org/>，Linux系统下的 `c/c++` 编译器 `GCC`
- `MinGW`：官网：没找到，下载链接大概是：[下载](https://osdn.net/projects/mingw/)
- `MinGW-w64`：官网：<https://www.mingw-w64.org/>， `Windows` 系统上的 `GCC` 编译器
- `TDM-GCC`：官网暂不可用，就不贴了，贴了其实也只是为凑字数而已。
- `MSVC` 系列，与 `Visual Studio` 集成，是微软的编译器

这里我们要下载的就是 MinGW。进入[下载地址](https://www.mingw-w64.org/downloads)，选择[w64devkit](https://www.mingw-w64.org/downloads/#w64devkit)
