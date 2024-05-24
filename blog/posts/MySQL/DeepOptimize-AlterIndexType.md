---
icon: pen-to-square
order: 99
category:
  - MySQL查询深入优化
title: 记一次MySQL查询深入优化--索引类型
tag:
- 源码阅读
- MySQL
- 索引优化
---

## 前言

书接上回，[记一次MySQL查询深入优化--类型不匹配](./DeepOptimize-QueryWithoutUsingIndex.md)，我们通过修改查询条件里的条件右侧的类型是索引生效了，但是我们知道，优化效果其实不是很明显，:han。

## 环境及数据准备

- MySQL 版本：8.0.25
- 服务器：2c2G （负载很低）

### 表结构

```sql
CREATE TABLE `a` (
  `id` bigint NOT NULL AUTO_INCREMENT ,
  -- ...
  -- 业务数据
  -- ...
  `publish_time` varchar(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL ,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`),
  KEY `idx_update_time` (`update_time`),
  KEY `idx_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 数据

现在可以直接通过我在服务器上搭建的 `MySQL` 测试。

| k        | v              |
| -------- | -------------- |
| IP       | 106.15.104.240 |
| user     | demo           |
| password | T&UY9QdNDScZ   |

### 现状

```sql
SELECT
 * 
FROM
 time_index_demo 
WHERE
 -- 这里你可能需要调整下时间范围
 publish_time > date_format( TIMESTAMPADD( HOUR, - 48, CURRENT_TIMESTAMP ), '%Y-%m-%d %H:%i:%s' ) 
ORDER BY
 publish_time DESC;

```

耗时：4.5s+

## 动手动手

### 修改 column 类型

这次我们通过修改表的字段类型来尝试优化。

> [!Note]
> 修改字段类型之前先看下有没有涉及到这个字段的索引,如果有的话，记得先删掉索引，类型修改好之后再重建索引

```sql
-- 删除相关索引
ALTER TABLE time_index_demo DROP index idx_publish_time;

-- 修改索引类型
ALTER table time_index_demo MODIFY COLUMN publish_time datetime NOT NULL COMMENT '发布时间' AFTER `global_id`;

-- 330w的数据修改字段类型耗费了大概15分钟，在生产进行更新时需要考虑实际场景

-- 添加索引，耗时20s
ALTER TABLE time_index_demo  index idx_publish_time;

```

### 尝试再次查询

```sql
SELECT
 * 
FROM
 a 
WHERE
 -- 进行类型转换
 publish_time > date_format( TIMESTAMPADD( DAY, - 48, CURRENT_TIMESTAMP ), '%Y-%m-%d %H:%i:%s' ) 
ORDER BY
 publish_time DESC;

SELECT
 * 
FROM
 a 
WHERE
 -- 不进行类型转换
 publish_time > TIMESTAMPADD( DAY, - 48, CURRENT_TIMESTAMP )
ORDER BY
 publish_time DESC;
```

结果是：两者查询效率其实是差不多的，，，，，但是！！！索引变小了，从之前的 `length = 19` 变成现在的 `length = 5`。
