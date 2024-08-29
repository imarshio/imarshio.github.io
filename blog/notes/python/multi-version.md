---
icon: fa-brands fa-python
category:
  - python
title: Python 多版本管理工具
order: 24
tag:
- spider

---

管理多个Python版本和它们的虚拟环境对于任何需要在不同项目间切换的开发者来说都是一项基础技能。从官方的 venv 到强大的 pyenv 和其他第三方工具，Python社区提供了一系列的工具来简化这一过程。本文将为你提供一个全面（未来会全的）的指南，帮助你掌握这些工具的使用方法。

## conda

## venv

venv 是 python 官方在 python 3.3 版本内置的一个标准库模块，用于创建虚拟环境，帮助用户快速创建干净、完全隔离的且不同版本的 python 解释器以便在不同项目中开发。

venv 本身不提供 python 版本的创建，而是直接依赖服务器的 python ，如果想要创建其他版本的 python，需要选择其他版本管理。

venv 重点是帮助用户创建虚拟环境，如果没有多版本的困扰，这对你来说是一个不错的选择。

python-version >= 3.3

### 安装

```sh
apt install python3.x-venv
```

### 创建虚拟环境

```sh
# 我这里是创建了一个python3.8的虚拟环境，python版本仍然是默认的python
python3 -m venv python3.8
```

### 激活虚拟环境

```sh
source python3.8/bin/activate
```

### 退出虚拟环境

```sh
deactivate
```

## pyenv

> pyenv lets you easily switch between multiple versions of Python. It's simple, unobtrusive, and follows the UNIX tradition of single-purpose tools that do one thing well.

重点：支持多版本创建、切换。

如果你有一个项目依赖的 python 版本为 3.8 ，另一个项目依赖的 python 版本为 3.9，你需要在服务器上下载多个 python ，但是在使用的时候其实是很不方便的，这时候，如果你有 pyenv 就很好了，当然 conda也是不错的。

### install

[pyenv-installer](https://github.com/pyenv/pyenv-installer)

```sh
#下载链接1
curl https://pyenv.run | bash


# 下载链接2
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash

```

### 查看和删除

```sh
# 查看已经下载的 python 版本，包括系统自带的
pyenv versions


# 全局切换 python 版本
pyenv global 3.8.0

# 局部切换 python 版本
pyenv local 3.8.0

# 删除已经下载的 python 版本
pyenv uninstall 3.9.0


```

### config

```sh
# 安装完成，我收到了下面的提示
WARNING: seems you still have not added 'pyenv' to the load path.

# Load pyenv automatically by appending
# the following to
# ~/.bash_profile if it exists, otherwise ~/.profile (for login shells)
# and ~/.bashrc (for interactive shells) :

export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# Restart your shell for the changes to take effect.

# Load pyenv-virtualenv automatically by adding
# the following to ~/.bashrc:

eval "$(pyenv virtualenv-init -)"
```

根据如上提示，我们选择 ~/.profile

#### 编辑 `~/.profile`

```sh
vim ~/.profile
```

#### 插入如下配置

```sh
# pyenv
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

#### 重启 shell

```sh
# 可以直接重启 shell
source ~/.profile 
```

#### 验证

```sh
pyenv --version

pyenv 2.4.7
```

### 使用

#### 列出可安装的版本

```sh
pyenv install --list

# 输出
3.8.0
3.8-dev
3.8.1
3.8.2
3.8.3
3.8.4
3.8.5
3.8.6
3.8.7
```

#### 安装特定版本

```sh
pyenv install version

pyenv install 3.8.0

# 当然国内下载是非常非常慢的

# 因为 pyenv 会将下载的包先放到 ~/.pyenv/cache 目录下
# 所以我们可以使用国内镜像先将要下载的东西放过来

# 通过如下命令下载，将版本替换成自己的版本
wget https://mirrors.huaweicloud.com/python/3.8.0/Python-3.8.0.tar.xz -P ~/.pyenv/cache/

# 执行安装
pyenv install 3.8.0 -v

# 安装后 python 执行器放在 ~/.pyenv/versions/3.8.0 包下
```

### pyenv virtualenvs

pyenv-virtualenv 是一个 pyenv 的插件，它提供了创建和管理虚拟环境的功能。这对于需要在不同项目中使用不同 Python 版本和依赖的开发者来说非常有用。

#### 创建虚拟环境

```sh
# 基于 3.8.0 创建一个名为 python-3.8.0 的虚拟环境
pyenv virtualenv 3.8.0 python-3.8.0
```

#### 列出所有的虚拟环境

```sh
pyenv virtualenvs
```

#### 激活虚拟环境

```sh
pyenv activate python-3.8.0
```

#### 停用虚拟环境

```sh
pyenv deactivate
```

#### 删除虚拟环境

```sh
pyenv uninstall python-3.8.0
```

#### 查看当前的虚拟环境

```sh
# 查看当前虚拟环境的 python 版本
pyenv version
```

### 常见问题

解决方案查看[Common-build-problems](https://github.com/pyenv/pyenv/wiki/Common-build-problems#prerequisites)

```log
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/root/.pyenv/versions/3.8.0/lib/python3.8/bz2.py", line 19, in <module>
    from _bz2 import BZ2Compressor, BZ2Decompressor
ModuleNotFoundError: No module named '_bz2'
WARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/root/.pyenv/versions/3.8.0/lib/python3.8/curses/__init__.py", line 13, in <module>
    from _curses import *
ModuleNotFoundError: No module named '_curses'
WARNING: The Python curses extension was not compiled. Missing the ncurses lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/root/.pyenv/versions/3.8.0/lib/python3.8/ctypes/__init__.py", line 7, in <module>
    from _ctypes import Union, Structure, Array
ModuleNotFoundError: No module named '_ctypes'
WARNING: The Python ctypes extension was not compiled. Missing the libffi lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
ModuleNotFoundError: No module named 'readline'
WARNING: The Python readline extension was not compiled. Missing the GNU readline lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/root/.pyenv/versions/3.8.0/lib/python3.8/ssl.py", line 98, in <module>
    import _ssl             # if we can't import it, let the error propagate
ModuleNotFoundError: No module named '_ssl'
ERROR: The Python ssl extension was not compiled. Missing the OpenSSL lib?

Please consult to the Wiki page to fix the problem.
https://github.com/pyenv/pyenv/wiki/Common-build-problems


BUILD FAILED (Ubuntu 22.04 using python-build 2.4.7)

Inspect or clean up the working tree at /tmp/python-build.20240711110235.34532
Results logged to /tmp/python-build.20240711110235.34532.log

Last 10 log lines:
        LD_LIBRARY_PATH=/tmp/python-build.20240711110235.34532/Python-3.8.0 ./python -E -m ensurepip \
                $ensurepip --root=/ ; \
fi
/tmp/tmp63zi22uj/pip-19.2.3-py2.py3-none-any.whl/pip/_vendor/ipaddress.py:1106: SyntaxWarning: 'str' object is not callable; perhaps you missed a comma?
/tmp/tmp63zi22uj/pip-19.2.3-py2.py3-none-any.whl/pip/_vendor/ipaddress.py:1106: SyntaxWarning: 'str' object is not callable; perhaps you missed a comma?
Looking in links: /tmp/tmp63zi22uj
Collecting setuptools
Collecting pip
Installing collected packages: setuptools, pip
```

## virtualenv

## pipenv

集成 pip 和 virtualenv

### 下载

```sh
pip install pipenv
```

### 创建虚拟环境

```sh
pipenv --python 3.8
```

### 查看虚拟环境

```sh
pipenv --venv
```

### 激活虚拟环境

```sh
pipenv shell
```

### 退出虚拟环境

```sh
exit
```

### 下载依赖到虚拟环境

```sh
pipenv install requests

# 安装依赖到开发环境
pipenv install pytest --dev

# 从指定的依赖文件下载依赖
pipenv install -r requirements.txt
```

### 生成或更新 `Pipfile`

```sh
pipenv lock
```
