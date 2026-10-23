---
title: "算法面试题"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 39
redirectFrom:
  - /posts/interview/13-data-structures-algorithms.html
  - /posts/interview/10-foundation-notes.html
---

# 数据结构与算法题库

> 入门 / 中等 / 高难各 20 题以上，★ 是高频题。10 文档第三、四节是浓缩版和 10 道必练手撕题，这里不重复那 10 道代码。
> 文末「代码合集」里的实现都可以直接运行（末尾带自检），面试前每个默写一遍。
> 后端岗的算法面一般是 LeetCode 中等难度，重点在**能写对 + 能说清复杂度 + 能联系实际系统**（Redis 为什么用跳表、数据库为什么用 B+ 树、限流用什么算法）。

---

## 入门（21 题）

### 1. ★ 时间复杂度是什么？怎么分析？
描述「输入规模 n 增大时，执行次数增长得有多快」，用大 O 表示，只保留最高阶、去掉常数。分析方法：看循环嵌套层数（一层 O(n)、两层 O(n²)）；每次规模减半是 O(log n)；递归看「递归次数 × 每次的工作量」。常见：O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)。

### 2. 空间复杂度？
算法运行中**额外**占用的内存随 n 的增长量级。递归的空间复杂度要算上**调用栈深度**（递归 n 层就是 O(n)）。原地算法是 O(1)。

### 3. ★ 最好、最坏、平均、均摊复杂度？
- 快排：最好 / 平均 O(n log n)，最坏 O(n²)（每次选到最大或最小值做基准）；
- 哈希表查找：平均 O(1)，最坏 O(n)（全部冲突）；
- **均摊**：动态数组的 append，偶尔一次扩容要 O(n)，但平摊到每次操作是 O(1)。

### 4. ★ 数组的特点？
内存连续、通过下标 O(1) 随机访问（地址 = 起始地址 + 下标 × 元素大小）；插入删除要移动元素 O(n)；CPU 缓存友好。Python 的 list 是动态数组（存的是对象指针）。

### 5. ★ 链表有哪几种？特点？
单链表（只有 next）、双向链表（prev + next，可以 O(1) 删除已知节点）、循环链表（尾指向头）。不需要连续内存，已知位置插入删除 O(1)，但查找第 k 个要 O(n)，缓存不友好、每个节点额外占指针空间。**哨兵（dummy）节点**能省掉大量边界判断，写链表题必备。

### 6. ★ 栈的特点和应用？
后进先出（LIFO），push / pop / peek 都是 O(1)。应用：函数调用栈、括号匹配、表达式求值（中缀转后缀）、浏览器后退、撤销操作、DFS 的非递归实现、单调栈。

### 7. ★ 队列的特点和应用？
先进先出（FIFO）。应用：BFS、任务队列、消息队列、缓冲区。Python 用 `collections.deque`（`append` + `popleft` 都是 O(1)），**不要用 list 的 `pop(0)`**（O(n)）。

### 8. 双端队列和循环队列？
双端队列两端都能 O(1) 进出（`deque`），可以当栈也可以当队列，滑动窗口最大值题要用它。循环队列用固定大小的数组 + 头尾指针取模实现，空间复用，常用于环形缓冲区（日志、网卡收包）。

### 9. ★ 哈希表的基本原理？
通过哈希函数把键映射到数组下标，平均 O(1) 的插入、删除、查找。核心问题：哈希函数设计（均匀分布）、冲突处理、扩容。不支持有序遍历和范围查询。

### 10. 树的基本概念？
根节点、父子节点、叶子节点（没有子节点）、深度（从根到该节点的边数）、高度（从该节点到最远叶子的边数）、子树、度（子节点个数）。二叉树每个节点最多两个子节点；**满二叉树**每层都满；**完全二叉树**除最后一层外都满、最后一层从左往右连续（堆就是完全二叉树，可以用数组存）。

### 11. ★ 二叉树的四种遍历？
- 前序：根 → 左 → 右（复制树、序列化）；
- 中序：左 → 根 → 右（**二叉搜索树的中序遍历是有序的**）；
- 后序：左 → 右 → 根（删除树、计算子树信息）；
- 层序：按层从上到下（BFS，用队列）。
前中后序可以递归写（简单），也可以用栈迭代写（面试常要求）。

### 12. ★ 二叉搜索树（BST）？
左子树所有节点 < 根 < 右子树所有节点。查找、插入、删除平均 O(log n)，但如果按顺序插入会退化成链表 O(n) → 所以需要平衡树（AVL、红黑树）。

### 13. ★ 堆是什么？
完全二叉树，**大顶堆**每个节点 ≥ 子节点（堆顶最大），**小顶堆**相反。用数组存：节点 i 的子节点是 2i+1、2i+2，父节点是 (i−1)//2。插入（上浮）和删除堆顶（下沉）都是 O(log n)，取堆顶 O(1)，建堆 O(n)。Python 的 `heapq` 是小顶堆。应用：优先队列、Top K、堆排序、定时器、合并 K 个有序链表。

### 14. 图的基本概念和存储？
顶点 + 边；有向 / 无向；带权 / 无权；连通图；环。存储：**邻接矩阵**（n×n 数组，判断两点是否相连 O(1)，但稀疏图浪费空间）、**邻接表**（每个顶点一个邻居列表，稀疏图常用）。知识图谱、社交关系、依赖关系、地图都是图。

### 15. ★ 递归是什么？要注意什么？
函数调用自己，把问题拆成更小的同类问题。三要素：**终止条件**、**递推关系**、**每层做什么**。注意：没有终止条件会栈溢出（Python 默认递归深度 1000）；重复计算（斐波那契的朴素递归是 O(2ⁿ)，加记忆化变 O(n)）。

### 16. ★ 二分查找的前提和复杂度？
数组**有序**（或者满足某种单调性）；每次排除一半，O(log n)。变形：找第一个 ≥ target 的位置（`bisect_left`）、找最后一个 ≤ target 的、在旋转有序数组里查找、对答案二分（「最小化最大值」这类题）。

### 17. 冒泡、选择、插入排序？
都是 O(n²)：冒泡相邻比较交换，每轮把最大的「冒」到末尾；选择每轮选最小的放到前面；插入把每个元素插到前面已排好序的部分里。**插入排序在数组基本有序时接近 O(n)**，所以 Timsort 对小片段用插入排序。

### 18. ★ 什么是排序的稳定性？为什么重要？
相等的元素排序后保持原来的相对顺序。重要性：**多关键字排序**时，先按次要字段排、再按主要字段稳定排序，结果就是「主要字段相同时按次要字段排」。稳定的：冒泡、插入、归并、Timsort、计数；不稳定的：选择、快排、堆排序。

### 19. 字符串常见题型和技巧？
反转、回文判断（双指针）、子串查找、字母异位词（排序或计数）、最长无重复子串（滑动窗口）、最长回文子串（中心扩展）、字符串匹配（KMP）。Python 里字符串不可变，频繁修改先转成 list 最后 `"".join`。

### 20. 什么时候用 set / dict 代替 list？
需要**频繁判断元素是否存在**（O(1) vs O(n)）、去重、计数、建立映射关系（两数之和）时。代价是更多内存、不保证 set 有序。

### 21. 常见算法题套路有哪些？
双指针、滑动窗口、前缀和、哈希计数、二分、排序 + 贪心、栈 / 单调栈、BFS / DFS、回溯、动态规划、分治、拓扑排序、并查集。拿到题先想「属于哪一类」。

---

## 中等（24 题）

### 1. ★ 哈希冲突的解决方法和扩容？
- **链地址法**：每个槽挂一个链表（或树），Java HashMap（链表长度 > 8 且数组长度 ≥ 64 时转红黑树，< 6 退回链表）；
- **开放寻址法**：冲突后按规则找下一个空槽（线性探测、二次探测、双重哈希），Python dict。删除不能直接清空槽，要放「已删除」标记，否则后面的元素找不到；
- **再哈希**：换一个哈希函数；
- **扩容**：负载因子超过阈值（Java 0.75、Python 2/3）时新建更大的数组，所有元素重新计算位置（rehash）。Redis 用**渐进式 rehash**：两张表并存，每次操作迁移一点，避免一次性卡顿。

### 2. ★ 红黑树的性质？为什么用它？
五条性质：节点是红或黑；根是黑；叶子（NIL）是黑；红节点的子节点必须是黑（不能有连续红节点）；任一节点到其所有叶子的路径上黑节点数相同。结果：**最长路径不超过最短路径的 2 倍**，高度 O(log n)。插入删除最多 2–3 次旋转，比 AVL 少。应用：Java TreeMap / HashMap 树化、C++ `std::map`、Linux CFS 调度器、epoll 管理 fd。

### 3. ★ AVL 树和红黑树怎么选？
AVL 严格平衡（左右子树高度差 ≤ 1），查询稍快，但插入删除要更多旋转；红黑树近似平衡，写入更便宜。**读多写少选 AVL，写多选红黑树**，工程上红黑树更常见。

### 4. ★ B 树和 B+ 树的区别？
| | B 树 | B+ 树 |
|---|---|---|
| 数据存在哪 | 所有节点都存数据 | **只有叶子节点存数据**，非叶子只存键 |
| 叶子之间 | 无链接 | **双向链表**相连 |
| 查询 | 可能在中间节点就找到（不稳定） | 一定到叶子（稳定，IO 次数固定） |
| 范围查询 | 要中序遍历，在层之间跳 | 找到起点后顺着叶子链表扫 |
| 每个节点能放的键 | 少（因为还存数据） | 多 → 树更矮 |
所以数据库索引用 B+ 树。

### 5. ★ 一棵 3 层的 B+ 树大概能存多少行数据？（MySQL 经典题）
InnoDB 页 16KB。非叶子节点存「主键 + 页指针」：bigint 主键 8 字节 + 指针 6 字节 ≈ 14 字节，一页约 16384 / 14 ≈ 1170 个；叶子节点存整行，假设一行 1KB，一页 16 行。3 层：1170 × 1170 × 16 ≈ **2190 万行**。所以千万级的表主键查询只要 3 次 IO（根节点通常常驻内存，实际更少）。

### 6. ★ 跳表的原理？
在有序链表上加多层「快速通道」：底层包含所有元素，每上一层随机保留一部分（Redis 的概率是 1/4），查找从最高层开始，能往右就往右，不能就下一层。查找、插入、删除平均 O(log n)。相比平衡树：实现简单、范围查询方便、并发友好（修改只影响局部）。Redis ZSet、LevelDB / RocksDB 的 MemTable 用跳表。

### 7. 字典树（Trie）？
每个节点代表一个字符，从根到某个节点的路径就是一个前缀。插入和查找都是 O(字符串长度)，和总单词数无关。应用：前缀搜索、输入法联想、路由表最长前缀匹配、**敏感词过滤**（配合 AC 自动机可以一次扫描文本匹配所有敏感词）。缺点：节点多，耗内存。

### 8. ★ 并查集是什么？
维护「若干个不相交集合」的结构，支持 `find`（查所属集合的代表）和 `union`（合并两个集合）。配合**路径压缩**和**按秩合并**，单次操作几乎是 O(1)。应用：判断连通性、朋友圈 / 岛屿数量、最小生成树（Kruskal）、**实体去重后的归并**（A 和 B 是同一实体、B 和 C 是同一实体 → A、B、C 合并成一个）。代码见文末。

### 9. ★ 快速排序的原理？怎么优化？
选一个基准，把小于它的放左边、大于它的放右边（分区），再递归处理两边。平均 O(n log n)、最坏 O(n²)、原地、不稳定。
优化：**随机选基准**或三数取中（防止有序数组退化）；小区间（< 16 个元素）改用插入排序；**三路快排**（分成 < = > 三部分，大量重复元素时效果好）；尾递归优化减少栈深度。

### 10. ★ 归并排序的原理和应用？
分成两半分别排序，再合并两个有序数组。稳定，始终 O(n log n)，需要 O(n) 额外空间。应用：**外部排序**（数据大到内存放不下时，分块排序后多路归并）、求**逆序对**数量、链表排序（链表的归并不需要额外空间）。

### 11. 堆排序的原理？
先把数组建成大顶堆（O(n)），然后反复把堆顶（最大值）和末尾交换、堆大小减一、对新堆顶下沉。O(n log n)、原地、不稳定。实际比快排慢（缓存不友好），但最坏情况有保证。

### 12. ★ Top K 有哪几种解法？
| 方法 | 复杂度 | 适合 |
|---|---|---|
| 全排序取前 K | O(n log n) | 数据小、简单 |
| **大小为 K 的堆** | O(n log K)，空间 O(K) | 数据量大、**流式数据**（不用全部装进内存） |
| **快速选择**（快排的分区思想，只递归一边） | 平均 O(n)，最坏 O(n²) | 数据能放进内存，求第 K 大 |
| 计数 / 桶 | O(n + 值域) | 值域有限 |
海量数据（10 亿个数）的 Top K：分片在各自机器上求 Top K，再汇总求 Top K。代码见文末快速选择。

### 13. ★ 双指针的几种用法？
- **对撞指针**：左右往中间走（有序数组两数之和、回文判断、盛水最多的容器）；
- **快慢指针**：链表找中点、**判断链表有环**（快指针一次走两步、慢指针一步，相遇说明有环）、找倒数第 k 个节点；
- **同向指针**：原地去重、移动零。

### 14. ★ 滑动窗口的思路？
用左右两个指针维护一个窗口，右指针扩张、不满足条件时左指针收缩，每个元素最多进出窗口一次，O(n)。适合「连续子数组 / 子串」的最值问题：最长无重复子串、最小覆盖子串、长度最小的子数组。**我们的滑动窗口限流**也是同一个思想（按时间维护一个窗口）。

### 15. ★ 前缀和是什么？
`prefix[i] = a[0] + ... + a[i-1]`，区间和 `sum(a[l:r]) = prefix[r] - prefix[l]`，O(1) 查询。配合哈希表可以求「和为 K 的子数组个数」（O(n)）。二维前缀和用于矩阵区域求和。

### 16. 单调栈是什么？
栈里的元素保持单调递增或递减，新元素进来时把破坏单调性的元素弹出（弹出时就找到了它的「下一个更大 / 更小元素」）。O(n)。题型：每日温度、下一个更大元素、柱状图中最大的矩形、接雨水。

### 17. ★ BFS 和 DFS 分别适合什么问题？
- **BFS**（队列，一层一层扩展）：**无权图最短路径**、层序遍历、最少步数类问题；空间消耗大（要存一整层）；
- **DFS**（栈 / 递归，一条路走到底再回退）：连通性、所有路径、排列组合（回溯）、拓扑排序、检测环；空间是递归深度。
- 知识图谱的「多跳查询」就是限制深度的图遍历。

### 18. ★ 拓扑排序是什么？
对有向无环图（DAG）的顶点排序，使得每条边 u → v 中 u 都在 v 前面。**Kahn 算法**：反复取出入度为 0 的节点、把它指向的节点入度减一；最后如果还有节点没被取出，说明有环。应用：任务依赖调度、编译顺序、课程表、Celery chain / 工作流编排、数据库迁移的依赖顺序。代码见文末。

### 19. Dijkstra 算法？
求**非负权重**图中单源最短路径：每次从未确定的节点里取距离最小的（用小顶堆），用它更新邻居的距离。O((V + E) log V)。有负权边要用 Bellman-Ford。应用：地图导航、网络路由（OSPF）。代码见文末。

### 20. ★ 动态规划的基本思路？
适用条件：**最优子结构**（大问题的最优解由子问题的最优解构成）+ **重叠子问题**（子问题被反复计算）。步骤：定义状态（`dp[i]` 表示什么）→ 写状态转移方程 → 确定初始值 → 确定计算顺序 → 优化空间（滚动数组）。经典题：爬楼梯、打家劫舍、最长递增子序列、零钱兑换、编辑距离、最长公共子序列、背包。

### 21. 贪心和动态规划的区别？
贪心每一步都选当前最优，不回头，**只有在「局部最优能推出全局最优」时才正确**（需要证明）；DP 考虑所有子问题的组合，一定能得到最优解但更慢。例子：找零钱，面额是 1、5、10 时贪心正确；面额是 1、3、4 凑 6 时贪心（4+1+1）不对，DP 得出 3+3。

### 22. ★ 回溯算法的模板？
「做选择 → 递归 → 撤销选择」，本质是对决策树的 DFS。题型：全排列、组合、子集、N 皇后、括号生成。剪枝（提前排除不可能的分支）是优化的关键。
```python
def backtrack(path, choices):
    if 满足结束条件:
        res.append(path[:]); return
    for c in choices:
        if 不合法(c): continue      # 剪枝
        path.append(c)
        backtrack(path, 剩余选择)
        path.pop()                  # 撤销
```

### 23. ★ 怎么判断链表有环、找到环的入口？
快慢指针：慢指针一次一步、快指针一次两步，有环一定会相遇。找入口：相遇后把一个指针放回链表头，两个指针都一次走一步，再次相遇的位置就是环的入口（数学推导：头到入口的距离 = 相遇点到入口的距离 + 若干圈）。代码见文末。

### 24. 递归和迭代怎么互相转换？
递归天然用调用栈保存状态，改成迭代就**自己维护一个栈**（树的非递归遍历、DFS）。尾递归（递归调用是函数最后一步）可以直接改成循环。Python 没有尾递归优化，深递归要改迭代。

---

## 高难（22 题）

### 1. ★ 一致性哈希是什么？为什么要有虚拟节点？
- 普通取模哈希 `hash(key) % N`：节点数 N 变化时几乎所有 key 都要重新映射（缓存全部失效）；
- **一致性哈希**：把节点和 key 都哈希到一个 0 ~ 2³² 的环上，key 顺时针找到的第一个节点就是它的归属。增删一个节点只影响相邻的一段数据（约 1/N）；
- 问题：节点少时在环上分布不均，导致数据倾斜；一个节点挂了，它的数据全部压到下一个节点 → **虚拟节点**：每个物理节点在环上放几百个虚拟点，分布更均匀，故障时负载被分摊到多个节点；
- 应用：分布式缓存（Memcached 客户端）、负载均衡粘性会话（我们的 HAProxy 按用户 ID 一致性哈希）、Cassandra / DynamoDB 的数据分片。Redis Cluster 用的是**哈希槽**（16384 个槽），是另一种思路：槽和节点的映射可以手动调整。代码见文末。

### 2. ★ 布隆过滤器的原理？参数怎么定？
- 一个 m 位的位数组 + k 个哈希函数。插入：k 个哈希位置都置 1；查询：k 个位置都是 1 才「**可能存在**」，有一个是 0 就「**一定不存在**」；
- 有误判（假阳性），没有漏判；**不能删除**（会影响别的元素，要删除用计数布隆过滤器）；
- 参数：要存 n 个元素、期望误判率 p，位数 `m = -n·ln(p) / (ln2)²`，哈希函数个数 `k = (m/n)·ln2`。例子：1 亿个元素、误判率 1%，约需 9.6 亿位 ≈ 114MB、k ≈ 7（对比存 1 亿个字符串要几个 GB）；
- 应用：缓存穿透防护（先判断 key 是否可能存在）、爬虫 URL 去重、LSM 树里判断某个 key 是否可能在某个文件中（避免无效磁盘读）。

### 3. ★ LSM 树的原理？和 B+ 树比怎么样？
- 写入：先写 WAL（防丢），再写内存中的有序结构（MemTable，通常是跳表）；MemTable 满了冻结并**顺序**刷到磁盘成为不可变的有序文件（SSTable）；后台不断**合并（compaction）**多个 SSTable，去掉旧版本和删除标记；
- 读取：先查 MemTable，再从新到旧查各层 SSTable（配合布隆过滤器和稀疏索引跳过不相关的文件）；
- 对比 B+ 树：
  | | B+ 树 | LSM 树 |
  |---|---|---|
  | 写 | 随机写（原地更新页） | **顺序写**，写入吞吐高 |
  | 读 | 稳定、快 | 可能要查多个文件，较慢 |
  | 放大 | 写放大较小 | 写放大（compaction 反复重写）、空间放大 |
  | 代表 | MySQL InnoDB、PostgreSQL | RocksDB、LevelDB、HBase、Cassandra、TiKV |
- 写多读少（日志、时序、监控、消息）选 LSM，读多、事务型业务选 B+ 树。

### 4. ★ HNSW（向量检索）的原理？
分层可导航小世界图：
- 每个向量是图里的一个节点，和它最近的若干个节点连边；
- 分多层：最上层节点很少（像高速公路），越往下越密，最底层包含所有节点（像跳表的思想）；
- 查询：从最上层的入口点开始，**贪心地**往更接近查询向量的邻居走，走不动了就下到下一层继续，直到最底层，用一个大小为 `ef` 的候选列表做精细搜索；
- 参数：`m`（每个节点的边数，越大越准越占内存）、`ef_construct`（建索引时的搜索宽度）、`ef`（查询时的搜索宽度，**调召回率和延迟的主要旋钮**）；
- 是近似算法：不保证找到真正最近的，但召回率可以做到 95%–99%，复杂度约 O(log n)。

### 5. ★ 倒排索引和 BM25 的原理？
- **倒排索引**：「词 → 包含它的文档列表（及位置、词频）」。查询时取出每个查询词的文档列表求交 / 并，再打分排序。Elasticsearch、Lucene、PG 的 GIN 索引都基于它；
- **BM25** 打分：对每个查询词，`IDF × (tf × (k1 + 1)) / (tf + k1 × (1 − b + b × 文档长度 / 平均文档长度))`，再对所有查询词求和：
  - **IDF**（逆文档频率）：词越稀有越重要（「的」几乎没有分量，「MK-W80002-4」这种型号分量很大）；
  - **词频饱和**：tf 增大分数增长越来越慢（k1 控制，通常 1.2–2），防止一个词重复 100 次就霸榜；
  - **长度归一化**：长文档天然包含更多词，要打折扣（b 控制，通常 0.75）。
- 我们的混合检索：BM25 稀疏向量（擅长精确匹配型号、编码）+ 稠密向量（擅长语义），用 RRF 融合。

### 6. ★ RRF 融合算法是什么？为什么用它？
Reciprocal Rank Fusion：多路检索结果按**排名**融合：`score(d) = Σ 1 / (k + rank_i(d))`，k 通常取 60。
- 为什么不直接把分数加起来：BM25 的分数和余弦相似度不在一个量纲上（一个可能是 15.3，一个是 0.82），直接相加或加权都很难调；RRF 只看排名，不需要归一化，简单稳健；
- k 的作用：减弱排名靠前的结果之间的差距，防止某一路的第一名独占；
- 我们的知识图谱节点检索对「名称」和「摘要」两个向量分别检索，然后在 Python 里做 RRF 融合；文档检索在 Qdrant 服务端做 BM25 + 稠密向量的 RRF。

### 7. ★ 海量数据：10 亿个整数（内存只有 1GB），找出出现次数最多的 100 个
1. **分治 + 哈希分桶**：顺序读文件，按 `hash(x) % 1000` 写到 1000 个小文件里（相同的数一定落在同一个文件）；
2. 对每个小文件用哈希表计数，求出每个文件的 Top 100（小顶堆）；
3. 把 1000 个文件的 Top 100 合并，再求一次 Top 100。
思路关键：**相同的元素一定被分到同一个桶**，所以分桶后可以独立处理。分布式场景下就是 MapReduce 的 Map（分桶）+ Reduce（汇总）。

### 8. ★ 海量数据：两个各有 50 亿条 URL 的文件，找出共同的 URL（内存 4GB）
- 方法一：分别对两个文件按 `hash(url) % 1000` 分桶（同一个 URL 在两个文件里会落到同编号的桶），然后逐对比较 A_i 和 B_i（把 A_i 放进 set，遍历 B_i）；
- 方法二：允许少量误差时用布隆过滤器：把 A 的所有 URL 放进布隆过滤器（50 亿 × 1% 误判率约 5.6GB，可以降低精度或分批），遍历 B 判断。

### 9. 海量数据：40 亿个不重复的 unsigned int，判断某个数是否在其中？
**位图（Bitmap）**：2³² 位 = 512MB，第 x 位为 1 表示 x 存在。一次遍历建好位图，之后查询 O(1)。同样的思路可以做：找出不重复的数（用 2 位表示 0 次、1 次、多次）、排序（按位输出）。Redis 的 Bitmap 统计日活就是这个思想。

### 10. ★ 海量数据：10 亿个数找中位数？
- 方法一：**按值分桶**：按数值范围（比如最高的 8 位）把数分到 256 个桶，统计每个桶的数量，找到中位数所在的桶，只对那一个桶继续细分或排序；
- 方法二：两个堆（大顶堆存较小的一半、小顶堆存较大的一半）适合**流式数据**实时求中位数，但要能放下全部数据；
- 方法三：外部排序后直接取中间位置。

### 11. ★ 外部排序怎么做？
数据大到内存放不下时：
1. 分块读入内存，每块排序后写回磁盘（得到多个有序的小文件）；
2. **多路归并**：每个文件开一个读缓冲，用小顶堆维护每个文件当前的最小元素，每次弹出最小的写到输出、再从对应文件补一个。
数据库的大排序（`ORDER BY` 超出 `work_mem` 时 `Sort Method: external merge`）、LSM 树的 compaction 都是这个原理。

### 12. ★ 令牌桶限流怎么实现？（手写）
以固定速率往桶里放令牌（最多放到桶容量），每个请求取一个令牌，取不到就拒绝。实现时不用定时器，**每次请求时根据距离上次的时间差补令牌**：
```python
tokens = min(capacity, tokens + (now - last) * rate)
```
允许突发（桶满时可以一下用掉全部令牌），长期平均速率受 rate 限制。分布式版本把 tokens 和 last 存在 Redis Hash 里，整段逻辑放进 Lua 保证原子。代码见文末。

### 13. ★ 滑动窗口限流怎么实现？和令牌桶比？
记录窗口内每个请求的时间戳（Redis ZSet），每次请求先删掉窗口外的，再看数量是否超过上限。精确、没有固定窗口的边界突发问题，但每个请求都要存一条记录，高 QPS 时内存大。令牌桶只存两个数，更省，并且允许突发。我们模型的 RPM / TPM 用滑动窗口（因为供应商就是按「过去 60 秒」统计的，算法和对方一致才不会被误限流）。

### 14. LFU 缓存怎么做到 O(1)？
LFU 淘汰**访问次数最少**的（次数相同淘汰最久没用的）。O(1) 的做法：
- `key → (value, freq)` 的哈希表；
- `freq → 这个频率下所有 key 的有序字典`（按访问先后排列，相当于每个频率一个 LRU 链表）；
- 记录当前最小频率 `min_freq`。
- 访问一个 key：从 `freq` 的链表移到 `freq + 1` 的链表；如果 `freq` 链表空了且它正好是 `min_freq`，`min_freq + 1`；
- 插入新 key：频率为 1，`min_freq = 1`；满了就从 `min_freq` 的链表头淘汰。
代码见文末。

### 15. 时间轮是什么？
管理大量定时任务的数据结构：一个环形数组，每个格子代表一个时间刻度，里面挂着到期时间落在这一格的任务；指针每个刻度前进一格，执行当前格的任务。添加和删除任务 O(1)（比堆的 O(log n) 快），适合海量定时器（连接超时、心跳检测）。超出一圈的用多层时间轮（像时钟的时分秒）。Netty、Kafka 的延时操作、Linux 内核定时器都用它。我们的定时任务量不大，用 Redis ZSet（本质是按时间排序的跳表）就够了。

### 16. ★ 雪花算法是怎么生成分布式 ID 的？
64 位：1 位符号位（0）+ **41 位毫秒时间戳**（约 69 年）+ **10 位机器 ID**（1024 台机器）+ **12 位序列号**（每毫秒 4096 个）。特点：趋势递增（对 B+ 树索引友好）、不依赖数据库、每秒每台机器 400 万个。
问题：**时钟回拨**（服务器时间被调回去会生成重复 ID）→ 检测到回拨时等待、拒绝或借用备用位；机器 ID 的分配要靠配置或 ZooKeeper / 数据库。对比 UUID v7：同样是「时间在前、有序」的思路，但 128 位、不需要分配机器 ID。

### 17. ★ 编辑距离怎么求？（动态规划经典）
`dp[i][j]` = 把 a 的前 i 个字符变成 b 的前 j 个字符的最少操作数：
- `a[i-1] == b[j-1]` 时 `dp[i][j] = dp[i-1][j-1]`；
- 否则 `1 + min(dp[i-1][j]（删除）, dp[i][j-1]（插入）, dp[i-1][j-1]（替换）)`。
O(mn) 时间，可以滚动数组优化到 O(n) 空间。应用：拼写纠错、模糊匹配、文本相似度。代码见文末。

### 18. 0-1 背包问题？
n 个物品，每个有重量 w 和价值 v，背包容量 C，每个物品最多选一次，求最大价值。`dp[j]` 表示容量 j 时的最大价值，倒序遍历容量：`dp[j] = max(dp[j], dp[j - w] + v)`（倒序保证每个物品只用一次；正序就变成完全背包）。O(nC)。很多「选或不选」「凑出某个和」的问题都能转化成背包。

### 19. 递归算法的复杂度怎么算？（主定理）
形如 `T(n) = a·T(n/b) + O(n^d)` 的递归：
- `d > log_b(a)`：`O(n^d)`；
- `d = log_b(a)`：`O(n^d · log n)`（归并排序：a=2、b=2、d=1 → O(n log n)）；
- `d < log_b(a)`：`O(n^(log_b a))`。
二分查找 a=1、b=2、d=0 → O(log n)。

### 20. ★ 怎么判断两段文本「近似重复」？（项目真实场景）
我们 Agent 的打转检测：判断两次工具调用的参数是不是「差不多」。
- 不能要求完全相同（模型每轮往搜索词后面多拼一两个词）；
- 做法：把参数分词，算两个词集合的**对称差**大小，除以较长那份的词数，小于阈值就算近似重复。分母取较长的一份，是为了「新参数只是旧参数加了一个前缀 / 后缀」这种情况不被稀释成「差异很大」；
- 其他常见的相似度算法：Jaccard 相似度（交集 / 并集）、编辑距离、SimHash（海量文档去重，比较 64 位指纹的汉明距离）、MinHash + LSH（大规模近似去重）、向量余弦相似度（语义级别）。
这个例子能体现「用基础算法解决实际问题，并且根据线上数据调整设计」。

### 21. 敏感词过滤怎么做才快？
- 朴素做法：对每个敏感词在文本里查找，O(敏感词数 × 文本长度)；
- **Trie 树**：把所有敏感词建成字典树，从文本的每个位置出发沿着树匹配；
- **AC 自动机**：在 Trie 上加「失配指针」（类似 KMP 的 next 数组），匹配失败时不用回到文本的下一个位置重新开始，**一次扫描文本就能找出所有敏感词**，O(文本长度 + 匹配数)。

### 22. 无锁队列 / 并发数据结构的思路？
用 CAS 代替锁：比如入队时，先读出尾指针，用 CAS 把尾节点的 next 从 null 改成新节点，成功了再用 CAS 移动尾指针；失败就重试。优点：没有锁竞争和上下文切换；难点：ABA 问题、内存回收（被摘下的节点可能还有别的线程在读）。工程里一般直接用现成的：Java 的 `ConcurrentLinkedQueue`、Disruptor（环形缓冲区 + 序号，避免伪共享）。Python 里因为 GIL，直接用 `queue.Queue`。

---

## 代码合集（可运行，带自检）

```python
import heapq
import random
import time
from bisect import bisect
from collections import OrderedDict, defaultdict, deque
from hashlib import md5


# 并查集（中等 8）：路径压缩 + 按秩合并
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # 路径压缩（隔代压缩）
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True


# 快速选择（中等 12）：第 k 大的数，平均 O(n)
def kth_largest(nums, k):
    target = len(nums) - k            # 第 k 大 = 升序后下标 n-k
    lo, hi = 0, len(nums) - 1
    a = nums[:]
    while True:
        p = random.randint(lo, hi)
        a[p], a[hi] = a[hi], a[p]
        pivot, i = a[hi], lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        if i == target:
            return a[i]
        if i < target:
            lo = i + 1
        else:
            hi = i - 1


# 拓扑排序（中等 18）：Kahn 算法，有环返回 None
def topo_sort(n, edges):
    graph, indeg = defaultdict(list), [0] * n
    for u, v in edges:
        graph[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else None


# Dijkstra（中等 19）
def dijkstra(graph, src):
    dist = {src: 0}
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, float("inf")):
            continue                  # 过期的堆项
        for v, w in graph.get(u, []):
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist


# 链表找环入口（中等 23）
class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            p = head
            while p is not slow:
                p, slow = p.next, slow.next
            return p
    return None


# 一致性哈希（高难 1）：带虚拟节点
class ConsistentHash:
    def __init__(self, nodes, vnodes=100):
        self.ring, self.keys = {}, []
        for node in nodes:
            for i in range(vnodes):
                h = self._hash(f"{node}#{i}")
                self.ring[h] = node
                self.keys.append(h)
        self.keys.sort()

    @staticmethod
    def _hash(s):
        return int(md5(s.encode()).hexdigest()[:8], 16)

    def get(self, key):
        idx = bisect(self.keys, self._hash(key)) % len(self.keys)   # 顺时针第一个，绕回开头
        return self.ring[self.keys[idx]]


# 令牌桶（高难 12）：单机版；分布式版把 tokens/last 放 Redis Hash，逻辑写进 Lua
class TokenBucket:
    def __init__(self, rate, capacity):
        self.rate, self.capacity = rate, capacity
        self.tokens, self.last = capacity, time.monotonic()

    def allow(self, now=None):
        now = time.monotonic() if now is None else now
        self.tokens = min(self.capacity, self.tokens + (now - self.last) * self.rate)
        self.last = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False


# LFU 缓存（高难 14）：get / put 都是 O(1)
class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.kv = {}                                  # key -> (value, freq)
        self.freq_keys = defaultdict(OrderedDict)     # freq -> 按访问先后排列的 key
        self.min_freq = 0

    def _touch(self, key):
        value, f = self.kv[key]
        del self.freq_keys[f][key]
        if not self.freq_keys[f]:
            del self.freq_keys[f]
            if self.min_freq == f:
                self.min_freq += 1
        self.kv[key] = (value, f + 1)
        self.freq_keys[f + 1][key] = None

    def get(self, key):
        if key not in self.kv:
            return -1
        self._touch(key)
        return self.kv[key][0]

    def put(self, key, value):
        if self.cap <= 0:
            return
        if key in self.kv:
            self.kv[key] = (value, self.kv[key][1])
            self._touch(key)
            return
        if len(self.kv) >= self.cap:
            evict, _ = self.freq_keys[self.min_freq].popitem(last=False)
            if not self.freq_keys[self.min_freq]:
                del self.freq_keys[self.min_freq]
            del self.kv[evict]
        self.kv[key] = (value, 1)
        self.freq_keys[1][key] = None
        self.min_freq = 1


# 编辑距离（高难 17）：滚动数组，O(n) 空间
def edit_distance(a, b):
    prev = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        cur = [i] + [0] * len(b)
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1]
            else:
                cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
        prev = cur
    return prev[-1]


# 0-1 背包（高难 18）
def knapsack(items, capacity):
    dp = [0] * (capacity + 1)
    for w, v in items:
        for j in range(capacity, w - 1, -1):          # 倒序：每个物品只用一次
            dp[j] = max(dp[j], dp[j - w] + v)
    return dp[capacity]


# 近似重复判定（高难 20）：词集合对称差 / 较长一份的词数
def near_duplicate(a, b, ratio):
    if a == b:
        return True
    ta, tb = a.split(), b.split()
    if not ta or not tb:
        return False
    diff = len(set(ta) ^ set(tb))
    return diff <= round(ratio * max(len(ta), len(tb)))


if __name__ == "__main__":
    uf = UnionFind(5)
    uf.union(0, 1); uf.union(1, 2)
    assert uf.find(0) == uf.find(2) and uf.find(3) != uf.find(0)

    assert kth_largest([3, 2, 1, 5, 6, 4], 2) == 5

    assert topo_sort(4, [(0, 1), (1, 2), (0, 3)]) in ([0, 1, 3, 2], [0, 3, 1, 2])
    assert topo_sort(2, [(0, 1), (1, 0)]) is None

    g = {"a": [("b", 1), ("c", 4)], "b": [("c", 2)], "c": []}
    assert dijkstra(g, "a") == {"a": 0, "b": 1, "c": 3}

    n1, n2, n3 = ListNode(1), ListNode(2), ListNode(3)
    n1.next, n2.next, n3.next = n2, n3, n2
    assert detect_cycle(n1) is n2 and detect_cycle(ListNode(1)) is None

    ch = ConsistentHash(["n1", "n2", "n3"])
    before = {k: ch.get(k) for k in map(str, range(1000))}
    ch2 = ConsistentHash(["n1", "n2", "n3", "n4"])
    moved = sum(before[k] != ch2.get(k) for k in before)
    assert moved < 500                                # 加一个节点只迁移一部分（约 1/4）

    tb = TokenBucket(rate=1, capacity=2)
    t0 = tb.last
    assert tb.allow(t0) and tb.allow(t0) and not tb.allow(t0)
    assert tb.allow(t0 + 1.0)

    lfu = LFUCache(2)
    lfu.put(1, 1); lfu.put(2, 2)
    assert lfu.get(1) == 1                            # key1 频率 2
    lfu.put(3, 3)                                     # 淘汰频率最低的 key2
    assert lfu.get(2) == -1 and lfu.get(3) == 3

    assert edit_distance("horse", "ros") == 3
    assert knapsack([(1, 1), (3, 4), (4, 5)], 4) == 5
    assert near_duplicate("graph search 张三 项目", "graph search 张三 项目 负责人", 0.25)
    assert not near_duplicate("天气", "股票", 0.15)
    print("all ok")
```

---

## 排序算法补充

## 排序算法

### 1）冒泡排序（O(N^2)）

循环数组，对比相邻两个数据，前面的数据大于后面的数据则交换位置，否则不变。循环一遍之后，最小的数据会在最前面，数组长度-1，从第二个位置继续循环数组，重复上面过程。

### 2）选择排序（O(N^2)）

选择排序是对冒泡排序的优化，在冒泡排序中，每次满足条件都要交换数据位置，在选择排序中，每次循环找到当前循环最小的数据，存储在临时变量中，循环完成之后与第一个数据交换，之后从第二个数据开始，重复这个操作。

### 3）插入排序（O(N^2)）

将数据插入到一个有序数列中，当数据是无序的，我们需要将第一个数据当成有序数列，将后面的数据依次插入。

### 4）希尔排序（O()）

将数据按一定间隔分成多个数组，对每个数组进行插入排序。

### 5）归并排序

### 6）快排（O(n*logn)）

①先随机找一个基准数，一般以最后一位为基准数。

②分区，将比基准数小的放到左边，比它大的放到右边。

③重复第二步直到每个区间只有一个数。

第二步详细步骤：<https://www.runoob.com/w3cnote/quick-sort.html>

### 关于排序中插入排序使用率远超过冒泡排序的原因

参考：<https://zhuanlan.zhihu.com/p/147678685>

两者时间复杂度都是O（n^2）

这里引入一个概念：**原地排序**

**原地排序算法**：指**空间复杂度**为O（1）的排序算法，空间复杂度为O（1）代表不需要额外的空间或需要少量的额外空间

## 如何评价一个算法？

- 最好情况，最坏情况，平均情况时间复杂度
- 时间复杂度的系数，常数，低阶
- 比较次数和交换（移动）次数
- 内存消耗
- 稳定性：指数组中存在值相等的数据，在排完序之后仍保持原来的顺序

在两种排序有相同的时间复杂度的情况下，其余情况就是要考虑的，从以上几个方向分析这两种排序算法，首先，他们都是原地排序算法，冒泡排序只需要一个额外的空间，插入排序也只需要一个额外的空间，从稳定性方面来分析，冒泡排序因为每次对比都需要交换元素位置，所以稳定性不强，而插入排序只在合适的情况下才进行交换，所以稳定性很强。

---

## 三、数据结构与算法基础

### 1. ★ 时间复杂度怎么算？常见的有哪些？

看输入规模 n 增大时，操作次数的增长量级，忽略常数和低阶项。
`O(1)` < `O(log n)`（二分）< `O(n)`（遍历）< `O(n log n)`（好的排序）< `O(n²)`（双重循环）< `O(2ⁿ)`（穷举子集）< `O(n!)`（全排列）。
空间复杂度同理，看额外占用的内存。**均摊复杂度**：偶尔一次很贵、平均下来很便宜（list 的 append）。

### 2. ★ 数组和链表的区别？

| | 数组 | 链表 |
| --- | --- | --- |
| 内存 | 连续 | 不连续，节点通过指针相连 |
| 随机访问 | O(1) | O(n) |
| 头部插入 / 删除 | O(n) | O(1) |
| 已知位置插入 / 删除 | O(n)（要移动元素） | O(1)（改指针） |
| 缓存友好 | 是（CPU 预读连续内存） | 否 |
| 代表 | Python list、Java ArrayList | Java LinkedList、Redis 的 quicklist（链表 + 数组的混合） |

### 3. ★ 栈和队列？

- 栈：后进先出（LIFO）。用途：函数调用栈、括号匹配、表达式求值、DFS、浏览器后退。Python 用 list 的 `append` / `pop`。
- 队列：先进先出（FIFO）。用途：BFS、任务队列、消息队列。Python 用 `deque` 的 `append` / `popleft`（不要用 list 的 `pop(0)`，O(n)）。
- 优先队列：按优先级出队，底层是堆。

### 4. ★ 哈希表的原理？哈希冲突怎么解决？

- 用哈希函数把键映射到数组下标，平均 O(1) 增删查。
- 冲突（不同的键映射到同一个位置）的解决：
  - **链地址法**：每个槽位挂一个链表（Java HashMap，链表太长转红黑树）；
  - **开放寻址法**：冲突了就按规则探测下一个空位（Python dict）。
- **负载因子** = 元素数 / 槽位数，太高冲突多，超过阈值就扩容 rehash。Redis 的字典用**渐进式 rehash** 避免一次性迁移卡住。
- 缺点：不支持范围查询、不保证有序（Python dict 有序是额外设计的）。

### 5. ★ 树的几种类型，各用在哪？

| 结构 | 特点 | 应用 |
| --- | --- | --- |
| 二叉搜索树（BST） | 左 < 根 < 右；中序遍历是有序的 | 基础，极端情况退化成链表 O(n) |
| AVL 树 | 严格平衡（左右高度差 ≤ 1），查询快，插入删除旋转多 | 读多写少 |
| **红黑树** | 近似平衡（最长路径 ≤ 最短的 2 倍），插入删除旋转少 | Java TreeMap / HashMap 的树化、C++ map、Linux 进程调度 |
| B 树 | 多路平衡树，每个节点存多个键和数据 | 文件系统 |
| **B+ 树** | 数据只在叶子，叶子之间有链表；非叶子只存键，一个节点能放更多键 → 树更矮 | **MySQL / PG 的索引** |
| 字典树（Trie） | 按字符逐层分支 | 前缀匹配、自动补全、敏感词过滤 |
| 堆 | 完全二叉树，父节点 ≤（或 ≥）子节点 | 优先队列、Top K、堆排序 |

### 6. ★ 为什么数据库索引用 B+ 树，不用哈希、红黑树、B 树？

- **哈希**：等值查询 O(1)，但**不支持范围查询和排序**（`WHERE a > 10`、`ORDER BY`）。
- **红黑树**：二叉，树太高。1000 万数据红黑树高约 24 层，每层可能一次磁盘 IO；B+ 树一个节点（16KB 页）能放上千个键，**3–4 层就能存千万级数据**，IO 次数少得多。
- **B 树**：非叶子节点也存数据，一个节点能放的键更少、树更高；范围查询要中序遍历跳来跳去。B+ 树叶子节点有链表，**范围查询顺着链表走**就行。
- 一句话：**数据库瓶颈是磁盘 IO，B+ 树矮胖、范围查询友好**。

### 7. ★ 为什么 Redis 的 ZSet 用跳表而不是红黑树？

跳表实现简单；范围查询（`ZRANGEBYSCORE`）找到起点后顺着链表走即可；插入删除只改局部指针；内存里不需要考虑磁盘 IO。（详见 08 文档第二节）

### 8. ★ 堆是什么？怎么用堆求 Top K？

- 完全二叉树，用数组存储（节点 i 的子节点是 2i+1、2i+2）；小顶堆父节点 ≤ 子节点，堆顶是最小值。插入、弹出 O(log n)，建堆 O(n)。
- **求最大的 K 个数**：维护一个大小为 K 的**小顶堆**，遍历每个数，比堆顶大就替换堆顶。最后堆里就是最大的 K 个。时间 O(n log K)，空间 O(K)，适合海量数据（不用全部排序）。

### 9. 图的基础？

- 存储：邻接矩阵（稠密图）、邻接表（稀疏图，常用）。
- 遍历：**BFS**（队列，求无权图最短路径、层序）、**DFS**（栈 / 递归，求连通性、路径、拓扑）。
- 常见算法：拓扑排序（任务依赖、编译顺序）、Dijkstra（带权最短路径）。
- 我们的知识图谱（Neo4j）本质就是图，多跳查询就是图遍历。

### 10. ★ 常见排序算法对比

| 算法 | 平均 | 最坏 | 空间 | 稳定 | 说明 |
| --- | --- | --- | --- | --- | --- |
| 冒泡 | O(n²) | O(n²) | O(1) | 是 | 教学用 |
| 选择 | O(n²) | O(n²) | O(1) | 否 | |
| 插入 | O(n²) | O(n²) | O(1) | 是 | 基本有序时接近 O(n) |
| **快速排序** | O(n log n) | O(n²) | O(log n) | 否 | 实际最快之一；基准选得差会退化，随机选基准 |
| **归并排序** | O(n log n) | O(n log n) | O(n) | 是 | 稳定，适合外部排序（大文件） |
| **堆排序** | O(n log n) | O(n log n) | O(1) | 否 | |
| 计数 / 桶 / 基数 | O(n + k) | — | O(n + k) | 是 | 数据范围有限时 |
| Timsort | O(n log n) | O(n log n) | O(n) | 是 | Python、Java 对象排序 |
「稳定」：相等元素排序后保持原来的相对顺序。

### 11. ★ 二分查找

前提是有序。O(log n)。易错点：边界（`left <= right` 还是 `<`）、中点溢出（Python 不用担心，Java 写 `left + (right - left) / 2`）、找第一个 / 最后一个满足条件的位置。

### 12. 其他常考结构

- **LRU 缓存**：哈希表 + 双向链表，get / put 都 O(1)（手撕见第四节）。
- **布隆过滤器**：一个位数组 + 多个哈希函数。判断「一定不存在」或「可能存在」，有误判、不能删除。用于缓存穿透防护、爬虫 URL 去重。
- **LSM 树**：写先进内存、再顺序刷成有序文件、后台合并。写入极快、读较慢。用于 RocksDB、LevelDB、HBase、Cassandra（对比 B+ 树：读快写慢）。
- **一致性哈希**：哈希环，节点增减只影响相邻一段的数据，用于分布式缓存、负载均衡（我们的 HAProxy 按用户 ID 一致性哈希）。
- **倒排索引**：词 → 包含这个词的文档列表。Elasticsearch、PG 的 GIN 索引、BM25 检索的基础。
- **HNSW**：分层的近似最近邻图，向量数据库（Qdrant、pgvector）的主流索引。

### 13. 常见算法思想

双指针、滑动窗口、前缀和、哈希计数、二分、递归与回溯、动态规划（最优子结构 + 重叠子问题）、贪心、分治、BFS / DFS、拓扑排序、单调栈。

---

---

## 四、手撕代码（Python 版，必练）

> 面试手撕优先级：LRU > 反转链表 > Top K > 两数之和 > 有效括号 > 合并有序链表 > 二分查找 > 快排 > 层序遍历 > 最长无重复子串。
> 写完要能说出时间 / 空间复杂度。下面的代码都可以直接运行。

```python
from collections import OrderedDict, deque
import heapq
import random


# 1. LRU 缓存（力扣 146）——方法一：OrderedDict（先写这个，再被要求手写链表）
class LRUCacheSimple:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.data = OrderedDict()

    def get(self, key):
        if key not in self.data:
            return -1
        self.data.move_to_end(key)          # 访问过就移到末尾（最新）
        return self.data[key]

    def put(self, key, value):
        if key in self.data:
            self.data.move_to_end(key)
        self.data[key] = value
        if len(self.data) > self.cap:
            self.data.popitem(last=False)   # 弹出最前面（最久未用）


# 1. LRU 缓存——方法二：哈希表 + 双向链表（面试官要的版本），get / put 都是 O(1)
class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map = {}                       # key -> Node
        self.head, self.tail = Node(), Node()   # 哨兵节点，省去判空
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _add_to_front(self, node):          # 头部 = 最近使用
        node.prev, node.next = self.head, self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._add_to_front(node)
        return node.val

    def put(self, key, value):
        if key in self.map:
            self._remove(self.map[key])
        node = Node(key, value)
        self.map[key] = node
        self._add_to_front(node)
        if len(self.map) > self.cap:
            lru = self.tail.prev            # 尾部 = 最久未用
            self._remove(lru)
            del self.map[lru.key]


# 2. 反转链表（力扣 206），O(n) 时间 O(1) 空间
class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


def reverse_list(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev


# 3. Top K：最大的 K 个数，小顶堆 O(n log k)
def top_k(nums, k):
    heap = []
    for x in nums:
        if len(heap) < k:
            heapq.heappush(heap, x)
        elif x > heap[0]:
            heapq.heapreplace(heap, x)      # 弹出堆顶再压入，比先 pop 再 push 快
    return sorted(heap, reverse=True)       # 实际工作中直接 heapq.nlargest(k, nums)


# 4. 两数之和（力扣 1），哈希表 O(n)
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []


# 5. 有效的括号（力扣 20），栈
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack


# 6. 合并两个有序链表（力扣 21）
def merge_two(l1, l2):
    dummy = cur = ListNode()
    while l1 and l2:
        if l1.val <= l2.val:
            cur.next, l1 = l1, l1.next
        else:
            cur.next, l2 = l2, l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next


# 7. 二分查找：返回 target 的下标，不存在返回 -1
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


# 8. 快速排序（原地，随机基准防止退化）
def quick_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    p = random.randint(lo, hi)
    a[p], a[hi] = a[hi], a[p]
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)
    return a


# 9. 二叉树层序遍历（力扣 102），BFS
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def level_order(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
    return res


# 10. 无重复字符的最长子串（力扣 3），滑动窗口
def length_of_longest_substring(s):
    last, start, best = {}, 0, 0
    for i, ch in enumerate(s):
        if ch in last and last[ch] >= start:
            start = last[ch] + 1
        last[ch] = i
        best = max(best, i - start + 1)
    return best


if __name__ == "__main__":
    for cls in (LRUCacheSimple, LRUCache):
        c = cls(2)
        c.put(1, 1); c.put(2, 2)
        assert c.get(1) == 1
        c.put(3, 3)                          # 淘汰 2
        assert c.get(2) == -1 and c.get(3) == 3
    h = ListNode(1, ListNode(2, ListNode(3)))
    r = reverse_list(h)
    assert [r.val, r.next.val, r.next.next.val] == [3, 2, 1]
    assert top_k([3, 1, 5, 12, 2, 11], 3) == [12, 11, 5]
    assert two_sum([2, 7, 11, 15], 9) == [0, 1]
    assert is_valid("()[]{}") and not is_valid("(]")
    m = merge_two(ListNode(1, ListNode(3)), ListNode(2, ListNode(4)))
    out = []
    while m:
        out.append(m.val); m = m.next
    assert out == [1, 2, 3, 4]
    assert binary_search([1, 3, 5, 7], 5) == 2 and binary_search([1, 3], 2) == -1
    assert quick_sort([5, 2, 9, 1, 5, 6]) == [1, 2, 5, 5, 6, 9]
    assert level_order(TreeNode(1, TreeNode(2), TreeNode(3, TreeNode(4)))) == [[1], [2, 3], [4]]
    assert length_of_longest_substring("abcabcbb") == 3
    print("all ok")
```

**多线程手撕题**（Java 面试常考，Python 也可能问）：两个线程交替打印奇偶数、三个线程按顺序打印 ABC。思路：`threading.Condition` 或多个 `Semaphore` 轮流放行；注意虚假唤醒要用 `while` 而不是 `if` 判断条件。

---
