---
icon: pen-to-square
lang: en-US
title: Git Troubleshooting
order: 99
description: 虚心接受自己的不足，然后找机会与时间去弥补自己的不足，你会慢慢体会到高处不胜寒的感觉。
category:
- git

---

## fatal: refusing to merge unrelated histories

```sh
root@root-Bro demo-gradle % git pull origin main
From github.com:imarshio/dmeo-gradle
 * branch            main       -> FETCH_HEAD
fatal: refusing to merge unrelated histories

# 使用 --allow-unrelated-histories 来避免
root@root-Bro demo-gradle % git pull origin main --allow-unrelated-histories
From github.com:imarshio/dmeo-gradle
 * branch            main       -> FETCH_HEAD
hint: Waiting for your editor to close the file... error: There was a problem with the editor 'vi'.
Not committing merge; use 'git commit' to complete the merge.

# 后面只需要在处理一下冲突，在 commit-push 一下就好了
```
