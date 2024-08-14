---
icon: pen-to-square
# star: true
title: Spring AOP
order: 32
category:
  - spring
  - 源码分析
tag:
  - aop
---

## 简介

AOP，aspect oriented programing，面向切面编程.

### `@Aspect`

`@Aspect`可以用来声明一个切面类，需要配合`@Component`使用。

```java
@Slf4j
@Aspect
@Component
public class DemoLoggerAspect {

    // ...

}
```

### Join point

一个连接点，

### `@Pointcut`

`@Pointcut`声明一组切面（织入点）。

```java
@Pointcut("@annotation(com.marshio.demo.annotation.DemoAnnotation)")
public void logAdvice() {

    // 切面方法应该为空

}
```

### Advice

切面会采取的行为就是 Advice,一共有5种 Advice，如下：

- `@Before`: 在执行切面前
- `@AfterReturning`: 在切入点方法正常执行完成后
- `@AfterThrowing`: 在切入点方法抛出异常
- `@After`: 退出切入点方法（正常或抛出异常）
- `@Around`: `Advice that surrounds a join point such as a method invocation. This is the most powerful kind of advice. Around advice can perform custom behavior before and after the method invocation. It is also responsible for choosing whether to proceed to the join point or to shortcut the advised method execution by returning its own return value or throwing an exception.`

## 常用场景

- 日志记录
- 多租户
- 数据统计

## Demo

<https://github.com/imarshio/springboot-demo/tree/main/demo-spring-framework/demo-aop>

## 参考

[spring-framework-aop](https://docs.spring.io/spring-framework/docs/3.0.x/reference/aop.html)
