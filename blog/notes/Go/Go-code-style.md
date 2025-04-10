---
title: Go Code Style
icon: fa-brands fa-golang
order: 5
category:
  - go
tag:
  - base
---

Currently, the version of Go is 1.22

## Go 开发规范

[Go Code Style](https://gocn.github.io/styleguide/)

以下是我个人精简后的规范

### package命名

package 名称应该与文件名一致（虽然 go 可以使 package 名与文件名不一致，但是不建议这样做），并且以小写字母开头。

使用下划线命名法(Underscore Naming Convention)， 在多个单词之间使用下划线作为分隔符，每个单词全部小写。

只有包名为`main`时，才可以通过`go run`命令直接运行。

### 变量命名

#### 全局变量

#### 局部变量

### 变量声明

- 没用的包不要import，在Go中，没用的（unused）变量会爆红
- 没用的变量不要声明，在Go中，没用的（unused）变量会爆红

### 函数命名

驼峰命名法(Camel Case Naming Convention)，在多个单词之间使用驼峰命名法，每个单词的首字母大写（包括开头首字母），其余字母小写。
