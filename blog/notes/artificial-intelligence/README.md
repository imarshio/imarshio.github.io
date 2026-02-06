---
title: Artificial Intelligence
icon: fa-solid fa-infinity
order: 4
article: false
index: false
category:
  - Intro
tag:
  - Intro
---

## 学历路径

### 1、数学基础

[The Math](../math/README.md)

### 2、机器学习 (Machine Learning)

目标：理解“数据驱动”的思想，掌握传统算法，为深度学习做铺垫。

#### 1. 理论入门

- 推荐课程：
  - 吴恩达 (Andrew Ng) - Machine Learning (2022版)：Coursera/B 站都有。AI 祖师爷，由浅入深，数学门槛低，非常适合作为第一门课。
  - 李宏毅 (Hung-yi Lee) - 机器学习 (台大)：B 站必看。主要讲深度学习，但前几节课对 ML 的概念讲得极好（比如 Pokemon 例子），中文授课，非常幽默，紧跟前沿。
- 辅助教材：
  - 周志华《机器学习》（西瓜书）：国内最权威教材，适合当字典查阅原理。
  - 李航《统计学习方法》：推导非常严谨，适合面试准备。

#### 2. 核心算法

不要只看视频，要动手写代码（哪怕是调包 `scikit-learn`）。

- 重点掌握：线性回归、逻辑回归（分类）、决策树、支持向量机 (SVM)、K-Means 聚类。

---

### 3、神经网络与深度学习 (Deep Learning)

目标：理解从“人工特征”到“自动特征提取”的跨越。这是你点名的重点。

#### 1. 体系化学习

- 吴恩达 - Deep Learning Specialization (深度学习专项)：如果 Karpathy 的课觉得跳跃，可以用这套课来补全体系（CNN, RNN, 优化算法等）。

#### 2. Andrej Karpathy - Neural Networks: Zero to Hero

这是目前全网公认最好的深度学习入门系列，没有之一。Karpathy (前 Tesla AI 总监, OpenAI 创始成员) 会手把手带你从零写一个 PyTorch。

- 学习顺序：
    1. The spelled-out intro to neural networks and backpropagation：必看。手写一个微型自动微分引擎 (MicroGrad)，彻底搞懂反向传播。
    2. Building makemore 系列：从 Bigram 模型讲到 MLP、BatchNorm、RNN。
    3. Building GPT：在这个阶段先看前半部分，理解 Transformer 的基本组件。
- 学习建议：一定要跟着敲代码。只看不练等于白看。

#### 3. 框架工具

- PyTorch：目前学术界和工业界的主流。跟着 Karpathy 的视频学就够了，官方文档是最好的字典。

---

### 4、大语言模型 (LLMs)

目标：理解 Transformer 架构，掌握微调 (Fine-tuning) 和应用开发。

#### 1. 核心架构：Transformer

- 回看 Karpathy 的 "Let's build GPT"：彻底理解 Attention（注意力机制）、Self-Attention、Multi-head Attention。这是大模型的灵魂。
- 李宏毅 - Transformer 课程：李宏毅老师对 Attention 的解释非常形象，适合辅助理解。

#### 2. 大模型原理与应用

- Karpathy - Intro to Large Language Models (1小时讲座)：极度精炼地概括了大模型的现状、训练过程（Pre-training, SFT, RLHF）和未来。
- 李宏毅 - 2024/2025 生成式 AI 课程：涵盖了 Prompt Engineering, LoRA, RAG 等最新技术。

#### 3. 实战路线

在这个阶段，看视频已经不够了，需要上手玩项目：

1. Fine-tuning (微调)：尝试用 PEFT/LoRA 技术微调一个小模型（如 Llama 3 8B 或 Qwen 7B），让它学会特定的说话风格。
