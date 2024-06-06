---
title: Go Install and Config
icon: fa-brands fa-golang
order: 1
category:
  - go
tag:
  - base
---


[官网](https://go.dev/)

[CN官网](https://golang.google.cn/)

## 下载与安装

SDK：(Software Development Kit，软件开发工具包)。

下载地址：[Install Go](https://go.dev/doc/install)

> [!Note]
> 注：最新版的Go下载已经不需要手动配置环境变量了，前提是你使用的是安装包安装。
>
> 如果是解压缩的安装包，还是需要手动配置环境变量。

### Windows

推荐：下载 msi 安装包，这能省去我们配置环境变量的步骤，且不会出错。

下载完成后，打开 cmd 窗口，输入如下指令

```sh
C:\Users\demo>go version
go version go1.22.3 windows/amd64
# 出现如上说明已经配置好Go的环境，
```

### Mac

直接下载安装包安装即可。

## Go env 命令

[GOPATH](https://pkg.go.dev/cmd/go#hdr-GOPATH_and_Modules)

```shell
go env

[demo.DESKTOP-xxxxxxV] ➤ go env
set GO111MODULE=
set GOARCH=amd64
set GOBIN=
set GOCACHE=C:\Users\shenqing\AppData\Local\go-build
set GOENV=C:\Users\shenqing\AppData\Roaming\go\env
set GOEXE=.exe
set GOEXPERIMENT=
set GOFLAGS=
set GOHOSTARCH=amd64
set GOHOSTOS=windows
set GOINSECURE=
set GOMODCACHE=C:\Users\shenqing\go\pkg\mod
set GONOPROXY=
set GONOSUMDB=
set GOOS=windows
set GOPATH=C:\Users\shenqing\go
set GOPRIVATE=
set GOPROXY=https://proxy.golang.org,direct
set GOROOT=C:\Env\Go
set GOSUMDB=sum.golang.org
set GOTMPDIR=
set GOTOOLCHAIN=auto
set GOTOOLDIR=C:\Env\Go\pkg\tool\windows_amd64
set GOVCS=
set GOVERSION=go1.22.3
set GCCGO=gccgo
set GOAMD64=v1
set AR=ar
set CC=gcc
set CXX=g++
set CGO_ENABLED=0
set GOMOD=NUL
set GOWORK=
set CGO_CFLAGS=-O2 -g
set CGO_CPPFLAGS=
set CGO_CXXFLAGS=-O2 -g
set CGO_FFLAGS=-O2 -g
set CGO_LDFLAGS=-O2 -g
set PKG_CONFIG=pkg-config
set GOGCCFLAGS=-m64 -fno-caret-diagnostics -Qunused-arguments -Wl,--no-gc-sections -fmessage-length=0 -ffile-prefix-map=C:\Users\shenqing\AppData\Roaming\MobaXterm\slash\mx86_64b\tmp\go-build4034802447=/tmp/go-build -gno-record-gcc-switches

```

### 切换国内代理

```shell
# 查看默认的代理配置
go env GOPROXY

# https://proxy.golang.org,direct

# 设置代理
go env -w GOPROXY=https://goproxy.cn,direct

# 查看代理配置
go env GOPROXY

# https://goproxy.cn,direct
```

### goproxy

[goproxy](https://goproxy.cn/)

下面是 goproxy 官网提供的一个（zhuang bility）炫酷的演示案例。

```go
package main

import (
	"net/http"
	"os"

	"github.com/goproxy/goproxy"
	// 	require "github.com/goproxy/goproxy@v1.6.9"
)

func main() {
	http.ListenAndServe("localhost:8080", &goproxy.Goproxy{
		GoBinEnv: append(
			os.Environ(),
			"GOPROXY=https://goproxy.cn,direct", // 使用 Goproxy.cn 作为上游代理
			"GOPRIVATE=git.example.com",         // 解决私有模块的拉取问题（比如可以配置成公司内部的代码源）
		),
		ProxiedSUMDBs: []string{
			"sum.golang.org https://goproxy.cn/sumdb/sum.golang.org", // 代理默认的校验和数据库
		},
	})
}
```
