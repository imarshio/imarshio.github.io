---
title: Go Base
icon: fa-brands fa-golang
order: 6
category:
  - go
tag:
  - base
---

Currently, the version of Go is 1.22

## Go 数据类型

[Go Type](https://golang.org/ref/spec#Types)

### 基础类型

Go语言中，基础类型有如下这些

```textmate
<!--  布尔 -->
bool
<!--  字符-->
string

<!--  有符号整数-->
int  int8  int16  int32  int64

<!--  无符号整数-->
uint uint8 uint16 uint32 uint64 uintptr

<!--  字节-->
byte // alias for uint8

<!--  -->
rune // alias for int32
     // represents a Unicode code point

<!--  浮点型-->
float32 float64

<!--  -->
complex64 complex128
```

### 复杂类型

```textmate
指针
Pointer

数组

结构体
struct

管道
channel

函数

切片
slice

接口
interface

map
```

### int 类型

| 类型    | 含义                                                                                                                          |
|-------|-----------------------------------------------------------------------------------------------------------------------------|
| int   | 这是一个平台相关的整数类型，它的大小依赖于目标架构。在32位系统上，int通常等于int32；在64位系统上，则通常等于int64。它提供了对机器字长的良好默认选择，适用于大多数整数运算需求。                            |
| int8  | 这是一个8位有符号整数，范围是从-128到127。当你确切知道变量的值会在这个范围内，并且想要节省空间时，可以使用它。                                                                 |
| int16 | 这是一个16位有符号整数，范围是从-32,768到32,767。适合存储比int8更大一些的整数值。                                                                          |
| int32 | 这是一个32位有符号整数，范围是从-2^31到2^31-1（即-2,147,483,648到2,147,483,647）。当需要更大的整数范围，但又不需要64位的大小时，可以使用它。                                 |
| int64 | 这是一个64位有符号整数，范围是从-2^63到2^63-1（即-9,223,372,036,854,775,808到9,223,372,036,854,775,807）。它提供了极大的整数范围，适用于需要大量精度的场景，比如时间戳或者大规模计数。 |

## Go 变量

Go 变量声明遵循如下公式：

`var name type = value`

Go 同样支持如下声明方式，Go会在编译时自动推导变量类型

`name := value`

至于为什么Go 在变量声明的时候将类型放在名称后面，请看[Go's Declaration Syntax](https://go.dev/blog/declaration-syntax).

```go
package main

import "fmt"

// 全局变量声明
var num1 = 10
var name = "demo"

func main() {

	var num2 int = 10
	a := 10
	fmt.Println(a)
	fmt.Println(num1 + 1)
	fmt.Println(name)
}

```

## Go 函数

### main function

```go
package main

// 主函数声明，一个 module 只能有一个 main function
func main() {
}

```

### 一般函数声明

```go
package main

import "fmt"

func main() {
	VoidMethod()
	NoReturnMethod(1, 2)
	fmt.Println(Sum(1, 2))
	fmt.Println(Reverse(1, 2))
}

func VoidMethod() {
	fmt.Println("this is a void method with no variables and no return value")
}

func NoReturnMethod(a, b int) {
	fmt.Println("this is a method with two variables and no return value")
}

func Sum(a, b int) int {
	fmt.Println("this is a method with two variables and one return value")
	return a + b
}

func Reverse(a, b int) (c, d int) {
	fmt.Println("this is a method with two variables and two return values")
	println("this is a method with two variables and two return values")
	return b, a
}


```

- func 关键字
- VoidMethod 函数名
- (a, b int) 参数列表、参数名称、参数类型
- int （第二个int）返回值类型

> [!Note]
> 在 Go 中，函数的命名跟Java略有不同，Java中函数名开头字母一般都是小写，Go中函数名开头字母一般都是大写（除main函数外）。

## Go 泛型

Go语言在1.18版本中增加了泛型功能。

限制

- 匿名结构体和匿名函数不支持泛型
- 不支持类型断言
- 支持泛型方法，只能通过recover来实现方法的泛型处理
- ～后的类型必须为基本类型，不能为接口类型

## Go 指针

声明一个指针的方式如下：

`var num1 = &num`

## Go 结构体
