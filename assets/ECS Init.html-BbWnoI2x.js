import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r,o as d,c as t,d as n,e,f as s,b as l}from"./app-Dz9ChoJV.js";const o={},c=n("p",null,"当你到手一台服务器后，你会干什么？看看我都会做啥吧。",-1),v=n("h2",{id:"安装nginx-must",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装nginx-must"},[n("span",null,"安装Nginx（Must）")])],-1),u=n("p",null,"需要的配置",-1),m=n("ul",null,[n("li",null,"内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量"),n("li",null,"磁盘：越大越好啦"),n("li",null,"CPU：取决于连接数，当然是越大越好，1C也是可以的")],-1),p=n("h3",{id:"安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装"},[n("span",null,"安装")])],-1),b={href:"https://nginx.org/en/linux_packages.html#RHEL",target:"_blank",rel:"noopener noreferrer"},h=l(`<p>CentOS 7.x</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 下载工具包</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h3><p>安装后的默认配置</p><div class="language-conf line-numbers-mode" data-ext="conf" data-title="conf"><pre class="language-conf"><code>user nginx;
# worker节点数量，等于内核数量
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    # worker 支持的最大链接数量
    worker_connections 1024;
}

http {
    log_format  main  &#39;$remote_addr - $remote_user [$time_local] &quot;$request&quot; &#39;
                      &#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;
                      &#39;&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot;&#39;;

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        listen       [::]:80;
        # _ 默认代表 localhost
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }
# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2;
#        listen       [::]:443 ssl http2;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate &quot;/etc/pki/nginx/server.crt&quot;;
#        ssl_certificate_key &quot;/etc/pki/nginx/private/server.key&quot;;
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers HIGH:!aNULL:!MD5;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启停" tabindex="-1"><a class="header-anchor" href="#启停"><span>启停</span></a></h3>`,6),g={href:"https://nginx.org/en/docs/beginners_guide.html",target:"_blank",rel:"noopener noreferrer"},_=l(`<blockquote><p>注意：执行命令的用户最好是同一个</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 启动</span>
nginx

<span class="token comment"># 停止</span>
nginx <span class="token parameter variable">-s</span> stop

<span class="token comment"># 重载配置</span>
nginx <span class="token parameter variable">-s</span> reload

<span class="token comment"># 优雅停止</span>
nginx <span class="token parameter variable">-s</span> quit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="适配服务器" tabindex="-1"><a class="header-anchor" href="#适配服务器"><span>适配服务器</span></a></h3><div class="language-conf line-numbers-mode" data-ext="conf" data-title="conf"><pre class="language-conf"><code>user nginx;
# worker节点数量，等于内核数量
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    # worker 支持的最大链接数量
    worker_connections 1024;
}

http {
    log_format  main  &#39;$remote_addr - $remote_user [$time_local] &quot;$request&quot; &#39;
                      &#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;
                      &#39;&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot;&#39;;

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        listen       [::]:80;
        # _ 默认代表 localhost
        # 如果你有域名，那么可以将域名解析到本服务器的公网IP，如 我的域名marshio.com
        # 添加解析 服务器IP列表添加本服务器IP
        server_name  marshio.com *.marshio.com;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装mysql-option" tabindex="-1"><a class="header-anchor" href="#安装mysql-option"><span>安装Mysql（Option）</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="安装redis-option" tabindex="-1"><a class="header-anchor" href="#安装redis-option"><span>安装Redis（Option）</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="安装kafka-option" tabindex="-1"><a class="header-anchor" href="#安装kafka-option"><span>安装Kafka（Option）</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul><h2 id="安装postgresql-option" tabindex="-1"><a class="header-anchor" href="#安装postgresql-option"><span>安装Postgresql（Option）</span></a></h2><p>需要的配置</p><ul><li>内存</li><li>磁盘</li><li>CPU</li></ul>`,16);function x(f,k){const i=r("ExternalLinkIcon");return d(),t("div",null,[c,v,u,m,p,n("p",null,[e("参照："),n("a",b,[e("RHEL系Linux安装nginx"),s(i)])]),h,n("p",null,[e("参考："),n("a",g,[e("初学者指导"),s(i)])]),_])}const C=a(o,[["render",x],["__file","ECS Init.html.vue"]]),E=JSON.parse('{"path":"/posts/notes/Environment/ECS%20Init.html","title":"What would you do if you have a ECS server?","lang":"en-US","frontmatter":{"icon":"pen-to-square","date":"2024-03-19T00:00:00.000Z","category":["ECS"],"title":"What would you do if you have a ECS server?","description":"当你到手一台服务器后，你会干什么？看看我都会做啥吧。 安装Nginx（Must） 需要的配置 内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量 磁盘：越大越好啦 CPU：取决于连接数，当然是越大越好，1C也是可以的 安装 参照：RHEL系Linux安装nginx CentOS 7.x 配置 安装后的默认配置 启停 参考：初...","head":[["meta",{"property":"og:url","content":"https://imarshio.github.io/posts/notes/Environment/ECS%20Init.html"}],["meta",{"property":"og:site_name","content":"Blog"}],["meta",{"property":"og:title","content":"What would you do if you have a ECS server?"}],["meta",{"property":"og:description","content":"当你到手一台服务器后，你会干什么？看看我都会做啥吧。 安装Nginx（Must） 需要的配置 内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量 磁盘：越大越好啦 CPU：取决于连接数，当然是越大越好，1C也是可以的 安装 参照：RHEL系Linux安装nginx CentOS 7.x 配置 安装后的默认配置 启停 参考：初..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-03-21T13:49:16.000Z"}],["meta",{"property":"article:author","content":"Marshio"}],["meta",{"property":"article:published_time","content":"2024-03-19T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-21T13:49:16.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"What would you do if you have a ECS server?\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-03-19T00:00:00.000Z\\",\\"dateModified\\":\\"2024-03-21T13:49:16.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Marshio\\",\\"url\\":\\"https://marshio.com\\"}]}"]]},"headers":[{"level":2,"title":"安装Nginx（Must）","slug":"安装nginx-must","link":"#安装nginx-must","children":[{"level":3,"title":"安装","slug":"安装","link":"#安装","children":[]},{"level":3,"title":"配置","slug":"配置","link":"#配置","children":[]},{"level":3,"title":"启停","slug":"启停","link":"#启停","children":[]},{"level":3,"title":"适配服务器","slug":"适配服务器","link":"#适配服务器","children":[]}]},{"level":2,"title":"安装Mysql（Option）","slug":"安装mysql-option","link":"#安装mysql-option","children":[]},{"level":2,"title":"安装Redis（Option）","slug":"安装redis-option","link":"#安装redis-option","children":[]},{"level":2,"title":"安装Kafka（Option）","slug":"安装kafka-option","link":"#安装kafka-option","children":[]},{"level":2,"title":"安装Postgresql（Option）","slug":"安装postgresql-option","link":"#安装postgresql-option","children":[]}],"git":{"createdTime":1710947575000,"updatedTime":1711028956000,"contributors":[{"name":"marshio","email":"marshioman@gmail.com","commits":2}]},"readingTime":{"minutes":2.23,"words":669},"filePathRelative":"posts/notes/Environment/ECS Init.md","localizedDate":"March 19, 2024","excerpt":"<p>当你到手一台服务器后，你会干什么？看看我都会做啥吧。</p>\\n<h2>安装Nginx（Must）</h2>\\n<p>需要的配置</p>\\n<ul>\\n<li>内存: Nginx一个server大概会占12~15M内存，所以你需要自己衡量</li>\\n<li>磁盘：越大越好啦</li>\\n<li>CPU：取决于连接数，当然是越大越好，1C也是可以的</li>\\n</ul>\\n<h3>安装</h3>\\n<p>参照：<a href=\\"https://nginx.org/en/linux_packages.html#RHEL\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">RHEL系Linux安装nginx</a></p>","autoDesc":true}');export{C as comp,E as data};
