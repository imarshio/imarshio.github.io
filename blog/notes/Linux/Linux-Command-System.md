---
icon: pen-to-square
category:
  - Linux
title: Linux Command -- Chapter System
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

## `top`

`top`命令可以实时显示系统的运行状态，包括CPU、内存、进程，类似Windows的**任务管理器**，但是更强大，能帮助我们排查服务器异常。

### 用法

`top -hv | -bcHiOSs -d secs -n max -u|U user -p pid(s) -o field -w [cols]`

### 常用参数

| 参数 | 说明 | 用例 |
| ---- | ---- | ---- |
|      |      |      |
|      |      |      |

### 输出说明

![image.png](/assets/images/linux/LinuxCommand-20240318-0002.png)

第一排：

- `top - 12:58:55 up 17 days, 19:53`：指的是这台服务器到今天的`12:58:55`启动了17天，19个小时，53分钟。
- `1 user`：指的是这台服务器目前只有一个用户处于登陆状态
- `load average: 0.01, 0.06, 0.06`：系统负载，三个数值指的是1分钟内的负载，5分钟内的负载，15分钟内的负载。

> [!Note]
> 负载表示在一段时间内，系统平均有多少任务在等待CPU的资源，负载的平均值与系统的CPU核心数量有关系，比如你有一台2C2g的 ECS ，那么你的系统负载能保持在2以下则刚刚好。
>
> 你可以通过`cat /proc/cpuinfo | grep processor`或者`lscpu`查看你有几个 core 。

第二排

- `Tasks: 107 total`：进程数量
  - `running`：运行中的进程数量
  - `sleeping`：sleeping 状态中的进程数量
  - `stopped`：停止的进程数量
  - `zombie`：僵尸进程数量

第三排

- `%Cpu(s)`: CPU 时间被不同活动（进程）占用的百分比
  - `us`：（User）用户空间进程消耗的 CPU 时间百分比，这包括所有非特权用户进程的 CPU 时间。
  - `sy`：（System）内核空间进程消耗的 CPU 时间百分比，这涵盖了操作系统内部操作，如进程调度、内存管理等。
  - `ni`：（nice）优先级被调整（降低）的用户进程消耗的 CPU 时间百分比。这些进程的 nice 值大于0，因此它们比普通用户进程优先级更低。
  - `id`：（idel）CPU 空闲时间的百分比。当没有进程需要执行时，CPU 处于空闲状态。
  - `wa`：（wait）CPU 等待 I/O 操作完成的时间百分比。当进程在等待磁盘读写或其他 I/O 操作时，CPU 不会执行其他任务。
  - `hi`：（Hardware Interrupts）硬件中断处理消耗的 CPU 时间百分比。这些中断通常由硬件设备（如网络接口卡或硬盘）触发。
  - `si`：（Software Interrupts）软件中断（Doorbell Polling Context Switches）或 DPC（Deferred Procedure Calls）消耗的 CPU 时间百分比。这些通常与驱动程序和系统服务相关。
  - `st`：（Steal Time）虚拟化环境中，用于其他虚拟机的 CPU 时间百分比。在物理服务器上运行虚拟机时，这部分表示宿主机 CPU 时间被 hypervisor（如 KVM 或 Xen）分配给了其他虚拟机。

第四排/第五排

- `KiB Mem` ：以`KiB`为单位的内存信息
  - `total`,  服务器总内存大小
  - `free`,   未被使用的内存
  - `used`,   目前进程占用的内存
  - `buff/cache`：缓冲区所占内存
- `KiB Swap`：交换区大小，详细信息可参考：[Swap](https://baike.baidu.com/item/SWaP/2666174?fr=aladdin)
  - `total`：
  - `free`：
  - `used`：
  - `avail Mem`：

其他信息

- `PID`
- `USER`
- `PR`：优先级
- `NI`：nice 值
- `VIRT`：虚拟内存使用
- `RES`
- `SHR`
- `%CPU`
- `%MEM`
- `TIME+`
- `COMMAND`

### 用法

#### Java进程CPU飙升

##### 查看飙升的进程ID（PID）

```sh
top
```

可以使用`SHIFT` + `P` 根据 `%CPU` 排序。

![linux-top-1](/assets/images/linux/Linux-Command-20240513183127.png)

##### 查看飙升的线程ID（TID）

> ![Note]
> 注意上图的 PID 与后续的图操作的 PID 不一致，因为程序重启过，但是没截图，请按照实际情况操作。

```sh
# 查看飙升的线程ID（TID）
ps -mp [PID] -o THREAD,tid,time

# 将线程id转成十六进制
printf "%x\n" [线程ID]

```

![linux-top-2](/assets/images/linux/Linux-Command-20240513183942.png)

##### 查看问题点

```sh
jstack [进程ID] | grep [线程ID] -A100
```

![linux-top-3](/assets/images/linux/Linux-Command-20240513184133.png)

## `systemctl`

`systemctl` 是 `systemd` 系统管理守护进程的一个命令行工具，在采用 `systemd` 的 Linux 发行版（如 Fedora、CentOS/RHEL 7+、Ubuntu 15.04+ 等）中广泛使用。它用于管理系统服务（unit）、监听并控制它们的状态。

```shell
# 启动服务
systemctl start <服务名.service>

# 停止服务
systemctl stop <服务名.service>

# 重启服务
systemctl restart <服务名.service>

# 查看服务状态
systemctl status <服务名.service>

# 设置服务开机自启
systemctl enable <服务名.service>

# 取消服务开机自启
systemctl disable <服务名.service>

# 列出所有服务的状态
systemctl list-units --type=service

# 查看服务日志
journalctl -u <服务名.service>
```

### 查看防火墙的状态

```sh
systemctl status firewalld
```
