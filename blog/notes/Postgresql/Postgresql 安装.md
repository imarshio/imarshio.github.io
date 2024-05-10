---
icon: pen-to-square
date: 2021-03-17
category:
  - postgresql
title: pg安装 
# tag:

---

## 前言

参考

- [https://help.aliyun.com/document_detail/52948.html](https://help.aliyun.com/document_detail/52948.html)
- [https://help.aliyun.com/document_detail/352149.html](https://help.aliyun.com/document_detail/352149.html)
- [https://www.postgresql.org/download/linux/redhat/](https://www.postgresql.org/download/linux/redhat/)

硬件要求

- [https://postgres-xc.sourceforge.net/docs/1_0/install-requirements.html](https://postgres-xc.sourceforge.net/docs/1_0/install-requirements.html)

软件要求

-

用户权限要求

- 需要能在`/usr/local`下新建文件的权限

## 1、下载

进入[官网](https://www.postgresql.org/)，点击Download。

- [指定Linux发行版](https://www.postgresql.org/download/linux/#generic)，按照指示命令下载即可
- [其他Linux发行版](https://www.postgresql.org/ftp/source/)，选择版本后选择以`tar.gz`结尾的文件

[postgresql-13.10.tar.gz](https://www.yuque.com/attachments/yuque/0/2023/gz/21953536/1679394968794-2b166dae-678a-41d6-9f9d-17cdd177701f.gz)
这里我们选择在CentOS7上安装，而CentOS是RedHat的分支，所以我们选择指定Linux发行版的安装方式。

## 2、安装

指定Linux发行版

- Ubuntu

```shell
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql
```

其他Linux发行版

- CentOS

```shell
# 将上述第一步下载的tar.gz包上传到服务器并解压.
tar -zxvf postgresql-13.10.tar.gz

# 迁移目录
mv postgresql-13.10 postgresql

# 编译
./configure

# 
make && make install

```

Docker
1、

```shell
# 拉取镜像
docker pull postgres:13.10-alpine3.17

# 运行
docker run -itd --name postgresql-13.10 --restart=always -e POSTGRES_PASSWORD=Deepq@postgres-dev1310 -p 5432:5432 -v /data/postgresql:/mnt/postgresql/data postgres:13.10-alpine3.17
```
