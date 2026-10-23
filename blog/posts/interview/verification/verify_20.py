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
