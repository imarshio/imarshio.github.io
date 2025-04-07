---
icon: pen-to-square
order: 20
category:
  - MySQL
title: MySQL 8.0.x 源码下载
tag:
- 源码阅读
- MySQL
- C++
---

## 源码下载

在[MySQL官网](https://dev.mysql.com/)找到[下载地址](https://dev.mysql.com/downloads/mysql/)，选择版本-->选择源码下载--> 选择All Operation Systems...-->选择带boost的点击下载或获取下载链接。

如果不想找，这里有[官网下载链接](https://downloads.mysql.com/archives/get/p/23/file/mysql-boost-8.0.35.tar.gz)

![MySQL-downloads-0001](/assets/images/MySQL-20240322-0001.png)

![MySQL-downloads-0002](/assets/images/MySQL-20240322-0002.png)

![MySQL-downloads-0003](/assets/images/MySQL-20240322-0003.png)

![MySQL-downloads-0004](/assets/images/MySQL-20240322-0004.png)

![MySQL-选择带boost的包](/assets/images/MySQL-20240322-0005.png)

如果你是Windows，可以直接下载，然后上传到服务器进行解压，如果你是Linux/Mac可以右键`download`按钮，复制下载链接，然后运行`wget https://downloads.mysql.com/archives/get/p/23/file/mysql-boost-8.0.40.tar.gz`,下载完成后进行解压。

参考命令

```sh
# 使用wget下载
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-boost-8.0.40.tar.gz

# 在你想要解压的目录下进行解压
tar -zxvf mysql-8.0.34.tar.gz
```

- `-z`：调用`Gzip`进行第一层解压，如果是打包则是调用Gzip进行压缩
- `-x`：从`tar`包中解压
- `-v`：`verbose`的缩写，表示展示解压的详细信息
- `-f`：表示解压指定文件名的文件，即`mysql-boost-8.0.40.tar.gz`
