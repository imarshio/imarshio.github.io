---
icon: pen-to-square
date: 2021-03-17
category:
  - Linux
title: Linux简介 
# tag:

---

## Linux学习路径图

![](https://doc.shiyanlou.com/linux_base/1-8.png#id=NSkvR&originHeight=693&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

本文图部分来自：[蓝桥云课](https://www.lanqiao.cn/courses/1)，仅供个人学习使用。当然学习Linux我也非常推荐蓝桥云课，不仅有免费的在线Linux系统可用，还有大量免费的教程，这不是广告，是我的使用体验。

## Linux文件系统结构图

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210930174255.png#id=Po5nT&originHeight=1388&originWidth=1247&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<!--more-->

1、/boot 该目录默认下存放的是Linux的启动文件和内核。

2、/initrd 它的英文含义是boot loader initialized RAM disk,就是由boot loader初始化的[内存](https://so.csdn.net/so/search?q=%E5%86%85%E5%AD%98&spm=1001.2101.3001.7020)盘。在linux内核启动前，boot loader会将存储介质(一般是硬盘)中的initrd文件加载到内存，内核启动时会在访问真正的根文件系统前先访问该内存中的initrd文件系统。

3、/bin 该目录中存放Linux的常用命令。

4、/sbin 该目录用来存放系统管理员使用的管理程序。

5、/var 该目录存放那些经常被修改的文件，包括各种日志、数据文件。

6、/etc 该目录存放系统管理时要用到的各种配置文件和子目录，例如网络配置文件、文件系统、X系统配置文件、设备配置信息、设置用户信息等。

7、/dev 该目录包含了Linux系统中使用的所有外部设备，它实际上是访问这些外部设备的端口，访问这些外部设备与访问一个文件或一个目录没有区别。

8、/mnt 临时将别的文件系统挂在该目录下。

9、/root 如果你是以超级用户的身份登录的，这个就是超级用户的主目录。

10、/home 如果建立一个名为“xx”的用户，那么在/home目录下就有一个对应的“/home/xx”路径，用来存放该用户的主目录。

11、/usr 用户的应用程序和文件几乎都存放在该目录下。

12、/lib 该目录用来存放系统动态链接共享库，几乎所有的应用程序都会用到该目录下的共享库。

13、/opt 第三方软件在安装时默认会找这个目录,所以你没有安装此类软件时它是空的,但如果你一旦把它删除了,以后在安装此类软件时就有可能碰到麻烦。

14、/tmp 用来存放不同程序执行时产生的临时文件，该目录会被系统自动清理干净。

15、/proc 可以在该目录下获取系统信息，这些信息是在内存中由系统自己产生的，该目录的内容不在硬盘上而在内存里。

16、/misc 可以让多用户堆积和临时转移自己的文件。

17、/lost＋found 该目录在大多数情况下都是空的。但当突然停电、或者非正常关机后，有些文件就临时存放在这里。

18、文件颜色的含义：蓝色为文件夹；绿色是可执行文件；浅蓝色是链接文件；红框文件是加了SUID位，任意限权；红色为压缩文件；褐色为设备文件。

## Linux为何物

Linux就是一个操作系统（OS，Operate System），就像Windows或Mac OS。

Linux主要是系统调用和内核那两层，想一下就知道了，首先Linux不能是硬件，虽然说操作系统也算是应用程序，但是他是特殊的应用程序---操作系统。

![](https://doc.shiyanlou.com/linux_base/1-1.png#id=GLheT&originHeight=406&originWidth=488&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## Linux历史

操作系统始于二十世纪五十年代，当时的操作系统能运行批处理程序。批处理程序不需要用户的交互，它从文件或者穿孔卡片读取数据，然后输出到另外一个文件或者打印机。

二十世纪六十年代初，交互式操作系统开始流行。它不仅仅可以交互，还能使多个用户从不同的终端同时操作主机。这样的操作系统被称作分时操作系统，它的出现对批处理操作系统是个极大的挑战。许多人尝试开发分时操作系统， 其中包括一些大学的研究项目和商业项目。当时有个项目叫做 Multics ，它的技术在当时很具有创新性。 Multics 项目的开发并不顺利，它花费了远超过预计的资金，却没有在操作系统市场上占到多少份额。而参加该项目的一个开发团体——贝尔实验室退出了这个项目。他们在退出后开发了他们自己的一个操作系统—— UNIX 。

UNIX 最初免费发布并因此在大学里受到欢迎。后来，UNIX 实现了 TCP/IP 协议栈，成为了早期工作站的操作系统的一个流行选择。

1990 年，UNIX 在服务器市场上尤其是大学校园中成为主流操作系统，许多校园都有 UNIX 主机，当然还包括一些研究它的计算机系的学生。这些学生都渴望能在自己的电脑上运行 UNIX 。不幸的是，从那时候开始，UNIX 开始变得商业化，它的价格也变得非常昂贵。而唯一低廉的选择就是 MINIX，这是一个功能有限的类似 UNIX 的操作系统，作者 Andrew Tanenbaum 开发它的目的是用于教学。

1991 年 10 月，Linus Torvalds（Linux 之父）在赫尔辛基大学接触 UNIX，他希望能在自己的电脑上运行一个类似的操作系统。可是 UNIX 的商业版本非常昂贵，于是他从 MINIX 开始入手，计划开发一个比 MINIX 性能更好的操作系统。很快他就开始了自己的开发工作。他第一次发行的版本迅速吸引了一些黑客。尽管最初的 Linux 并没有多少用处，但由于一些黑客的加入使它很快就具有了许多吸引人的特性，甚至一些对操作系统开发不感兴趣的人也开始关注它。

Linux 本身只是操作系统的内核。内核是使其它程序能够运行的基础。它实现了多任务和硬件管理，用户或者系统管理员交互运行的所有程序实际上都运行在内核之上。其中有些程序是必需的，比如说，命令行解释器（shell），它用于用户交互和编写 shell 脚本。 Linus 没有自己去开发这些应用程序，而是使用已有的自由软件。这减少了搭建开发环境所需花费的工作量。实际上，他经常改写内核，使得那些程序能够更容易地在 Linux 上运行。许多重要的软件，包括 C 编译器，都来自于自由软件基金 GNU 项目。GNU 项目开始于 1984 年，目的是为了开发一个完全类似于 UNIX 的免费操作系统。为了表扬 GNU 对 Linux 的贡献，许多人把 Linux 称为 GNU/Linux（GNU 有自己的内核）。

1992－1993 年，Linux 内核具备了挑战 UNIX 的所有本质特性，包括 TCP/IP 网络，图形界面系统（X window )，Linux 同样也吸引了许多行业的关注。一些小的公司开始开发和发行 Linux，有几十个 Linux 用户社区成立。1994 年，Linux 杂志也开始发行。

Linux 内核 1.0 在 1994 年 3 月发布，内核的发布要经历许多开发周期，直至达到一个稳定的版本。

下面列举一些 Linux 诞生大事件：

- 1965 年，Bell 实验室、MIT、GE（通用电气公司）准备开发 Multics 系统，为了同时支持 300 个终端访问主机，但是 1969 年失败了；

> 那时候并没有鼠标、键盘，输入设备，只有卡片机。因此，如果要测试某个程序，则需要将读卡纸插入卡片机，如果有错误，还需要重新来过；
>  
> Multics : Multiplexed Information and Computing Service；

- 1969 年，Ken Thompson（C 语言之父）利用汇编语言开发了 File Server System（Unics，即 UNIX 的原型）；

> 因为汇编语言对于硬件的依赖性，因此只能针对特定硬件； 只是为了移植一款“太空旅游”的游戏；

- 1973 年，Dennis Ritchie 和 Ken Thompson 发明了 C 语言，而后写出了 UNIX 的内核；

> 将 B 语言改成 C 语言，由此产生了 C 语言之父；90% 的代码是 C 语言写的，10% 的代码用汇编语言写的，因此移植时只要修改那 10% 的代码即可；

- 1977 年，Berkeley 大学的 Bill Joy 针对他的机器修改了 UNIX 源码，称为 BSD（Berkeley Software Distribution）；

> Bill Joy 是 Sun 公司的创始人；

- 1979 年，UNIX 发布 System V，用于个人计算机；
- 1984 年，因为 UNIX 规定“不能对学生提供源码”，Tanenbaum 老师自己编写兼容于 UNIX 的 Minix，用于教学；
- 1984 年，Stallman 开始 GNU（GNU's Not Unix）项目，创办 FSF（Free Software Foundation）基金会；

> 产品：GCC、Emacs、Bash Shell、GLIBC；倡导“自由软件”；GNU 的软件缺乏一个开放的平台运行，只能在 UNIX 上运行；自由软件指用户可以对软件做任何修改，甚至再发行，但是始终要挂着 GPL 的版权；自由软件是可以卖的，但是不能只卖软件，而是卖服务、手册等；

- 1985 年，为了避免 GNU 开发的自由软件被其他人用作专利软件，因此创建 GPL（General Public License）版权声明；
- 1988 年，MIT 为了开发 GUI，成立了研发 XFree86 的组织；
- 1991 年，芬兰赫尔辛基大学的研究生 Linus Torvalds 基于 gcc、bash 开发了针对 386 机器的 Linux 内核；
- 1994 年，Torvalds 发布 Linux-v1.0；
- 1996 年，Torvalds 发布 Linux-v2.0，确定了 Linux 的吉祥物：企鹅。

UNIX 进化史（UNIX 大家族族谱 1969-2013）：

![](https://dn-simplecloud.shiyanlou.com/uid/c4ca4238a0b923820dcc509a6f75849b/1467262784463.png#id=RtVJX&originHeight=1306&originWidth=1959&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## Linux 之父

### Linus Torvalds - 芬兰赫尔辛基大学

![](https://doc.shiyanlou.com/linux_base/1-7.jpg#id=nuW1H&originHeight=920&originWidth=600&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## Linux与Windows的异同

#### 1. 免费与收费

- 最新正版 Windows 10，需要付费购买；
- Linux 免费或少许费用。

#### 2. 软件与支持

- Windows 平台：数量和质量的优势，不过大部分为收费软件；由微软官方提供重要支持和服务；
- Linux 平台：大都为开源自由软件，用户可以修改定制和再发布，由于基本免费没有资金支持，部分软件质量和体验欠缺；由全球所有的 Linux 开发者和自由软件社区提供支持。

#### 3. 安全性

- Windows 平台：三天两头打补丁安装系统安全更新，还是会中病毒木马；
- Linux 平台：要说 Linux 没有安全问题，那当然是不可能的，这一点仁者见仁智者见智，相对来说肯定比 Windows 平台要更加安全，使用 Linux 你也不用装某杀毒、某毒霸。

#### 4. 使用习惯

- Windows：普通用户基本都是纯图形界面下操作使用，依靠鼠标和键盘完成一切操作，用户上手容易，入门简单；
- Linux：兼具图形界面操作（需要使用带有桌面环境的发行版）和完全的命令行操作，可以只用键盘完成一切操作，新手入门较困难，需要一些学习和指导（这正是我们要做的事情），一旦熟练之后效率极高。

#### 5. 可定制性

- Windows：这些年之前算是全封闭的，系统可定制性很差；
- Linux：你想怎么做就怎么做，Windows 能做到得它都能，Windows 做不到的，它也能。

#### 6. 应用范畴

或许你之前不知道 Linux ，要知道，你之前在 Windows 使用百度、谷歌，上淘宝，聊 QQ 时，支撑这些软件和服务的，是后台成千上万的 Linux 服务器主机，它们时时刻刻都在忙碌地进行着数据处理和运算，可以说世界上大部分软件和服务都是运行在 Linux 之上的。

#### 7. Windows 没有的

- 稳定的系统
- 安全性和漏洞的快速修补
- 多用户
- 用户和用户组的规划
- 相对较少的系统资源占用
- 可定制裁剪，移植到嵌入式平台（如安卓设备）
- 可选择的多种图形用户界面（如 GNOME，KDE）

#### 8. Linux 没有的

- 特定的支持厂商
- 足够的游戏娱乐支持度
- 足够的专业软件支持度

## Linux桌面环境

#### 1.Linux 桌面环境介绍

相对于现在的 Windows 系统，UNIX/Linux 本身是没有图形界面的，我们通常在 UNIX/Linux 发行版上看到的图形界面实际都只是运行在 Linux 系统之上的一套软件，类似 Windows95 之前的 Windows 的图形界面实则也只是运行在 DOS 环境的一套软件。而 Linux 上的这套软件以前是 XFree86，现在则是 xorg（X.Org），而这套软件又是通过 X 窗口系统（X Window System，也常被称为 X11 或 X）实现的，X 本身只是工具包及架构协议，而 xorg 便是 X 架构规范的一个实现体，也就是说它是实现了 X 协议规范的一个提供图形界面服务的服务器，就像实现了 http 协议提供 web 服务的 Apache 。如果只有服务器也是不能实现一个完整的桌面环境的，当然还需要一个客户端，我们称为 X Client，像如下几个大家熟知也最流行的实现了客户端功能的桌面环境 **KDE**，**GNOME**，**XFCE**，**LXDE** 。其中就有你看到的，实验楼目前使用的 **XFCE** 桌面环境，部分老用户可能可以回想起，实验楼之前使用的环境是 **LXDE** 。这也意味着在 Linux 上你可以自己选择安装不同的桌面环境，甚至可以定制自己的专属桌面。

![](https://doc.shiyanlou.com/linux_base/2-1.png#id=aUkDy&originHeight=500&originWidth=1120&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

这里讲这么多，主要是为了帮助你更好地理解 Linux 的桌面环境是一个怎样的概念，以及它跟 Windows 操作系统桌面的差异，实际它们之间是有着本质的差别的，希望清楚这些内容之后可以让你忽略那些体验上的差异，专心把精力放到 Linux 系统本身或者你正准备学习的某一门技术之上，这门实验课后面的内容和实验楼的其它课程便是为了帮助你实现以上两个目标。

#### 2.Linux 桌面环境的使用

如果你对当前实验桌面环境（xfce）的使用有任何困难，建议你先学习[实验楼入门基础课程](https://www.lanqiao.cn/courses/63)，对于其它桌面环境的使用，不在本课程的范围之内，有兴趣的用户可以在自己的计算机中安装完整的 Linux 发行版或其 Live CD 体验。

## Linux的哲学

没有结果就是最好的结果

## IO

IO 是贯穿计算机的一个非常重要的。。enmmm，怎么说，功能？部分吧。

IO是贯穿计算机的一个非常重要的部分。

在 Linux中，最最重要的就是命令，这就包含了 2 个过程，输入和输出

- 输入：输入当然就是打开终端，然后按键盘输入，然后按回车，输入格式一般就是这类的
- 输出：输出会返回你想要的结果，比如你要看什么文件，就会返回文件的内容。如果只是执行，执行失败会告诉你哪里错了，如果执行成功那么会没有输出，因为 Linux的哲学就是：没有结果就是最好的结果

## 向系统获取帮助

在 Linux 环境中，如果你遇到困难，可以使用 `man`命令，它是 `Manual pages`的缩写。

Manual pages 是 UNIX 或类 UNIX 操作系统中在线软件文档的一种普遍的形式， 内容包括计算机程序（包括库和系统调用）、正式的标准和惯例，甚至是抽象的概念。用户可以通过执行 `man`命令调用手册页。

你可以使用如下方式来获得某个命令的说明和使用方式的详细介绍：

```bash
man <command_name>
```

比如你想查看 man 命令本身的使用方式，你可以输入：

```bash
man man
```

通常情况下，man 手册里面的内容都是英文的，这就要求你有一定的英文基础。man 手册的内容很多，涉及了 Linux 使用过程中的方方面面。为了便于查找，man 手册被进行了分册（分区段）处理，在 Research UNIX、BSD、OS X 和 Linux 中，手册通常被分为 8 个区段，安排如下：

| 区段 | 说明 |
| --- | --- |
| 1 | 一般命令 |
| 2 | 系统调用 |
| 3 | 库函数，涵盖了 C 标准函数库 |
| 4 | 特殊文件（通常是/dev 中的设备）和驱动程序 |
| 5 | 文件格式和约定 |
| 6 | 游戏和屏保 |
| 7 | 杂项 |
| 8 | 系统管理命令和守护进程 |

要查看相应区段的内容，就在 man 后面加上相应区段的数字即可，如：

```bash
man 1 ls
```

会显示第一区段中的 `ls`命令 man 页面。

所有的手册页遵循一个常见的布局，为了通过简单的 ASCII 文本展示而被优化，而这种情况下可能没有任何形式的高亮或字体控制。一般包括以下部分内容：

**NAME（名称）**

> 该命令或函数的名称，接着是一行简介。

**SYNOPSIS（概要）**

> 对于命令，正式的描述它如何运行，以及需要什么样的命令行参数。对于函数，介绍函数所需的参数，以及哪个头文件包含该函数的定义。

**DESCRIPTION（说明）**

> 命令或函数功能的文本描述。

**EXAMPLES（示例）**

> 常用的一些示例。

**SEE ALSO（参见）**

> 相关命令或函数的列表。

也可能存在其它部分内容，但这些部分没有得到跨手册页的标准化。常见的例子包括：OPTIONS（选项），EXIT STATUS（退出状态），ENVIRONMENT（环境），BUGS（程序漏洞），FILES（文件），AUTHOR（作者），REPORTING BUGS（已知漏洞），HISTORY（历史）和 COPYRIGHT（版权）。

通常 man 手册中的内容很多，你可能不太容易找到你想要的结果，不过幸运的是你可以在 man 中使用搜索 `/&#x3c;你要搜索的关键字>`，查找完毕后你可以使用 `n`键切换到下一个关键字所在处，`shift+n`为上一个关键字所在处。使用 `Space`（空格键）翻页，`Enter`（回车键）向下滚动一行，或者使用 `k`，`j`（vim 编辑器的移动键）进行向前向后滚动一行。按下 `h`键为显示使用帮助（因为 man 使用 less 作为阅读器，实为 `less`工具的帮助），按下 `q`退出。

想要获得更详细的帮助，你还可以使用 `info`命令，不过通常使用 `man`就足够了。如果你知道某个命令的作用，只是想快速查看一些它的某个具体参数的作用，那么你可以使用 `--help`参数，大部分命令都会带有这个参数，如：

```bash
ls --help
```
