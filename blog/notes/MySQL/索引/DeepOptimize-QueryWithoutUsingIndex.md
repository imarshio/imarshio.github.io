---
icon: pen-to-square
order: 99
category:
  - MySQL查询深入优化
title: 记一次MySQL深入优化（1）
tag:
- 源码阅读
- MySQL
- 索引优化
---

## 前言

某一天，产品经理找到我说，我们收到上级反馈，说这个页面的响应有些让人抓狂（修饰后的说法doge），我打开F12查看了响应时间，enmmm，竟然需要耗时12s+。

话不多说，准备动手。

## 环境及数据准备

由于这里涉及到了业务数据，所以我在这里只能模拟数据进行演示。

MySQL版本：8.0.25

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

本来想在这里直接放数据的,但是由于sql文件太大,暂时放弃,可以按照如下sql进行批量插入,数据量大概在200w即可,也可以通过[demo数据](https://marshio-github-large-file.oss-cn-shanghai.aliyuncs.com/sql/DeepOptimize-QueryWithoutUsingIndex.sql?Expires=1714284260&OSSAccessKeyId=TMP.3Kfd8vWpKTbgWw2NNdDY4A1e6MyxbEZg8HQ516hHKgqZkfwot6yUfFx8uXVrKQtodkU3Zx9jz37AmAiC9ZeSL8YGXmhaJh&Signature=%2FV0F6feXJ6c9WUsqUrPDOrK7NPM%3D)下载

```sql
INSERT INTO `<table_name>` (`publish_time`, `create_time`, `update_time`) VALUES ('2023-12-24 08:50:00', '2023-12-24 08:56:19', '2023-12-29 08:56:27');
```

### 场景复现

```sql
SELECT
 * 
FROM
 a 
WHERE
 publish_time > TIMESTAMPADD( HOUR, - 48, CURRENT_TIMESTAMP ) 
ORDER BY
 publish_time DESC;

```

耗时：8s+

## 动手动手

上面我们通过一系列操作还原了现场，确实很慢，这也业务里面一共有两个查询，这第一个就占了2/3的时间，解决完这个，页面响应基本就会很快了哈。

### 优化第一步：来解释下吧

```sql
EXPLAIN SELECT
 * 
FROM
 a 
WHERE
 publish_time > TIMESTAMPADD( HOUR, - 48, CURRENT_TIMESTAMP ) 
ORDER BY
 publish_time DESC;
```

|id|select_type|table|partations|type|possible_keys|key|key_len|ref|rows|filtered|extra|
|----|----|----|----|----|----|----|----|----|----|----|----|
|1|SIMPLE|a||ALL|idx_publish_time||||2193593|33.33|Using where; Using filesort|

好了，原因找到了，type为ALL，key为null，没走索引，进行的全表扫描，那必然会慢啊。

### 优化第二步：找找原因吧

问题找到了，那是为什么呢？我们在建表的时候明明已经给`publish_time`加了索引的啊，而且`where`条件的查询里只用到了`publish_time`。

这时候我们需要想一下，索引失效的原因有哪些？

1. 查询条件不符合最左匹配原则（适用于聚簇索引）
2. 索引列参与运算且在条件的左侧 `indexA + 1 = 2`
3. 索引列参与函数且在条件的左侧 `LEFT(indexA, 1) = 'a'`
4. 类型隐式转换 ``
5. `like`关键字使用不当 `index like '%key_word%'`
6. `or`关键字使用不当 `indexA = 1 or non_index_column = 2`
7. 索引列作比较  `indexA < indexB`
8. 索引列使用`is not null`  `indexA is not null`，因为`MySQL`会存储为null的索引，所以`is not null`相当于都满足条件

还有一种情况，查询区间囊括的数据超过表数据总量的30%，`MySQL`就不会走时间索引了，而是改为全表扫描（官方文档还没找到具体的说明，后面会通过源码进行证实）

如上的查询中，`publish_time > TIMESTAMPADD( HOUR, - 48, CURRENT_TIMESTAMP )`，在意识中，一直以为`publish_time`是一个时间索引，所以没有注意，后来一看才发现，索引声明的时候是字符类型，导致索引失效。

## 完美解决

```sql
SELECT
 * 
FROM
 a 
WHERE
 -- 提前进行类型转换
 publish_time > date_format( TIMESTAMPADD( DAY, - 48, CURRENT_TIMESTAMP ), '%Y-%m-%d %H:%i:%s' ) 
ORDER BY
 publish_time DESC;
```
