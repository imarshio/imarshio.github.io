---
icon: pen-to-square
date: 2024-03-22
order: 99
category:
  - springboot
title: Springboot Elasticsearch
tag:
  - elasticsearch
  - springboot
---

## 环境

- Java 11
- Maven 3.9.6
- springboot 2.3.5.RELEASE
- elasticsearch 7.10.0

> [!IMPORTANT]
>
> spring-boot与elasticsearch之间的版本兼容是一个很大的问题，你需要确保自己的spring-boot版本与elasticsearch版本兼容
>
> 版本兼容可以参考：https://docs.spring.io/spring-data/elasticsearch/reference/elasticsearch/versions.html

## 引入依赖

### spring boot框架

```xml

<dependencies>
    <!-- spring-boot-starter-data-elasticsearch是一个spring-boot-starter，代表他是一个支持自动装配的依赖，不需要手动配置 -->
    <!-- 如果你用的是spring-boot框架，那么你只需要引入spring-boot-starter-data-elasticsearch依赖即可，他已经包含了spring-data-elasticsearch依赖 -->
    <!-- https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.nosql.elasticsearch -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
    </dependency>
</dependencies>
```

### spring data

```xml

<dependencies>
    <!-- 支持Elasticsearch的spring-data组件 -->
    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-elasticsearch</artifactId>
    </dependency>
</dependencies>
```

## 配置

```yaml
spring:
  elasticsearch:
    rest:
      urls: http://localhost:19200
#    option 可选配置
#    index-name: ${spring.application.name}
```

## 实战

### 实体类

```java
package com.marshio.demo.elasticsearch.es.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * @author marshio
 * @desc es 存储的实体类
 * @create 2024/4/15 17:54
 */
@Data
@Document(indexName = "#{elasticsearchProperties.indexName}")
public class Doc {
    @Field(type = FieldType.Text)
    private String title;
    @Field(type = FieldType.Text)
    private String content;
    @Id
    private String id;
}
```

### 服务层

```java
@Slf4j
@RequiredArgsConstructor
public class BaseEsService<T, TD> {

    // 以下代码存在个人使用习惯的差异，请酌情参考
    // TODO 疑问：elasticsearchRepository 与 restHighLevelClient 的区别是什么？

    protected final ElasticsearchRepository<T, TD> elasticsearchRepository;
    protected final RestHighLevelClient restHighLevelClient;
    protected final ElasticsearchProperties properties;


    @PostConstruct
    public void init() {
        log.info("elasticsearch init nodes is " + Arrays.toString(
                restHighLevelClient.getLowLevelClient().getNodes().toArray()));
    }

    /**
     * 新增或更新实体
     * 当实体id在索引命名空间下不存在时会新增
     * 当实体id在索引命名空间下存在时会更新
     *
     * @param entity 实体
     * @return 保存的实体
     */
    public T save(T entity) {
        return elasticsearchRepository.save(entity);
    }

    /**
     * 批量保存实体
     *
     * @param entities 实体
     * @return 保存的实体集合
     */
    public Iterable<T> saveAll(Iterable<T> entities) {
        return elasticsearchRepository.saveAll(entities);
    }

    public T update(T entity) {
        return this.save(entity);
    }

    public SearchResponse search(SearchRequest searchRequest) throws IOException {
        return this.search(searchRequest, RequestOptions.DEFAULT);
    }

    public SearchResponse search(SearchRequest searchRequest, RequestOptions options) throws IOException {
        return restHighLevelClient.search(searchRequest, options);
    }


    /**
     * 删除实体
     *
     * @param id 实体id
     */
    public void delete(TD id) {
        elasticsearchRepository.deleteById(id);
    }
}

```

```java
@Service
public class DocEsService extends BaseEsService<Doc, String> {

    public DocEsService(ElasticsearchRepository<Doc, String> elasticsearchRepository,
                        RestHighLevelClient restHighLevelClient,
                        ElasticsearchProperties properties) {
        super(elasticsearchRepository, restHighLevelClient, properties);
    }

    public Page<Doc> search(DocQueryRequest query, PageRequest pageRequest) throws IOException {
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
        queryBuilder.must(QueryBuilders.matchQuery(Doc.Fields.globalId, query.getGlobalId()));

        SearchSourceBuilder searchSourceBuilder = SearchSourceBuilder.searchSource().query(queryBuilder);
        searchSourceBuilder.from(pageRequest.getPageNumber()).size(pageRequest.getPageSize());

        SearchRequest searchRequest = new SearchRequest(properties.getIndexName()).source(searchSourceBuilder);
        SearchResponse response = this.search(searchRequest);
        long total = response.getHits().getTotalHits().value;
        SearchHit[] hits = response.getHits().getHits();
        List<Doc> list = new ArrayList<>();
        for (SearchHit hit : hits) {
            // 转成实体类即可
            hit.getSourceAsString();
            Doc doc = JSONUtil.toBean(hit.getSourceAsString(), Doc.class);
            list.add(doc);
        }

        return new PageImpl<>(list, pageRequest, total);
    }
}

```

## 疑问

### ElasticsearchRepository 与 RestHighLevelClient 的区别是什么？

### TermQuery 与 MatchQuery 的区别

TermQuery

- 精确查询，不分词

MatchQuery

- 模糊查询，分词