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

## 安装Nginx（Must For Me, Option For You）

需要的配置

- 内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量
- 磁盘：越大越好啦
- CPU：取决于连接数，当然是越大越好，1C也是可以的

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

# Linux iZuf6ipaofe0zmf15z5lttZ 3.10.0-1160.108.1.el7.x86_64 #1 SMP Thu Jan 25 16:17:31 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux

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
[root@iZuf6ipaofe0zmf15z5lttZ ~]# mysql_secure_installation

Securing the MySQL server deployment.

Enter password for user root: 
Error: Access denied for user 'root'@'localhost' (using password: YES)
[root@iZuf6ipaofe0zmf15z5lttZ ~]# mysql_secure_installation

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
grant all privaleges on *.* to 'dba'@'%';

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



## 安装Redis（Option）

需要的配置

- 内存
- 磁盘
- CPU

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
