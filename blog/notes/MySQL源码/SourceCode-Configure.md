---
icon: pen-to-square
order: 21
category:
  - MySQL
title: MySQL 8.0.x 环境配置
tag:
- 源码阅读
- MySQL
- C++
---

接上文[MySQL源码下载](./SourceCodeDownload.md)，现在假设你的环境中已经存在`MySQL`的源码文件且已经解压完成了。

## Linux

这里我把MySQL的源码下载到了`/usr/local/src`这个位置，这个下载的文件位置纯看个人喜好，我这里是想规范一点，所以放在了Linux中专门放源码文件的地方。


```sh
# 进入指定目录，
cd /usr/local/src

# 进入目录
cd mysql-8.0.40/

# 创建打包用的目录,build_output用于存放cmake configure后的输出，data用于mysql存放数据，etc用于存放mysql的启动配置
mkdir -p {build_output,data,src}

```

除此之外，我们还需要预先下载好一些工具包，需要下载的东西可以从官网查看：[Source Installation Prerequisites](https://dev.mysql.com/doc/refman/8.0/en/source-installation-prerequisites.html)。

主要包括

- Git
- CMake
- make
- gcc（Linux和mac一般都会自带，Windows需要单独下载）
- ssl库，默认是用OpeSSL
- ncurses库

```sh
# 查看git是否安装
git --version

# 没安装则执行
yum install -y git

# 查看cmake是否安装
cmake --version

# 没安装则执行
yum install -y cmake

make --version

yum install -y make

gcc --version

yum install -y gcc

openssl --version

yum install -y openssl


# 最后附一下我的版本
[root@VM-12-3-centos ~]# git --version
git version 2.47.1
[root@VM-12-3-centos ~]# make --version
GNU Make 4.3
Built for x86_64-redhat-linux-gnu
Copyright (C) 1988-2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
[root@VM-12-3-centos ~]# gcc --version
gcc (GCC) 11.2.1 20220127 (Red Hat 11.2.1-9)
Copyright (C) 2021 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

[root@VM-12-3-centos ~]# openssl --version
OpenSSL 3.2.2 4 Jun 2024 (Library: OpenSSL 3.2.2 4 Jun 2024)

```

此时进入下一步[IDE 配置](./SourceCodeIde.md)

## Mac

## Windows
