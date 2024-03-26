---
icon: pen-to-square
date: 2021-03-17
category:
  - Linux
title: Linux模版机 
# tag:

---

## ISO下载

## ISO安装

### 装机

#### 具体步骤

##### 1、打开VMware，选择File-->New Virtual Machine，选择Custom，点击next

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679818570976-86cd0a03-624c-4f13-9df6-d2939bd37bc9.png#averageHue=%23f9f5f4&clientId=ufcbce0c8-1413-4&from=paste&height=395&id=u78907459&originHeight=395&originWidth=426&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25261&status=done&style=none&taskId=u0809deac-4e57-4a75-9907-97639c84d3d&title=&width=426)

##### 2、选择自己的VMware版本，点击next

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679818747477-cd4425ba-0f73-4499-9337-894270108ea0.png#averageHue=%23ece8e6&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=u67ca1824&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21686&status=done&style=none&taskId=u1514dbb3-da2d-41f2-8c3b-ff13ddbf5b7&title=&width=442)

##### 3、选择"I will install the operating system later"，点击next

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679818801755-75af779d-58c2-41ae-b991-96a945f17266.png#averageHue=%23ece8e7&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=u2d0da296&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21927&status=done&style=none&taskId=uf3207f27-cb79-4bcc-b12d-41131faf205&title=&width=442)

##### 4、选择模板机的操作系统（operating system）和版本（version），点击next

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679818849027-a449a58c-90be-41b2-a530-a7d60e266d4c.png#averageHue=%23ededec&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=u2211b94d&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16961&status=done&style=none&taskId=u9eb72d7e-74ea-42d6-95f1-36030a32ff6&title=&width=442)

##### 5、给模板机命名，并选择下载地址

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679818963518-58d8a99c-1eee-464e-97b8-9b2047d40143.png#averageHue=%23eeedec&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=uf3d9c045&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16414&status=done&style=none&taskId=u16045602-c7e5-4efd-a1d1-96de7bd3045&title=&width=442)

##### 6、给模板机配置内存和处理器核心

一般我们这里给模板机配置1c2g即可，实际用的时候再扩充
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679819933089-60da765f-2aaa-4c3a-8b36-92701e09d474.png#averageHue=%23eeedec&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=uc7ae9339&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=13964&status=done&style=none&taskId=u468a96b5-f46b-4b72-875c-cdfbb3bc3b2&title=&width=442)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679819940623-109618b9-1151-482a-bbb1-fe20b376f118.png#averageHue=%23ecebe9&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=ued1fc53a&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21522&status=done&style=none&taskId=ubee9346d-bfb3-4d9d-8226-cf69012f260&title=&width=442)

##### 7、设置模板机的网络类型、I/O、磁盘等相关信息

- NAT：最简单的虚拟机上网方式，虚拟机基本无需配置即可通过主机上网
- 网桥：稍微复杂的上网方式，在此模式下虚拟机的网络IP和主机的网络IP处于同等地位
- host-only：虚拟网络是一个全封闭的网络，它唯一能够访问的就是主机

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679823222736-fd1f9b01-8241-4b74-89fd-035b4eefd8a6.png#averageHue=%23ebeae8&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=u86dd858a&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=23260&status=done&style=none&taskId=u2b03e10e-d697-4215-bd14-479e8b840ee&title=&width=442)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679823237672-fa087f33-4573-4757-875a-6e76ebac6deb.png#averageHue=%23edeceb&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=udf966c52&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=18519&status=done&style=none&taskId=u55d6dad3-6743-4c3e-bcde-d7e0ed3e3bf&title=&width=442)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679823243294-3731ce97-cdc3-491c-a9c2-789ac4ca1e11.png#averageHue=%23eeeded&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=ueb07bb18&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14639&status=done&style=none&taskId=ufbc9fe04-3329-4c0a-a517-f53ce10bcc5&title=&width=442)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679823260729-76aa46e1-b805-4d8d-a8e7-71c13c388dfe.png#averageHue=%23ebe9e7&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=u3d784d30&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22112&status=done&style=none&taskId=ud50fdcaa-c4d3-4536-b098-a4249d1e359&title=&width=442)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679823430741-9a2d8d2c-b477-4043-b7bb-51fd4d8580a0.png#averageHue=%23ebeae8&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=ueb0864d2&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=23347&status=done&style=none&taskId=u5f9258ac-4f3d-4425-8dbf-0747cf89043&title=&width=442)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679824567736-c30d5d8a-0ecb-4a06-a114-338b219da861.png#averageHue=%23eeeded&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=uacd3b55f&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15313&status=done&style=none&taskId=u7860678a-ebdd-446a-8b06-12ae0df5713&title=&width=442)

##### 8、装载ISO镜像

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679835954819-0d068330-6a05-4ed7-8cf8-d982a9adc541.png#averageHue=%238e8e8d&clientId=ufcbce0c8-1413-4&from=paste&height=1278&id=u3002831d&originHeight=1278&originWidth=2241&originalType=binary&ratio=1&rotation=0&showTitle=false&size=72907&status=done&style=none&taskId=u8d9f9315-3283-4983-874b-f9c495534ac&title=&width=2241)
选择自己的镜像位置
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679835978201-25586a0f-bcdb-4310-b12c-442fc0584899.png#averageHue=%23f2f1f0&clientId=ufcbce0c8-1413-4&from=paste&height=741&id=ub0e87d8b&originHeight=741&originWidth=764&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35056&status=done&style=none&taskId=u0868c2c8-e429-4944-b9ea-35d7e5aa7d0&title=&width=764)

##### 9、点击"Power on this virtule machine"，进去后选择"Install CentOS Linux 7"，等待安装

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679836283341-ff88a840-83f7-427c-9e1f-ba21e85918ce.png#averageHue=%23010000&clientId=ufcbce0c8-1413-4&from=paste&height=480&id=uc86bee19&originHeight=480&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4790&status=done&style=none&taskId=u1ab02b14-761f-45d3-b1d1-9260eb09995&title=&width=640)

##### 10、选择语言"English"-->"English(United States)"，点击Continue

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679836424995-6135d0cb-1ddc-4a65-94b8-4bedd45556b2.png#averageHue=%23f0ecec&clientId=ufcbce0c8-1413-4&from=paste&height=600&id=u7eea7a4e&originHeight=600&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=98202&status=done&style=none&taskId=ua4891693-9b53-403c-96bd-edae4cde5bf&title=&width=800)

##### 11、选择时区

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679836556311-5b750ebb-96fd-447d-81f2-8853f996d28e.png#averageHue=%23a4d57e&clientId=ufcbce0c8-1413-4&from=paste&height=600&id=u9a6fbea7&originHeight=600&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=177453&status=done&style=none&taskId=u858bd19f-0a39-4f54-a2ee-c431b6883d3&title=&width=800)

##### 12、软件安装选择，选择最小安装，选择所需安装的软件，然后点击Done

这里的
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679836690883-fad6b1fa-07f7-4041-a5b8-1a1ad12303d6.png#averageHue=%23f8f6f6&clientId=ufcbce0c8-1413-4&from=paste&height=600&id=ueeb2707a&originHeight=600&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=104154&status=done&style=none&taskId=u4a44682e-4695-4b4d-984f-dbe955f943c&title=&width=800)

##### 13、关闭KDUMP

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679837886139-0d2410cb-ea7a-403f-aaca-ce6720924137.png#averageHue=%23edebeb&clientId=ufcbce0c8-1413-4&from=paste&height=600&id=ucc922366&originHeight=600&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=33238&status=done&style=none&taskId=uf7397152-9e96-4596-8fbe-e4168026607&title=&width=800)

##### 14、打开网络连接

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679837978555-86b93f8d-dcd1-4644-bf79-a6920315fef9.png#averageHue=%23f0efef&clientId=ufcbce0c8-1413-4&from=paste&height=600&id=u521bdacc&originHeight=600&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=71717&status=done&style=none&taskId=uc6da44f1-375a-42ba-82d6-bac06dcf8c7&title=&width=800)
15、进行磁盘格式化，选择"Automatically configure partitioning"
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679838125820-243847fe-2aa2-4db5-885b-e1233fab083a.png#averageHue=%23ebebea&clientId=ufcbce0c8-1413-4&from=paste&height=600&id=udb914ac2&originHeight=600&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=78266&status=done&style=none&taskId=ufda50bb4-9dd5-4580-ab86-27611a0edbc&title=&width=800)
16、开始下载同时配置root用户

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679838171853-41b94583-5c8d-4da3-b84b-6af4431cb48b.png#averageHue=%23e4e3e3&clientId=ufcbce0c8-1413-4&from=paste&height=600&id=u23664971&originHeight=600&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=118998&status=done&style=none&taskId=u2ceeec43-8ec6-42c4-b52d-aa88c1025c3&title=&width=800)
如果你的密码强度不高。需要点击两次Done，安装完成后点击reboot
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679838222264-9fa40a92-4fea-46b4-b192-55c2e6cebdb6.png#averageHue=%23ede5da&clientId=ufcbce0c8-1413-4&from=paste&height=600&id=u794c4cce&originHeight=600&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=48986&status=done&style=none&taskId=uadb0f13a-1e09-41e4-af7e-dd695a669c0&title=&width=800)
部分人reboot后，可能会报错，此时我们只需要重启即可（我是这样解决的）。

至此，装机部分就完成了。

## 远程

我们首次进入是这样的。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679838877460-29c3b697-8ae3-4b71-b3ff-3d7fbeb1dbea.png#averageHue=%23000000&clientId=ufcbce0c8-1413-4&from=paste&height=768&id=uf2acf6b7&originHeight=768&originWidth=1280&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6774&status=done&style=none&taskId=uf19d04ce-d0b0-4afb-8281-df9cde6a577&title=&width=1280)

我们需要输入用户名、密码
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679839436760-dcffd9f8-bc8a-4c21-9613-8149358b25b0.png#averageHue=%23000000&clientId=ufcbce0c8-1413-4&from=paste&height=768&id=u0fc6b309&originHeight=768&originWidth=1280&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7257&status=done&style=none&taskId=udf7db265-f33d-4be9-9381-737da10695d&title=&width=1280)
输入`ip a`查看当前虚拟机的IP，然后使用远程连接工具连接。

## 软件安装

```shell
# 安装以下软件
yum install -y vim wget lrzsz tree curl
```

- vim：（recommend），文本编辑工具
- wget：（recommend），下载工具
- lrzsz：（optional）上传下载文件，拖拉拽即可
- tree：
- curl：（recommend）

## yum源配置

##### 1、进入如下位置，对目标文件进行备份

```shell
# 切换目录
cd /etc/yum.repos.d/

# 备份
mv CentOS-Base.repo CentOS-Base-bak.repo
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1675097058829-1dba9c69-f247-4026-a0c1-e342d3315bdc.png#averageHue=%232e3742&clientId=ub89e2585-fe2d-4&from=paste&height=225&id=u6f2eb6d0&originHeight=225&originWidth=500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21729&status=done&style=none&taskId=ucff6341f-ef4d-41d9-b4cd-21890d90ac2&title=&width=500)

##### 2、下载其他yum源

可选yum源

- 阿里源：`wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/CentO-7.repo`
- 清华源：
- 163源：
- 中科大源：

清理缓存：`yum clean all`
重新建立缓存：`yum makecache`

这里我遇到了两个问题，记录一下解决方法

```shell
# 尝试下载阿里云yum源
[root@192 yum.repos.d]# wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/CentO-7.repo
--2023-03-26 22:20:04--  http://mirrors.aliyun.com/repo/CentO-7.repo
Resolving mirrors.aliyun.com (mirrors.aliyun.com)... 119.167.250.249, 119.167.250.215, 119.167.250.240, ...
Connecting to mirrors.aliyun.com (mirrors.aliyun.com)|119.167.250.249|:80... connected.
HTTP request sent, awaiting response... 404 Not Found
# 提示404
2023-03-26 22:20:04 ERROR 404: Not Found.

# 删除之前的yum配置
[root@192 yum.repos.d]# rm -f *

# 查询出所有yum相关的程序
[root@192 yum.repos.d]# rpm -qa | grep yum
yum-3.4.3-150.el7.centos.noarch
yum-metadata-parser-1.1.4-10.el7.x86_64
yum-plugin-fastestmirror-1.1.31-40.el7.noarch

# 全部删除，yum要排在最后一个删除
[root@192 yum.repos.d]# rpm -e yum-metadata-parser-1.1.4-10.el7.x86_64 yum-plugin-fastestmirror-1.1.31-40.el7.noarch yum-3.4.3-150.el7.centos.noarch

# 在http://mirrors.163.com/centos/7/os/x86_64/Packages/这里找到最新的yum相关包
# 切换到~目录
[root@192 yum.repos.d]# cd ~

# 安装包下载
[root@192 ~]# wget http://mirrors.163.com/centos/7/os/x86_64/Packages/yum-3.4.3-168.el7.centos.noarch.rpm
[root@192 ~]# wget http://mirrors.163.com/centos/7/os/x86_64/Packages/yum-metadata-parser-1.1.4-10.el7.x86_64.rpm
[root@192 ~]# wget http://mirrors.163.com/centos/7/os/x86_64/Packages/yum-plugin-fastestmirror-1.1.31-54.el7_8.noarch.rpm
[root@192 ~]# wget http://mirrors.163.com/centos/7/os/x86_64/Packages/yum-plugin-fastestmirror-1.1.31-54.el7_8.noarch.rpm

# rpm安装
[root@192 ~]# rpm -ivh yum-plugin-fastestmirror-1.1.31-54.el7_8.noarch.rpm yum-3.4.3-168.el7.centos.noarch.rpm yum-metadata-parser-1.1.4-10.el7.x86_64.rpm

# 这里又遇到一个问题
error: Failed dependencies:
       # 下面的意思是rpm的版本>=4.11.3的被yum-3.4.3-168所需要
        rpm >= 0:4.11.3-22 is needed by yum-3.4.3-168.el7.centos.noarch

# 查看当前rpm的版本
[root@192 ~]# rpm --version
RPM version 4.11.3

# 虽然版本是正确的，但是还是准备先尝试升级一下
[root@192 ~]# wget http://mirrors.163.com/centos/7/os/x86_64/Packages/rpm-4.11.3-45.el7.x86_64.rpm

# 升级rpm
[root@192 ~]# rpm -Uvh rpm-4.11.3-45.el7.x86_64.rpm --nodeps

# 再次尝试下载，成功
[root@192 ~]# rpm -ivh yum-plugin-fastestmirror-1.1.31-54.el7_8.noarch.rpm yum-3.4.3-168.el7.centos.noarch.rpm yum-metadata-parser-1.1.4-10.el7.x86_64.rpm

# 导入证书
[root@192 ~]# rpm --import http://mirror.centos.org/centos/RPM-GPG-KEY-CentOS-7

# 添加阿里源
[root@192 ~]# wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
```

##### 3、清除缓存并重新生成

```shell
yum clean all && yum makecache
```

## 静态IP地址

位置：`/etc/sysconfig/network-scripts/ifcfg-ens33`

##### 1、修改配置

```shell
[root@192 ~]# vim /etc/sysconfig/network-scripts/ifcfg-ens33
```

```shell
TYPE="Ethernet"
BOOTPROTO="dhcp"
DEFROUTE="yes"
PEERDNS="yes"
PEERROUTES="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_PEERDNS="yes"
IPV6_PEERROUTES="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="52d10f81-c2c7-417f-812a-dc87ad580aeb"
DEVICE="ens33"
ONBOOT="yes"
```

```shell
TYPE="Ethernet"
# 更改为静态
BOOTPROTO="static"
DEFROUTE="yes"
PEERDNS="yes"
PEERROUTES="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_PEERDNS="yes"
IPV6_PEERROUTES="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
# 删除uuid
# UUID="52d10f81-c2c7-417f-812a-dc87ad580aeb"
DEVICE="ens33"
# 需要看一下onboot是否为yes
ONBOOT="yes"
# 设置一个ip地址，根据自己的ip生成
IPADDR=192.168.130.141
# 网关，按照如下方式查看
GATEWAY=192.168.130.2
# 子网掩码，
NETMASK=255.255.255.0
# DNS设置，可以设置为网关，也可以设置为其他的如8.8.8.8
DNS1=192.168.130.2
```

###### 1.1、查看网关

1、进入VMware，点击edit-->VMware Network Editor，点击VMnet8
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679844087471-c1df3155-f96d-42a7-8484-724563db467e.png#averageHue=%23efeceb&clientId=ub21957db-170b-4&from=paste&height=546&id=u89a2cfcb&originHeight=546&originWidth=1111&originalType=binary&ratio=1&rotation=0&showTitle=false&size=73198&status=done&style=none&taskId=u6438be83-0691-4d4a-8665-d82399fd5c6&title=&width=1111)

##### 2、重启网络服务

```shell
[root@192 ~]# systemctl restart network
```

##### 3、关闭防火墙

```shell
[root@192 ~]# systemctl disable firewalld
Removed symlink /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.
Removed symlink /etc/systemd/system/basic.target.wants/firewalld.service.
```

##### 4、测试网络连接

```shell
[root@192 ~]# ping www.baidu.com
```

## 快照

右键新建好的虚拟机-->Snapshot-->Take Snapshot。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679923258289-deaf4ac0-566c-4421-a8b8-1c91fe00a3c9.png#averageHue=%23838382&clientId=ud7ae89de-a645-4&from=paste&height=1186&id=u93267402&originHeight=1186&originWidth=2276&originalType=binary&ratio=1&rotation=0&showTitle=false&size=111020&status=done&style=none&taskId=u373d45d7-55a9-446d-a0c5-8865d117a08&title=&width=2276)
命名快照、描述，点击Take Snapshot就OK了。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679923402588-53950f46-4a12-45c3-969e-f36451907921.png#averageHue=%23ecebea&clientId=ud7ae89de-a645-4&from=paste&height=232&id=u0527fe46&originHeight=232&originWidth=353&originalType=binary&ratio=1&rotation=0&showTitle=false&size=11023&status=done&style=none&taskId=u059a9064-ab96-49a4-a367-4eb6351f22d&title=&width=353)

# Kali

## ISO

进入[https://www.kali.org/get-kali/#kali-installer-images](https://www.kali.org/get-kali/#kali-installer-images)，下载带有Recommended的iso镜像，建议使用迅雷下载。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679926607678-5ec80318-e705-48a4-9e55-f39cc09f9ccd.png#averageHue=%23f7f6f5&clientId=ue5248778-9dae-4&from=paste&height=1233&id=u303a7d00&originHeight=1233&originWidth=2560&originalType=binary&ratio=1&rotation=0&showTitle=false&size=598083&status=done&style=none&taskId=ue74ae75a-d817-454f-98cf-f141db37543&title=&width=2560)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679926630761-df911486-6212-49f0-8fe4-ed19513148dd.png#averageHue=%23f9f8f8&clientId=ue5248778-9dae-4&from=paste&height=1233&id=u48d33949&originHeight=1233&originWidth=2560&originalType=binary&ratio=1&rotation=0&showTitle=false&size=212306&status=done&style=none&taskId=u72f4779e-f2cb-448a-9de5-bcf5e6fab56&title=&width=2560)

## 装机

##### 1、打开VMware，选择File-->New Virtual Machine，选择Custom，点击next

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679818570976-86cd0a03-624c-4f13-9df6-d2939bd37bc9.png#averageHue=%23f9f5f4&clientId=ufcbce0c8-1413-4&from=paste&height=395&id=jZb1g&originHeight=395&originWidth=426&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25261&status=done&style=none&taskId=u0809deac-4e57-4a75-9907-97639c84d3d&title=&width=426)

##### 2、选择自己的VMware版本，点击next

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679818747477-cd4425ba-0f73-4499-9337-894270108ea0.png#averageHue=%23ece8e6&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=Y9xzv&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21686&status=done&style=none&taskId=u1514dbb3-da2d-41f2-8c3b-ff13ddbf5b7&title=&width=442)

##### 3、选择"I will install the operating system later"，点击next

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679818801755-75af779d-58c2-41ae-b991-96a945f17266.png#averageHue=%23ece8e7&clientId=ufcbce0c8-1413-4&from=paste&height=437&id=kL2qG&originHeight=437&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21927&status=done&style=none&taskId=uf3207f27-cb79-4bcc-b12d-41131faf205&title=&width=442)

##### 4、选择模板机的操作系统（operating system）和版本（version），点击next

这里我们选择
