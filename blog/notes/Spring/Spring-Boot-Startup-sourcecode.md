---
icon: pen-to-square
star: true
title: Spring Boot Startup Sourcecode
order: 34
category:
  - Logging Framework
  - 源码分析
  - spring
tag:
  - spring
headerDepth: 4
---

## 下载 spring 源码

可以像我一样直接fork一下spring的代码仓库，比如[spring-framework](https://github.com/imarshio/spring-framework)，这是`7.0.0-SNAPSHOT`版本的`spring-framwork`。

注意，spring在`3.2.0.BUILD-SNAPSHOT`这个版本开始切换成了 `gradle`，所以你还需要掌握一定的 `gradle` 基础，入门即可。

```sh
git clone https://github.com/imarshio/spring-framework.git
```

## 配置 gradle

- gradle-wrapper.properties

```properties
<!-- 这样可以使用国内镜像源加快下载速度 -->
distributionUrl=https://mirrors.aliyun.com/macports/distfiles/gradle/gradle-8.10-bin.zip
```

新建一个 module, 引入相应的依赖。

```gradle
dependencies {
    <!-- 这里我引入了 spring-context -->
    implementation project(':spring-context')
    testImplementation platform('org.junit:junit-bom:5.10.0')
    testImplementation 'org.junit.jupiter:junit-jupiter'
}
```

## Springboot 启动源码解读

```java

package org.springframework.demo;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.demo.controller.HelloWorldController;

@ComponentScan(value = "org.springframework.demo")
public class DemoBoot {

 public static void main(String[] args) {
  // 这里我们默认使用 AnnotationConfigApplicationContext 类，因为 springboot 最终引用的就是这个类
  // 我们首先要知道，类加载的机制是双亲委派机制，即在加载 AnnotationConfigApplicationContext 类之前会先加载其父类，
  // 也就是 GenericApplicationContext，同样的 AbstractApplicationContext，在向上 DefaultResourceLoader
  // 加载顺序如下
  // DefaultResourceLoader -> AbstractApplicationContext -> GenericApplicationContext -> AnnotationConfigApplicationContext
  // 这过程中只是涉及到了类加载，不涉及到类初始化的，即类中的静态变量、静态函数、静态代码块、
  AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(DemoBoot.class);

  // 获取 bean
  HelloWorldController helloWorld = context.getBean(HelloWorldController.class);
  System.out.println(helloWorld.sayHello());
 }
}
```

这里我们默认使用 AnnotationConfigApplicationContext 类，因为 springboot 最终引用的就是这个类我们首先要知道，类加载的机制是双亲委派机制，即在加载 AnnotationConfigApplicationContext 类之前会先加载其父类， 也就是 GenericApplicationContext，同样的向上 AbstractApplicationContext，在向上 DefaultResourceLoader。

所以加载顺序如下 DefaultResourceLoader -> AbstractApplicationContext -> GenericApplicationContext -> AnnotationConfigApplicationContext， 这过程中只是涉及到了类加载到内存中，不涉及到类的初始化（即调用构造函数），但是类中的静态变量、静态函数、静态代码块都会被执行，但是 final 声明的参数不会被初始化。
