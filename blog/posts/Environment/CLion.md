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

下载 CLion 前，先说一下，支持 c/c++ 的 ide 不止 CLion，我选择 CLion 是因为我是付费用户，外加对 JetBrains 的评价目前来看还算中肯，所以才会选择 CLion。

像 IDEA 一样，CLion 本身不会提供 c/c++ 的编译环境，所以需要我们自己去下载编译环境，就像使用 IDEA 去下载 Java 的 jdk 一样。

但与 Java 不一样的是 jdk 我们没有很多的选择（除了版本这一变量），c/c++ 的编译器有很多选择，如下

- GCC，官网：<https://gcc.gnu.org/>
  - MinGW：官网：没找到，下载链接大概是：[下载](https://osdn.net/projects/mingw/)
  - MinGW-w64：官网：<https://www.mingw-w64.org/>
  - TDM-GCC：官网暂不可用，就不贴了，贴了其实也只是为凑字数而已。

- MSVC 系列，与 Visual Studio 集成，是微软的编译器

这里我们要下载的就是 MinGW。进入[下载地址](https://www.mingw-w64.org/downloads)，选择[w64devkit](https://www.mingw-w64.org/downloads/#w64devkit)

## 下载
