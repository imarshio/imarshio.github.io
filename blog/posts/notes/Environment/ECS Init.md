---
icon: pen-to-square
date: 2024-03-19
category:
  - ECS
title: What would you do if you have a ECS server?
# tag:

---

当你到手一台服务器后，你会干什么？看看我都会做啥吧。

## 安装Nginx（Must）

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

- 内存
- 磁盘
- CPU

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
