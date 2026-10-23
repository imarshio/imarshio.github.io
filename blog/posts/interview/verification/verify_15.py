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
