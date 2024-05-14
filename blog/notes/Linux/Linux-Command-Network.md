---
icon: pen-to-square
category:
  - Linux
title: Linux Command -- Chapter Network
order: 24
tag:
- ls

---

> [!NOTE]
> 如下命令使用中，
>
> - `[]` 代表可选参数，
> - `<>` 代表可自由输入输入的字符
> - `-` 后面跟的是缩写
> - `--` 后面跟的是全拼

## ping

packet Internet grouper，是一种因特网包探索器，用于测试网络连接量的程序。
ping是TCP/IP体系中应用层的一个命令。
ping可以通过向目标IP发送一个ICMP（Internet Control Message Protocol，因特网报文控制信息协议）报文，测试目的IP是否可达及了解其有关状态。

### 功能

- 检测网络连通性
- 检测时延

## netstat

显示网络状态。
**参数**

| 参数       | 解释             |
| ---------- | ---------------- |
| `-a --all` | 显示所有的Socket |
|            |                  |

```shell

netstat -lnt

```

## telnet

Process Status，用于显示当前进程的状态。
用法：
`ps [options]`
`ps [--help]`

### 🌰

```shell
# 查找所有的Java进程  -a代表查询所有 | 代表管道  grep代表过滤出
ps -a | grep java

# 排除结果中的grep进程
ps -a | grep java | grep -v grep
```
