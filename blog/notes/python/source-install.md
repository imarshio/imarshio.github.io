---
title: "解释器与源码安装"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 1
article: false
---

# 解释器与源码安装

学习 Python 前，先明确“语言”和“解释器”的区别。Python 是语言，CPython 是这里主要使用的实现。本文保留之前安装 Python 3.12.4 的操作记录；它是历史环境记录，实际项目版本应按项目约束和维护情况选择。

初学时可以先使用已经安装好的解释器；下面的源码编译记录可以跳过，后续有定制安装需求时再回来看。

## 先确认运行环境

```bash
python --version
python -c "import sys; print(sys.executable)"
```

同一台机器可能有多个解释器。`python -m pip` 使用当前这个解释器对应的 pip，排查“明明安装却导入失败”时先核对解释器路径。

## 源码安装记录（选读）


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


## 安装后的下一步

解释器安装完成后，再为项目建立虚拟环境，隔离不同项目的依赖。继续读 [多版本与虚拟环境](./multi-version.md)，再看 [uv 项目管理](./uv.md)。

---

[下一篇](/notes/python/multi-version.md) · [学习目录](/notes/python/README.md)
