---
icon: fa-solid fa-face-smile-wink
category:
  - interview
title: Interview on Spring
---

## 1.Spring

### Spring boot与Spring MVC的区别

参考：<https://zhuanlan.zhihu.com/p/63117304>

#### 什么是 `Spring` ？

要知道它们之间的区别我们需要先了解什么是 `Spring` 。

`Spring` 是一个开源容器**框架**，支持web层，业务层，持久层，Dao层的组件，可以配置bean，能管理bean与bean之间的关系。核心为**控制反转IOC**和**面向切面编程AOP**。

在这里我们需要了解两个知识点：对，就是你陌生的IOC和AOP。（参考：<https://zhuanlan.zhihu.com/p/144241957）>

首先，`IOC` 是 `Inversion of control` 的简写（shorthand），翻译过来就是控制反转，它是一种思想，不是一种技术，他描述的是Java开发领域对象的创建以及管理的问题

例，类A依赖于类B，

**传统思想**：我们需要在类A中new一个类B，我们才能实现类A。

**IoC思想**：不使用new创建对象，而是将实例化之后的类B放入容器中，在我们需要调用时再去从容器中调用。

这样很明显的能看出来，大大降低了对象之间的耦合度。

有了 `IoC` 之后，资源管理变得就相对简单。

**为什么叫控制反转？**

**控制**：创建对象的权力

**反转**：控制权交给外部环境（`IoC，spring`）

这里提一句DI，`DI` 是 `Dependency Injection` 的简写，是 `IoC` 的最合理实现方式。

其次，`AOP` 是 `Aspect oriented programming` 的简写，翻译过来就是面向切面的编程，是面向对象编程（`OOP,Object Oriented Programming`）的一种延申

OOP的核心就是封装，继承，多态

OOP可以解决大多数代码重用的问题，比如pig，dog，cat可以提取一个animal的父类来减少代码的重复，但是她不能解决单一类的代码重用问题，比如animal父类中有两个方法run（）和eat（），这两个方法中的代码有大量重复时，OOP不能解决此时的代码重用问题。而这些重用的代码被称为横切逻辑代码。

![image-20210402153710185](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701224749.png)
<!--more-->

这些横切逻辑代码存在的问题：

- 代码重复
- 混在其他代码（业务代码）之中，不便维护。

##### AOP如何解决横切逻辑代码的问题？

将代码分为业务模块，逻辑模块两个模块。

这样在我们写代码时，只需要调用重复的代码即可，不需要重复写这些代码了。

##### 为什么叫面对切面编程？

**切** ：指的是横切逻辑，原有业务逻辑代码不动，只能操作横切逻辑代码，所以面向横切逻辑

**面** ：横切逻辑代码往往要影响的是很多个方法，每个方法如同一个点，多个点构成一个面。这里有一个面的概念。

至此我们了解了spring的实现。

#### 2）什么是springMVC？

spring mvc属于springframwork的后续产品。

springMVC是一种web层MVC框架，用于代替老一套servlet（处理|响应请求，获取表单参数，表单验证等）。

SpringMVC是一个MVC的开源框架，SpringMVC=structs2+spring。

#### 3）什么是spring boot？

spring boot是一个微服务框架，延续了spring的核心IoC和AOP，简化了应用的开发和部署。

因为spring配置需要配置大量的ｘｍｌ文件，所以开发人员根据使用习惯将这些ｘｍｌ文件进行自动配置。

##### spring boot的特性

- 快速创建web应用。
- 嵌入tomcat，
- 提供大量的懒人工具starter
- 自动配置

==所以springMVC和spring boot的区别就是spring boot实现了自动配置，降低了项目搭建的复杂度。==

==Spring MVC 是基于Spring的一个 MVC 框架 ；==

==Spring Boot 是基于Spring4的条件注册的一套快速开发整合包。==

### *spring boot的核心与实现

上面说到，spring boot的核心就是自动配置，那么spring boot是如何实现自动配置的呢？

简单来说，==main方法中的springbootApplication注解调用EnableAutoConfigation，EnableAutoConfigation注解调用AutoConfigationImportSelector注解,这个注解可以完成对需要自动配置的方法进行自动配置。==

因为spring boot只需要一个main即可启动，得益于他的SpringBootApplication注解，

```java
package com.esprots;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//这里只需要一个注解即可启动服务，所以核心注解之一必是SpringBootApplication
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

下一步，我们查看SpringBootApplication，这里一共有如下几个注释

```java
package org.springframework.boot.autoconfigure;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration//这个是对spring boot进行配置
@EnableAutoConfiguration//这个是启动自动配置
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
  @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
```

从这里我们可以看出，这是一个自动配置的接口，我们沿着autoconfigurtion，在这里我么可以将SpringBootApplication看作是Configuration，EnableAutoConfiguration，ComponentScan的集合。

分别来看一下各个注解的作用

- EnableAutoConfiguration：启用spring boot的自动配置，这个是实现自动配置的关键注解
- Configuration：允许用户进行自行配置，即允许我们修改自动配置的值
- ComponentScan：扫描被`@Component` (`@Service`,`@Controller`)注解的 bean，注解默认会扫描启动类所在的包下所有的类 ，可以自定义不扫描某些 bean。

下一步，我们查看EnableAutoConfiguration，这里一共有如下几个注释

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage//自动配置包
@Import(AutoConfigurationImportSelector.class)
```

@AutoConfigurationPackage：自动配置包，完成了如下功能

```java
@Import(AutoConfigurationPackages.Registrar.class)
public @interface AutoConfigurationPackage 
```

我们都知道import是导入包使用的，所以这里的注释意思即是导入自动配置包下的class

`EnableAutoConfiguration` 只是一个简单地注解，自动装配核心功能的实现实际是通过 `AutoConfigurationImportSelector`类。

我们现在重点分析下`AutoConfigurationImportSelector` 类到底做了什么？

`AutoConfigurationImportSelector` 的源码

```java
 private static final AutoConfigurationEntry EMPTY_ENTRY = new AutoConfigurationEntry();

 private static final String[] NO_IMPORTS = {};

 private static final Log logger = LogFactory.getLog(AutoConfigurationImportSelector.class);

 private static final String PROPERTY_NAME_AUTOCONFIGURE_EXCLUDE = "spring.autoconfigure.exclude";

 private ConfigurableListableBeanFactory beanFactory;

 private Environment environment;

 private ClassLoader beanClassLoader;

 private ResourceLoader resourceLoader;

 private ConfigurationClassFilter configurationClassFilter;

 public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {

}

 @Override
 public String[] selectImports(AnnotationMetadata annotationMetadata) {
  if (!isEnabled(annotationMetadata)) {
            //判断是否启用自动配置
   return NO_IMPORTS;
  }
        //获取所需装配的bean
  AutoConfigurationEntry autoConfigurationEntry = getAutoConfigurationEntry(annotationMetadata);
  return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
 }
```

我们可以看到，在这个类中没有新的注解，并且它定义了很多变量，而这些变量没有被new关键字实例化，再根据IoC的原理，我们可以猜想一下，这些实例应该是放在IoC容器中。

再根据她下面这些方法，autoConfigurationEntry.getConfigurations()

## 2.设计模式

### 什么是设计模式？

==设计模式是一套被反复使用的，多人只晓的，经过分类的代码设计经验总结。==

设计模式有三大类：创建型，结构型，行为型

**创建型**：工厂模式，抽象工厂模式，单例模式，建造者模式，原型模式

**结构型**：适配器模式，过滤器模式，装饰模式，享元模式，代理模式，外观模式，组合模式，桥接模式

**行为型**：责任链模式，命令模式，中介者模式，观察者模式，状态模式，策略模式，模板模式，空对象模式，备忘录模式，迭代器模式，解释器模式，访问者模式

### 常见的设计模式有哪些？

![preview](https://pic4.zhimg.com/v2-bebb6883701f140121a7566c50145b4f_r.jpg)

## 3.MySQL

### 百万级数据优化查询

我知道的有分页，缓存，分表。具体实现按如下所示：

- #### limit

首先我们很容易想到使用limit来限制查询，但是一个limit不是万能的，他能解决百万级数据量（耗时不到1s,不算快，也不算慢），但千万级数据量的时候就会达到10s以上。

- #### 索引

说到查询优化，我们首先想到的就是建立索引。

- #### 避免全表扫描

如索引值为null

- #### 数据存储结构设计

  - **分区**：根据一定的规则，将表分为更小更容易管理的部分，是一种水平划分，
  - **分表**：有横向分表和纵向分表
  - **分库**：按照时间或空间/地点来对分库

### 什么时候使用索引？什么不能使用索引？

### MySQL常见底层引擎

InnoDB和MyISAM

### InnoDB和Myisam的区别

参考：<https://www.zhihu.com/question/20596402/answer/211492971>

- InnoDB支持事务，MyISAM不支持事务
- InnoDB 支持外键，MyISAM不支持外键
- InnoDB不保存表的行数，MyISAM会保存表的行数
- InnoDB最小粒度锁是行锁，而MyISAM 是表锁，
- InnoDB是聚集索引，MyISAM 是非聚集索引，聚簇索引的文件放在主键索引的叶子节点上，因此InnoDB必须有主键，通过主键索引效率高，所以InnoDB索引效率高。

### 事务

四个特性：

- **原子性**：指事务操作为最小执行单元，不可分割
- **一致性**：数据的一致性
- **隔离性**：值多个对象访问同一个数据时的数据保护，只允许一个对象访问数据
- **持久性**：采用WAL（预写日志）的方式来保证事务的原子性和持久性。WAL 是指在更新数据前，先写日志，在完成更新操作。这样，在系统崩溃时，如果数据还没有完成更新操作，即可通过读取日志来完成，如果还没更新日志，则数据仍然保持一致性。

### 使用事务会产生的问题

脏读，幻读

### 表与表之间的关联关系有哪几种？

一对一，一对多，多对多。

### 外键的使用

**外键的作用**：保持数据的一致性，完整性，主要目的是控制存储在外键表中的数据，使两张表形成关联，外键只能引用外表中列的值。

### 链接数据库的几种方式

- ODBC（Open DataBase Connectivity）
- DAO（）

## 4.进程与线程

### 4.1进程（process）

狭义：是正在运行的一个程序

广义：是一个具有一定独立功能的程序关于某个数据集合的一次运行活动，是操作系统进行资源分配与调度的基本单位

进程的概念主要有两点：

- 进程是一个实体
- 进程是一个**执行中**的程序，只有当操作系统赋予进程生命时，才成为一个活动的实体，称之为进程

### 4.2线程（thread）

线程是进程的一个执行单元，每个线程有自己的线程栈，自己的寄存器环境，自己的线程本地存储。

线程是操作系统可进行运算调度的最小运行单元。

一个进程至少有一个线程

多线程运行调度由线程调度器管理，不一定根据线程创建顺序执行

#### 4.2.1线程的创建方法

##### 继承Thread

```java
public class MyThread extends Thread{
 @override
 public void run(){
  //重写方法体
 }
}
```

##### 实现Runnable接口

```java
public class MyThread implements Runnable{
    @Override
    public void run(){
        System.out.println("runnable thread");
    }
}

public static void main(String args[]){
    MyThread mt = new MyThread()
    Thread thread = new Thread(mt);
    thread.start();
    
}
```

##### 实现Callable接口

```java
public class CallableThread implements Callable<String>{
    @Override
    public String call() throws Exception{
        System.out.println("Callable");
        return null;
    }
}
```

在操作系统中以进程为单位分配资源，如虚拟空间

生命周期，线程的生命周期共6种状态：**New（初始化状态）、Runnable（可运行/运行状态）、Blocked（阻塞状态）、Waiting（等待状态）、Timed_Waiting（有时间限制的等待）、Terminated（终止状态）**

![image-20210414225118178](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701224948.png)

### 4.3主线程与子线程

JVM在启动时，会创建一个主线程，该线程负责执行main方法，Java中线程是不孤立的，

### 4.4线程之间运行的状态

![image-20210512105021210](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701224959.png)

![image-20210512105040500](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701225011.png)

#### 4.4.1串行

​ 依次运行

#### 4.4.2并行

​ 同时运行

#### 4.4.3并发

​ 同时发生，但不能同时运行，在较小的时间内串行。

（同步/异步）参考：<https://zhuanlan.zhihu.com/p/67452727>

### 4.7异步

可发生请求，有等待时间，在等待时可进行下一任务

### 4.8同步

可发生请求，有等待，在等待时不可进行下一任务，必须等当前任务完成才能进行下一任务。

## 5.数据结构

### 5.1什么是数据结构？

- 数据结构是指数据在计算机中的存储方式，是相互之间存在一种或多种关系的数据元素的集合
- 数据结构是计算机组织，存储数据的方式

### 5.2经典的数据结构有哪些？及其使用

参考：<https://zhuanlan.zhihu.com/p/257915734>

![preview](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701225023.jpg)

常用的数据结构有**数组，栈，队列，链表，树，图，堆，散列表**，

- **数组**（Array），数据的集合，长度固定

    ```java
    //声明:类型 数组名[];这里不需要给出数组长度，否则编译出错
    int array[]  ;
    //初始化：静态初始化/动态初始化
    //静态初始化:一旦完成初始化则数组长度固定
    //数组类型 数组名[] = {数据1，数据2，。。。。}
    int array[] = {1,2,3,4,5};
    //动态初始化
    //方法1
    int array1[];
    array1 = new int[10];
    //赋值
    array1 = array;
    //方法2
    int[] array2 = new int[10];
    //赋值
    array2 = array1;
    array2[5] = 10;
    
    /**
      * 注意事项
      * 1.定义数组：无论使用什么方法定义数组，都不能指定数组长度，
      * 2.数组下标只能为int byte short 不能为long
      * 3.获取数组长度 数组.lenth,没有括号
      */
    ```

  - 优点：数组在存储在内存中，数组的数据连续存放，数组长度固定，知道数组开头位置和偏移量就可以很快找到数据的位置，数组就像一本书，指定页码找很快，无需每页都看一遍。根据内容找势必很慢。

    - 按照索引查询速度很快

    - 按照索引遍历数组也很快

  - 缺点：

    - 数组的大小在创建后就固定了，不可变无法扩容
    - 数组只能存储一种数据类型
    - 添加数据删除数据很费时间，因为要移动其他元素

- **链表**:继承了AbstractSequentialList,

    底层：由于链表的链式存储结构，所以链表可以实现内存非连续存储

    ![image-20210509131617876](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701225036.png)

    实现了List接口，实现了Deque接口，实现了Clone able接口，实现了Serializable接口

    ![image-20210509112919102](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701225045.png)

  - 定义：链表是一种递归的数据结构，它或者为空，或者指向一个节点（node）的引用，该节点还有一个元素和指向另一条链表的引用

        ```java
        public class LinkedList<E> {
            transient Node<E> first;
            transient Node<E> last;
        
            private static class Node<E> {
            E item;
            Node<E> next;
            Node<E> prev;
        
            Node(Node<E> prev, E element, Node<E> next) {
           this.item = element;
           this.next = next;
           this.prev = prev;
          }
         }
        }
        ```

        由于不必按照顺序的方式存储，所以链表在插入删除时可以达到O（1）的时间复杂度（只需只想下一个空内存的地址即可，不需要像数组那样一个一个移动数据），除此之外，链表还可以动态的增加数组长度。

        优点：

    - 不需要初始化容量
    - 可以添加任意元素
    - 插入删除的时候只需要更新引用

        缺点：

    - 含有大量的引用，耗费内存
    - 查找元素需要遍历整个链表，耗时

- **栈**:先进后出

    ![image-20210509133359637](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701225054.png)

- **队列**:先进先出，后进后出

    ![image-20210509141407698](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701225102.png)

- **树**:树是一种典型的非线性结构，由n个有限节点组成的一个有层次的关系的集合

    ![preview](https://pic3.zhimg.com/v2-58b68626b1a17c4eaa05f72d084e4d7e_r.jpg)

    特点：

  - 每个节点都有有限个子节点或无子节点，每个节点有0或n个子节点

  - 没有子节点的节点为根节点

  - 每一个非根节点有且只有一个父节点

  - 除了根节点，每个子节点可以分为多个不相交的子树

        ![preview](https://pic3.zhimg.com/v2-fb67a1effb77eea9a53a074610df97ce_r.jpg)

        树的种类有很多种：无序树，有序树，二叉树，B树，二叉树包括满二叉树，完全二叉树，平衡二叉树（AVL），二叉搜索树（二叉搜索树，BST），霍夫曼树，红黑树

    - 无序数：树的任意节点的子节点没有顺序关系

    - 有序树：树的任意节点的子节点有顺序关系

    - 二叉树：树的任意节点至多包含两个节点，二叉树包括

    - **满二叉树**：每一层的节点都达到了最大值的二叉树，有两种表现形式，是完全二叉树的一种特殊形式

      - 第一种，像下图这样（每一层都是满的），满足每一层的节点数都达到了最大值 2。

                ![preview](https://pic3.zhimg.com/v2-ab19f6bc309461c30dbb815fedd36ede_r.jpg)

      - 第二种，像下图这样（每一层虽然不满），但每一层的节点数仍然达到了最大值 2。

                ![preview](https://pic4.zhimg.com/v2-dbe765021095631ee7434be6e32d89f7_r.jpg)

    - **完全二叉树**：除最后一层，即叶子节点层其余层都是满的，即如有缺失数据，则只能从最下面一层的最右面往左面缺失。

            ```text
            设二叉树的深度为h，除第 h 层外，其它各层 (1～h-1) 的结点数都达到最大个数，第 h 层所有的结点都连续集中在最左边，这就是完全二叉树。
            ```

    - **平衡二叉树**：又称AVL树，由前苏联数学家 Adelse-Velskil 和 Landis提出，它是一颗空树，或左右两子树的高度差不超过1，并且左右两子树都是一颗平衡二叉树，查找/删除/插入等操作在最坏及平均的情况下**时间复杂度**都是O（logn），增加和删除元素的操作需要一次或多次**树旋转**来实现新的平衡。

      - **平衡二叉树是基于二分法的策略提高数据的查找速度的二叉树的数据结构**；

      - 参考：<https://zhuanlan.zhihu.com/p/56066942>

      - 平衡因子：左子树与右子树的高度差（BF，Balance Factor），
                $$
                左子树高度-右子树高度
                $$
                平衡因子取值为1，0，-1，分别代表左子树高，左右子树相等，右子树高。

      - **AVL树插入时的失衡与调整**

      - 最小失衡子树：在新插入的节点向上查找，以第一个平衡因子的绝对值超过1的节点为根的子树为最小平衡子树

      - **左旋**流程：

                1）节点的右孩子代替最小平衡子树的根节点，

                2）节点的右孩子的左子树成为根节点的右子树，

                3）节点本身变为右孩子的左子树

                ![img](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701230521.gif)

      - **右旋**流程：

                1）节点的左孩子代表此节点 ，

                2）节点的左孩子的右子树变为节点的左子树 ，

                3）将此节点作为左孩子节点的右子树。

                ![img](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701230527.gif)

      - **AVL树删除时的失衡与调整**：删除操作需要将出现的所有非平衡点修正，删除可分为四种情况

                1）删除叶子节点

                2）删除只有左子树的根节点

                3）删除只有右子树的根节点

                4）删除的节点既有左子树又有右子树

                删除操作步骤：

    - 二叉搜索树：

      - 参考：<https://zhuanlan.zhihu.com/p/29867652>

    - 霍夫曼树：

      - 参考：<https://zhuanlan.zhihu.com/p/127021911>

    - **红黑树**：平衡二叉树最常见的就是红黑树，节点是红色或者黑色，通过颜色的约束来维持二叉树的平衡

      - 定义

                1）每个节点都只能是红色或者黑色

                2）根节点是黑色

                3）每个叶节点（NIL 节点，空节点）是黑色的。

                4）如果一个节点是红色的，则它两个子节点都是黑色的。也就是说在一条路径上不能出现相邻的两个红色节点。

                5）从任一节点到其每个叶子的所有路径都包含相同数目的黑色节点。

                ![preview](https://pic4.zhimg.com/v2-f28bd27feefd5acae2d6a2542bc61a87_r.jpg)

    - **B树**（B-tree）：一种对读写操作进行优化的自平衡二叉查找树，能够保证数据有序，**拥有多于两个的子树**。数据库的索引技术就用到了B树。

            ![preview](https://pic2.zhimg.com/v2-b4fc5eb956f77b68f53b3d39958289bd_r.jpg)

            参考：<https://zhuanlan.zhihu.com/p/27700617>

            与其他树不同的地方在于B树拥有多于两个的子树

- **堆**:堆可以被看作一棵树的数组对象，总是一颗完全二叉树

- **图**:图是一种复杂的非线性结构，由顶点的有穷非空集合和顶点之间边的集合组成，通常表示为：G（V，E），其中，G 表示一个图，V 是图 G 中顶点的集合，E 是图 G 中边的集合。

    ![preview](https://pic4.zhimg.com/v2-647f404560f5f24818b7bbf2b584bb17_r.jpg)

  - 在线性结构中，数据元素之间满足唯一的线性关系，每个数据元素（除第一个和最后一个外）均有唯一的“前驱”和“后继”；

        在树形结构中，数据元素之间有着明显的层次关系，并且每个数据元素只与上一层中的一个元素（父节点）及下一层的多个元素（子节点）相关；

        而在图形结构中，节点之间的关系是任意的，图中任意两个数据元素之间都有可能相关。

- **散列表（哈希表）**:是根据关键码值（key-value）及逆行数据访问的数据结结构。

  - 实现：取数组长度为模，将key值对其取模运算，得到的就是它的存储位置下标，时间复杂度为O（1）

        这里有一个公式可以快速算出对2的n次方取模值

        **任意数对2的N次方取模时，等同于其和2的N次方-1作位于运算。**
        $$
        k %% 2^n = k & (2^n - 1)
        $$
        ![preview](https://pic2.zhimg.com/v2-ba75342bf820741e91ec7992b7bd63a9_r.jpg)

    问题：会产生哈希碰撞

    解决方法：散列法，拉链法

- 散列法分**开放寻址**和**再散列法**

- 拉链发，java中的散列表即使用这个是实现

- **负载因子**：哈希表中现有元素与哈希表的长度的比值，阈值为0.75
    <!-- $$
    \text{负}载因子=现有元素/哈希表长度
    $$ -->

## 6.java基础

### JDK和JRE的区别？

### Java中集合有哪些类型？

- #### list

- #### set

- #### map

### list,set,map的区别

参考：<https://blog.csdn.net/zhangqunshuai/article/details/80660974>

list和set的父类都是collection

### 基础类型有哪些？

### 抽象类和接口的区别以及抽象类的具体使用、

### 修饰符有哪些？

### final的具体使用？final的效果？

### 没有构造函数的类如何创建对象？

在Java中，如果一个类没有写构造函数，通过方法创建时，系统会默认创建无参构造函数，，如果写了有参构造函数，则需要自己写无参构造函数，不然只能调用有参构造函数。

## 7.JVM

调优

## 8.Tomcat

### 优化connector的方法

首先我们先来了解tomcat的connector的三种运行模式

- BIO（）：同步并阻塞一个线程处理一个请求，并发量高时，线程数较多，浪费资源。HTTP/1.1
- NIO（）：同步非阻塞IO，利用Java的异步IO处理，可以通过少量的线程处理大量的请求，可以利用一个线程处理多个connection（多路复用）
- APR（Apache Portable Runtime）：从操作系统层面解决IO阻塞问题，

#### tomcat7.x

## 9.JS

参考：<https://zhuanlan.zhihu.com/p/25508730>

JavaScript是HTML和web的编程语言，js是具有函数优先的轻量级，解释型或即时编译型的的编程语言

### js中undefined和not defined的区别是什么？

- undefined

声明了变量，但没有赋值会输出undefined。

例：

```javascript
var data;
console.log(data);
```

此时页面控制台会输出undefined。

- not defined

未声明变量，就直接进行引用

例:

```javascript
console.log(data);
```

此时页面控制台会输出not defined。

#### 在js中创建一个private方法有什么缺点？

浪费内存，因为每个对象都会创建一个私有方法，不管用没用到。

#### delete方法

将一个object对象的某一属性删除，不能删除对象本身，

#### 赋值优先顺序

从右到左，将最右边的值赋给左边的值

#### 变量提升

js引擎在编译js时会将**声明操作**（var data；）放在最前面编译，赋值则不动。

### jQuery

jquery是一款非常流行的JavaScript框架。

#### $符号

$符号为jQuery的简写,是jQuery的选择器，通过这个符号来选择页面中的元素
$$
$(document)=jQuery(document)
$$

#### body的onload函数与Jquery中的document.ready()的区别

1）、onload()函数只能使用一次，而document.ready可以使用多次

2）、document.ready()在页面DOM元素加载完之后就会被调用，

​  onload()函数需要在所有资源（图像，音频）都加载完毕之后才会被调用

#### jQuery中有几种选择器？

大概可以归为9种

常用的为

1）基本选择器：根据id,类名，元素名

2）层次选择器：根据路径来选择

3）过滤选择器：又分基本过滤选择器，内容过滤选择器，可见性过滤器选择器，属性过滤器选择器

## 10.算法

### 排序算法（小->大）

#### 1）冒泡排序（O(N^2)）

循环数组，对比相邻两个数据，前面的数据大于后面的数据则交换位置，否则不变。循环一遍之后，最小的数据会在最前面，数组长度-1，从第二个位置继续循环数组，重复上面过程。

#### 2）选择排序（O(N^2)）

选择排序是对冒泡排序的优化，在冒泡排序中，每次满足条件都要交换数据位置，在选择排序中，每次循环找到当前循环最小的数据，存储在临时变量中，循环完成之后与第一个数据交换，之后从第二个数据开始，重复这个操作。

#### 3）插入排序（O(N^2)）

将数据插入到一个有序数列中，当数据是无序的，我们需要将第一个数据当成有序数列，将后面的数据依次插入。

#### 4）希尔排序（O()）

将数据按一定间隔分成多个数组，对每个数组进行插入排序。

#### 5）归并排序

#### 6）快排（O(n*logn)）

①先随机找一个基准数，一般以最后一位为基准数。

②分区，将比基准数小的放到左边，比它大的放到右边。

③重复第二步直到每个区间只有一个数。

第二步详细步骤：<https://www.runoob.com/w3cnote/quick-sort.html>

#### 关于排序中插入排序使用率远超过冒泡排序的原因

参考：<https://zhuanlan.zhihu.com/p/147678685>

两者时间复杂度都是O（n^2）

这里引入一个概念：**原地排序**

**原地排序算法**：指**空间复杂度**为O（1）的排序算法，空间复杂度为O（1）代表不需要额外的空间或需要少量的额外空间

##### 如何评价一个算法？

- 最好情况，最坏情况，平均情况时间复杂度
- 时间复杂度的系数，常数，低阶
- 比较次数和交换（移动）次数
- 内存消耗
- 稳定性：指数组中存在值相等的数据，在排完序之后仍保持原来的顺序

在两种排序有相同的时间复杂度的情况下，其余情况就是要考虑的，从以上几个方向分析这两种排序算法，首先，他们都是原地排序算法，冒泡排序只需要一个额外的空间，插入排序也只需要一个额外的空间，从稳定性方面来分析，冒泡排序因为每次对比都需要交换元素位置，所以稳定性不强，而插入排序只在合适的情况下才进行交换，所以稳定性很强。

### Hash Map

#### HashMap解决冲突的方法改变

参考：<https://zhuanlan.zhihu.com/p/127147909>

java1.7：数组+链表

java1.8：数组+链表/红黑树

在1.8版本中，hash表中单个链表长度超过8时才会进行树化，变成红黑树，

#### hashmap继承体系

```java
public class HashMap<K,V> extends AbsractMap<K,V> implements Map<K,V>

public abstract class AbstractMap<K,V> implementsMap<K,V>

public interface Map<K,V>
```

#### **hashmap和hashtable的区别**

​ 参考<https://zhuanlan.zhihu.com/p/79993393>

1. ##### 安全性

    hashtable是线程安全的，hashmap是非线程安全的。hashmap的性能高于hashtable,所以在**多线程**编程的情况下尽量使用hashtable

2. ##### **是否可以用null作为key**

    Hash Map可以使用null作为key键，并且会存储在第一个位置，hashtable不允许使用null作为key。

3. ##### **继承了什么，实现了什么**

    Hash Map继承了Abstract Map实现了Map，Hash Table继承了Dictionary抽象类实现了Map接口。

4. ##### **默认容量以及如何扩容**

    HashMap默认容量为16，阈值为0.75，即数组达到12个元素时，就会开始扩容成当前容量的2倍。

    HashTable默认容量为11，阈值为0.75，扩容时容量翻倍+1，11*2+1.

5. ##### **底层实现**

    底层都是数组+链表

6. ##### **计算hash的方法不同**

    Hash Table：使用key的hashcode对table的长度取模

    Hash Map:对key的hashcode进行二次hashcode在进行取模运算，以获得更好的散列值，使数据更分散

#### 解决hash冲突的方法？

- **链地址法**：
- **开放地址法**：

## 11.JDBC

### 三个对象，关闭顺序？在那里关闭？

## 12.GC(garbage collection)

参考：<https://zhuanlan.zhihu.com/p/142062403>

## 13.多线程
