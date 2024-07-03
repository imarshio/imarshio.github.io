---
icon: pen-to-square
lang: en-US
order: 50
title: k8s
description: 虚心接受自己的不足，然后找机会与时间去弥补自己的不足，你会慢慢体会到高处不胜寒的感觉。
category:
- k8s
tags: 
- k8s
- notes
- linux

---

## 简介

[概念](https://kubernetes.io/zh-cn/docs/concepts/)

### Node

### Pod

### Namespace

## 安装

[安装官网](https://kubernetes.io/zh-cn/docs/setup/)

## 命令

[官方文档](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)

### kubectl

```sh
# 查看所有的namespace，前提是你有权限
kubectl get namespace

# 查看指定namespace下的pod
kubectl get pod -n namespace_name

# 查看指定pod的日志
kubectl logs -f -n namespace pod_name --tail=200
```
