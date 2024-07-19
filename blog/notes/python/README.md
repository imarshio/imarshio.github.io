---
title: Python
icon: fa-brands fa-python
index: false
article: false
category:
  - Intro
tag:
  - Intro
---

## Introduction

## 源码安装

[官网](https://www.python.org/downloads/release/python-3124/)

下载对应的压缩包，可选 `Gzipped source tarball`，也可以选 `XZ compressed source tarball`。

```sh
# 解压
tar -zxvf Python-3.12.4.tgz

# 进入目录
cd Python-3.12.4

# 安装依赖  -- Ubuntu、Debian 
apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev libbz2-dev pkg-config liblzma-dev sqlite3 tk-dev uuid-dev libgdbm-compat-dev -y

# 安装依赖  -- CentOS、Fedora、RHEL 
sudo yum install zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl-devel xz xz-devel libffi-devel

# 配置编译
./configure --enable-optimizations --prefix=/usr/local/python3

# 编译并安装
make && make install
```
