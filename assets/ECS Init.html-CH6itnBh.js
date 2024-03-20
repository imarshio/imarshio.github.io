import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as i,o as t,c as l,d as n,e as s,f as o,b as c}from"./app-CfnGUyq9.js";const r={},p=n("p",null,"当你到手一台服务器后，你会干什么？看看我都会做啥吧。",-1),d=n("h2",{id:"安装nginx-must",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装nginx-must"},[n("span",null,"安装Nginx（Must）")])],-1),u=n("p",null,"需要的配置",-1),m=n("ul",null,[n("li",null,"内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量"),n("li",null,"磁盘：越大越好啦"),n("li",null,"CPU：取决于连接数，当然是越大越好，1C也是可以的")],-1),v=n("h3",{id:"安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装"},[n("span",null,"安装")])],-1),h={href:"https://nginx.org/en/linux_packages.html#RHEL",target:"_blank",rel:"noopener noreferrer"},b=c(`<p>CentOS 7.x</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 下载工具包</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装mysql-option" tabindex="-1"><a class="header-anchor" href="#安装mysql-option"><span>安装Mysql（Option）</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="安装redis-option" tabindex="-1"><a class="header-anchor" href="#安装redis-option"><span>安装Redis（Option）</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="安装kafka-option" tabindex="-1"><a class="header-anchor" href="#安装kafka-option"><span>安装Kafka（Option）</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="安装postgresql-option" tabindex="-1"><a class="header-anchor" href="#安装postgresql-option"><span>安装Postgresql（Option）</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul>`,17);function k(g,x){const e=i("ExternalLinkIcon");return t(),l("div",null,[p,d,u,m,v,n("p",null,[s("参照："),n("a",h,[s("RHEL系Linux安装nginx"),o(e)])]),b])}const y=a(r,[["render",k],["__file","ECS Init.html.vue"]]),q=JSON.parse('{"path":"/posts/notes/Environment/ECS%20Init.html","title":"What would you do if you have a ECS server?","lang":"en-US","frontmatter":{"icon":"pen-to-square","date":"2024-03-19T00:00:00.000Z","category":["ECS"],"title":"What would you do if you have a ECS server?","description":"当你到手一台服务器后，你会干什么？看看我都会做啥吧。 安装Nginx（Must） 需要的配置 内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量 磁盘：越大越好啦 CPU：取决于连接数，当然是越大越好，1C也是可以的 安装 参照：RHEL系Linux安装nginx CentOS 7.x 配置 安装后的默认配置 安装Mysql...","head":[["meta",{"property":"og:url","content":"https://imarshio.github.io/posts/notes/Environment/ECS%20Init.html"}],["meta",{"property":"og:site_name","content":"Blog"}],["meta",{"property":"og:title","content":"What would you do if you have a ECS server?"}],["meta",{"property":"og:description","content":"当你到手一台服务器后，你会干什么？看看我都会做啥吧。 安装Nginx（Must） 需要的配置 内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量 磁盘：越大越好啦 CPU：取决于连接数，当然是越大越好，1C也是可以的 安装 参照：RHEL系Linux安装nginx CentOS 7.x 配置 安装后的默认配置 安装Mysql..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-03-20T15:12:55.000Z"}],["meta",{"property":"article:author","content":"Marshio"}],["meta",{"property":"article:published_time","content":"2024-03-19T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-20T15:12:55.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"What would you do if you have a ECS server?\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-03-19T00:00:00.000Z\\",\\"dateModified\\":\\"2024-03-20T15:12:55.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Marshio\\",\\"url\\":\\"https://marshio.com\\"}]}"]]},"headers":[{"level":2,"title":"安装Nginx（Must）","slug":"安装nginx-must","link":"#安装nginx-must","children":[{"level":3,"title":"安装","slug":"安装","link":"#安装","children":[]},{"level":3,"title":"配置","slug":"配置","link":"#配置","children":[]}]},{"level":2,"title":"安装Mysql（Option）","slug":"安装mysql-option","link":"#安装mysql-option","children":[]},{"level":2,"title":"安装Redis（Option）","slug":"安装redis-option","link":"#安装redis-option","children":[]},{"level":2,"title":"安装Kafka（Option）","slug":"安装kafka-option","link":"#安装kafka-option","children":[]},{"level":2,"title":"安装Postgresql（Option）","slug":"安装postgresql-option","link":"#安装postgresql-option","children":[]}],"git":{"createdTime":1710947575000,"updatedTime":1710947575000,"contributors":[{"name":"marshio","email":"marshioman@gmail.com","commits":1}]},"readingTime":{"minutes":1.51,"words":454},"filePathRelative":"posts/notes/Environment/ECS Init.md","localizedDate":"March 19, 2024","excerpt":"<p>当你到手一台服务器后，你会干什么？看看我都会做啥吧。</p>\\n<h2>安装Nginx（Must）</h2>\\n<p>需要的配置</p>\\n<ul>\\n<li>内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量</li>\\n<li>磁盘：越大越好啦</li>\\n<li>CPU：取决于连接数，当然是越大越好，1C也是可以的</li>\\n</ul>\\n<h3>安装</h3>\\n<p>参照：<a href=\\"https://nginx.org/en/linux_packages.html#RHEL\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">RHEL系Linux安装nginx</a></p>","autoDesc":true}');export{y as comp,q as data};
