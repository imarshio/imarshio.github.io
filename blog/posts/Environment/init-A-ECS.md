---
icon: pen-to-square
category:
  - ECS
  - Environment setup
title: What if you have a ECS server?
# tag:

---

当你到手一台服务器后，你会干什么？

Just One?

Yes, One.

Nothing.

But, this is life.

看看我都会做啥吧。

## 环境

- 刚刚出炉的阿里云2c2g服务器
- CentOS 7
- 默认安全组（22、3389）

## 安装Nginx（Must For Me, Option For You）

需要的配置

- 内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量
- 磁盘：越大越好啦
- CPU：取决于连接数，当然是越大越好，1C也是可以的
- 阿里云安全组打开80端口

### 安装

参照：[RHEL系Linux安装nginx](https://nginx.org/en/linux_packages.html#RHEL)

CentOS 7.x

```sh
# 下载工具包
sudo yum install yum-utils
# 下载Nginx
sudo yum install nginx

# 查看安装位置
whereis nginx

# 输出：nginx: /usr/sbin/nginx /usr/lib64/nginx /etc/nginx /usr/share/nginx /usr/share/man/man8/nginx.8.gz /usr/share/man/man3/nginx.3pm.gz
# /usr/sbin/nginx               启动脚本
# /usr/lib64/nginx              存放nginx的模块
# /etc/nginx                    存放nginx的配置文件和一些文件
# /usr/share/nginx              存放nginx的静态文件和模块
# /usr/lib/systemd/system/nginx 存放nginx的服务模块
```

### 配置

安装后的默认配置

```conf
user nginx;
# worker节点数量，等于内核数量
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    # worker 支持的最大链接数量
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        listen       [::]:80;
        # _ 默认代表 localhost
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }
# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2;
#        listen       [::]:443 ssl http2;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers HIGH:!aNULL:!MD5;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}
```

### 启停

参考：[初学者指导](https://nginx.org/en/docs/beginners_guide.html)

> 注意：执行命令的用户最好是同一个

```sh
# 启动
nginx

# 停止
nginx -s stop

# 重载配置
nginx -s reload

# 优雅停止
nginx -s quit
```

### 适配服务器

```conf
user nginx;
# worker节点数量，等于内核数量
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    # worker 支持的最大链接数量
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        listen       [::]:80;
        # _ 默认代表 localhost
        # 如果你有域名，那么可以将域名解析到本服务器的公网IP，如 我的域名marshio.com
        # 添加解析 服务器IP列表添加本服务器IP
        server_name  marshio.com *.marshio.com;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }

}
```

## 安装Mysql（Option）

需要的配置

- 内存：越大越好，小点也没问题
- 磁盘：越大越好，小点也没问题
- CPU：越多越好，少了也能跑

进[官网](https://dev.mysql.com/downloads/repo/yum/)，这里传送门会送你到下载地址，映入眼帘的就是你可以点击下载的链接，至于进入这个链接的原因嘛，你可以看下[官方解释](https://dev.mysql.com/doc/refman/8.4/en/linux-installation-yum-repo.html)

### 确认Linux版本

点击如上连接后，你会发现有好多个链接可以点击下载，不明所以的同学以及有选择困难症的同学可能就难以下手了，那么此时我们就需要知道其中有什么区别？

仔细观察一番，我们可以发现其中的玄机就在一个数字之差，Linux 9 对应 “el9”，Linux 8 对应 “el8”，Linux 7 对应 “el7”，我们略施小计就能猜到这是版本不一致导致的。

> [!NOTE]
>
> 有些人可能会好奇RHEL与CentOS的区别是什么？这篇文章会告诉你。[What is CentOS?](https://www.redhat.com/en/topics/linux/what-is-centos)
>
> 简单来说，他俩基本一样，不一样的点在于一个是商业化的，一个是开源免费的。一个由专业的团队维护，一个由开源社区维护。

```sh
uname -a 

# Linux demo 3.10.0-1160.108.1.el7.x86_64 #1 SMP Thu Jan 25 16:17:31 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux

# 第三段内容决定了你能下载的版本
```

### 安装

```sh
# 下载rpm包
rpm -Uvh https://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm

# 下载mysql-server
yum -y install mysql-community-server --enablerepo=mysql80-community --nogpgcheck

# 检查是否安装成功
mysql -V
```

### 配置

使用`yum`安装的程序其配置文件一般放在 `/etc/` 下，在我们的情况中，MySQL的配置文件就存放在了 `/etc/my.cnf`，在这里可以找到数据文件的位置（`datadir=/var/lib/mysql`）

```sh
# 启动mysql服务
sudo systemctl start mysqld

# 启用mysql服务
sudo systemctl enable mysqld

# 从日志中找到临时密码
sudo grep 'temporary password' /var/log/mysqld.log

# rn,Ooorsp9s#
# Vjb,Li6N}r

```

#### 安全配置（可选）

```sh
# 执行安全检查配置
mysql_secure_installation
```

##### 重置密码

```sh
[root@demo ~]# mysql_secure_installation

Securing the MySQL server deployment.

Enter password for user root: 
Error: Access denied for user 'root'@'localhost' (using password: YES)
[root@demo ~]# mysql_secure_installation

Securing the MySQL server deployment.

Enter password for user root: 
The 'validate_password' component is installed on the server.
The subsequent steps will run with the existing configuration
of the component.
Using existing password for root.

Estimated strength of the password: 100 
Change the password for root ? ((Press y|Y for Yes, any other key for No) : y

New password: 

Re-enter new password: 

Estimated strength of the password: 100 
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y
```

##### 移除匿名用户

```sh
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
Success.
```

##### 禁止远程登录root账户

```sh
Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y
Success.
```

##### 删除测试库

```sh
By default, MySQL comes with a database named 'test' that
anyone can access. This is also intended only for testing,
and should be removed before moving into a production
environment.


Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
 - Dropping test database...
Success.

 - Removing privileges on test database...
Success.

Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.
```

##### 重新加载授权表

```sh
Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
Success.

All done! 
```

#### 创建远程登录用户

```sh

# 先进入mysql服务的控制台
mysql -uroot -p

# 输入密码

# 创建用户
create user 'dba'@'%' identified by 'passsword';

# 授予全部权限
grant all privileges on *.* to 'dba'@'%';
# 如果你总是拼错 privileges，你也可以使用下面的语句
grant all on *.* to 'dba'@'%';

# 刷新权限，使权限立即生效
flush privaleges;
```

### 密码记录

| 账号 | 密码       |
| ---- | ---------- |
| root |            |
| dba  | W9My48X.k6 |
|      |            |

## 安装Java（Option）

> [!Note]
> 从 Java 9 开始，Oracle 官方不再提供单独的JRE下载，而是将其包含在 JDK 中。
>
> 从 Java 9 开始，环境变量不需要手动配置。

```shell
# 搜索jdk列表
yum list java*

# 选择合适的版本安装，
yum -y install java-11-openjdk-devel.x86_64

# 查看是否安装成功
java -version
```

### 查看安装位置

```sh
whereis java

# 输出：java: /usr/bin/java /usr/lib/java /etc/java /usr/share/java /usr/share/man/man1/java.1.gz

# 查看java命令安装的目录
ll /usr/bin | grep java

# lrwxrwxrwx  1 root root        22 May 13 17:05 java -> /etc/alternatives/java
# 开头的 l 代表这是一个软连接，链接的是其他目录，我们继续深入

ll /etc/alternatives | grep java

# lrwxrwxrwx  1 root root 64 May 13 17:05 java -> /usr/lib/jvm/java-11-openjdk-11.0.23.0.9-2.el7_9.x86_64/bin/java
# /usr/lib/jvm/java-11-openjdk-11.0.23.0.9-2.el7_9.x86_64/bin/java 就是java命令的位置，在这个地方你可以看到其他命令，如jstack，jconsole等
```

### 配置

自Java9开始，如果你选择的是安装程序（.msi、）的方式，jdk的环境变量不需要手动配置。

## 安装Redis（Option）

需要的配置

- 内存
- 磁盘
- CPU

这次我们换个方式，之前都是用安装包管理工具完成一系列中间件的安装，这次我们来体验下使用源码进行安装。

如果你不想这么麻烦，也可以，但是由于yum源其本身是没有redis的，所以我们需要借助其他方式，下文也会讲到。

### 源码

### epel

借助epel不完全是官网推荐的安装方式，官网推荐的是使用snaps安装，但是我这里不是很推荐大家使用snaps去安装软件，毕竟我们讲的就是一个开源。

关于epel（Extra Packages for Enterprise Linux）可以查看[History and Philosophy of EPEL](https://docs.fedoraproject.org/en-US/epel/epel-about-history-philosophy/)

关于snaps的介绍可以查看[传送门](https://snapcraft.io/)，简单来说，snaps 是一个 Linux 版的应用商店。

#### 下载epel

```sh
[root@demo ~]# sudo yum install epel-release
Loaded plugins: fastestmirror
Determining fastest mirrors
base                                                                                                                                                                                                                                                                   | 3.6 kB  00:00:00
epel                                                                                                                                                                                                                                                                   | 4.3 kB  00:00:00
extras
2.9 kB  00:00:00
mysql-connectors-community                                                                                                                                                                                                                                             | 2.6 kB  00:00:00
mysql-tools-community                                                                                                                                                                                                                                                  | 2.6 kB  00:00:00
mysql80-community                                                                                                                                                                                                                                                      | 2.6 kB  00:00:00
updates                                                                                                                                                                                                                                                                | 2.9 kB  00:00:00
(1/3): epel/x86_64/updateinfo                                                                                                                                                                                                                                          | 1.0 MB  00:00:00
(2/3): epel/x86_64/primary_db                                                                                                                                                                                                                                          | 8.7 MB  00:00:00
(3/3): updates/7/x86_64/primary_db                                                                                                                                                                                                                                     |  27 MB  00:00:00
Resolving Dependencies
--> Running transaction check
---> Package epel-release.noarch 0:7-14 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

==============================================================================================================================================================================================================================================================================================
 Package                                                                    Arch                                                                 Version                                                             Repository                                                          Size
==============================================================================================================================================================================================================================================================================================
Installing:
 epel-release                                                               noarch                                                               7-14                                                                epel                                                                15 k

Transaction Summary
==============================================================================================================================================================================================================================================================================================
Install  1 Package

Total download size: 15 k
Installed size: 25 k
Is this ok [y/d/N]: y
Downloading packages:
epel-release-7-14.noarch.rpm                                                                                                                                                                                                                                           |  15 kB  00:00:00
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : epel-release-7-14.noarch                                                                                                                                                                                                                                                   1/1
warning: /etc/yum.repos.d/epel.repo created as /etc/yum.repos.d/epel.repo.rpmnew
  Verifying  : epel-release-7-14.noarch                                                                                                                                                                                                                                                   1/1

Installed:
  epel-release.noarch 0:7-14

Complete!
```

#### Install and Enable Redis

```sh
# 现在可以直接用 epel 源下载 redis
[root@demo lib]# yum install redis
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
Resolving Dependencies
--> Running transaction check
---> Package redis.x86_64 0:3.2.12-2.el7 will be installed
--> Processing Dependency: libjemalloc.so.1()(64bit) for package: redis-3.2.12-2.el7.x86_64
--> Running transaction check
---> Package jemalloc.x86_64 0:3.6.0-1.el7 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

==============================================================================================================================================================================================================================================================================================
 Package                                                               Arch                                                                Version                                                                    Repository                                                         Size
==============================================================================================================================================================================================================================================================================================
Installing:
 redis                                                                 x86_64                                                              3.2.12-2.el7                                                               epel                                                              544 k
Installing for dependencies:
 jemalloc                                                              x86_64                                                              3.6.0-1.el7                                                                epel                                                              105 k

Transaction Summary
==============================================================================================================================================================================================================================================================================================
Install  1 Package (+1 Dependent package)

Total download size: 648 k
Installed size: 1.7 M
Is this ok [y/d/N]: y
Downloading packages:
(1/2): redis-3.2.12-2.el7.x86_64.rpm                                                                                                                                                                                                                                   | 544 kB  00:00:00
(2/2): jemalloc-3.6.0-1.el7.x86_64.rpm                                                                                                                                                                                                                                 | 105 kB  00:00:00
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                                                                                                                                         5.2 MB/s | 648 kB  00:00:00
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : jemalloc-3.6.0-1.el7.x86_64                                                                                                                                                                                                                                                1/2
  Installing : redis-3.2.12-2.el7.x86_64                                                                                                                                                                                                                                                  2/2
  Verifying  : redis-3.2.12-2.el7.x86_64                                                                                                                                                                                                                                                  1/2
  Verifying  : jemalloc-3.6.0-1.el7.x86_64                                                                                                                                                                                                                                                2/2

Installed:
  redis.x86_64 0:3.2.12-2.el7

Dependency Installed:
  jemalloc.x86_64 0:3.6.0-1.el7

Complete!

# 启动 redis 服务
[root@demo lib]# systemctl start redis

# 启用 redis 服务
[root@demo lib]# systemctl enable redis
Created symlink from /etc/systemd/system/multi-user.target.wants/redis.service to /usr/lib/systemd/system/redis.service.

# 查看 redis 服务状态 active为启动
[root@demo lib]# systemctl status redis
● redis.service - Redis persistent key-value database
   Loaded: loaded (/usr/lib/systemd/system/redis.service; enabled; vendor preset: disabled)
  Drop-In: /etc/systemd/system/redis.service.d
           └─limit.conf
   Active: active (running) since Sat 2024-06-01 23:52:37 CST; 19s ago
 Main PID: 7415 (redis-server)
   CGroup: /system.slice/redis.service
           └─7415 /usr/bin/redis-server 127.0.0.1:6379

Jun 01 23:52:37 demo systemd[1]: Starting Redis persistent key-value database...
Jun 01 23:52:37 demo systemd[1]: Started Redis persistent key-value database.
```

### 配置 redis

```sh
# 确认 redis 配置文件位置
[root@demo ~]# whereis redis.conf
redis: /etc/redis.conf

# 修改配置
[root@demo ~]# vim /etc/redis.conf

# 设置 daemonize 为 yes
# 注释掉 bind 127.0.0.1
# 设置 protected-mode 为 no
# 设置密码 requirepass password 没有用户名

```

#### 配置文件样例

```sh
# Redis configuration file example.

################################## INCLUDES ###################################

# include /path/to/local.conf
# include /path/to/other.conf

################################## NETWORK #####################################

# bind 127.0.0.1

protected-mode no

# Accept connections on the specified port, default is 6379 (IANA #815344).
# If port 0 is specified Redis will not listen on a TCP socket.
port 6379

tcp-backlog 511

# Unix socket.
# unixsocket /tmp/redis.sock
# unixsocketperm 700

# Close the connection after a client is idle for N seconds (0 to disable)
timeout 0

tcp-keepalive 300

################################# GENERAL #####################################

# By default Redis does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.
daemonize yes

supervised no

pidfile /var/run/redis_6379.pid

loglevel notice


logfile /var/log/redis/redis.log

# To enable logging to the system logger, just set 'syslog-enabled' to yes,
# and optionally update the other syslog parameters to suit your needs.
# syslog-enabled no

# Specify the syslog identity.
# syslog-ident redis

# Specify the syslog facility. Must be USER or between LOCAL0-LOCAL7.
# syslog-facility local0

databases 16

################################ SNAPSHOTTING  ################################

save 900 1
save 300 10
save 60 10000

stop-writes-on-bgsave-error yes

rdbcompression yes

rdbchecksum yes

# The filename where to dump the DB
dbfilename dump.rdb

# The working directory.
dir /var/lib/redis

################################# REPLICATION #################################

# slaveof <masterip> <masterport>

# masterauth <master-password>


slave-serve-stale-data yes

slave-read-only yes

# Replication SYNC strategy: disk or socket.
repl-diskless-sync no


repl-diskless-sync-delay 5

# repl-ping-slave-period 10

# repl-timeout 60

repl-disable-tcp-nodelay no

# repl-backlog-size 1mb

# repl-backlog-ttl 3600

slave-priority 100

# min-slaves-to-write 3
# min-slaves-max-lag 10

# slave-announce-ip 5.5.5.5
# slave-announce-port 1234

################################## SECURITY ###################################

requirepass strong_password

################################### LIMITS ####################################

# maxclients 10000

# maxmemory-policy noeviction

# maxmemory-samples 5

############################## APPEND ONLY MODE ###############################

appendonly no

# The name of the append only file (default: "appendonly.aof")

appendfilename "appendonly.aof"

# appendfsync always
appendfsync everysec
# appendfsync no

no-appendfsync-on-rewrite no

auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

aof-load-truncated yes

################################ LUA SCRIPTING  ###############################

lua-time-limit 5000

################################ REDIS CLUSTER  ###############################

# cluster-enabled yes

# cluster-config-file nodes-6379.conf

# cluster-node-timeout 15000


# cluster-slave-validity-factor 10


# cluster-migration-barrier 1


# In order to setup your cluster make sure to read the documentation
# available at http://redis.io web site.

################################## SLOW LOG ###################################

slowlog-log-slower-than 10000

slowlog-max-len 128

################################ LATENCY MONITOR ##############################

latency-monitor-threshold 0

############################# EVENT NOTIFICATION ##############################

notify-keyspace-events ""

############################### ADVANCED CONFIG ###############################

hash-max-ziplist-entries 512
hash-max-ziplist-value 64

list-max-ziplist-size -2

list-compress-depth 0

set-max-intset-entries 512

zset-max-ziplist-entries 128
zset-max-ziplist-value 64

hll-sparse-max-bytes 3000

activerehashing yes

client-output-buffer-limit normal 0 0 0
client-output-buffer-limit slave 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60

hz 10

aof-rewrite-incremental-fsync yes
```

### 进入redis控制台

```sh
[root@demo ~]# redis-cli
127.0.0.1:6379>

127.0.0.1:6379> auth 501RXzp1bunnAJFTF9Vp
OK

# 授权完成就可以随意玩啦,have fun
# 记得打开安全组的6379端口

# 退出redis服务端控制台
127.0.0.1:6379> quit
```

## 安装Docker（Option）

需要的配置

- 内存
- 磁盘
- CPU

### Ubuntu

```sh
# 更新包仓库索引
root@host:~# apt-get update

# 安装docker、docker compose
root@host:~# apt install docker.io docker-compose

# 检查docker版本
root@host:~# docker -v
Docker version 24.0.7, build 24.0.7-0ubuntu2~22.04.1

```

## 安装Kafka（Option）

需要的配置

- 内存
- 磁盘
- CPU

## 安装Postgresql（Option）

需要的配置

- 内存
- 磁盘
- CPU
