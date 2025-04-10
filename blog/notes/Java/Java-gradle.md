---
title: 构建工具之 gradle
icon: pen-to-square
order: 6
category:
  - java
tag:
  - base
---

## 项目结构

```markdown
demo-gradle/
├── gradle/
│   └── wrapper/                        // 包含 Gradle Wrapper 的 JAR 文件和配置文件
│       ├── gradle-wrapper.jar          // Gradle Wrapper 的可执行 JAR 文件
│       └── gradle-wrapper.properties   // 包含 Gradle Wrapper 的配置信息
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── project/
│   │   │               └── Main.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── project/
│       │               └── MainTest.java
│       └── resources/
│           └── test.properties
├── .gitignore
├── build.gradle        // Gradle 构建脚本
├── gradlew             // Gradle Wrapper 的可执行脚本
├── gradlew.bat         // Gradle Wrapper 的 Windows 版本的可执行脚本
└── settings.gradle     // Gradle 设置文件
```

其中，你最需要关注的是如下配置。

### `gradle-wrapper.properties`

```properties
# Thu Apr 10 16:52:21 CST 2025
# 定义 Gradle 发行版的基础存储位置
# GRADLE_USER_HOME 表示使用 Gradle 用户主目录作为基础存储位置，这个目录一般在 ~/.gradle 目录下
distributionBase=GRADLE_USER_HOME

# 定义 Gradle 发行版文件在基础存储位置下的存储路径
# 这里指定为 wrapper/dists，意味着发行版文件会存储在 GRADLE_USER_HOME 下的 wrapper/dists 目录中
distributionPath=wrapper/dists

# 定义 Gradle 发行版的下载地址
# 此处使用了阿里云的镜像地址，指定下载的是 gradle-8.10 版本的二进制文件压缩包
distributionUrl=https://mirrors.aliyun.com/macports/distfiles/gradle/gradle-8.10-bin.zip
# 初始配置为，
# distributionUrl=https\://services.gradle.org/distributions/gradle-8.8-bin.zip

# 定义 Gradle 发行版压缩包的基础存储位置
# 同样使用 GRADLE_USER_HOME 作为基础存储位置
zipStoreBase=GRADLE_USER_HOME

# 定义 Gradle 发行版压缩包在基础存储位置下的存储路径
# 也是存储在 GRADLE_USER_HOME 下的 wrapper/dists 目录中
zipStorePath=wrapper/dists
```

### `build.gradle`

```gradle

plugins {
    // Gradle插件，相当于 maven 中的 <plugins>
    // 声明方式 id + version + apply，如 id 'io.freefair.aspectj' version '8.13' apply false
    id 'java'
}

// 等同于 maven 中的 group
group = 'com.marshio.demo'

// 指定项目的版本号
version = '1.0-SNAPSHOT'

// 配置项目的依赖仓库，Gradle 会从这些仓库中下载项目所需的依赖项
repositories {
    // 阿里云的 Maven 公共仓库
    maven { url 'https://maven.aliyun.com/repository/public' }
    // Maven 中央仓库
    mavenCentral()
}

// 添加依赖，等同于 Maven 中的 <dependencies>
dependencies {
    // 使用 JUnit 5 的 BOM（Bill of Materials）来管理依赖版本
    testImplementation platform('org.junit:junit-bom:5.10.0')
    // 添加 JUnit Jupiter 作为测试实现依赖
    testImplementation 'org.junit.jupiter:junit-jupiter'
}

// 配置测试任务
test {
    // 指定使用 JUnit Platform 来运行测试
    useJUnitPlatform()
}
```

#### `plugins`

`plugins` 节点用于定义项目所使用的 Gradle 插件，可以理解为 maven 中的 `<plugins>` 节点。

```gradle
plugins {
    // id: 插件id，由Gradle官方提供，如java、war、war、maven-publish等
    // version: 插件版本，默认为当前Gradle版本
    // apply: 是否应用插件，默认为true
    // Java 插件不需要声明版本，因为 Java 插件是核心插件，其版本和 gradle 版本绑定
    id 'java'
}
```

- id：插件 id
- version：插件版本
- apply：是否应用插件，默认为true

#### `repositories`

```gradle
repositories {
    // 阿里云的 Maven 公共仓库
    maven { url 'https://maven.aliyun.com/repository/public' }
    // Maven 中央仓库
    mavenCentral()
}
```

#### `dependencies`

[`dependencies`](https://docs.gradle.org/current/userguide/declaring_dependencies_basics.html) 节点用于定义项目所依赖的库。在 Gradle 中，依赖关系由 `dependencies` 节点来管理，可以理解为 maven 中的 `<dependencies>` 节点。

```gradle
dependencies {
    // 使用 JUnit 5 的 BOM（Bill of Materials）来管理依赖版本
    // 'testImplementation' 关键字表示这是用于测试的依赖
    // 'platform' 关键字确保项目中使用的 JUnit 相关依赖版本一致
    // 'org.junit:junit-bom:5.10.0' 表示使用 JUnit 5 的 5.10.0 版本的 BOM
    testImplementation platform('org.junit:junit-bom:5.10.0')
    // 添加 JUnit Jupiter 作为测试实现依赖
    // JUnit Jupiter 是 JUnit 5 的编程模型和扩展模型的组合，用于编写和运行测试用例
    testImplementation 'org.junit.jupiter:junit-jupiter'
}
```

##### Types of dependencies

Gradle 中的依赖项主要有三种类型， Module Dependency、Project Dependency 和 File Dependency。

### `settings.gradle`

```gradle
rootProject.name = 'demo-gradle'
```
