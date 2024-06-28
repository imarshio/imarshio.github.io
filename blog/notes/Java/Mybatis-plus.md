---
icon: pen-to-square
star: true
title: Mybatis Plus Usage
category:
  - java
tag:
  - java
  - Mybatis Plus
---

## 简介

## 背景

Mybatis-plus: 3.5.2
springboot: 2.3.8.RELEASE

## 快速开始

### 添加依赖

```pom
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
        </dependency>
```

### 配置

mybatis-plus秩序简单的几步配置即可快速使用。

#### `@MapperScan`

```java
@Configuration
@MapperScan({
        // 指定要扫描的Mapper类所在的包
        "com.marshio.demo.mapper",
})
public class MybatisPlusConfig {
    
}
```

#### `@TableName`

```java
@Data
// 指定表名，开启自动映射
@TableName(value = "user", autoResultMap = true)
public class User {

    @TableId
    private Integer id;

    private String username;

    private String email;

    private String password;

    private Date birthday;

    private String phoneNumber;

    private String address;

    private Date registrationTime;

    private Boolean isActive;

    private Gender gender;

    /**
     * 必须开启映射注解
     *
     * <p> @TableName(autoResultMap = true) <p>
     * 选择对应的 JSON 处理器，并确保存在对应的 JSON 解析依赖包
     */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<Integer> role;

    private String intro;
}
```

#### 持久层

```java
public interface UserMapper extends BaseMapper<User> {
    
}

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

}
```

然后你就可以愉快的玩耍了。

## 插件

### 分页插件

分页插件是非常常见的插件，它提供了非常方便的分页功能。

#### 配置

```java
@Configuration
@MapperScan({
        "com.marshio.demo.mapper",
})
public class MybatisPlusConfig {

    /**
     * 新的分页插件,一缓和二缓遵循mybatis的规则,
     * 需要设置 MybatisConfiguration#useDeprecatedExecutor = false
     * 避免缓存出现问题(该属性会在旧插件移除后一同移除)
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加分页拦截器
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

#### 使用MP自带的分页查询

```java

public Page<User> getUsers(PageRequest<UserRequest> request) {

        // page.getTotal()
        Page<User> page = new Page<>(request.getPageNo(), request.getPageSize());

        if (null != request.getTotal()) {
            // 如已存在总数，则无需查询总数，减轻数据库压力
            // 此总数可以通过其他方式获取，如存在缓存，则直接从缓存中获取
            // 注：需要考虑具体的场景，什么时候前端可以传总数，什么情况不可以传
            page.setTotal(request.getTotal());
            page.setSearchCount(false);
        }
        page.setOrders(request.getOrders());

        // 构建查询条件
        LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
        if (null != request.getQuery()) {
            query.eq(null != request.getQuery().getId(), User::getId, request.getQuery().getId())
                    .eq(null != request.getQuery().getUsername(), User::getUsername, request.getQuery().getUsername())
                    .in(null != request.getQuery().getIds(), User::getId, request.getQuery().getIds());
        }

        // 使用mybatis-plus自带的分页查询
        return this.getBaseMapper().selectPage(page, query);
    }
```

#### 使用自定义的分页查询

### 日志插件

我们经常会在开发过程中遇到数据查询相关的问题，当查询的SQL 参数较少时，我们还可以很轻松的复制SQL，替换参数，在数据库浮现查询，但是当参数较多时，我们在复制SQL，一个一个的进行参数替换，就会非常麻烦，所以，我们希望在日志中打印出完整的SQL，这样可以方便我们调试，Mybatis-plus集成了p6spy插件，可以很好的解决这个问题，接下来就来看看如何正确的使用吧。

#### 依赖

```pom
        <dependency>
            <groupId>com.github.gavlyukovskiy</groupId>
            <artifactId>p6spy-spring-boot-starter</artifactId>
            <version>1.8.1</version>
        </dependency>
```

> ![Note]
> spring-boot 2.x，对应的p6spy版本为1.8.1。
> spring-boot 3.x，对应的p6spy版本为1.9.1。

在spring-boot 2.x版本，到这里你就已经可以看到被p6spy接管打印的SQL了。

#### 默认输出

```log
2024-06-28 17:35:36.528  INFO 21008 --- [io-18888-exec-1] p6spy                                    : #1719567336528 | took 10ms | statement | connection 0| url jdbc:mysql://106.15.104.240:3306/mybatis?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
SELECT id,username,email,password,birthday,phone_number,address,registration_time,is_active,gender,role,intro FROM user WHERE id=? 
SELECT id,username,email,password,birthday,phone_number,address,registration_time,is_active,gender,role,intro FROM user WHERE id=1 ;
```

#### 自定义输出

参考[p6spy config and usage](https://p6spy.readthedocs.io/en/latest/configandusage.html?highlight=config)

#### 配置

```properties
logMessageFormat:com.p6spy.engine.spy.appender.CustomLineFormat
customLogMessageFormat:%(currentTime) | SQL Execute Time: %(executionTime) ms | Connection: %(category)-%(connectionId) | Execute SQL: %(sql)
```

## LambdaQueryWrapper 108 式

具体项目参考[demo-mybatis-plus](https://github.com/imarshio/springboot-demo/tree/main/demo-orm/demo-mybatis-plus)
