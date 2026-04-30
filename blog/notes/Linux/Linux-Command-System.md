---
icon: pen-to-square
category:
  - Linux
title: Linux Command -- Chapter System
order: 25
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

### 交互

- `1`，输入 `top` 命令后，按键盘上的 `1`，即可展开显示所有逻辑 CPU 的使用率。
- `shift + e`，切换内存单位
- `o`
- `i`
- ``

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

## `hostname`

```sh
[root@iZuf6ipaofe0zmf15z5lttZ ~]# 
```

我们在终端中经常看到如上一串输出，

- `root`：当前用户名
- `@`：连接符
- `iZuf6ipaofe0zmf15z5lttZ`：hostname（主机名，相当于电脑名称）
- `~`：当前目录

hostname 就可以用来修改第三个变量

```sh
# 修改为demo
hostname dmeo

```

### 其他方式

修改文件

```sh
# 修改 /etc/hostname
echo "demo" | tee /etc/hostname

# 替换文件中 所有的 当前主机名 为 新主机名
vim /etc/hosts
```

使用`hostnamectl`

```sh
hostnamectl set-hostname demo
```

参考

- [https://linux.vbird.org/](https://linux.vbird.org/)(推荐，基本所有的命令都可以在这找到)
- [https://phoenixnap.com/kb/linux-commands](https://phoenixnap.com/kb/linux-commands)（推荐）
- [https://www.runoob.com/linux/linux-command-manual.html](https://www.runoob.com/linux/linux-command-manual.html)
- [https://www.linuxcool.com/](https://www.linuxcool.com/)

## `hostnamectl`

```sh
% hostnamectl set-hostname demo
```

## `timedatectl`

查看详细的系统的时间以及时区信息，包括时间同步服务的状态。

```sh
[root@jc-main-02 ~]# timedatectl
      # 本地时间，代表的是服务的时间
      Local time: Tue 2026-01-20 22:42:30 EST
  # 世界时间
  Universal time: Wed 2026-01-21 03:42:30 UTC
        # real time clock 实时时钟--代表的是硬件时间
        RTC time: Wed 2026-01-21 03:42:29
       # 时区
       Time zone: America/New_York (EST, -0500)
     # Network time protocol 网络时间协议，联网自动调整时间，yes 表示开启了这个服务
     NTP enabled: yes
# NTP 协议同步，no 表示没有同步成功
NTP synchronized: no
 # 主板存的时间是否本地时区，no 表示存的是世界时区的时间，即UTC，yes 表示存的是本地时区的时间
 RTC in local TZ: no
      DST active: no
 Last DST change: DST ended at
                  Sun 2025-11-02 01:59:59 EDT
                  Sun 2025-11-02 01:00:00 EST
 Next DST change: DST begins (the clock jumps one hour forward) at
                  Sun 2026-03-08 01:59:59 EST
                  Sun 2026-03-08 03:00:00 EDT
```

### 邪修修复服务器时间有偏差

背景：我本地的时间是上海时间`2026-1-21 11:35`，我有一个服务器时间是`Wed Jan 21 11:37 CST 2026`，也就是服务器和我本地的时间差2分钟左右。

#### 排查问题

```sh
# 排查原因
# 因为我确认我本地时间是绝对正确的，所以重点就放在排查服务器是否有问题
# 在服务器上执行
$ timedatectl status

# 这里发现，NTP 服务虽然开启了，但是同步却失败了
# 查看具体的时间同步服务
# 查看是否有 systemd-timesyncd or chronyd 服务。我这里是 chronyd
$ which systemd-timesyncd
$ which chronyd

# 先尝试重启大法好，
$ sudo systemctl restart chronyd
$ chronyc tracking
# 如果你是 systemd-timesyncd
$ sudo systemctl restart systemd-timesyncd
$ timedatectl status

# 查看 Leap status，如果是 Normal, 则表示成功，否则就是失败
# 我这里仍然是 Not synchronised, 就是失败了

# 调整 NTP 服务器地址
# 因为大多 Linux 服务器的 NTP 源都在国外，所以我们尝试调整为国内源
$ vim /etc/chrony.conf
# 添加如下内容，并注释掉旧的
server ntp.aliyun.com iburst

# 重启服务进行验证
$ sudo systemctl restart chronyd
$ chronyc tracking

# 仍然有问题，排查端口问题
$ chronyc sources -v

# 查看 reach 列，如果都是 0，则代表有网络问题
# 使用 nc 进行排查
$ nc -zvu ntp.aliyun.com 123
Ncat: Version 7.50 ( https://nmap.org/ncat )
Ncat: Connected to 203.107.6.88:123.
Ncat: UDP packet sent successfully
Ncat: 1 bytes sent, 0 bytes received in 2.02 seconds.
# 到这里，问了下ai，他说我的入战规则没开 123
```

#### 尝试 ntpdate 服务【失败】

```sh
# 下载并测试
$ yum install ntpdate -y
$ ntpdate ntp.aliyun.com
21 Jan 01:06:11 ntpdate[20070]: no server suitable for synchronization found

```

#### 邪修登场

```sh
# 利用 date -s 设置系统时间，从百度获取最新世界时间
% date -s "$(curl -sI baidu.com | grep '^Date:' | cut -d' ' -f3-6)Z"

# 配合 crontab 定期执行
# 创建脚本
% sudo vim /usr/local/bin/sync_time.sh

# 写入以下内容
>>>
#!/bin/bash

# 1. 获取百度响应头中的 GMT 时间
# 2. 格式化并添加 Z (表示 UTC/GMT)
# 3. 设置系统时间
HTTP_DATE=$(curl -sI --connect-timeout 5 http://www.baidu.com | grep -i '^Date:' | cut -d' ' -f3-6)

if [ -n "$HTTP_DATE" ]; then
    # 设置系统时间
    date -s "$HTTP_DATE Z"
    # 将系统时间写入硬件时钟 (RTC)
    /usr/sbin/hwclock -w
    echo "Time synced successfully at $(date)"
else
    echo "Failed to fetch time from baidu.com"
    exit 1
fi
<<<

# 添加定时任务
% crontab -e
# 添加如下内容，每30分钟执行一次时间同步
*/30 * * * * /usr/local/bin/sync_time.sh >> /var/log/sync_time.log 2>&1
```

## `lscpu`

查看 CPU 数量，

```sh
% lscpu
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                16
On-line CPU(s) list:   0-15
Thread(s) per core:    1
Core(s) per socket:    1
Socket(s):             16
NUMA node(s):          1
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 79
Model name:            Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz
Stepping:              1
CPU MHz:               2299.998
BogoMIPS:              4599.99
Hypervisor vendor:     VMware
Virtualization type:   full
L1d cache:             32K
L1i cache:             32K
L2 cache:              256K
L3 cache:              51200K
NUMA node0 CPU(s):     0-15
Flags:                 fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon nopl xtopology tsc_reliable nonstop_tsc eagerfpu pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single ssbd ibrs ibpb stibp fsgsbase tsc_adjust bmi1 avx2 smep bmi2 invpcid rdseed adx smap xsaveopt arat md_clear spec_ctrl intel_stibp flush_l1d arch_capabilities
```

还可以通过查看 `/proc/cpuinfo` 来查看。

```sh
% cat /proc/cpuinfo
```
