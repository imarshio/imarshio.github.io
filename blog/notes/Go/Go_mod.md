---
title: Go mod
icon: fa-brands fa-golang
order: 2
category:
  - go
tag:
  - base
---

Currently, the version of Go is 1.22

## Go mod 命令

### Go mod 文件组成

```mod
// go.mod 文件是 go 用于依赖管理的文件
// 可以通过 go mod init 来创建该文件

// 模块名称
module go-demo

// go sdk version
go 1.22

// 第三方依赖
require (
	// dependency latest
)

// 排除以来继承里不需要的依赖
exclude (
	// dependency latest
)

// 修改依赖包的路径
// 依赖包发生迁移
// 原始包无法使用
// 使用本地包

// 即当依赖包不可用时，可以使用 replace 替换依赖包
replace (
	// source latest => target latest
)

// 撤回
// 如，当前项目作为其他项目的依赖，如果当前版本出现问题，则回退到指定的版本
retract (
)
```

### 创建一个项目

```shell
# 初始化模块（项目）
go mod init

# 初始化指定模块（项目）名称
go mod init demo
```

### 下载依赖

```shell

go mod download

go mod download github.com/gin-gonic/gin@v1.10.0

# 这里下载不会有任何提示，说明下载成功，有提示则不成功
# 下载位置在 GOPATH/pkg/mod/
# 只是下载指定的包，不会下载指定包依赖的包
```

### Go mod tidy

remove unused dependencies and add missing dependencies.

可以理解为对 go.mod 文件进行格式化整理

```shell
go mod tidy
```
