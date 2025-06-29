---
icon: fa-solid fa-face-smile-wink
category:
  - interview
title: Spring Cloud 面试题
order: 12
---

## 常用的 SpringCloud 组间有哪些？

按照自己的技术栈去回答即可，主要从以下几个点出发

- 服务注册、服务发现，如Nacos，Apllo
- 网关：Gateway
- 服务转发：OpenFeign
- 流量控制、熔断器，如Sentinel，Hystrix
- 分布式配置中心，如Nacos，Apollo
- 消息队列，如Kafka，RabbitMQ
- 分布式事务，如Seata，2PC，3PC

## OpenFeign 了解吗？

## OpenFeign 是如何实现负载均衡的？

旧版是通过集成 Ribbon 来实现负载均衡的，自 Spring Cloud 2020.0 版本之后，改为由 Spring Cloud LoadBanlancer 实现负载均衡策略。

## OpenFeign 的负载均衡策略有哪些？

- 轮询，按照顺序依次选择注册的服务实例
- 随机，随机选取一个服务实例
- 响应时间加权，根据服务的响应时间分配权重
- 重试，在某个实例调用失败时，会选择调用其他实例
- 自定义，通过实现 `ReactorServiceInstanceLoadBalancer` 来创建自定义的负载均衡策略
