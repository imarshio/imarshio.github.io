---
icon: pen-to-square
date: 2024-03-22
category:
  - MySQL
title: MySQL8.0.x 源码阅读指南
tag:
- 源码阅读
- MySQL
- C++
---

## 源码下载

在[MySQL官网](https://dev.mysql.com/)找到[下载地址](https://dev.mysql.com/downloads/mysql/)，选择版本-->选择源码下载--> 选择All Operation...-->点击下载。

如果不想找，这里有[官网下载链接](https://downloads.mysql.com/archives/get/p/23/file/mysql-boost-8.0.35.tar.gz)

![MySQL-downloads-0001](/assets/images/MySQL-20240322-0001.png)

![MySQL-downloads-0002](/assets/images/MySQL-20240322-0002.png)

![MySQL-downloads-0002](/assets/images/MySQL-20240322-0003.png)

![MySQL-downloads-0002](/assets/images/MySQL-20240322-0004.png)

![MySQL-downloads-0002](/assets/images/MySQL-20240322-0005.png)

下载完成后进行解压。

参考命令

```sh
# 解压
tar -zxvf mysql-8.0.34.tar.gz
```

## 使用IDE打开

这里我选择的是JetBrains家族的 CLion，因为我有JetBrains全家桶账号，且付费插件都是可用的，而且不是盗版，有兴趣的小伙伴可以联系我。
