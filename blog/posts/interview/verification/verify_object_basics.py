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
