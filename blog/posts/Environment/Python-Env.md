---
icon: pen-to-square
category:
  - python
title: Python环境搭建 
tag:
  - python
---

## [Conda](https://conda.io/en/latest/)

### Windows

配置参考：[https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)
安装完成后，进入命令行界面

```shell
# 生成.condarc文件
conda config --set show_channel_urls yes


# 找到用户目录下的.condarc文件，打开，替换文件中的内容为如下
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  deepmodeling: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/
```

创建虚拟环境

```shell
# 创建python3.8的环境
conda create -n python3.8 python=3.8 [packages to install]

# 启用python3.8的环境
conda activate python3.8
```

需要注意的是，conda建立的虚拟环境都是完全隔离的，包括依赖，假设当前我有base和python3.8两个环境，那么我在base下载的依赖，在python3.8是不可以用的。

## pyenv + pipenv

### pyenv

1、download

```sh
curl -fsSL https://pyenv.run | bash
```

2、config

- `.bashrc`：
- `.bash_profile`：
- `.profile`：

```sh
# 检查你是否有~/.bash_profile文件

# 有
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc

echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bash_profile
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(pyenv init - bash)"' >> ~/.bash_profile



# 没有
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init - bash)"' >> ~/.bashrc

echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.profile
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.profile
echo 'eval "$(pyenv init - bash)"' >> ~/.profile

```

3、重启SHELL

```sh
exec "$SHELL"
```

4、下载依赖

```sh
yum install gcc make patch zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl-devel tk-devel libffi-devel xz-devel
```

#### 使用

```sh
# 下载指定版本的python，下载位置：C:\Users\xxx\.pyenv\pyenv-win\install_cache\python-3.10.11-amd64.exe
pyenv install 3.9

pyenv uninstall 3.9

# 指定全局python版本
pyenv global 3.9

# select just for current shell session
pyenv shell 3.9

# automatically select whenever you are in the current directory (or its subdirectories)
pyenv local 3.9

# select globally for your user account
pyenv global 3.9

# pyenv install 3.9
WARNING: Please make sure you remove any previous custom paths from your /root/.pydistutils.cfg file.
Downloading Python-3.9.21.tar.xz...
-> https://www.python.org/ftp/python/3.9.21/Python-3.9.21.tar.xz
Installing Python-3.9.21...
Installed Python-3.9.21 to /root/.pyenv/versions/3.9.21

[root@xxx]# python --version
Python 2.7.5
[root@xxx]# pyenv global 3.9
[root@xxx]# python --version
Python 3.9.21
```

### pipenv

```sh
# 安装，--user指定为当前用户安装，不会污染全局的python环境
pip install --user pipenv
pip install --user pipenv -i https://mirrors.aliyun.com/pypi/simple/

echo 'export PATH=$PATH:~/.local/bin' >> ~/.bashrc
# windows下将 C:\Users\xxx\AppData\Roaming\Python\PythonXx\Scripts 添加到环境变量

source ~/.bashrc

# Pipenv会自动将项目映射到对应的虚拟环境,虚拟环境会以项目的根目录加上全路径的hash值作为环境名称 (例如 my_project-a3de50) 存储起来,如果项目路径被更改，就会破坏这个默认的映射，这样pipenv就无法找到和使用项目的虚拟环境,你可以在你的.bashrc/.zshrc (或者其他终端配置文件中) 加入 export PIPENV_VENV_IN_PROJECT=1 来让虚拟环境创建到你的项目目录中，这样就避免了以后路径更改带来的问题。
pipenv install requests

pipenv install matplotlib

# 删除当前的虚拟环境
pipenv --rm

# 指定 python 版本
pipenv --python 3.12

# 从 Pipfile 中下载依赖
pipenv install
```

## 设置PIP源

我们下载python依赖包时有两种方法，如下两种方法都是可以的，下载的依赖也是隔离的

- 使用`pip install`
- 使用`conda install`

但是我们直接下载的时候，大多数情况都会遇到下载慢、失败的问题，其原因嘛，90%都是因为我们要下载的依赖时默认使用的仓库都是国外的仓库，所以我们需要换一个国内的镜像源

### 查看当前镜像源

```shell
# 查看当前镜像源
pip config list
```

### 配置镜像源

```shell
# 配置全局镜像源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### 恢复默认的镜像源

```shell
pip config unset global.index-url
```

可选镜像源地址

- [https://pypi.tuna.tsinghua.edu.cn/simple/](https://pypi.tuna.tsinghua.edu.cn/simple/) （清华源）
- [http://mirrors.aliyun.com/pypi/simple/](http://mirrors.aliyun.com/pypi/simple/) （阿里源）
- [https://pypi.mirrors.ustc.edu.cn/simple/](https://pypi.mirrors.ustc.edu.cn/simple/) （中科大）
- [http://pypi.douban.com/simple](http://pypi.douban.com/simple) （豆瓣源）

对比

```shell
# 未配置镜像源下载依赖
(base) PS C:\Data\Code\spider\demo> pip install pymysql
Collecting pymysql
  Downloading PyMySQL-1.1.0-py3-none-any.whl.metadata (4.4 kB)
Downloading PyMySQL-1.1.0-py3-none-any.whl (44 kB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 44.8/44.8 kB 12.0 kB/s eta 0:00:00
Installing collected packages: pymysql
Successfully installed pymysql-1.1.0

# 配置清华源下载依赖
(base) PS C:\Data\Code\spider\demo> pip install pymysql
Looking in indexes: https://pypi.tuna.tsinghua.edu.cn/simple
```
