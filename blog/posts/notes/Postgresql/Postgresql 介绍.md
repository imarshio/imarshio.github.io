---
icon: pen-to-square
date: 2021-03-17
category:
  - postgresql
title: pg介绍
# tag:

---

与MySQL不同的是，postgresql多了一层schema。
其关系如下
![](https://cdn.nlark.com/yuque/0/2023/jpeg/21953536/1679585802319-61b72ae6-0175-45e5-a2cf-91fe4d2e0954.jpeg)

# 权限校验

## peer
参考：[https://www.postgresql.org/docs/13/auth-peer.html](https://www.postgresql.org/docs/13/auth-peer.html)
postgresql默认使用peer进行权限校验，默认会取当前操作系统用户的name作为登录用户
