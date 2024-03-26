---
icon: pen-to-square
date: 2024-03-22
category:
  - CLion
title: CLion环境搭建
tag:
- jetbrains
- ide
- C++
---

enmm，不知从何说起，那就直接开始干活吧。

下载CLion前，先说一下，支持c/c++的ide不止CLion，我选择CLion是因为我是付费用户，外加对JetBrains的评价目前来看还算中肯，所以才会选择CLion。

像IDEA一样，CLion本身不会提供c/c++的编译环境，所以需要我们自己去下载编译环境，就像使用IDEA去下载Java 的jdk一样。

但与Java不一样的是jdk我们没有很多的选择（除了版本这一变量），c/c++的编译器有很多选择，如下

- GCC，官网：<https://gcc.gnu.org/>
  - MinGW：官网：没找到，下载链接大概是：[下载](https://osdn.net/projects/mingw/)
  - MinGW-w64：官网：<https://www.mingw-w64.org/>
  - TDM-GCC：官网暂不可用，就不贴了，贴了其实也只是为凑字数而已。

- MSVC系列，与Visual Studio集成，是微软的编译器

这里我们要下载的就是MinGW。进入[下载地址](https://www.mingw-w64.org/downloads)，选择[w64devkit](https://www.mingw-w64.org/downloads/#w64devkit)

## 下载
