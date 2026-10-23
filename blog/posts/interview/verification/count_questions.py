"""按学科/难度统计题目；仅标准题目格式，不计答案步骤、代码、速查表。"""
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEVELS = ('入门', '中等', '高难')
rows = []

def lines_outside_code(path):
    fence = False
    for number, line in enumerate(path.read_text().splitlines(), 1):
        if re.match(r'^\s*```', line):
            fence = not fence
            continue
        if not fence:
            yield number, line
    assert not fence, f'{path.name} 代码围栏未闭合'

# 02 的小节是复习提纲；Python 前三节合并，其余独立学科采用完整版。
p = ROOT / '02-后端八股.md'
subjects = {'一': 'Python（语言/并发/工程化）', '二': 'Python（语言/并发/工程化）',
            '三': 'Python（语言/并发/工程化）', '七': '系统设计', '八': '安全', '九': 'Linux'}
counts = defaultdict(Counter)
where = defaultdict(list)
subject = difficulty = None
for number, line in lines_outside_code(p):
    m = re.match(r'^## ([一二三四五六七八九十]+)、', line)
    if m:
        subject, difficulty = subjects.get(m[1]), None
    elif line.startswith('## '):
        subject = difficulty = None
    m = re.match(r'^### (入门|中等|高难)', line)
    if m:
        difficulty = m[1]
    if subject and difficulty and re.match(r'^\d+\.\s+\*\*', line):
        counts[subject][difficulty] += 1
        where[subject].append(number)
for subject, count in counts.items():
    rows.append((subject, p.name, count))

# 03/07/08/09 旧格式：编号加粗题干；场景题本身一题，答案步骤不算。
for prefix, subject in [('03-', 'FastAPI'), ('07-', 'PostgreSQL'), ('08-', 'Redis'), ('09-', 'Flask')]:
    p = next(ROOT.glob(prefix+'*.md'))
    count = Counter()
    difficulty = None
    for number, line in lines_outside_code(p):
        if line.startswith('## '):
            difficulty = '入门' if '入门速答' in line else None
        m = re.match(r'^### (入门|中等|高难)', line)
        if m:
            difficulty = m[1]
        if re.match(r'^### 场景 [\dA-Z]+[：:]', line):
            count['高难'] += 1
            difficulty = None
        elif difficulty and re.match(r'^\d+\.\s+\*\*', line):
            count[difficulty] += 1
    rows.append((subject, p.name, count))

# 11–20 新格式：只认 ### 数字. 题干；不把答案中的编号列表算题。
specialty = None
for prefix in range(11, 21):
    p = next(ROOT.glob(f'{prefix:02d}-*.md'))
    counts = defaultdict(Counter)
    default = {11:'计算机网络',12:'操作系统',13:'数据结构与算法',17:'Docker 与部署',19:'Agent',20:'Python 运行时'}.get(prefix)
    subject, difficulty = default, None
    sequence = []
    def finish():
        if sequence:
            assert sequence == list(range(1, len(sequence)+1)), f'{p.name} {subject} {difficulty} 编号不连续: {sequence}'
    for number, line in lines_outside_code(p):
        if line.startswith('## '):
            finish()
            sequence = []
            difficulty = None
            m = re.match(r'^## (?:(.*?)\s+)?(入门|中等|高难)', line)
            if m:
                subject = m[1] or default
                difficulty = m[2]
        m = re.match(r'^### (\d+)\.', line)
        if m and subject and difficulty:
            counts[subject][difficulty] += 1
            sequence.append(int(m[1]))
    finish()
    for subject, count in counts.items():
        if prefix == 20:
            specialty = (subject, p.name, count)
        else:
            rows.append((subject, p.name, count))

assert len(rows) == 22, f'学科遗漏或误分组：{len(rows)}'
failures = [f'{s}/{d}={c[d]}' for s,_,c in rows for d in LEVELS if c[d] < 20]
assert not failures, '未达标：'+', '.join(failures)
output = ['# 题数统计', '', '统计日期：2026-10-23。运行 `python3 -I 面试准备/验证/count_questions.py` 可重新生成。', '',
          '每个学科按指定完整版统计，不把多份文档的重复题相加。Python 的语言、并发、工程化合为一科；02 的网络/SQLAlchemy/Celery 清单分别由 11/15 覆盖。系统设计、安全、Linux 单独验收。', '',
          '旧格式只计难度小节里的编号加粗题干，场景标题单独计一题；新格式只计编号三级标题。代码、答案步骤、速查表、测试数据与口述材料不计。01、04、05、06、10、21 是口述/速查/基础导读/补充练习，不作为独立学科叠加；Agent 与前端的完整版分别是 19/18。Java、Kafka 按要求免于最低题数检查。', '',
          '| 学科 | 完整版 | 入门 | 中等 | 高难 | 验收 |', '|---|---|---:|---:|---:|---|']
for subject, filename, count in rows:
    output.append(f'| {subject} | [{filename}]({filename}) | {count["入门"]} | {count["中等"]} | {count["高难"]} | 通过 |')
total = sum(sum(c.values()) for _,_,c in rows)
output += ['', f'共 **{len(rows)} 个学科、{len(rows)*3} 个档位、{total} 题**，每档均不少于 20 题。新增 16–19 共 420 题。题数通过不等于旧稿所有技术结论已逐条复核，代码运行范围见 [验证记录.md](验证记录.md)。', '']
assert specialty is not None, '缺少 20 的运行时专项'
subject, filename, count = specialty
assert all(count[d] >= 20 for d in LEVELS), f'专项未达标：{count}'
output += ['## 专项补充（单列验收）', '',
           'Python 运行时与主表 Python 有概念交叉，保留单独练习与计数，不重复叠加成去重总题数。', '',
           '| 专项 | 文件 | 入门 | 中等 | 高难 |', '|---|---|---:|---:|---:|',
           f'| {subject} | [{filename}]({filename}) | {count["入门"]} | {count["中等"]} | {count["高难"]} |', '']
(ROOT/'题数统计.md').write_text('\n'.join(output))
for subject, _, count in rows:
    print(subject, '/'.join(str(count[d]) for d in LEVELS))
print(f'通过：{len(rows)} 学科 / {len(rows)*3} 档位 / {total} 题')

print('另列 Python 运行时专项：'+'/'.join(str(specialty[2][d]) for d in LEVELS))
