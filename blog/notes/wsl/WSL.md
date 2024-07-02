---
icon: pen-to-square
category:
  - wsl
title: WSL2 使用
tag:
  - ubuntu

---

关于如何在Windows上安装WSL可以参考[安装](./README.md)，关于WSL 的概念，你可以把它理解为一个docker，其中的Linux发行版就是一个一个的镜像，下载下来运行后就是一个一个的容器。

wsl 再退出控制台后，控制台所对应的发行版一样也会退出，但是会有一定的延迟。

## 常用命令

### 查看

查看已经下载的Linux发行版,带*的是默认的

```cmd
C:\Users\demo>wsl -l -v
  NAME                  STATE           VERSION
* openSUSE-Leap-15.6    Stopped         2
  Ubuntu-22.04          Running         2

```

### 启动某个发行版

Docker 视角：启动一个已经暂停的容器

```cmd
wsl -d <name>

wsl -d Ubuntu-22.04
```

### 升级 WSL

```cmd
wsl --update
```

很多情况下，当你遇到跟wsl相关的问题后，你可以先尝试将wsl更新下。

比如我遇到一个问题，在安装完 Ubuntu 发行版后，我尝试运行了一下 `systemctl` （自 WSL2 后，这个命令是默认支持的），但是我得到了 `wsl ubuntu System has not been booted with systemd as init system (PID 1). Can't operate.`，因为我确认我的发行版的 `VERSION` 是2，然后我查看了一下 `wsl` 的配置文件 `/etc/wsl.conf`，确认了这个服务已经配置好了，如下。

```sh
[boot]
systemd=true
```

在我重启了一下没有啥效果后，我就更新了一下`WSL`，又重启了一下，问题就解决了。

### 下载发行版

```cmd
wsl 
```

## 配置

WSL 有 2 个重要的配置文件 `.wslconfig` 和 `wsl.conf`，其中 `.wslconfig` 位于 `Windows` 系统上，`wsl.conf` 位于 Linux 发行版系统上。

详情可参考[wsl-config](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config)。

### `.wslconfig`

默认情况下，`.wslconfig`不存在。如果要想生效，必须建立在 `C:\Users\<UserName>\.wslconfig`。

```sh
# Settings apply across all Linux distros running on WSL 2
[wsl2]

# Limits VM memory to use no more than 4 GB, this can be set as whole numbers using GB or MB
memory=4GB 

# Sets the VM to use two virtual processors
processors=2

# Specify a custom Linux kernel to use with your installed distros. The default kernel used can be found at https://github.com/microsoft/WSL2-Linux-Kernel
kernel=C:\\temp\\myCustomKernel

# Sets additional kernel parameters, in this case enabling older Linux base images such as Centos 6
kernelCommandLine = vsyscall=emulate

# Sets amount of swap storage space to 8GB, default is 25% of available RAM
swap=8GB

# Sets swapfile path location, default is %USERPROFILE%\AppData\Local\Temp\swap.vhdx
swapfile=C:\\temp\\wsl-swap.vhdx

# Disable page reporting so WSL retains all allocated memory claimed from Windows and releases none back when free
pageReporting=false

# Turn on default connection to bind WSL 2 localhost to Windows localhost. Setting is ignored when networkingMode=mirrored
localhostforwarding=true

# Disables nested virtualization
nestedVirtualization=false

# Turns on output console showing contents of dmesg when opening a WSL 2 distro for debugging
debugConsole=true

# Enable experimental features
[experimental]
sparseVhd=true
```

### `wsl.conf`

默认位置：`/etc/wsl.conf`
