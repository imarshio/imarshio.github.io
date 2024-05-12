---
icon: pen-to-square
category:
  - Linux
title: Linux Command -- Chapter Edit
tag:
- ls

---

一个命令的使用总归是先有一个背景的，所以如下命令都是结合适用场景总结出来的。
由于 Linux 家族过于庞大，每个分支都各有特点，且处理方式不完全一样，所以我会尽量给出常用系统的命令。
这里你需要知道自己的电脑属于哪个发行版，不了解的可以点击了解一下(虽然我也不是很了解，但是可以稍微i提供一点点帮助)。
参考

- [https://phoenixnap.com/kb/linux-commands](https://phoenixnap.com/kb/linux-commands)（推荐）
- [https://www.runoob.com/linux/linux-command-manual.html](https://www.runoob.com/linux/linux-command-manual.html)
- [https://www.linuxcool.com/](https://www.linuxcool.com/)
-

> 如下命令使用中，
>
> - []    代表可选参数，
> - <> 代表可自由输入输入的字符
> - -     后面跟的是缩写
> - --    后面跟的是全拼

<!-- # 编辑 -->

## vi

## vim

<!-- ##  -->

## sed

Stream EDitor，流式编辑器，类似awk，但是没有awk功能强大，但相对简单。

### 用法

`sed [OPTION]... {script-only-if-no-other-script} [input-file]...`

### 参数

| 参数 | 说明                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| i    | 直接修改读取的文件内容，`sed -i 's///'`，支持的界定符:`/`、`@`、`#`、`&#124;` |
|      |                                                                               |

### 举例

```shell

# 将/home/text.txt文件中的oldstr替换成newstr
sed -i 's/oldstr/newstr/' /home/text.txt
sed -i 's/oldstr/newstr/g' /home/text.txt

# 上面的区别就是s///每行找到第一个oldstr并替换后就会结束，s///g不会结束，会替换到最后一个字符串

# 如下测试用例，创建两个txt文件，写入abcabca\nabcabcabca

```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679498606268-77b52d4f-a471-4efb-a2e4-b2badb8ae9c8.png#averageHue=%232a343e&clientId=u5ce6f6a9-7c29-4&from=paste&height=347&id=u7873d025&originHeight=347&originWidth=448&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17823&status=done&style=none&taskId=u4addc969-37de-46d6-9f9d-fdb9ef37560&title=&width=448)

<!-- # 进程 -->

## top

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

第二排

- `Tasks: 107 total`：进程数量
  - `running`：运行中的进程
  - `sleeping`：sleeping状态中的进程
  - `stopped`：停止的进程
  - `zombie`：僵尸进程

第三排

- `%Cpu(s)`:  
  - `us`：用户使用CPU
  - `sy`
  - `ni`
  - `id`
  - `wa`
  - `hi`
  - `si`
  - `st`

第四排/第五排

- `KiB Mem` ：以KiB为单位的内存信息
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

- PID
- USER
- PR  
- NI
- VIRT
- RES
- SHR S
- %CPU
- %MEM
- TIME+
- COMMAND

<!-- # 网络 -->

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

## ps

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

#### 根据PID查找工作目录

场景：有一个服务A被同事上线了，但是你不知道这个服务部署在哪了，只知道部署在了哪台服务器以及服务的名称，那么此时你该如何定位到这个服务部署在哪个目录下了呢？
方法1：

```shell
# 查找服务PID
ps -ef | grep 'service name'

# 终端输出如下：
# op       18486     1  0 02:44 ?        00:01:12 java -jar -Xmx1g -Dspring.security.strategy=MODE_INHERITABLETHREADLOCAL stock-surge-1.0-SNAPSHOT.jar

# 由上面的输出信息可知服务的PID为18486

# 根据服务PID定位可执行文件位置,proc文件包含所有的进程及其详细信息
cd /proc

# 找到当前的PID
ll | grep 18486

# 进入当前PID的目录
cd 18486

# 查看cwd对应的引用值即当前工作目录
```

可以参考：

- [proc](https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/proc.html)

方法2：

```shell
# 直接根据lsof 命令查找工作目录
# 找到PID
ps -ef | grep 'service name'

# 查找相关信息
lsof -p PID
```

<!-- # 查找 -->

## find

## locate

```shell
locate file
```

<!-- # 系统管理 -->

## sudo

查看拥有sudo权限的用户：` /etc/sudoers `

```shell
# 非root用户但拥有sudo权限的用户更改其他用户的密码
# 先删除该用户密码
sudo passwd -d user1

# 在该该用户设置密码
sudo -u user1 passwd
```

## uname

unix name，用于显示操作系统信息，如内核版本、主机名、处理器等。

| 参数 | 说明                                                                       |
| ---- | -------------------------------------------------------------------------- |
| a    | 显示全部的信息，包括内核名称、主机名、操作系统版本、处理器类型和硬件架构等 |
| m    | 显示处理器类型                                                             |
| n    | 显示主机名                                                                 |
| r    | 显示内核版本号                                                             |
| v    | 显示操作系统的版本                                                         |
| p    | 显示处理器类型                                                             |

```shell

uanme -a 

# 输出
# Linux iZuf6ipaofe0zmf15z5lttZ 3.10.0-1160.108.1.el7.x86_64 #1 SMP Thu Jan 25 16:17:31 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux

```

### -a 参数解释

- 系统名（System Name）: 通常显示的是内核的名称，比如 "Linux"。
- 网络节点名（Node Name）: 这是你的主机名，比如 "myhostname"。
- 操作系统发行版（Operating System Release）: 显示操作系统的发行版号，如 "4.4.0-62-generic" 或 "B.11.23"。
- 操作系统版本（Operating System Version）: 提供更详细的内核版本信息，可能包括内核的修订版本号，如 "#83-Ubuntu SMP Wed Jan"。
- 机器硬件名称（Machine Hardware Name）: 表示计算机的硬件架构，如 "x86_64" 或 "i686"。
- 处理器类型（Processor Type）: 在某些系统上，可能会显示处理器的类型，如 "Intel(R) Core(TM) i7-8700K CPU"。
- 硬件平台（Hardware Platform）: 描述硬件平台的信息，有时与机器硬件名称相似。
- 操作系统名称（Operating System）: 显示操作系统的名称，比如 "GNU/Linux"。

<!-- # Linux三剑客 -->

可参考：[https://www.jianshu.com/p/f1402e96c9dd](https://www.jianshu.com/p/f1402e96c9dd)

## grep

global search regular expression and print out the line，全局正则表达式搜索并打印该行，俗称管道，类似一层过滤网，多上一层命令的结果集进行过滤.
用法：`grep [options] <pattern>`

参数

| 参数 | 解释 |
| ---- | ---- |
|      |      |
|      |      |

## awk

## sed

## 命令手册

出自：

- [https://phoenixnap.com/kb/wp-content/uploads/2022/11/linuxCommandsAllUsersShouldKnow.pdf](https://phoenixnap.com/kb/wp-content/uploads/2022/11/linuxCommandsAllUsersShouldKnow.pdf)
- [linuxCommandsAllUsersShouldKnow.pdf](https://www.yuque.com/attachments/yuque/0/2023/pdf/21953536/1677561001341-bb64ab76-4777-4fce-a4e5-e637ea631274.pdf)
