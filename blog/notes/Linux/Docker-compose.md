---
icon: fa-brands fa-docker
lang: en-US
order: 50
title: Docker compose
category:
- docker compose
tags: 
- docker compose
- Linux

---

## 简介

docker-compose是

## Samples

### MySQL

```yaml
version: '3'
services:
  mysql:
    image: mysql:8.3.0
    container_name: mysql
    restart: unless-stopped
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci --default-authentication-plugin=mysql_native_password
    environment:
      - TZ=Asia/Shanghai
      - LANG=zh_CN.UTF-8
      - MYSQL_ROOT_HOST=%
      - MYSQL_ROOT_PASSWORD=zQajzMsVs0@
    ports:
      - 3306:3306
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    volumes:
      - ./volumes/db/conf:/etc/mysql/conf.d
      - ./volumes/db/conf/my.cnf:/etc/mysql/my.cnf
      - ./volumes/db/data:/var/lib/mysql
      - ./volumes/db/logs:/var/log/mysql
      - ./volumes/db/init:/docker-entrypoint-initdb.d

```

### Redis

```yaml
version: '3'
services:
  redis:
    image: redis:6-alpine
    restart: always
    volumes:
      # Mount the redis data directory to the container.
      - ./volumes/redis/data:/data
    healthcheck:
      test: [ "CMD", "redis-cli", "ping" ]
    ports:
      - "6379:6379"
```

### Nacos

```yaml
version: '3'
services:
  nacos:
    image: nacos/nacos-server:v2.2.0
    container_name: nacos
    restart: always
    ports:
      # web 界面访问端口
      - 8848:8848
      # 程序使用 grpc 连接的端口
      - 9848:9848
      - 9849:9849
    environment:
      - MODE=standalone
      - PREFER_HOST_MODE=hostname
      - SPRING_DATASOURCE_PLATFORM=mysql
      - MYSQL_SERVICE_HOST=mysql
      - MYSQL_SERVICE_PORT=3306
      - MYSQL_SERVICE_USER=root
      - MYSQL_SERVICE_PASSWORD=zQajzMsVs0@
      - MYSQL_SERVICE_DB_NAME=nacos_config
      - MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8&connectTimeout=10000&socketTimeout=3000&autoReconnect=true&useSSL=false&serverTimezone=UTC
      - TZ=Asia/Shanghai
    depends_on:
      - mysql
    volumes:
      - ./volumes/nacos/logs:/home/nacos/logs
  mysql:
    image: mysql:8.3.0
    container_name: mysql
    restart: unless-stopped
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci --default-authentication-plugin=mysql_native_password
    environment:
      - TZ=Asia/Shanghai
      - LANG=zh_CN.UTF-8
      - MYSQL_ROOT_HOST=%
      - MYSQL_ROOT_PASSWORD=zQajzMsVs0@
    ports:
      - 3306:3306
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    volumes:
      - ./volumes/db/conf:/etc/mysql/conf.d
      - ./volumes/db/conf/my.cnf:/etc/mysql/my.cnf
      - ./volumes/db/data:/var/lib/mysql
      - ./volumes/db/logs:/var/log/mysql
      - ./volumes/db/init:/docker-entrypoint-initdb.d

```

### Nginx

```yaml
version: '3'
services:
  # nginx
  nginx:
    image: nginx:latest
    restart: always
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/proxy.conf:/etc/nginx/proxy.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/html:/etc/nginx/html
    ports:
      - "17088:17088"
      - "18088:18088"

```

### Minio

```yaml
version: '3'
services:
  minio:
    container_name: minio
    image: minio/minio:RELEASE.2023-03-20T20-16-18Z
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    ports:
      - "9001:9001"
      - "9000:9000"
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/minio:/minio_data
    command: minio server /minio_data --console-address ":9001"
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost:9000/minio/health/live" ]
      interval: 30s
      timeout: 20s
      retries: 3
```

### Milvus

```yaml
version: '3'
services:
  etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.5
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/etcd:/etcd
    command: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
    healthcheck:
      test: [ "CMD", "etcdctl", "endpoint", "health" ]
      interval: 30s
      timeout: 20s
      retries: 3
```
