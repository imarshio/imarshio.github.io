---
icon: fa-brands fa-docker
lang: en-US
order: 50
title: Dockerfile
description: 虚心接受自己的不足，然后找机会与时间去弥补自己的不足，你会慢慢体会到高处不胜寒的感觉。
category:
- docker
tags: 
- docker
- notes
- Linux

---
  
## 简介

[Dockerfile](https://docs.docker.com/reference/dockerfile)，Dockerfile 是一个文本文档，包含用户可以在命令行上调用来组装映像的所有命令。

## Instruction

### From

`FROM [--platform=<platform>] <image> [AS <name>]`

or

`FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]`

or

`FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]`

### ENV

### RUN

### ADD

### ARG

### CMD

### COPY

### ENTRYPOINT

### EXPOSE

### HEALTHCHECK

### LABEL

### MAINTAINER

### ONBUILD

### SHELL

### STOPSINGLE

### USER

### VOLUME

### WORKDIR
