import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as l,o as t,c as o,d as n,e as s,f as c,b as e}from"./app-DntpMp77.js";const r={},p=e('<p>当你到手一抬服务器后，你会干什么？</p><p>当然，这也取决于你的服务器配置。</p><h2 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx"><span>Nginx</span></a></h2><p>需要的配置</p><ul><li>内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量</li><li>磁盘：越大越好啦</li><li>CPU：取决于连接数，当然是越大越好，1C也是可以的</li></ul><h3 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h3>',6),d={href:"https://nginx.org/en/linux_packages.html#RHEL",target:"_blank",rel:"noopener noreferrer"},u=e(`<p>CentOS 7.x</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 下载工具包</span>
<span class="token function">sudo</span> yum <span class="token function">install</span> yum-utils
<span class="token comment"># 下载Nginx</span>
<span class="token function">sudo</span> yum <span class="token function">install</span> nginx

<span class="token comment"># 查看安装位置</span>
<span class="token function">whereis</span> nginx

<span class="token comment"># 输出：nginx: /usr/sbin/nginx /usr/lib64/nginx /etc/nginx /usr/share/nginx /usr/share/man/man8/nginx.8.gz /usr/share/man/man3/nginx.3pm.gz</span>
<span class="token comment"># /usr/sbin/nginx               启动脚本</span>
<span class="token comment"># /usr/lib64/nginx              存放nginx的模块</span>
<span class="token comment"># /etc/nginx                    存放nginx的配置文件和一些文件</span>
<span class="token comment"># /usr/share/nginx              存放nginx的静态文件和模块</span>
<span class="token comment"># /usr/lib/systemd/system/nginx 存放nginx的服务模块</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h3><p>安装后的默认配置</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>user nginx<span class="token punctuation">;</span>
<span class="token comment"># worker节点数量，等于内核数量</span>
worker_processes auto<span class="token punctuation">;</span>
error_log /var/log/nginx/error.log<span class="token punctuation">;</span>
pid /run/nginx.pid<span class="token punctuation">;</span>

<span class="token comment"># Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.</span>
include /usr/share/nginx/modules/*.conf<span class="token punctuation">;</span>

events <span class="token punctuation">{</span>
    <span class="token comment"># worker 支持的最大链接数量</span>
    worker_connections <span class="token number">1024</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

http <span class="token punctuation">{</span>
    log_format  main  <span class="token string">&#39;$remote_addr - $remote_user [$time_local] &quot;$request&quot; &#39;</span>
                      <span class="token string">&#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;</span>
                      <span class="token string">&#39;&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot;&#39;</span><span class="token punctuation">;</span>

    access_log  /var/log/nginx/access.log  main<span class="token punctuation">;</span>

    sendfile            on<span class="token punctuation">;</span>
    tcp_nopush          on<span class="token punctuation">;</span>
    tcp_nodelay         on<span class="token punctuation">;</span>
    keepalive_timeout   <span class="token number">65</span><span class="token punctuation">;</span>
    types_hash_max_size <span class="token number">4096</span><span class="token punctuation">;</span>

    include             /etc/nginx/mime.types<span class="token punctuation">;</span>
    default_type        application/octet-stream<span class="token punctuation">;</span>

    <span class="token comment"># Load modular configuration files from the /etc/nginx/conf.d directory.</span>
    <span class="token comment"># See http://nginx.org/en/docs/ngx_core_module.html#include</span>
    <span class="token comment"># for more information.</span>
    include /etc/nginx/conf.d/*.conf<span class="token punctuation">;</span>

    server <span class="token punctuation">{</span>
        listen       <span class="token number">80</span><span class="token punctuation">;</span>
        listen       <span class="token punctuation">[</span>::<span class="token punctuation">]</span>:80<span class="token punctuation">;</span>
        <span class="token comment"># _ 默认代表 localhost</span>
        server_name  _<span class="token punctuation">;</span>
        root         /usr/share/nginx/html<span class="token punctuation">;</span>

        <span class="token comment"># Load configuration files for the default server block.</span>
        include /etc/nginx/default.d/*.conf<span class="token punctuation">;</span>

        error_page <span class="token number">404</span> /404.html<span class="token punctuation">;</span>
        location <span class="token operator">=</span> /404.html <span class="token punctuation">{</span>
        <span class="token punctuation">}</span>

        error_page <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span> /50x.html<span class="token punctuation">;</span>
        location <span class="token operator">=</span> /50x.html <span class="token punctuation">{</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token comment"># Settings for a TLS enabled server.</span>
<span class="token comment">#</span>
<span class="token comment">#    server {</span>
<span class="token comment">#        listen       443 ssl http2;</span>
<span class="token comment">#        listen       [::]:443 ssl http2;</span>
<span class="token comment">#        server_name  _;</span>
<span class="token comment">#        root         /usr/share/nginx/html;</span>
<span class="token comment">#</span>
<span class="token comment">#        ssl_certificate &quot;/etc/pki/nginx/server.crt&quot;;</span>
<span class="token comment">#        ssl_certificate_key &quot;/etc/pki/nginx/private/server.key&quot;;</span>
<span class="token comment">#        ssl_session_cache shared:SSL:1m;</span>
<span class="token comment">#        ssl_session_timeout  10m;</span>
<span class="token comment">#        ssl_ciphers HIGH:!aNULL:!MD5;</span>
<span class="token comment">#        ssl_prefer_server_ciphers on;</span>
<span class="token comment">#</span>
<span class="token comment">#        # Load configuration files for the default server block.</span>
<span class="token comment">#        include /etc/nginx/default.d/*.conf;</span>
<span class="token comment">#</span>
<span class="token comment">#        error_page 404 /404.html;</span>
<span class="token comment">#            location = /40x.html {</span>
<span class="token comment">#        }</span>
<span class="token comment">#</span>
<span class="token comment">#        error_page 500 502 503 504 /50x.html;</span>
<span class="token comment">#            location = /50x.html {</span>
<span class="token comment">#        }</span>
<span class="token comment">#    }</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="mysql" tabindex="-1"><a class="header-anchor" href="#mysql"><span>Mysql</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="redis" tabindex="-1"><a class="header-anchor" href="#redis"><span>Redis</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="kafka" tabindex="-1"><a class="header-anchor" href="#kafka"><span>Kafka</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="postgresql" tabindex="-1"><a class="header-anchor" href="#postgresql"><span>Postgresql</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul>`,17);function m(v,h){const a=l("ExternalLinkIcon");return t(),o("div",null,[p,n("p",null,[s("参照："),n("a",d,[s("RHEL系Linux安装nginx"),c(a)])]),u])}const g=i(r,[["render",m],["__file","ECS Init.html.vue"]]),x=JSON.parse('{"path":"/posts/notes/ECS%20Init.html","title":"What would you do if you have a ECS server?","lang":"en-US","frontmatter":{"icon":"pen-to-square","date":"2024-03-19T00:00:00.000Z","category":["ECS"],"title":"What would you do if you have a ECS server?","description":"当你到手一抬服务器后，你会干什么？ 当然，这也取决于你的服务器配置。 Nginx 需要的配置 内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量 磁盘：越大越好啦 CPU：取决于连接数，当然是越大越好，1C也是可以的 安装 参照：RHEL系Linux安装nginx CentOS 7.x 配置 安装后的默认配置 Mysql 需...","head":[["meta",{"property":"og:url","content":"https://imarshio.github.io/posts/notes/ECS%20Init.html"}],["meta",{"property":"og:site_name","content":"Blog"}],["meta",{"property":"og:title","content":"What would you do if you have a ECS server?"}],["meta",{"property":"og:description","content":"当你到手一抬服务器后，你会干什么？ 当然，这也取决于你的服务器配置。 Nginx 需要的配置 内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量 磁盘：越大越好啦 CPU：取决于连接数，当然是越大越好，1C也是可以的 安装 参照：RHEL系Linux安装nginx CentOS 7.x 配置 安装后的默认配置 Mysql 需..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-03-20T14:11:41.000Z"}],["meta",{"property":"article:author","content":"Marshio"}],["meta",{"property":"article:published_time","content":"2024-03-19T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-20T14:11:41.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"What would you do if you have a ECS server?\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-03-19T00:00:00.000Z\\",\\"dateModified\\":\\"2024-03-20T14:11:41.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Marshio\\",\\"url\\":\\"https://marshio.com\\"}]}"]]},"headers":[{"level":2,"title":"Nginx","slug":"nginx","link":"#nginx","children":[{"level":3,"title":"安装","slug":"安装","link":"#安装","children":[]},{"level":3,"title":"配置","slug":"配置","link":"#配置","children":[]}]},{"level":2,"title":"Mysql","slug":"mysql","link":"#mysql","children":[]},{"level":2,"title":"Redis","slug":"redis","link":"#redis","children":[]},{"level":2,"title":"Kafka","slug":"kafka","link":"#kafka","children":[]},{"level":2,"title":"Postgresql","slug":"postgresql","link":"#postgresql","children":[]}],"git":{"createdTime":1710904238000,"updatedTime":1710943901000,"contributors":[{"name":"marshio","email":"marshioman@gmail.com","commits":2}]},"readingTime":{"minutes":1.48,"words":445},"filePathRelative":"posts/notes/ECS Init.md","localizedDate":"March 19, 2024","excerpt":"<p>当你到手一抬服务器后，你会干什么？</p>\\n<p>当然，这也取决于你的服务器配置。</p>\\n<h2>Nginx</h2>\\n<p>需要的配置</p>\\n<ul>\\n<li>内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量</li>\\n<li>磁盘：越大越好啦</li>\\n<li>CPU：取决于连接数，当然是越大越好，1C也是可以的</li>\\n</ul>\\n<h3>安装</h3>\\n<p>参照：<a href=\\"https://nginx.org/en/linux_packages.html#RHEL\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">RHEL系Linux安装nginx</a></p>","autoDesc":true}');export{g as comp,x as data};
