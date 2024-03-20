---
icon: pen-to-square
date: 2021-03-17
category:
  - Nginx
title: Nginx
tag:
- nginx

---

# 介绍

官网：[http://nginx.org/](http://nginx.org/)
下载地址：[http://nginx.org/en/download.html](http://nginx.org/en/download.html)

# Linux下安装及使用

## 安装
参考：[https://www.runoob.com/linux/nginx-install-setup.html](https://www.runoob.com/linux/nginx-install-setup.html)
### 安装依赖
```shell
# 安装
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```
### 安装PCRE
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1675267655447-2c113300-0610-42c8-8b39-82706daebf38.png#averageHue=%23242e39&clientId=u32476b06-4201-4&from=paste&height=282&id=u3564989c&originHeight=282&originWidth=2489&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32149&status=done&style=none&taskId=u114720a9-013e-4a2e-8a4c-49c9ba96a38&title=&width=2489)
进入[pcre下载页](https://sourceforge.net/projects/pcre/)，点击[Files](https://sourceforge.net/projects/pcre/files/)，选择[pcre](https://sourceforge.net/projects/pcre/files/pcre/)，选择要下载的版本，选择下载较多的即可，选中以`tar.gz`结尾的文件右键，复制链接地址，然后回到Linux，使用`wget`下载
```shell
# 安装PCRE，让Nginx支持rewrite功能，我们选择的安装目录为/usr/local/src
cd /usr/local/src

# 下载pcre
wget http://downloads.sourceforge.net/project/pcre/pcre/8.45/pcre-8.45.tar.gz

# 解压
tar -zxvf pcre-8.45.tar.gz

# 进入pcre目录
cd pcre-8.45

# 编译生成Makefile为make做准备，下面的 ./  代表执行后面的文件的意思，等同于 sh configure
./configure

# 编译并安装
make && make install 

# 查看pcre版本
pcre-config --version
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1675268379945-1f5e11b5-6e18-4983-9080-01e8f84278fe.png#averageHue=%23bcb4ae&clientId=u90a8284f-7b48-4&from=paste&height=704&id=ubb5caac1&originHeight=704&originWidth=1060&originalType=binary&ratio=1&rotation=0&showTitle=false&size=53790&status=done&style=none&taskId=uf7372233-b1dc-420d-b0c7-5b954bd4401&title=&width=1060)

### 安装Nginx
```shell
# 进入安装目录，此次我们选择的安装目录为/usr/local/src
cd /usr/local/src

# 下载nginx压缩包
wget http://nginx.org/download/nginx-1.22.1.tar.gz

# 解压
tar -zxvf nginx-1.22.1.tar.gz

# 进入
cd nginx-1.22.1

# 生成Makefile，为下一步编译做准备
./configure --prefix=/usr/local/src/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/src/pcre-8.45

# 编译及安装
make && make install
```

## 启停
```shell
# 切换到安装目录下
cd /usr/local/nginx/sbin

# 启动命令，以下两条都可以启动
./nginx  

# 查看是否启动成功
ps -ef | grep nginx

# 停止
./nginx -s stop

# 优雅停止
./nginx -s quit

# 重新加载配置文件
./nginx -s reload
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1675353493122-bea81831-97c4-4d6d-83f7-72cf0c1e13c7.png#averageHue=%2329323d&clientId=u90a8284f-7b48-4&from=paste&height=284&id=u7b269287&originHeight=284&originWidth=581&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26702&status=done&style=none&taskId=ud29fec74-f150-41fb-a1a7-1b545308521&title=&width=581)

访问，本机访问输入localhost即可，外网访问只需输入安装机器的ip即可（需要开启80端口访问），因为nginx代理的是80端口。

## 配置系统服务
```shell
# 创建服务脚本
vim /usr/lib/systemd/system/nginx.service

# 插入以下内容
[Unit]
Description=nginx - high performance web server
Documentation=http://nginx.org/en/docs
After=network.target remote-fs.target nss-lookup.target
 
[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true
 
[Install]
WantedBy=multi-user.target

# 赋予脚本执行权限
chmod 744 /usr/lib/systemd/system/nginx.service
```



# Nginx

## 配置
### 原始配置
拿到原始配置后，去除被注释的代码后的配置如下所示
```shell
# worker进程数，上限取决于服务器的内核数
worker_processes  1;

events {

  	# 每个worker允许连接的 客户端最大连接数
    worker_connections  1024;
}

http {
  	# 请求类型
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

  	# 一个server对应一个服务器
    server {
      	# nginx监听的端口
        listen       80;
      	# 发起请求的域名或ip，比如baidu.com
        server_name  localhost;
      	# 
        location / {
            root   html;
            index  index.html index.htm;
        }

      	# 50x映射地址
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }
}
```

### 配置结构
![](https://cdn.nlark.com/yuque/0/2023/jpeg/21953536/1676704375003-a921ce35-ec8d-412c-b685-409f6fd1715e.jpeg)


### 映射静态资源
```shell
# 假设该服务器IP为192.168.130.1

# 示例1
server {
  	# 拦截192.168.130.1:8090的请求
    listen       8090;
    server_name  localhost;

  	# 192.168.130.1:8090/
    location / {
      	# 静态资源存放路径
        root   home/user;
      	# 想要访问的静态资源，可以是静态页面，也可以是图片，其他
        index  index.html index.htm;
    }

  	# 192.168.130.1:8090/demo
    location /demo {
      	# 静态资源存放位置
      	root   home/user/demo;
      	# 默认展示index.html页面
        index  demo.html demo.htm;
    }
}
```


### 二级域名访问
#### 背景
现在有一台服务器，一个域名（starve.fun），四个服务，想要实现通过二级域名的方式访问不同的服务。

- `[nginx.starve.fun](http://nginx.starve.fun)`：80，nginx默认
- `[heart.starve.fun](http://heart.starve.fun)`：9999，静态资源
- `[wechat.starve.fun](http://wechat.starve.fun)`：8090，只有一个`/test`可用，需要让其他请求跳转到配置的首页
- `[demo.starve.fun](http://demo.starve.fun)`：8888/8889/8890，只有`/demo/nginx`可用，需要让其他请求跳转到配置的首页

#### 配置
`nginx.conf`
```shell
# worker执行用户，需要有对应资源的访问权限
user  nobody;
worker_processes  1;

error_log  logs/error.log;

pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    tcp_nopush     on;

    keepalive_timeout  65;

    gzip  on;

  	# 引入配置文件
    include     ./demo/*.conf;

  	# 默认监听服务nginx，80端口
    server {
        listen       80;
        server_name  www.starve.fun starve.fun;


        location / {
            root   html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

wechat服务
```shell
upstream wechat {
    server 101.132.32.220:8090;
}

server {
    listen       80;
    server_name  wechat.starve.fun;

    location / {
        proxy_pass   http://wechat;
        root   /home/marshio/zmh;
        index  zmh.html;
    }
}


```
heart服务
```shell
server {
    listen       80;
    server_name  heart.starve.fun;
    location / {
        root   /home/marshio/demo;
        index  heart.html;
    }																					
}
```
demo服务
```shell
    upstream demo {
        server 101.132.32.220:8888;
        server 101.132.32.220:8889;
        server 101.132.32.220:8890;
    }
    
    server {
      	listen	80;
      	server_name    demo.starve.fun;
      	location    {
            proxy_pass http://demo;
            proxy_connect_timeout 3s;
            proxy_read_timeout 5s;
            proxy_send_timeout 3s;
        }
    }
```

## 配合spring boot使用


```shell
user  nobody;
worker_processes  1;

error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    gzip  on;


    upstream demo {
        server 101.132.32.220:8888;
        server 101.132.32.220:8889;
        server 101.132.32.220:8890;
    }

    server {
        listen       80;
        server_name  www.starve.fun demo.starve.fun;

        location / {
            root   html;
            proxy_pass http://demo;
            proxy_connect_timeout 3s;
            proxy_read_timeout 5s;
            proxy_send_timeout 3s;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```


## 使用

### 防盗链

# 涉及命令
简单的命令不在此赘述，此处只会涉及一些我个人认为**很少使用且相对较难**的命令。

- `tar`，虽然解压工具我也经常使用，但是对于其参数具体的含义还是很模糊，此处还是稍作复习。
   - `-z`：`--gzip`、`--gunzip`、`--ungzip`，调用gzip执行压缩或解压缩
   - `-x`：`--extract`、`--get`，解压`tar`文件
   - `-v`：`--verbose`，列出每一步处理涉及的文件信息，只用一个`v`时，仅列出文件名，使用两个`v`时，列出权限、所有者、大小、时间、文件名等信息
   - `-f`：`--file`，指定要处理的文件名
- `ps`，
   - `-e`
   - `-f`
- `configure`：
- `make`

参考

- [https://thoughtbot.com/blog/the-magic-behind-configure-make-make-install](https://thoughtbot.com/blog/the-magic-behind-configure-make-make-install)
# 涉及工具
常用工具此处不在多说，此处只会涉及一些我个人认为**很少使用且相对重要**的工具。

- 

