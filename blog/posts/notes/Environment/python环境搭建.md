---
icon: pen-to-square
date: 2021-03-17
category:
  - python
title: Python环境搭建 
# tag:

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
