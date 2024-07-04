---
icon: fa-brands fa-docker
lang: en-US
order: 50
title: Docker
description: 虚心接受自己的不足，然后找机会与时间去弥补自己的不足，你会慢慢体会到高处不胜寒的感觉。
category:
- docker
tags: 
- docker
- notes
- linux

---

## 简介

> Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的[Linux](https://baike.baidu.com/item/Linux)机器上，也可以实现虚拟化。
>
> Docker容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。
>
> Docker在17.03版本后分为CE（Community Edition社区版）和EE（Enterprise Edition: 企业版）版（类似JavaSE和JavaEE），我们安装时使用CE版即可。

## 安装

### 先决条件

> Docker需要较高的Linux内核版本,

```shell
# 查看内核
uname -a
```

### 卸载旧版本

在安装之前，我们需要卸载旧版本，这里我们需要知道，旧版本与新版本的Docker有啥区别.

旧版Docker被称为Docker，Docker.io，Docker-engine。
新版Docker被称为`Docker-ce`，以往旧式的安装相对繁琐，如果你想学习，可以自行搜索。

- CentOS

```shell
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

- Ubuntu

```shell
sudo apt-get remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

如果 `shell`报告没有安装这些软件包，那也没关系。

### 安装新版本

您可以根据需要以不同方式安装 Docker Engine,下面提供了三种安装docker的方式

- 存储库安装
大多数用户 [设置 Docker 的存储库](https://docs.docker.com/engine/install/centos/#install-using-the-repository)并从中安装，以便于安装和升级任务。这是推荐的方法。
使用存储库的前提就是需要我们先进行**设置存储库**。  

#### 设置存储库

- CentOS

```shell
# 安装yum-utils包，提供yum-config-manager实用程序，设置稳定存储库
sudo yum -y install yum-utils
# 给仓库设置源
# 官方源,较慢
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 阿里云源
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 清华大学源
sudo yum-config-manager --add-repo https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/docker-ce.repo
```

> **可选**：启用nightly或test存储库
>
> 这些存储库包含在 `docker.repo`上面的文件中，但默认情况下是禁用的。你可以在稳定存储库旁启动他们。
>
> 启动nightly存储库：
>
> `sudo yum-config-manager --enable docker-ce-nightly`
>
> 禁用nightly存储库：
>
> `sudo yum-config-manager --disable docker-ce-nightly`
>
> 启动test存储库：
>
> `sudo yum-config-manager --enable docker-ce-test`
>
> 禁用test存储库：
>
> `sudo yum-config-manager --disable docker-ce-test`

- Ubuntu

#### 安装docker引擎

- CentOS

```shell
# 不指定版本安装
# 安装最新版的Docker Engine和containerd
sudo yum -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 如果提示接收GPG密钥，请验证指纹是否匹配`060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35`,如果匹配请接受。
```

> 如果你有多个Docker存储库，当你在下载的时候，如果没有指定版本，那么会默认下载最高版本。
>
> 此命令会安装Docker，但不会启动Docker，他还会创建一个 `docker`组，但不会向该组添加用户。

```shell
# 指定版本安装
# 在存储库中列出并排序可用版本，排序按照版本号进行排序，从高到低
yum list docker-ce --showduplicates | sort -r
```

> 通过**完全限定的包名**进行安装，即使用**包名称**（`docker-ce`）加上从第一个冒号（`:`）开始的版本字符串（第二列），直到第一个 `-`，如：`docker-ce-18.09.1`。

```shell
sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io
```

- Ubuntu

#### 启动Docker

```shell
sudo systemctl start docker # CentOS 和 Ubuntu的启动命令是一样的
# 启动时需要使用root用户或具有root权限的用户，并输入用户密码
```

#### 试运行

```shell
sudo docker run hello-world 
# 新下载的docker可能没有自带hello-world镜像，docker会自动从存储库进行拉取，只需静待几分钟即可。出现 `This message shows that your installation appears to be working correctly.` 表示你已经启动成功。
```

#### 升级Docker引擎

要升级 Docker Engine，请按照[安装说明进行操作](https://docs.docker.com/engine/install/centos/#install-using-the-repository)，选择要安装的新版本。

- RPM包安装

> 一些用户下载 RPM 包并 [手动安装](https://docs.docker.com/engine/install/centos/#install-from-a-package)并完全手动管理升级。这在诸如在无法访问互联网的系统上安装 Docker 等情况下非常有用。
>
> 如果你无法从Docker的存储库安装Docker,你可以下载 `.rpm`版本的文件并手动安装,每次升级Docker Engine时都需要下载一个新文件.

前往[Docker存储库](https://download.docker.com/linux/centos/),选择你对应的版本,进入 `x86_64/stable/Packages`

在这里提醒大家,如果能用别的方法,尽量不要用这个方法,因为安装步骤繁琐,各个安装包之间的版本匹配也是一个大问题。

一定要直到那个包跟哪个包是匹配的版本.不然就前功尽弃了.等你下载完匹配好的包之后,按照如下顺序去安装就可以了。

```sh
yum localinstall docker-ce-version 
```

#### 下载 `.rpm`包

- 自动脚本安装

> 在测试和开发环境中，一些用户选择使用自动化的 [便捷脚本](https://docs.docker.com/engine/install/centos/#install-using-the-convenience-script)来安装 Docker。

Docker 在[get.docker.com](https://get.docker.com/) 上提供了一个方便的脚本，可以快速且非交互地将 Docker 安装到开发环境中。不建议将便捷脚本用于生产环境，但可以用作示例来创建适合您需求的配置脚本。另请参阅[使用存储库安装](https://docs.docker.com/engine/install/centos/#install-using-the-repository) 步骤以了解使用软件包存储库进行安装的安装步骤。该脚本的源代码是开源的，可以`[docker-install](https://github.com/docker/docker-install)`[在 GitHub 上](https://github.com/docker/docker-install)的 [存储库中找到](https://github.com/docker/docker-install)。
在本地运行之前，请务必检查从 Internet 下载的脚本。在安装之前，让自己熟悉便利脚本的潜在风险和限制：

- 脚本需要 `root`或 `sudo`特权才能运行。
- 该脚本尝试检测您的 Linux 发行版和版本并为您配置包管理系统，并且不允许您自定义大多数安装参数。
- 该脚本无需确认即可安装依赖项和建议。这可能会安装大量软件包，具体取决于主机的当前配置。
- 默认情况下，该脚本会安装 Docker、containerd 和 runc 的最新稳定版本。使用此脚本配置机器时，可能会导致 Docker 的主要版本意外升级。在部署到生产系统之前，始终在测试环境中测试（主要）升级。
- 该脚本并非旨在升级现有的 Docker 安装。使用脚本更新现有安装时，依赖项可能不会更新到预期版本，从而导致使用过时的版本。

您可以运行带有 `DRY_RUN=1`选项的脚本以了解脚本在安装过程中将执行的步骤：

```shell
curl -fsSL https://get.docker.com -o get-docker.sh
DRY_RUN=1 sh ./get-docker.sh
```

安装了 Docker。该 `docker`服务在基于 Debian 的发行版上自动启动。在 `RPM`基于发     行版的发行版上，例如 CentOS、Fedora、RHEL 或 SLES，您需要使用适 `systemctl`or `service`命令手动启动它。如消息所示，默认情况下，非 root 用户无法运    行 Docker 命令。

更多系统安装方法请查看[Docker官网](https://docs.docker.com/engine/install/)

## 仓库

[仓库](https://docs.docker.com/registry/)(**Repository**)可看成是Github，用来保存和分发镜像。
官方仓库：[https://hub.docker.com/](https://hub.docker.com/)

> Docker 使用客户端-服务器 (C/S) 架构模式，使用远程API来管理和创建Docker容器。
>
> Docker 容器通过 Docker 镜像来创建。
>
> 容器与镜像的关系类似于面向对象编程中的对象与类。
>
> ![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/576507-docker1.png#id=MI0bN&originHeight=392&originWidth=517&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 公有仓库

### 私有仓库

## 镜像

Docker 镜像（**Image**），就相当于`DNA`，你可以使用一个镜像创造出一个跟之前一摸一样的程序来。
比如官方镜像 `ubuntu:16.04` 就包含了完整的一套 `Ubuntu16.04` 最小系统的 `root` 文件系统。

> [!WARNING]
>
> 自 2024-06-06 开始，国内的 Docker Hub 镜像加速器相继停止服务，可选择如下式
>
> - 为 Docker daemon 配置代理
>
> - 自建镜像加速服务
>
> - 更换、新增可用镜像源，具体可以参考：[国内 DockerHub 镜像加速器还有哪些可用？](https://www.wangdu.site/course/2109.html)
>
> 公告查看
>
> <https://web.archive.org/web/20240606081039/https://sjtug.org/post/mirror-news/2024-06-06-takedown-dockerhub/>

### 相关命令

#### 拉取镜像

想拉啥镜像直接去官方仓库找，直接搜就可以。

```shell
# 拉取最新版MySQL镜像
docker pull mysql

# 拉取8.0.31-oracle版的MySQL镜像
docker pull mysql:8.0.31-oracle
```

#### 查看镜像

```bash
# 搜索镜像，这个不太准，建议直接去官网找
# sudo docker search <REPOSITORY>:<TAG>
docker search mysql:5.7

# 查看本地镜像
docker images
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220113104725.png#id=RDOZ4&originHeight=199&originWidth=495&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- **REPOSITORY：**表示镜像所处的仓库源
- **TAG：**镜像的标签
- **IMAGE ID：**镜像ID
- **CREATED：**镜像创建时间
- **SIZE：**镜像大小

#### 更新镜像

```bash
# 更新镜像之前，我们需要先进入镜像实例，即容器
# 进入容器之后，更新
apt-get update

# 更新之后，提交该镜像
sudo docker commit -m="update" -a="" <容器名称/容器ID> <更新后容器名称>
# t
```

#### 删除镜像

用法：`docker rmi [OPTIONS] [IMAGES]`
> Usage: docker rmi [OPTIONS] IMAGE [IMAGE...]
>
> Remove one or more images

Options:

- -f, --force Force removal of the image

- --no-prune Do not delete untagged parents

```bash
# 确保没有容器正在使用该镜像
sudo docker rmi <IMAGE ID>

# 按照仓库+tag删除唯一镜像，当镜像id不唯一时可以试一下
docker rmi <REPOSITORY>[:TAG]

# 同时删除多个镜像
docker rmi imageID1 imageID2 imageID3 ....
```

#### 创建镜像

1、使用Dockerfile创建镜像
[https://docs.docker.com/engine/reference/commandline/build/](https://docs.docker.com/engine/reference/commandline/build/)

```shell
# 命令,注意最后一个 .
docker build -t host/dir/to-your-path:version .

# host 是你要将镜像推送的云端仓库地址，也可以是本地，比如localhost，hub.docker.com/
```

```bash
# 注意创建镜像需要容器，所以需要先运行一个容器
# sudo docker commit -m=<提交描述信息> -a=<作者> <CONTAINER ID> <镜像名>
sudo docker commit -m="new image" -a="mas" 348e529d63d2 mas/redis-1
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220113111748.png#id=rQpiW&originHeight=382&originWidth=1154&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 推送镜像

用法： `docker push <repository:port>[:tag]`

> Usage: docker push [OPTIONS] NAME[:TAG]
>
> Push an image or a repository to a registry

Options:

-a, --all-tags Push all tagged images in the repository

--disable-content-trust Skip image signing (default true)

-q, --quiet Suppress verbose output

```shell
# 向公有仓库推送镜像
docker push <imageID>[:tag]

# 向私有仓库推送镜像
# 登录,想要向私有镜像推送，必须要有私有仓库的权限
docker login <respositryUrl:port>

# 输入账号密码

# 推送，填写自己的私有仓库地址:port/具体放在那个目录下/。。。
docker push respositryUrl:port/uri/xx/xxx

```

#### 镜像标签

用法： `docker tag <oldRepository>[:oldTag]  <newRepository>[:newTag]`

> Usage
>
> `docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]`
>
> `docker tag <oldRepository>[:oldTag]  <newRepository>[:newTag]`

```shell
# 给镜像打标签,tag不写默认latest
docker tag image_id redis:0.0.1

# 对于镜像而言，tag 其实并没有重命名的操作，只不过是新加一个 tag。
docker tag redis:latest redis:0.0.1
```

### 添加镜像源

#### 编辑守护进程

```sh
# 
vim /etc/docker/daemon.json
```

#### 添加镜像源

```sh
# 添加镜像源
{
    "registry-mirrors": [
        # "https://mirror.aliyuncs.com",
        # 可以多加几个代理
        "https://dockerhub.icu"
    ]
}
```

#### 重启 Docker

```sh
# 重启
systemctl restart docker
```

### Docker daemon 配置代理

编辑`daemon.json`文件

```json
{
  "proxies": {
    "http-proxy": "http://proxy.example.com:3128",
    "https-proxy": "https://proxy.example.com:3129",
    "no-proxy": "*.test.example.com,.example.org,127.0.0.0/8"
  }
}
```

### 构建镜像

#### Dockerfile

[Dockerfile 官方文档](https://docs.docker.com/reference/dockerfile/)

简单来说，Dockerfile 就是一系列命令，这些命令的作用就是帮你打包。

简单示例

```sh
FROM python:3.8.0
RUN apt-get update

ENV TZ=Asia/Shanghai

# 打包应用
ENV APP_ROOT="/app/"
RUN mkdir -p $APP_ROOT
WORKDIR $APP_ROOT

COPY requirements.txt /app/
COPY /demo.py /app/

RUN pip install --no-cache-dir -r /app/requirements.txt -i https://mirror.baidu.com/pypi/simple

ENTRYPOINT cd $APP_ROOT && python demo.py
```

#### `Docker build`

```sh
# 先构建镜像
docker build .
# 在指定tag:version
docker tag imageId tag:version

# 指定tag:version
docker build -t tag:version .
```

### docker save && docker load

```sh
docker save -o demo.tar tag:version

# 使用gzip能将压缩包变小
docker save tag:version | gzip > demo.tar.gz

docker load 
```

## 容器

镜像（**Image**）和容器（**Container**）的关系，就像是Java中的类和对象一样，镜像是静态的定义，容器是镜像运行时的实体。
容器可以被创建、启动、停止、删除、暂停等。

### 相关命令

#### 创建容器

```bash
# 无端口映射的容器创建
# sudo docker run -itd --name <容器名称> <镜像名称>
sudo docker run -itd --name ubuntu-1 ubuntu 

# 有端口映射的容器创建
# sudo docker run --name <容器名称> -p <本机端口>:<容器端口> -d <镜像名称>
# -p 8080:80： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
sudo docker run --name nginx-1 -p 8080:80 -d nginx

# 有端口映射，有版本控制，有环境变量需要传递的容器创建
# sudo docker run --name mysql-2 -p 3307:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql 
sudo docker run --name mysql-5.7-1 -p 3309:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7.36
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220113114938.png#id=B7aIL&originHeight=294&originWidth=1308&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 删除容器

```shell
docker rm <容器ID>
```

#### 开关容器

```bash
# 查看所有容器的状态
sudo docker ps -a

# 开启容器
# sudo docker start <容器名称>/<容器id>
sudo docker start mysql-1

# 关闭容器
# sudo docker stop <容器名称>/<容器id>
sudo docker stop mysql-1

# 只会查看已运行中的容器
sudo docker container ls
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220113113212.png#id=iROMH&originHeight=305&originWidth=1255&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 进入容器

```bash
# exec ，使用这个命令在退出时不会对容器产生影响
# sudo docker exec -it <容器名称>/<容器id> <命令>
sudo docker exec -it mysql-1 /bin/bash

# attach,使用这个命令在退出容器时会顺便停止容器
# sudo docker attach <容器名称>/<容器id>
sudo docker attach 1e560fca3906
```

#### 导出容器

```bash
# 导出容器到指定目录
sudo docker export <容器名称/容器ID> > [指定目录../]<容器.tar>

sudo docker export mysql-5.7-1 > 下载/mysql-5.7.tar
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220118111753.png#id=FOAj1&originHeight=200&originWidth=450&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 参数解析

| 参数 | 意义 |
| --- | --- |
| -i | 可交互 |
| -t | 提供一个终端 |
| -d | 后台启动 |
| -p | 指定端口，本机端口:容器内程序端口 |
| -e | 传递环境变量，即参数 |
| --name | 指定容器名称 |
| -m | 限制容器内存 |
| -v | 指定卷位置，即指定文件挂载目录 |

## 配置

### 相关命令

### 登录登出

```shell
# 登录到一个镜像仓库
docker login <respositryUrl:port>

# 登陆后，加密的密码一般存放在 /root/.docker/config.json
```

#### 查看配置

```shell
# 查看docker的系统信息，包括安装的插件
docker info

# 查看docker登录的用户
docker info | grep Name
```

## Dockerfile

[Dockerfile](https://docs.docker.com/reference/dockerfile)，Dockerfile 是一个文本文档，包含用户可以在命令行上调用来组装映像的所有命令。

### From

`FROM [--platform=<platform>] <image> [AS <name>]`

or

`FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]`

or

`FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]`

## Docker其他常用命令

### 容器资源使用情况

```shell
# 查看容器资源使用情况
docker stats

# 限制容器内存使用

```

### Docker常用容器创建

docker实际使用中还会用到如下命令

```shell
# 查看端口是否被占用
netstat -nap | grep '3306'


lsof -i:端口号
```

> 说明
> -n：
>
> -a：
>
> -p：
>
> grep：通道服务，类似于筛选的作用

#### MySQL

```shell
# 默认拉取最新镜像
docker pull myqsl

# 拉取固定版本的镜像
docker pull mysql:5.7.38

# 最简单的创建模式，使用mysql：5.7.38版本创建一个MySQL容器
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7.38

# 指定MySQL的文件挂载目录
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -v

```

> 说明：
> -p：指定端口号，3306：3306，第一个端口号指的是本机端口号，第二个端口号指的是docker创建的容器内部的端口号
>
> -e：指定一个变量，在这里创建MySQL时需要指定root的密码，指定root密码的变量就是 `MYSQL_ROOT_PASSWORD`
>
> -v：指定卷位置，即指定文件挂载目录

#### Redis

```shell
#
```

#### Nginx

```bash
# -p 8080:80： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
sudo docker run --name nginx-1 -p 8080:80 -d nginx
```

#### Minio

拉取镜像

```shell
# 拉取镜像
docker pull minio/minio

# 启动
docker run -p 9000:9000 -p 9090:9090 --name minio -d -e "MINIO_ACCESS_KEY=minioadmin" -e "MINIO_SECRET_KEY=minioadmin" -v /data/minio/data:/data -v /data/minio/config:/root/.minio minio/minio server /data --console-address ":9090" -address ":9000"
```

## 问题

### 权限相关

#### Ⅰ Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

```bash
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220111171803.png#id=wALKL&originHeight=240&originWidth=788&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

首先，这个问题说的是docker的守护进程没有运行中。

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220118110703.png#id=Pn7gN&originHeight=422&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

那么我们首先需要考虑 `docker是否启动`

```bash
# 查看docker运行状态
sudo systemctl docker status
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220111172059.png#id=oN47j&originHeight=113&originWidth=744&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

我们可以看到，此时docker是 `inactive(dead)`状态，即没有启动。

所以我们需要启动docker。

```bash
# 启动docker服务
sudo systemctl start docker
# 再次查看docker运行状态
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220111172338.png#id=m0Q4J&originHeight=224&originWidth=861&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

此时，在运行就没问题了。

---

#### Ⅱ IPv4 forwarding is disabled. Networking will not work

```bash
IPv4 forwarding is disabled. Networking will not work.
```

在新建一个容器后，弹出了这个警告，大概就是IPv4被禁用了，网络不能使用。

我们需要在Linux中如下设置。

```bash
# 编辑 /etc/sysctl.conf文件
sudo vim /etc/sysctl.conf
# 添加如下 代码
net.ipv4.ip_forward=1
# 重启服务
systemctl restart network
systemctl restart docker

# 查看值是否设置成功 出现 net.ipv4.ip_forward = 1  则代表成功
sysctl net.ipv4.ip_forward

# 删除镜像，重新构建即可
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220118110447.png#id=CRPw2&originHeight=550&originWidth=1319&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

---
