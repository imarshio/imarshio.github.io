---
# icon: database
category:
  - llm
  - vlm
title: Ollama

---

```sh
# 从远端拉去一个模型
% ollama pull qwen3:1.7b

# 启动一个本地模型
% ollama run qwen3:1.7b

# 查看本地有哪些模型
% ollama list
NAME                ID              SIZE      MODIFIED     
qwen2.5:1.5b        65ec06548149    986 MB    6 months ago    
qwen3:1.7b          8f68893c685c    1.4 GB    6 months ago    
deepseek-r1:1.5b    e0979632db5a    1.1 GB    7 months ago    

# 查看正在运行的本地模型
% ollama ps  
NAME          ID              SIZE      PROCESSOR    CONTEXT    UNTIL              
qwen3:1.7b    8f68893c685c    1.9 GB    100% GPU     4096       4 minutes from now  

# 删除模型
% ollama rm deepseek-r1:1.5b

# 设置 openclaw
% ollama launch openclaw --model deepseek-r1:1.5b
```
