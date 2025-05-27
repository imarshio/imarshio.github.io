---
title: Java 中的类加载机制
icon: pen-to-square
order: 5
category:
  - java
tag:
  - base
---

简单来说，类加载就是Java将 `.class` 文件加载到程序内存中，随时准备被调用，其中所做的一些列动作就是类加载，包括**加载**、**连接**、**初始化**三个步骤，其中连接又分为**验证**、**准备**、**解析**三步。。

## 加载（Loading）

这是类加载的第一步，其作用是通过类的全限定名来获取定义该类的二进制字节流（编译好的 .class 文件），然后将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构，最后在内存中生成一个代表这个类的 `java.lang.Class` 对象，作为**方法区**这个类的各种数据的访问入口。

加载阶段的字节码来源非常广泛，常见的有从本地文件系统中加载 `.class` 文件，从 `JAR`、`ZIP` 等归档文件中加载类，通过网络加载类，甚至在运行时动态生成类（如使用 Java 动态代理技术）。

## 连接（Linking）

此阶段又可细分为验证、准备和解析三个步骤：

- 验证（Verification）：目的是确保被加载类的字节码文件符合 Java 虚拟机规范，不会危害虚拟机自身的安全。验证内容涵盖文件格式验证、元数据验证、字节码验证和符号引用验证等多个方面。例如，文件格式验证会检查字节码文件的魔数、版本号等是否符合规范；元数据验证会检查类的继承关系、方法签名等是否合法。

- 准备（Preparation）：为类的静态变量分配内存，并将其初始化为默认值。这里的默认值是指数据类型的零值，例如 int 类型的默认值是 0，boolean 类型的默认值是 false。需要注意的是，对于 final 修饰的静态常量，在准备阶段会直接赋予指定的值。

- 解析（Resolution）：虚拟机将常量池内的符号引用替换为直接引用。符号引用是用一组符号来描述所引用的目标，它与虚拟机的内存布局无关；而直接引用则是直接指向目标的指针、相对偏移量或能间接定位到目标的句柄，和虚拟机的内存布局相关。解析动作主要针对类或接口、字段、类方法、接口方法、方法类型等符号引用进行。

## 初始化（Initialization）

这是类加载的最后一步，在这个阶段，Java 虚拟机才真正开始执行类中定义的 Java 程序代码。初始化阶段是执行类构造器 `<clinit>()` 方法的过程。`<clinit>()` 方法是由编译器自动收集类中的所有类变量的赋值动作和静态语句块（`static{}`块）中的语句合并产生的。

类初始化的触发时机遵循以下规则：

- 遇到 `new`、`getstatic`、`putstatic` 或 `invokestatic` 这四条字节码指令时，如果类没有进行过初始化，则需要先触发其初始化。常见的场景有使用 `new` 关键字实例化对象、读取或设置一个类的静态字段（被 `final` 修饰、已在编译期把结果放入常量池的静态字段除外）、调用一个类的静态方法。
- 使用 `java.lang.reflect` 包的方法对类进行反射调用时，如果类没有进行过初始化，则需要先触发其初始化。
- 当初始化一个类的时候，如果发现其父类还没有进行过初始化，则需要先触发其父类的初始化。
- 当虚拟机启动时，用户需要指定一个要执行的主类（包含 `main()` 方法的那个类），虚拟机会先初始化这个主类。

## Java 编译

在编写完`.java`文件后，想要让这个文件 Run Anywhere，就必须先编译，Java中javac就是Java的编译器。

比如我有一个.java 文件

```java
package com.marshio.demo.javacdemo;

/**
 * @author ms
 * @desc ...
 * @date 2025/4/11 16:29
 */
public class JavacDemo {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }

}

```

然后打开控制台，输入`javac JavacDemo.java`，你会得到一个`.class`文件，其内容就是

```class
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.marshio.demo.javacdemo;

public class JavacDemo {
    public JavacDemo() {
    }

    public static void main(String[] var0) {
        System.out.println("Hello World!");
    }
}
```

以上就是编译的过程，至于其具体的过程

然后通过 `jar cvf javac-demo.jar JavacDemo.class`可以生成一个可执行的jar文件

## 工具

<https://sourceforge.net/projects/xxd-for-windows/>

使用`xxd xxx.class`可以查看字节码的十六进制内容，

也可以在idea上下载一个插件，比如

- Binary/Hex Editor，右键.class文件，open in，Binary/Hex Editor，推荐

- ASM Bytecode Viewer，右键.java文件，找到最下面ASM Bytecode Viewer，推荐
- jclasslib，view->show bytecode with jclasslib

### xxd

```sh
00000000: cafe babe 0000 0041 001d 0a00 0200 0307  .......A........
00000010: 0004 0c00 0500 0601 0010 6a61 7661 2f6c  ..........java/l
00000020: 616e 672f 4f62 6a65 6374 0100 063c 696e  ang/Object...<in
00000030: 6974 3e01 0003 2829 5609 0008 0009 0700  it>...()V.......
00000040: 0a0c 000b 000c 0100 106a 6176 612f 6c61  .........java/la
00000050: 6e67 2f53 7973 7465 6d01 0003 6f75 7401  ng/System...out.
00000060: 0015 4c6a 6176 612f 696f 2f50 7269 6e74  ..Ljava/io/Print
00000070: 5374 7265 616d 3b08 000e 0100 0c48 656c  Stream;......Hel
00000080: 6c6f 2057 6f72 6c64 210a 0010 0011 0700  lo World!.......
00000090: 120c 0013 0014 0100 136a 6176 612f 696f  .........java/io
000000a0: 2f50 7269 6e74 5374 7265 616d 0100 0770  /PrintStream...p
000000b0: 7269 6e74 6c6e 0100 1528 4c6a 6176 612f  rintln...(Ljava/
000000c0: 6c61 6e67 2f53 7472 696e 673b 2956 0700  lang/String;)V..
000000d0: 1601 0024 636f 6d2f 6d61 7273 6869 6f2f  ...$com/marshio/
000000e0: 6465 6d6f 2f6a 6176 6163 6465 6d6f 2f4a  demo/javacdemo/J
000000f0: 6176 6163 4465 6d6f 0100 0443 6f64 6501  avacDemo...Code.
00000100: 000f 4c69 6e65 4e75 6d62 6572 5461 626c  ..LineNumberTabl
00000110: 6501 0004 6d61 696e 0100 1628 5b4c 6a61  e...main...([Lja
00000120: 7661 2f6c 616e 672f 5374 7269 6e67 3b29  va/lang/String;)
00000130: 5601 000a 536f 7572 6365 4669 6c65 0100  V...SourceFile..
00000140: 0e4a 6176 6163 4465 6d6f 2e6a 6176 6100  .JavacDemo.java.
00000150: 2100 1500 0200 0000 0000 0200 0100 0500  !...............
00000160: 0600 0100 1700 0000 1d00 0100 0100 0000  ................
00000170: 052a b700 01b1 0000 0001 0018 0000 0006  .*..............
00000180: 0001 0000 0008 0009 0019 001a 0001 0017  ................
00000190: 0000 0025 0002 0001 0000 0009 b200 0712  ...%............
000001a0: 0db6 000f b100 0000 0100 1800 0000 0a00  ................
000001b0: 0200 0000 0a00 0800 0b00 0100 1b00 0000  ................
000001c0: 0200 1c                                  ...
```

### ASM Bytecode Viewer

```sh
// class version 52.0 (52)
// access flags 0x21
public class com/marshio/demo/javacdemo/JavacDemo {

  // compiled from: JavacDemo.java

  // access flags 0x1
  public <init>()V
   L0
    LINENUMBER 8 L0
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
    RETURN
   L1
    LOCALVARIABLE this Lcom/marshio/demo/javacdemo/JavacDemo; L0 L1 0
    MAXSTACK = 1
    MAXLOCALS = 1

  // access flags 0x9
  public static main([Ljava/lang/String;)V
   L0
    LINENUMBER 10 L0
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    LDC "Hello World!"
    INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
   L1
    LINENUMBER 11 L1
    RETURN
   L2
    LOCALVARIABLE args [Ljava/lang/String; L0 L2 0
    MAXSTACK = 2
    MAXLOCALS = 1
}

```

## Loading（加载）

将.class文件加载到内存中，并生成对应的类对象，对于类加载这个大动作来说，将.class文件加载到内存只是第一步。

首先将.class文件以字节流的形式加载到内存中，这一步说起来简单，实际上想要实现的话，是要先根据类的全限定名获取类的二进制字节流（InputStream），然后是将这个二进制字节流转成JVM里的一部分，即运行时数据区的一部分数据，具体存放位置是方法区。

按理来说，下一步是要生成类对象的，生成类对象这个动作，是由classloader来完成的，可以是自定义的classloader，也可以是引导类加载器

### 类加载器

## Lingking（链接）

## Initialization

## 纯Java程序打包

```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>8</source>
                    <target>8</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.2.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>com.marshio.demo.launch.CustomLauncher</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
```
