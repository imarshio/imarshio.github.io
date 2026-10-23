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
