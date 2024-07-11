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

显示网络链接，路由，接口统计和其他网络相关信息的命令。

### 参数

| 参数       | 解释             |
| ---------- | ---------------- |
| `-a --all` | 显示所有的Socket链接 |
|  -n          | 以数字形式显示地址和端口号 |
|  -p          | 显示PID和名称 |

### 默认输出

```sh
[root@iZuf6ipaofe0zmf15z5lttZ sbin]# netstat
# 网络连接
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 iZuf6ipaofe0zmf15:41028 100.100.36.108:http     TIME_WAIT  
tcp        0      0 iZuf6ipaofe0zmf15:49392 100.100.30.27:http      ESTABLISHED
# 通过ssh链接到本机的网络通信
tcp        0     52 iZuf6ipaofe0zmf15z5:ssh 180.158.222.49:56755    ESTABLISHED
Active UNIX domain sockets (w/o servers)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ]         DGRAM                    13367    /var/run/chrony/chronyd.sock
unix  2      [ ]         DGRAM                    10567    /run/systemd/shutdownd
unix  4      [ ]         DGRAM                    8047     /run/systemd/notify
unix  2      [ ]         DGRAM                    8049     /run/systemd/cgroups-agent
unix  5      [ ]         DGRAM                    8067     /run/systemd/journal/socket
unix  14     [ ]         DGRAM                    8069     /dev/log
```

```shell

netstat -lnt

```

### 已知端口查进程

很多情况下，我们因为种种原因，会遇到 `Address already in use` 的错误，所以我们已知端口，想要知道是那个服务在占用这个端口。

```sh
netstat -anp | grep port

netstat -anp | grep 80

[root@demo sbin]# netstat -anp | grep 80
# 可以看到 80 端口在被 nginx 服务占用，PID 是 22286
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      22286/nginx: master 
tcp        0      0 172.26.208.232:49392    100.100.30.27:80        ESTABLISHED 8759/AliYunDun      
tcp        0      0 172.26.208.232:41092    100.100.36.108:80       TIME_WAIT   -                   
tcp        0     52 172.26.208.232:22       180.158.222.49:56755    ESTABLISHED 8050/sshd: root@pts 
tcp6       0      0 :::80                   :::*                    LISTEN      22286/nginx: master 
udp        0      0 0.0.0.0:68              0.0.0.0:*                           801/dhclient        
unix  4      [ ]         DGRAM                    8047     1/systemd            /run/systemd/notify
unix  2      [ ]         DGRAM                    8049     1/systemd            /run/systemd/cgroups-agent
unix  2      [ ACC ]     STREAM     LISTENING     8064     1/systemd            /run/systemd/journal/stdout
unix  5      [ ]         DGRAM                    8067     1/systemd            /run/systemd/journal/socket
unix  14     [ ]         DGRAM                    8069     1/systemd            /dev/log
unix  2      [ ]         DGRAM                    5606054  8050/sshd: root@pts  
unix  3      [ ]         STREAM     CONNECTED     16680    1079/master          
unix  2      [ ]         DGRAM                    14833    801/dhclient 
```

## telnet

```sh

```

## ps

Process Status，用于显示当前进程的状态。

用法：

`ps [options]`
`ps [--help]`

### `ps aux`

a：显示所有用户的所有进程。如果没有这个选项，ps 只会显示当前终端会话的进程。
u：以用户友好的格式显示进程信息，包括更多的细节，如进程的用户、进程状态、CPU 使用率、内存使用率等。
x：显示没有控制终端的进程。通常，一个进程会与一个终端相关联，但有些后台进程可能没有控制终端，这个选项确保这些进程也被列出。

输出

USER：进程的所有者用户名。
PID：进程的ID。
%CPU：进程使用的CPU百分比。
%MEM：进程使用的物理内存百分比。
VSZ：进程使用的虚拟内存大小（KB）。
RSS：进程使用的物理内存大小（KB）。
TTY：与进程关联的终端设备。
STAT：进程的状态（D=不可中断的睡眠，R=运行，S=睡眠，T=停止，Z=僵尸进程，等等）。
START：进程启动的时间。
TIME：进程已运行的时间。
COMMAND：进程的命令行，通常包括可执行文件的路径和任何传递给它的参数。

### 🌰

```shell
# 查找所有的Java进程  -a代表查询所有 | 代表管道  grep代表过滤出
ps -a | grep java

# 排除结果中的grep进程
ps -a | grep java | grep -v grep
```

参考

- [https://linux.vbird.org/](https://linux.vbird.org/)(推荐，基本所有的命令都可以在这找到)
- [https://phoenixnap.com/kb/linux-commands](https://phoenixnap.com/kb/linux-commands)（推荐）
- [https://www.runoob.com/linux/linux-command-manual.html](https://www.runoob.com/linux/linux-command-manual.html)
- [https://www.linuxcool.com/](https://www.linuxcool.com/)
