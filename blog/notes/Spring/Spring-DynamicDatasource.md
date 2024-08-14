---
icon: pen-to-square
star: true
title: Spring Dynamic Datasource
category:
  - java
tag:
  - java
  - swagger
  - knife4j
---

## 依赖

```pom

        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
        </dependency>
```

## 配置

```yaml

spring:
  datasource:
    dynamic:
      primary: mybatis
      strict: false
      datasource:
        mybatis:
          driver-class-name: com.mysql.cj.jdbc.Driver
          username: mybatis
          password: 3jq^edM#nW5J
          url: jdbc:mysql://106.15.104.240:3306/mybatis?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
        doc:
          driver-class-name: com.mysql.cj.jdbc.Driver
          username: doc
          password: UsK#28%*quE4uv
          url: jdbc:mysql://106.15.104.240:3306/doc?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai

```

## 集成 Hikari 连接池

```yaml

spring:
  datasource:
    dynamic:
      primary: master
      strict: false
      datasource:
        master:
          driver-class-name: com.mysql.cj.jdbc.Driver
          username: mybatis
          password: 3jq^edM#nW5J
          url: jdbc:mysql://106.15.104.240:3306/mybatis?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
          # 配置连接池，MySQL数据库默认支持2000个数据连接
          hikari:
            # 测试连接是否可用
            connection-test-query: select 1
            # 连接超时时间，单位是毫秒
            connection-timeout: 30000
            # 空闲连接超时时间，单位是毫秒
            idle-timeout: 600000
            # 保持连接最长时间，单位是毫秒
            max-lifetime: 1800000
            # 最大连接数
            maximum-pool-size: 10
            # 最小空闲连接数
            minimum-idle: 10
        doc:
          driver-class-name: com.mysql.cj.jdbc.Driver
          username: doc
          password: UsK#28%*quE4uv
          url: jdbc:mysql://106.15.104.240:3306/doc?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
          # 配置连接池，MySQL数据库默认支持2000个数据连接
          hikari:
            # 测试连接是否可用
            connection-test-query: select 1
            # 连接超时时间，单位是毫秒
            connection-timeout: 30000
            # 空闲连接超时时间，单位是毫秒
            idle-timeout: 600000
            # 保持连接最长时间，单位是毫秒
            max-lifetime: 1800000
            # 最大连接数
            maximum-pool-size: 10
            # 最小空闲连接数
            minimum-idle: 10
```

## 使用

```java

@DS("doc")
@Service
public class DocServiceImpl extends ServiceImpl<DocMapper, Doc> implements IDocService {
    @Override
    public Page<Doc> page(PageRequest<DocRequest> request) {
        return this.getBaseMapper().selectPage(
                new Page<>(request.getPage().getPageNo(), request.getPage().getPageSize()),
                new LambdaQueryWrapper<Doc>()
                .eq(null != request.getQuery().getId(), Doc::getId, request.getQuery().getId()));
    }
}

```
