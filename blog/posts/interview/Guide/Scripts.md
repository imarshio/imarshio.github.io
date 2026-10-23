---
title: "验证脚本"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 8
article: false
redirectFrom:
  - /posts/interview/verification/
---

# 验证脚本

以下代码保留原始验证脚本。运行依赖、原始中文文件名及本机服务约定见 [验证记录](./Verification.md)；博客按主题整理后的目录不能直接当作原始运行目录。

- [count_questions.py](#count-questions-py)
- [verify_15.py](#verify-15-py)
- [verify_16.py](#verify-16-py)
- [verify_18.mjs](#verify-18-mjs)
- [verify_20.py](#verify-20-py)
- [verify_existing.py](#verify-existing-py)
- [verify_object_basics.py](#verify-object-basics-py)
- [verify_sources.py](#verify-sources-py)
- [verify_web_gateway.py](#verify-web-gateway-py)
- [verify_wsgi_notes.py](#verify-wsgi-notes-py)
- [web_gateway_demo.py](#web-gateway-demo-py)

<a id="count-questions-py"></a>

## count_questions.py

````python
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
````

<a id="verify-15-py"></a>

## verify_15.py

````python
"""15 的独立自检；仅内存 SQLite / 内存 Celery，不加载项目配置。"""
import uuid
from datetime import datetime
from sqlalchemy import (JSON, ForeignKey, Index, Integer, String, UniqueConstraint,
                        create_engine, event, func, inspect, insert, or_, select, text, update)
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.postgresql import JSONB, insert as pg_insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import (DeclarativeBase, Mapped, Session, mapped_column,
                            relationship, selectinload, with_loader_criteria)
from sqlalchemy.orm.exc import StaleDataError
from celery import Celery, chain, group

class Base(DeclarativeBase):
    pass

class Card(Base):
    __tablename__ = 'cards'
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    org_id: Mapped[int] = mapped_column(default=1)
    status: Mapped[str] = mapped_column(default='pending')
    extra: Mapped[dict] = mapped_column(JSON, default=dict)
    version: Mapped[int] = mapped_column(default=1, nullable=False)
    steps: Mapped[list['Step']] = relationship(back_populates='card')
    __mapper_args__ = {'version_id_col': version}
    __table_args__ = (UniqueConstraint('title'),)

class Step(Base):
    __tablename__ = 'steps'
    id: Mapped[int] = mapped_column(primary_key=True)
    card_id: Mapped[int] = mapped_column(ForeignKey('cards.id'))
    card: Mapped[Card] = relationship(back_populates='steps')

e = create_engine('sqlite://')
Base.metadata.create_all(e)
with Session(e) as s, s.begin():
    c = Card(title='a', steps=[Step()], extra={'x': 1})
    s.add(c)
    s.flush()
    cid = c.id
    assert cid and inspect(c).persistent
with Session(e) as s:
    c = s.get(Card, cid)
    assert s.get(Card, cid) is c
    c.extra['x'] = 2
    s.commit()
    assert c.extra == {'x': 1}  # JSON 原地改动没有标记 dirty
    c.extra = {**c.extra, 'x': 3}
    s.commit()
    assert c.extra == {'x': 3}
    assert len(s.scalars(select(Card).options(selectinload(Card.steps))).one().steps) == 1
    s.rollback()
    with s.begin():
        s.add(Card(title='b'))
        s.flush()
        try:
            with s.begin_nested():
                s.add(Card(title='a'))
                s.flush()
        except IntegrityError:
            pass
        assert s.scalar(select(func.count()).select_from(Card)) == 2
    assert s.scalar(select(Card).where(Card.title == 'b')) is not None
with Session(e) as a, Session(e) as b:
    ca, cb = a.get(Card, cid), b.get(Card, cid)
    ca.status = 'done'
    a.commit()
    cb.status = 'failed'
    try:
        b.commit()
        raise AssertionError('应发生版本冲突')
    except StaleDataError:
        b.rollback()
with Session(e) as s, s.begin():
    s.execute(insert(Card), [{'title': 'c', 'org_id': 2}, {'title': 'd', 'org_id': 2}])
    c = s.scalar(select(Card).where(Card.title == 'c'))
    s.delete(c)
with Session(e) as s:
    assert s.scalar(select(func.count()).select_from(Card)) == 3

# PG 特有行为只编译，不把 SQLite 执行冒充 PG 执行。
stmt = pg_insert(Card).values(title='e', org_id=1).on_conflict_do_update(
    index_elements=['title'], set_={'status': 'done'})
assert 'ON CONFLICT' in str(stmt.compile(dialect=postgresql.dialect()))
assert 'FOR UPDATE SKIP LOCKED' in str(select(Card).with_for_update(skip_locked=True).compile(dialect=postgresql.dialect()))
assert 'FOR KEY SHARE' in str(select(Card).with_for_update(read=True, key_share=True).compile(dialect=postgresql.dialect()))
from sqlalchemy.schema import CreateIndex
idx = Index('ix_cards_pending', Card.status, postgresql_where=text("status = 'pending'"))
assert "WHERE status = 'pending'" in str(CreateIndex(idx).compile(dialect=postgresql.dialect()))
assert 'JSONB' in str(JSONB().compile(dialect=postgresql.dialect()))

class TenantSession(Session):
    pass
@event.listens_for(TenantSession, 'do_orm_execute')
def tenant_filter(state):
    if state.is_select:
        org_id = state.session.info['org_id']
        state.statement = state.statement.options(with_loader_criteria(
            Card, lambda cls: cls.org_id == org_id, include_aliases=True))
with TenantSession(e, info={'org_id': 1}) as s:
    assert all(c.org_id == 1 for c in s.scalars(select(Card)))
with TenantSession(e, info={'org_id': 2}) as s:
    assert [c.title for c in s.scalars(select(Card))] == ['d']

app = Celery('interview', broker='memory://', backend='cache+memory://')
app.conf.update(task_always_eager=True, task_eager_propagates=True,
                task_routes={'interview.add': {'queue': 'calc'}})
@app.task(name='interview.add')
def add(a, b):
    return a + b
@app.task(name='interview.bench', queue='bench')
def bench(x):
    return x
assert chain(add.s(1, 2), add.s(4))().get() == 7
assert group(add.s(i, 1) for i in range(3))().get() == [1, 2, 3]
assert app.amqp.router.route({}, 'interview.add')['queue'].name == 'calc'
# 真正发布到本进程的 memory transport，核对任务对象默认 queue。
app.conf.task_always_eager = False
bench.apply_async(args=[1])
with app.connection_for_read() as conn:
    msg = conn.SimpleQueue('bench').get(block=False)
    assert msg.headers['task'] == 'interview.bench'
    msg.ack()

# 外部幂等方的简化模型：故障发生在外部已成功、本地未落 paid 之间。
payments = {}
order = {'id': '42', 'status': 'pending'}
def recover_charge(crash=False):
    if order['status'] == 'paid':
        return
    order['status'] = 'charging'  # 模拟已提交的短事务；charging 允许恢复
    key = 'order-' + order['id']
    receipt = payments.setdefault(key, 'receipt-42')  # 接收方原子幂等
    if crash:
        raise RuntimeError('外部已成功后崩溃')
    order.update(status='paid', receipt=receipt)
try:
    recover_charge(crash=True)
except RuntimeError:
    pass
recover_charge()
recover_charge()
assert order['status'] == 'paid' and len(payments) == 1
print('15 自检通过：ORM / PG 编译 / 租户过滤 / Celery 本地路由 / 支付恢复模型')
````

<a id="verify-16-py"></a>

## verify_16.py

````python
"""仅连接本机临时 Qdrant 集合和本机 Neo4j 回滚事务，不加载项目配置。"""
import json
import subprocess
import uuid
from collections import defaultdict
from qdrant_client import QdrantClient, models
from neo4j import GraphDatabase

def rrf(branches, k=60):
    if k < 0:
        raise ValueError('k 不能为负')
    scores = defaultdict(float)
    for branch in branches:
        seen = set()
        for rank, pid in enumerate(branch, 1):
            if pid in seen:
                continue
            seen.add(pid)
            scores[pid] += 1 / (k + rank)
    return sorted(scores.items(), key=lambda p: (-p[1], str(p[0])))
assert rrf([['a', 'b'], ['b', 'c']])[0][0] == 'b'
assert abs(dict(rrf([['a'], ['a']]))['a'] - 2 / 61) < 1e-12
assert rrf([]) == []
assert dict(rrf([['a', 'a']]))['a'] == 1 / 61

collection = 'interview_verify_' + uuid.uuid4().hex
q = QdrantClient(url='http://127.0.0.1:6333', timeout=10, check_compatibility=False)
created = False
try:
    q.create_collection(collection,
        vectors_config={'dense': models.VectorParams(size=2, distance=models.Distance.COSINE)},
        sparse_vectors_config={'sparse': models.SparseVectorParams()})
    created = True
    q.upsert(collection, points=[
        models.PointStruct(id=1, vector={'dense': [1., 0.], 'sparse': models.SparseVector(indices=[1], values=[2.])}, payload={'tenant': 'a'}),
        models.PointStruct(id=2, vector={'dense': [1., 0.], 'sparse': models.SparseVector(indices=[1], values=[3.])}, payload={'tenant': 'b'}),
        models.PointStruct(id=3, vector={'dense': [0., 1.], 'sparse': models.SparseVector(indices=[2], values=[1.])}, payload={'tenant': 'a'}),
    ], wait=True)
    f = models.Filter(must=[models.FieldCondition(key='tenant', match=models.MatchValue(value='a'))])
    result = q.query_points(collection, prefetch=[
        models.Prefetch(query=[1., 0.], using='dense', filter=f, limit=3),
        models.Prefetch(query=models.SparseVector(indices=[1], values=[1.]), using='sparse', filter=f, limit=3),
    ], query=models.FusionQuery(fusion=models.Fusion.RRF), limit=3).points
    assert result[0].id == 1 and all(p.payload['tenant'] == 'a' for p in result)
    assert q.count(collection, exact=True).count == 3
finally:
    if created:
        q.delete_collection(collection)
    q.close()

# 仅从指定本机容器配置读取认证，绝不打印凭证、不读取项目 .env。
container = json.loads(subprocess.check_output(['docker', 'inspect', 'neo4j']))[0]
env = dict(x.split('=', 1) for x in container['Config']['Env'] if '=' in x)
auth = env.get('NEO4J_AUTH', '')
if '/' not in auth:
    raise RuntimeError('本机 neo4j 未提供可用 NEO4J_AUTH；需本机认证后重跑')
user, password = auth.split('/', 1)
tag = uuid.uuid4().hex
with GraphDatabase.driver('bolt://127.0.0.1:7687', auth=(user, password), connection_timeout=10) as driver:
    with driver.session(database='neo4j') as session:
        tx = session.begin_transaction(timeout=10)
        try:
            query = '''MERGE (a:InterviewVerify {id: $aid}) SET a.tag=$tag, a.name=$name
                       MERGE (b:InterviewVerify {id: $bid}) SET b.tag=$tag
                       MERGE (a)-[r:INTERVIEW_LINK]->(b) SET r.tag=$tag
                       RETURN a.name AS name'''
            args = dict(aid=tag+'a', bid=tag+'b', tag=tag, name='面试练习')
            assert tx.run(query, **args).single()['name'] == '面试练习'
            tx.run(query, **args).consume()  # 同事务重试不新增第二份
            row = tx.run('MATCH (a:InterviewVerify {tag:$tag})-[r:INTERVIEW_LINK]->(b:InterviewVerify {tag:$tag}) RETURN count(r) AS n', tag=tag).single()
            assert row['n'] == 1
            assert tx.run('UNWIND $xs AS x RETURN sum(x) AS n', xs=[1,2,3]).single()['n'] == 6
        finally:
            tx.rollback()
        assert session.run('MATCH (a:InterviewVerify {tag:$tag}) RETURN count(a) AS n', tag=tag).single()['n'] == 0
print('16 自检通过：RRF / 本机 Qdrant 混合过滤 / 本机 Neo4j MERGE、UNWIND 与回滚')
````

<a id="verify-18-mjs"></a>

## verify_18.mjs

````javascript
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

// 一次运行内只接受更新序号，终态不被进度事件回退。
function reduceRun(state, event) {
  if (event.run !== state.run || event.seq <= state.seq) return state;
  if (['completed', 'failed', 'cancelled'].includes(state.status)) return state;
  return { ...state, seq: event.seq, status: event.status ?? state.status,
    text: state.text + (event.delta ?? '') };
}
const initial = {run:'a', seq:0, status:'streaming', text:''};
const next = reduceRun(initial, {run:'a', seq:1, delta:'你好'});
assert.equal(initial.text, '');
assert.equal(next.text, '你好');
assert.equal(reduceRun(next, {run:'b', seq:2, delta:'错会话'}), next);
assert.equal(reduceRun(next, {run:'a', seq:1, delta:'重复'}), next);
const done = reduceRun(next, {run:'a', seq:2, status:'completed'});
assert.equal(reduceRun(done, {run:'a', seq:3, status:'streaming'}), done);

// 把每个字节都分成一块，验证跨中文字符的增量解码。
const bytes = new TextEncoder().encode('data: 你好\n\ndata: 完成\n\n');
const decoder = new TextDecoder('utf-8', {fatal:true});
let decoded = '';
for (const byte of bytes) decoded += decoder.decode(new Uint8Array([byte]), {stream:true});
decoded += decoder.decode();
assert.equal(decoded, 'data: 你好\n\ndata: 完成\n\n');
// 此处只验证 UTF-8 解码，不把它当完整 SSE parser（还需字段、多行、CRLF 等）。

const source = `console.log('sync');process.nextTick(()=>console.log('tick'));Promise.resolve().then(()=>console.log('promise'));setImmediate(()=>console.log('immediate'));setTimeout(()=>console.log('timer'),0);`;
const cjs = spawnSync(process.execPath, ['--input-type=commonjs', '-e', source], {encoding:'utf8'});
const esm = spawnSync(process.execPath, ['--input-type=module', '-e', source], {encoding:'utf8'});
assert.equal(cjs.status, 0, cjs.stderr);
assert.equal(esm.status, 0, esm.stderr);
const c = cjs.stdout.trim().split('\n'), m = esm.stdout.trim().split('\n');
assert.deepEqual(c.slice(0,3), ['sync','tick','promise']);
assert.deepEqual(m.slice(0,3), ['sync','promise','tick']);
for (const lines of [c,m]) {
  assert.ok(lines.indexOf('timer') > 2 && lines.indexOf('immediate') > 2);
}
console.log('18 自检通过：状态归属/乱序/终态、UTF-8 增量解码、CJS/ESM 调度');
console.log('Node', process.version);
````

<a id="verify-20-py"></a>

## verify_20.py

````python
"""CPython 3.12 内存/执行原理实验，只用标准库与临时文件，不连接任何服务。"""
import ast
import dis
import gc
import platform
import py_compile
import sys
import tempfile
import tracemalloc
import types
import weakref
from pathlib import Path

if sys.implementation.name != 'cpython' or sys.version_info[:2] != (3, 12):
    raise RuntimeError('本实验基线为 CPython 3.12，请使用项目的本机虚拟环境')

class Payload:
    pass

# 名字删除不等于对象销毁；弱引用自身不保活对象。
a = Payload()
r = weakref.ref(a)
b = a
del a
assert r() is b
del b
assert r() is None

# 不依赖精确引用计数，只比较同一普通对象增加一个别名后的变化。
a = Payload()
count = sys.getrefcount(a)
b = a
assert sys.getrefcount(a) == count + 1
del b
assert sys.getrefcount(a) == count
del a
assert not gc.is_tracked(1234567)
assert gc.is_tracked([])

# 禁用自动循环收集不关闭引用计数，手动 collect 也仍然有效。
was_enabled = gc.isenabled()
old_debug = gc.get_debug()
try:
    gc.set_debug(0)
    gc.disable()
    obj = Payload()
    plain = weakref.ref(obj)
    del obj
    assert plain() is None

    obj = Payload()
    obj.link = obj
    cycle = weakref.ref(obj)
    del obj
    assert cycle() is not None
    gc.collect()
    assert cycle() is None

    finalized = []
    class Finalized:
        def __del__(self):
            finalized.append('done')
    obj = Finalized()
    obj.link = obj
    final_ref = weakref.ref(obj)
    del obj
    gc.collect()
    assert final_ref() is None and finalized == ['done']
finally:
    gc.set_debug(old_debug)
    if was_enabled:
        gc.enable()
    else:
        gc.disable()

# defaults/闭包、traceback 与暂停生成器可延长对象存活。
def captured_default():
    obj = Payload()
    return weakref.ref(obj), lambda value=obj: value
r, fn = captured_default()
assert r() is fn()
del fn
gc.collect()
assert r() is None

def captured_cell():
    obj = Payload()
    def fn():
        return obj
    return weakref.ref(obj), fn
r, fn = captured_cell()
assert r() is fn()
del fn
gc.collect()
assert r() is None

def captured_traceback():
    obj = Payload()
    ref = weakref.ref(obj)
    try:
        1 / 0
    except ZeroDivisionError as error:
        return ref, error.__traceback__
r, tb = captured_traceback()
assert r() is not None
del tb
gc.collect()
assert r() is None

def suspended():
    obj = Payload()
    yield weakref.ref(obj)
gen = suspended()
r = next(gen)
assert r() is not None
gen.close()
gc.collect()
assert r() is None

# 弱值缓存不保活值；slots 对弱引用有布局要求。
cache = weakref.WeakValueDictionary()
obj = Payload()
cache['key'] = obj
del obj
assert 'key' not in cache
class Slotted:
    __slots__ = ('value',)
class WeakSlotted:
    __slots__ = ('value', '__weakref__')
x = Slotted()
assert not hasattr(x, '__dict__')
try:
    weakref.ref(x)
except TypeError:
    pass
else:
    raise AssertionError('该 slots 类不应支持弱引用')
x = WeakSlotted()
assert weakref.ref(x)() is x

# getsizeof 不递归；view 保持对底层缓冲的访问，不是深拷贝。
box = [bytearray(10)]
shallow = sys.getsizeof(box)
box[0] = bytearray(100_000)
assert sys.getsizeof(box) == shallow
base = bytearray(b'abcd')
view = memoryview(base)
view[0] = ord('z')
assert base == b'zbcd' and view.obj is base
del base
assert bytes(view) == b'zbcd'
view.release()
try:
    len(view)
except ValueError:
    pass
else:
    raise AssertionError('释放的 view 不应继续读取')

# 弱终结器的回调只捕获独立数据，不捕获目标对象/绑定方法。
finished = []
obj = Payload()
f = weakref.finalize(obj, finished.append, 'released')
del obj
gc.collect()
assert finished == ['released'] and not f.alive

# AST -> code object -> 实际执行，compile 本身不执行代码。
source = 'result = 2 + 3\ndef add(a, b):\n    return a + b\n'
tree = ast.parse(source)
code = compile(tree, '<interview-memory>', 'exec')
assert isinstance(code, types.CodeType)
namespace = {}
assert 'result' not in namespace
exec(code, namespace)
assert namespace['result'] == 5 and namespace['add'](2, 4) == 6
assert isinstance(namespace['add'].__code__, types.CodeType)
assert list(dis.get_instructions(namespace['add']))
assert eval(compile('6 * 7', '<fixed-expression>', 'eval')) == 42

# AST 可表示的结构仍可能在编译阶段被拒绝。
invalid = ast.parse('return 1')
try:
    compile(invalid, '<invalid-context>', 'exec')
except SyntaxError:
    pass
else:
    raise AssertionError('模块顶层 return 应被编译器拒绝')
code = compile('missing_name + 1', '<runtime-name>', 'eval')
try:
    eval(code, {})
except NameError:
    pass
else:
    raise AssertionError('成功编译不保证运行成功')
code = compile('assert False', '<optimize>', 'exec', optimize=1)
exec(code, {})  # 说明 assert 可能被优化移除，不可用于安全校验。

with tempfile.TemporaryDirectory(prefix='interview_python20_') as directory:
    source_path = Path(directory)/'sample.py'
    source_path.write_text('value = 42\n')
    cache_path = Path(py_compile.compile(str(source_path), doraise=True))
    assert cache_path.exists() and cache_path.suffix == '.pyc'

# 控制分配，测跟踪内存，不要求 RSS 随之下降。
tracemalloc.start(5)
try:
    gc.collect()
    before = tracemalloc.take_snapshot()
    current0, _ = tracemalloc.get_traced_memory()
    data = bytearray(2 * 1024 * 1024)
    current1, _ = tracemalloc.get_traced_memory()
    during = tracemalloc.take_snapshot()
    assert current1 - current0 >= len(data)
    assert any(stat.size_diff > 1024 * 1024 for stat in during.compare_to(before, 'lineno'))
    del data
    gc.collect()
    current2, peak = tracemalloc.get_traced_memory()
    assert current1 - current2 > 1024 * 1024
    assert peak >= current1
finally:
    tracemalloc.stop()

print(f'20 自检通过：{platform.python_implementation()} {platform.python_version()}')
print('引用/循环/终结器、持有链、slots/弱引用、缓冲、编译/执行、pyc、tracemalloc 均通过')
````

<a id="verify-existing-py"></a>

## verify_existing.py

````python
"""直接提取文档中的完整自检与 SQL；仅操作本机 postgres15 的回滚事务。"""
import ast
import json
import re
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def blocks(name, language):
    return re.findall(r'^```'+language+r'\n(.*?)^```', (ROOT/name).read_text(), re.M|re.S)
for name in ['10-基础打底.md', '13-数据结构与算法.md']:
    codes = [b for b in blocks(name, 'python') if '__main__' in b and 'assert' in b]
    assert len(codes) == 1, (name, len(codes))
    with tempfile.TemporaryDirectory(prefix='interview_verify_') as directory:
        path = Path(directory)/'check.py'
        path.write_text(codes[0])
        run = subprocess.run([sys.executable, '-I', str(path)], text=True, capture_output=True, timeout=30)
        assert run.returncode == 0, run.stderr
        print(name, run.stdout.strip())

# 15 的省略上下文片段只做语法解析；可执行语义另在 verify_15.py 验证。
codes = blocks('15-SQLAlchemy与Celery.md','python')
for i, code in enumerate(codes,1):
    ast.parse(code, filename=f'15-block-{i}')
print('15 Python 片段语法解析通过：', len(codes))

def pg_rollback(sql):
    schema = 'interview_verify_' + uuid.uuid4().hex
    full = f'BEGIN; CREATE SCHEMA {schema}; SET LOCAL search_path={schema};\n'+sql+'\nROLLBACK;\n'
    run = subprocess.run(['docker','exec','-i','postgres15','psql','-U','xknow','-d','xknow',
                          '-v','ON_ERROR_STOP=1','-X','-q','-A','-t'],
                         input=full, text=True, capture_output=True, timeout=30)
    assert run.returncode == 0, run.stderr
    return run.stdout.strip().splitlines()

text14 = (ROOT/'14-SQL与MySQL.md').read_text().split('## SQL 高难',1)[1].split('# 第二部分',1)[0]
bs = re.findall(r'^```sql\n(.*?)^```',text14,re.S|re.M)
assert len(bs)==15
fixture=bs[-1]
# 10 的题干假设已有表，这里复用 14 的 fixture，再补 users/sales。
fixture10 = fixture + """
CREATE TABLE users(id int, email text);
INSERT INTO users VALUES (1,'a'),(2,'a'),(3,'b'),(4,'c');
CREATE TABLE sales(user_id int, month int, amount int);
INSERT INTO sales VALUES (1,1,10),(1,2,20),(2,1,5);
"""
sql10 = blocks('10-基础打底.md','sql')
assert len(sql10) == 1
statements10=[q.strip() for q in re.sub(r'--[^\n]*','',sql10[0]).split(';') if q.strip()]
wrapped10=[]
for q in statements10:
    if q.startswith('DELETE'):
        wrapped10.append(q+';')
    else:
        wrapped10.append("SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM ("+q+") t;")
r10=[json.loads(l) for l in pg_rollback(fixture10+'\n'+'\n'.join(wrapped10))]
assert len(r10)==8
assert r10[0]==[{'second_highest':200}]
assert len(r10[1])==5
assert r10[2]==[{'email':'a'}]
assert sorted(r['id'] for r in r10[3])==[3,4]
assert [r['running_total'] for r in r10[4]]==[10,25,30]
assert r10[5][0]['days']==3
assert sorted(float(r['retention']) for r in r10[6])==[0.,0.5,1.]
assert sorted((r['user_id'],r['jan'],r['feb']) for r in r10[7])==[(1,10,20),(2,5,None)]
print('10 SQL 9 条语句在回滚事务执行及结果断言通过')

queries=[]
for question, block in enumerate(bs[:12],1):
    no_comments = re.sub(r'--[^\n]*','',block)
    for statement in no_comments.split(';'):
        if statement.strip():
            queries.append((question,statement.strip()))
run_sql = fixture + '\n' + '\n'.join(
    "SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM ("+q+") t;" for _,q in queries)
result=[json.loads(l) for l in pg_rollback(run_sql)]
assert len(result)==13
# 对每题结果做语义断言，不只看执行无异常。
assert result[0] == [{'nth':200}]
assert [(r['user_id'],r['days']) for r in result[1]] == [(1,3)]
assert [float(r['retention']) for r in result[2]] == [0.5,1.0,0.0]
assert [r['running_total'] for r in result[3]] == [10,25,30]
assert list(result[4][0].values()) == [200]
assert list(result[5][0].values()) == [200]
assert sorted(r['events'] for r in result[6]) == [1,1,2]
assert result[7] == [{'viewed':3,'carted':2,'ordered':1}]
assert sorted(r['order_id'] for r in result[8]) == [2,3]
assert result[9] == [{'gap_start':3,'gap_end':4},{'gap_start':7,'gap_end':8}]
assert result[10] == [{'follower':1,'followee':2},{'follower':3,'followee':4}]
assert sorted((r['dept'],r['salary']) for r in result[11]) == [('A',200),('A',200),('B',300)]
assert len(result[12])==13 and result[12][-1]['yoy']==0
assert result[12][0]['mom'] is None and all(r['mom']==0 for r in result[12][1:])
# 偶数样本中位数应取中间两行平均，验证通用写法没有漏掉一行。
median_sql = fixture + '\nDELETE FROM employee WHERE id=5;\n'
median_sql += '\n'.join("SELECT jsonb_agg(t) FROM ("+q+") t;" for number,q in queries if number==5)
medians=[json.loads(l) for l in pg_rollback(median_sql)]
assert all(list(r[0].values()) == [150] for r in medians)
print('14 高难 12 题 / 13 条查询执行及结果断言通过')

# 同一事务中执行两次，断言库存/版本的原子条件更新；不冒充多连接并发压测。
extra = """
CREATE TABLE stock(id int primary key, n int); INSERT INTO stock VALUES (1,1);
PREPARE take_stock(int) AS UPDATE stock SET n=n-1 WHERE id=$1 AND n>0 RETURNING n;
EXECUTE take_stock(1); EXECUTE take_stock(1);
CREATE TABLE cards(id int primary key, title text, version int);
INSERT INTO cards VALUES (1,'old',1);
PREPARE edit_card(text,int,int) AS UPDATE cards SET title=$1,version=version+1 WHERE id=$2 AND version=$3;
EXECUTE edit_card('new',1,1); EXECUTE edit_card('stale',1,1);
SELECT title,version FROM cards WHERE id=1;
"""
assert pg_rollback(extra)==['0','new|2']
print('14 高难 13/14 的库存与版本条件更新通过')
````

<a id="verify-object-basics-py"></a>

## verify_object_basics.py

````python
"""直接执行 21 Python 基础的 object 示例，并核对 3.12 的方法表。"""
import platform
import re
import sys
from pathlib import Path

if sys.implementation.name != 'cpython' or sys.version_info[:2] != (3, 12):
    raise RuntimeError('该方法清单的验证基线为 CPython 3.12')
p = Path(__file__).resolve().parents[1]/'21-Python基础.md'
text = p.read_text().split('### 15. ★ Python 有没有 Java Object',1)[1].split('### 18.',1)[0].split('\n---',1)[0]
blocks = re.findall(r'```python\n(.*?)```',text,re.S)
assert len(blocks)==4
ns = {}
for index, code in enumerate(blocks,1):
    exec(compile(code,f'{p}:object-example-{index}','exec'),ns)
section = text.split('| 分类 | 方法 |',1)[1].split('可以查看 object',1)[0]
listed = set(re.findall(r'__[a-z_]+__',section))
actual = set(object.__dict__) - {'__class__','__doc__'}
assert listed==actual and len(actual)==22,(listed ^ actual)

def raises(kind, callback):
    try:
        callback()
    except kind:
        return
    raise AssertionError(f'预期 {kind.__name__}')
raises(TypeError,lambda: object() < object())
class ValueOnly:
    def __eq__(self,other):
        if not isinstance(other,ValueOnly):
            return NotImplemented
        return True
assert ValueOnly.__hash__ is None
raises(TypeError,lambda:hash(ValueOnly()))
assert '__call__' not in object.__dict__ and '__getattr__' not in object.__dict__
assert str(ns['u'])=='用户：张三' and repr(ns['u'])=="NamedUser(name='张三')"
print('object 基础：4 个文档示例、22 方法清单、比较/哈希边界通过；',platform.python_version())
````

<a id="verify-sources-py"></a>

## verify_sources.py

````python
"""只读核对本轮写到的关键项目事实，不启动应用、不读取 .env。"""
import ast
import json
import re
import subprocess
from pathlib import Path
import yaml
ROOT = Path(__file__).resolve().parents[2]
AI = ROOT/'xknow-ai'
def read(path):
    return (AI/path).read_text()
compose = yaml.safe_load(read('docker-compose/docker-compose-prd.yaml'))['services']
for name in ['backend','console','gateway']:
    assert compose[name]['stop_grace_period']=='120s'
    assert compose[name]['deploy']['update_config']['order']=='start-first'
assert compose['worker']['stop_grace_period']=='3900s'
assert compose['worker']['deploy']['update_config']['order']=='start-first'
assert compose['beat']['stop_grace_period']=='30s'
assert compose['beat']['deploy']['update_config']['order']=='stop-first'
assert compose['beat']['deploy']['replicas']==1
assert 'SYS_ADMIN' in compose['backend']['cap_add']
assert 'SYS_ADMIN' in compose['worker']['cap_add']
entry = read('docker/entrypoint.sh')
assert 'APP_SCOPE=console flask db upgrade' in entry
assert 'exec celery' in entry and 'exec gunicorn' in entry
assert 'celery,ontology_doc,ontology_chat,scheduled,bench' in entry
assert 'PLATFORMS="linux/amd64,linux/arm64"' in read('docker/build.sh')
assert 'engine.dispose(close=False)' in read('app/gunicorn_conf.py')
assert '_DRAIN_WAIT = int(os.getenv("BACKEND_DRAIN_WAIT", "15"))' in read('app/gunicorn_conf.py')
vector = read('app/extended/ext_vector.py')
assert 'models.FusionQuery(fusion=models.Fusion.RRF)' in vector
assert 'model_name="Qdrant/bm25"' in vector
assert '_RRF_K = 60' in read('app/core/graph/graph_store.py')
assert 'read_scope.filter_documents' in read('app/core/agent/tools/vector_tools.py')
reg = read('app/core/agent/tools/__init__.py')
assert len(re.findall(r'^\s+restricted_to_agent="ariadne",', reg, re.M)) == 3
spec = ast.parse(read('app/core/agent/agent_spec.py'))
skeleton = next(n.value for n in spec.body if isinstance(n,ast.AnnAssign) and isinstance(n.target,ast.Name) and n.target.id=='AGENT_SKELETONS')
assert {'vesper','ariadne','cooker','doppel'} <= {ast.literal_eval(k) for k in skeleton.keys}
assert 'backend_for(self.spec.protocol)' in read('app/core/llm/client.py')
assert 'organization > user > global' in read('app/core/agent/tools/skill_tools.py')
assert '_SHUTDOWN_DEADLINE_SECONDS = 3600' in read('app/extended/ext_celery.py')
assert 'time_limit=3600' in read('app/worker/tasks/scheduled_task_task.py')
bench=ast.parse(read('app/worker/tasks/agent_bench_task.py'))
fn=next(n for n in bench.body if isinstance(n,ast.FunctionDef) and n.name=='run_agent_bench')
kw={k.arg:k.value for k in fn.decorator_list[0].keywords}
assert ast.literal_eval(kw['acks_late']) is False and ast.literal_eval(kw['queue'])=='bench'
for repo,versions in [('xknow-frontend',{'next':'15.3.6','react':'19.1.0'}),
                      ('xknow-console',{'next':'16.2.9','react':'19.2.7'}),
                      ('xknow-gateway',{'next':'16.2.9','react':'19.2.7'})]:
    deps=json.loads((ROOT/repo/'package.json').read_text())['dependencies']
    assert all(deps[k]==v for k,v in versions.items())
    assert 'rewrites' in (ROOT/repo/'next.config.ts').read_text()
server=(ROOT/'xknow-payment/src/server.js').read_text()
assert server.index('mountNotifyRoute(app, config, wechatPay)') < server.index('app.use(express.json')
assert 'express.raw' in (ROOT/'xknow-payment/src/routes/api.js').read_text()
subprocess.run(['bash','-n',str(AI/'docker/entrypoint.sh')],check=True)
subprocess.run(['bash','-n',str(AI/'docker/build.sh')],check=True)
print('关键源码/版本/部署配置与 bash 语法核对通过（只读）')
````

<a id="verify-web-gateway-py"></a>

## verify_web_gateway.py

````python
"""协议接口断言 + 临时 loopback 服务冒烟；不加载业务应用，不连接数据库。"""
import asyncio
import importlib.util
import os
import signal
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import ProxyHandler, build_opener
from wsgiref.util import setup_testing_defaults
from wsgiref.validate import validator

ROOT = Path(__file__).resolve().parent
source = ROOT/'web_gateway_demo.py'
spec = importlib.util.spec_from_file_location('gateway_demo', source)
demo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(demo)

environ = {}
setup_testing_defaults(environ)
environ['QUERY_STRING'] = ''
response = {}
def start_response(status, headers, exc_info=None):
    response.update(status=status, headers=dict(headers))
chunks = validator(demo.wsgi_app)(environ, start_response)
try:
    assert b''.join(chunks) == b'WSGI OK\n'
finally:
    chunks.close()
assert response['status'] == '200 OK'
assert response['headers']['Content-Length'] == '8'

async def check_asgi():
    sent = []
    events = iter([{'type':'http.request','body':b'a','more_body':True},
                   {'type':'http.request','body':b'b','more_body':False}])
    async def receive():
        return next(events)
    async def send(event):
        sent.append(event)
    await demo.asgi_app({'type':'http'}, receive, send)
    assert [e['type'] for e in sent] == ['http.response.start','http.response.body']
    assert sent[0]['status'] == 200 and sent[1]['body'] == b'ASGI OK\n'
    sent.clear()
    async def disconnected():
        return {'type':'http.disconnect'}
    await demo.asgi_app({'type':'http'}, disconnected, send)
    assert not sent
asyncio.run(check_asgi())
print('WSGI 标准校验与 ASGI 请求分块/断开事件断言通过')

# 忽略代理环境变量，固定连接本机临时端口。应用从临时目录导入。
opener = build_opener(ProxyHandler({}))
def smoke(kind, expected):
    with tempfile.TemporaryDirectory(prefix='interview_web_gateway_') as directory:
        directory = Path(directory)
        (directory/'gateway_demo.py').write_bytes(source.read_bytes())
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0))
            port = sock.getsockname()[1]
        if kind == 'gunicorn':
            args = ['-m','gunicorn','--chdir',str(directory),
                    '--bind',f'127.0.0.1:{port}','--workers','1',
                    '--worker-class','sync','gateway_demo:wsgi_app']
        else:
            args = ['-m','uvicorn','gateway_demo:asgi_app','--app-dir',str(directory),
                    '--host','127.0.0.1','--port',str(port),'--lifespan','off']
        log_path = directory/'server.log'
        with log_path.open('w') as log:
            proc = subprocess.Popen([sys.executable,'-I',*args],cwd=directory,
                                    stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
            try:
                deadline = time.monotonic()+12
                while True:
                    if proc.poll() is not None:
                        raise AssertionError(f'{kind} 启动失败：{log_path.read_text()}')
                    try:
                        with opener.open(f'http://127.0.0.1:{port}/',timeout=1) as reply:
                            assert reply.status==200 and reply.read()==expected
                        break
                    except (URLError,TimeoutError,ConnectionError):
                        if time.monotonic() >= deadline:
                            raise AssertionError(f'{kind} 请求超时：{log_path.read_text()}')
                        time.sleep(0.05)
            finally:
                # 仅停止本次新建的独立进程组，含 Gunicorn worker。
                if proc.poll() is None:
                    os.killpg(proc.pid,signal.SIGTERM)
                try:
                    proc.wait(timeout=6)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid,signal.SIGKILL)
                    proc.wait(timeout=3)
        print(f'{kind} 本机 HTTP 冒烟通过，子进程已停止')
smoke('gunicorn',b'WSGI OK\n')
smoke('uvicorn',b'ASGI OK\n')
````

<a id="verify-wsgi-notes-py"></a>

## verify_wsgi_notes.py

````python
"""笔记的 WSGI 示例、教学提交模型，以及本机 Gunicorn 两 worker / preload 实验。"""
import io
import os
import re
import signal
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import ProxyHandler, build_opener
from wsgiref.util import setup_testing_defaults
from wsgiref.validate import validator
import json

ROOT = Path(__file__).resolve().parents[1]
notes = (ROOT/'09-Flask专题.md').read_text().split('## 〇附、WSGI 学习笔记',1)[1].split('## 一、基础',1)[0]
codes = re.findall(r'```python\n(.*?)```',notes,re.S)
assert len(codes)==1
ns = {}
exec(compile(codes[0],'<document-wsgi-example>','exec'),ns)
application=ns['application']
environ={}
setup_testing_defaults(environ)
environ['QUERY_STRING']=''
assert isinstance(environ['wsgi.input'].read(0),bytes)
assert isinstance(environ['wsgi.version'],tuple)
assert not isinstance(environ['wsgi.multithread'],str)
assert bool(environ['wsgi.multithread']) is False
seen={}
def start_response(status,headers,exc_info=None):
    seen.update(status=status,headers=dict(headers))
    return lambda data:None
result=validator(application)(environ,start_response)
try:
    assert b''.join(result)==b'Hello, WSGI!'
finally:
    result.close()
assert seen['status']=='200 OK' and seen['headers']['Content-Type']=='text/plain; charset=utf-8'

# 仅模拟本笔记讨论的提交/清理边界，不声称这是完整 WSGI 或 HTTP 服务器。
class TeachingGateway:
    def __init__(self):
        self.pending=None
        self.sent=False
        self.committed=None
        self.body=[]
    def start_response(self,status,headers,exc_info=None):
        try:
            if exc_info is not None:
                if self.sent:
                    raise exc_info[1].with_traceback(exc_info[2])
            elif self.pending is not None:
                raise AssertionError('重复登记必须提供 exc_info')
            self.pending=(status,headers)
        finally:
            exc_info=None
        return self.write
    def write(self,data):
        assert isinstance(data,bytes) and self.pending is not None
        if not self.sent:
            self.committed=self.pending
            self.sent=True
        self.body.append(data)
    def run(self,app,limit=None):
        result=app(environ,self.start_response)
        try:
            for index,data in enumerate(result,1):
                if data:
                    self.write(data)
                if limit is not None and index>=limit:
                    break
            if not self.sent:
                self.write(b'')
        finally:
            if hasattr(result,'close'):
                result.close()

h=[('Content-Type','text/plain')]
g=TeachingGateway()
assert callable(g.start_response('200 OK',h)) and not g.sent
try:
    raise ValueError('before commit')
except ValueError:
    g.start_response('500 Internal Server Error',h,sys.exc_info())
assert not g.sent
g.write(b'error')
assert g.committed[0]=='500 Internal Server Error'
g=TeachingGateway()
g.start_response('200 OK',h)
g.write(b'partial')
try:
    raise ValueError('after commit')
except ValueError:
    info=sys.exc_info()
    try:
        g.start_response('500 Internal Server Error',h,info)
    except ValueError as raised:
        assert raised is info[1]
    else:
        raise AssertionError('提交头后应重抛原异常')
    finally:
        info=None
assert g.committed[0]=='200 OK'

closed=[]
g=TeachingGateway()
def lazy(env,start):
    def chunks():
        try:
            start('200 OK',h)
            yield b''
            assert not g.sent
            yield b'lazy'
        finally:
            closed.append('normal')
    return chunks()
g.run(lazy)
assert closed==['normal'] and g.body==[b'lazy']

class Body:
    def __init__(self,fail=False):
        self.index=0
        self.closed=False
        self.fail=fail
    def __iter__(self):return self
    def __next__(self):
        self.index+=1
        if self.index==1:return b'first'
        if self.fail:raise RuntimeError('iteration failed')
        if self.index==2:return b'second'
        raise StopIteration
    def close(self):self.closed=True
for fail,limit in [(False,None),(False,1),(True,None)]:
    body=Body(fail)
    def app(env,start):
        start('200 OK',h)
        return body
    try:
        TeachingGateway().run(app,limit)
    except RuntimeError:
        assert fail
    else:
        assert not fail
    assert body.closed
empty=TeachingGateway()
def empty_app(env,start):
    start('200 OK',h)
    return []
empty.run(empty_app)
assert empty.sent and empty.body==[b'']
print('文档 WSGI 示例、environ 类型、延迟头/exc_info 与正常/提前/异常 close 校验通过')

# 独立的最小 Flask 模块。不会导入项目 app.py，不连接任何业务服务。
source='''import os
from flask import Flask, jsonify
loaded_pid=os.getpid()
app=Flask(__name__)
@app.get('/pid')
def pid():
    return jsonify(pid=os.getpid(),ppid=os.getppid(),loaded_pid=loaded_pid,callable_app=callable(app))
'''
opener=build_opener(ProxyHandler({}))
for preload in [False,True]:
    with tempfile.TemporaryDirectory(prefix='interview_wsgi_notes_') as folder:
        folder=Path(folder)
        (folder/'pid_app.py').write_text(source)
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0))
            port=sock.getsockname()[1]
        args=[sys.executable,'-I','-m','gunicorn','--chdir',str(folder),
              '--bind',f'127.0.0.1:{port}','--workers','2','--worker-class','sync',
              '--access-logfile','-', 'pid_app:app']
        if preload:args.insert(-1,'--preload')
        log_path=folder/'server.log'
        with log_path.open('w') as log:
            proc=subprocess.Popen(args,cwd=folder,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
            try:
                deadline=time.monotonic()+12
                while True:
                    if proc.poll() is not None:
                        raise AssertionError(log_path.read_text())
                    workers=set(map(int,re.findall(r'Booting worker with pid: (\d+)',log_path.read_text())))
                    if len(workers)==2:
                        try:
                            with opener.open(f'http://127.0.0.1:{port}/pid',timeout=1) as response:
                                data=json.load(response)
                            break
                        except (URLError,TimeoutError,ConnectionError):
                            pass
                    if time.monotonic()>deadline:
                        raise AssertionError('本机 worker 启动超时：'+log_path.read_text())
                    time.sleep(0.05)
                assert data['pid'] in workers and data['ppid']==proc.pid and data['callable_app']
                assert data['loaded_pid']==(proc.pid if preload else data['pid'])
                # 只检查本次 master 的直接子进程数量，不打印系统其他进程信息。
                output=subprocess.check_output(['ps','-axo','pid=,ppid='],text=True)
                children={int(pid) for pid,ppid in (line.split() for line in output.splitlines()) if int(ppid)==proc.pid}
                assert children==workers,children
            finally:
                if proc.poll() is None:os.killpg(proc.pid,signal.SIGTERM)
                try:proc.wait(timeout=6)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid,signal.SIGKILL)
                    proc.wait(timeout=3)
        print(f'Gunicorn 两 worker / preload={preload} 的 PID 与加载进程断言通过；已停止临时进程')
````

<a id="web-gateway-demo-py"></a>

## web_gateway_demo.py

````python
"""教学用最小 WSGI / HTTP ASGI 应用，无项目依赖，不支持 WebSocket/lifespan。"""

def wsgi_app(environ, start_response):
    body = b'WSGI OK\n'
    start_response('200 OK', [
        ('Content-Type', 'text/plain; charset=utf-8'),
        ('Content-Length', str(len(body))),
    ])
    return [body]


async def asgi_app(scope, receive, send):
    if scope['type'] != 'http':
        raise NotImplementedError('此教学示例只实现 HTTP')
    while True:
        event = await receive()
        if event['type'] == 'http.disconnect':
            return
        if event['type'] != 'http.request':
            raise ValueError('不支持的 HTTP 事件')
        if not event.get('more_body', False):
            break
    body = b'ASGI OK\n'
    await send({
        'type': 'http.response.start', 'status': 200,
        'headers': [(b'content-type', b'text/plain; charset=utf-8'),
                    (b'content-length', str(len(body)).encode('ascii'))],
    })
    await send({'type': 'http.response.body', 'body': body, 'more_body': False})
````
