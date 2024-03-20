import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as l,o as c,c as o,d as n,e as s,f as e,b as i}from"./app-DntpMp77.js";const p={},r={href:"http://nginx.org/",target:"_blank",rel:"noopener noreferrer"},d={href:"http://nginx.org/en/download.html",target:"_blank",rel:"noopener noreferrer"},u={href:"https://nginx.org/en/docs/",target:"_blank",rel:"noopener noreferrer"},v=n("h2",{id:"安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装"},[n("span",null,"安装")])],-1),m={href:"https://www.runoob.com/linux/nginx-install-setup.html",target:"_blank",rel:"noopener noreferrer"},b=i(`<h3 id="安装依赖" tabindex="-1"><a class="header-anchor" href="#安装依赖"><span>安装依赖</span></a></h3><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 安装</span>
yum <span class="token parameter variable">-y</span> <span class="token function">install</span> <span class="token function">make</span> zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装pcre" tabindex="-1"><a class="header-anchor" href="#安装pcre"><span>安装PCRE</span></a></h3>`,3),h=n("img",{src:"https://cdn.nlark.com/yuque/0/2023/png/21953536/1675267655447-2c113300-0610-42c8-8b39-82706daebf38.png#averageHue=%23242e39&clientId=u32476b06-4201-4&from=paste&height=282&id=u3564989c&originHeight=282&originWidth=2489&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32149&status=done&style=none&taskId=u114720a9-013e-4a2e-8a4c-49c9ba96a38&title=&width=2489",alt:"image.png",loading:"lazy"},null,-1),g={href:"https://sourceforge.net/projects/pcre/",target:"_blank",rel:"noopener noreferrer"},k={href:"https://sourceforge.net/projects/pcre/files/",target:"_blank",rel:"noopener noreferrer"},f={href:"https://sourceforge.net/projects/pcre/files/pcre/",target:"_blank",rel:"noopener noreferrer"},x=n("code",null,"tar.gz",-1),_=n("code",null,"wget",-1),y=i(`<div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 安装PCRE，让Nginx支持rewrite功能，我们选择的安装目录为/usr/local/src</span>
<span class="token builtin class-name">cd</span> /usr/local/src

<span class="token comment"># 下载pcre</span>
<span class="token function">wget</span> http://downloads.sourceforge.net/project/pcre/pcre/8.45/pcre-8.45.tar.gz

<span class="token comment"># 解压</span>
<span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> pcre-8.45.tar.gz

<span class="token comment"># 进入pcre目录</span>
<span class="token builtin class-name">cd</span> pcre-8.45

<span class="token comment"># 编译生成Makefile为make做准备，下面的 ./  代表执行后面的文件的意思，等同于 sh configure</span>
./configure

<span class="token comment"># 编译并安装</span>
<span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span> 

<span class="token comment"># 查看pcre版本</span>
pcre-config <span class="token parameter variable">--version</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://cdn.nlark.com/yuque/0/2023/png/21953536/1675268379945-1f5e11b5-6e18-4983-9080-01e8f84278fe.png#averageHue=%23bcb4ae&amp;clientId=u90a8284f-7b48-4&amp;from=paste&amp;height=704&amp;id=ubb5caac1&amp;originHeight=704&amp;originWidth=1060&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=53790&amp;status=done&amp;style=none&amp;taskId=uf7372233-b1dc-420d-b0c7-5b954bd4401&amp;title=&amp;width=1060" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><h3 id="安装nginx" tabindex="-1"><a class="header-anchor" href="#安装nginx"><span>安装Nginx</span></a></h3><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 进入安装目录，此次我们选择的安装目录为/usr/local/src</span>
<span class="token builtin class-name">cd</span> /usr/local/src

<span class="token comment"># 下载nginx压缩包</span>
<span class="token function">wget</span> http://nginx.org/download/nginx-1.22.1.tar.gz

<span class="token comment"># 解压</span>
<span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> nginx-1.22.1.tar.gz

<span class="token comment"># 进入</span>
<span class="token builtin class-name">cd</span> nginx-1.22.1

<span class="token comment"># 生成Makefile，为下一步编译做准备</span>
./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr/local/src/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre<span class="token operator">=</span>/usr/local/src/pcre-8.45

<span class="token comment"># 编译及安装</span>
<span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启停" tabindex="-1"><a class="header-anchor" href="#启停"><span>启停</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 切换到安装目录下</span>
<span class="token builtin class-name">cd</span> /usr/local/nginx/sbin

<span class="token comment"># 启动命令，以下两条都可以启动</span>
./nginx  

<span class="token comment"># 查看是否启动成功</span>
<span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> nginx

<span class="token comment"># 停止</span>
./nginx <span class="token parameter variable">-s</span> stop

<span class="token comment"># 优雅停止</span>
./nginx <span class="token parameter variable">-s</span> quit

<span class="token comment"># 重新加载配置文件</span>
./nginx <span class="token parameter variable">-s</span> reload
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://cdn.nlark.com/yuque/0/2023/png/21953536/1675353493122-bea81831-97c4-4d6d-83f7-72cf0c1e13c7.png#averageHue=%2329323d&amp;clientId=u90a8284f-7b48-4&amp;from=paste&amp;height=284&amp;id=u7b269287&amp;originHeight=284&amp;originWidth=581&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=26702&amp;status=done&amp;style=none&amp;taskId=ud29fec74-f150-41fb-a1a7-1b545308521&amp;title=&amp;width=581" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p>访问，本机访问输入localhost即可，外网访问只需输入安装机器的ip即可（需要开启80端口访问），因为nginx代理的是80端口。</p><h2 id="配置系统服务" tabindex="-1"><a class="header-anchor" href="#配置系统服务"><span>配置系统服务</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 创建服务脚本</span>
<span class="token function">vim</span> /usr/lib/systemd/system/nginx.service

<span class="token comment"># 插入以下内容</span>
<span class="token punctuation">[</span>Unit<span class="token punctuation">]</span>
<span class="token assign-left variable">Description</span><span class="token operator">=</span>nginx - high performance web server
<span class="token assign-left variable">Documentation</span><span class="token operator">=</span>http://nginx.org/en/docs
<span class="token assign-left variable">After</span><span class="token operator">=</span>network.target remote-fs.target nss-lookup.target
 
<span class="token punctuation">[</span>Service<span class="token punctuation">]</span>
<span class="token assign-left variable">Type</span><span class="token operator">=</span>forking
<span class="token assign-left variable">PIDFile</span><span class="token operator">=</span>/usr/local/nginx/logs/nginx.pid
<span class="token assign-left variable">ExecStartPre</span><span class="token operator">=</span>/usr/local/nginx/sbin/nginx <span class="token parameter variable">-t</span> <span class="token parameter variable">-c</span> /usr/local/nginx/conf/nginx.conf
<span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/local/nginx/sbin/nginx <span class="token parameter variable">-c</span> /usr/local/nginx/conf/nginx.conf
<span class="token assign-left variable">ExecReload</span><span class="token operator">=</span>/bin/kill <span class="token parameter variable">-s</span> HUP <span class="token variable">$MAINPID</span>
<span class="token assign-left variable">ExecStop</span><span class="token operator">=</span>/bin/kill <span class="token parameter variable">-s</span> QUIT <span class="token variable">$MAINPID</span>
<span class="token assign-left variable">PrivateTmp</span><span class="token operator">=</span>true
 
<span class="token punctuation">[</span>Install<span class="token punctuation">]</span>
<span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target

<span class="token comment"># 赋予脚本执行权限</span>
<span class="token function">chmod</span> <span class="token number">744</span> /usr/lib/systemd/system/nginx.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx"><span>Nginx</span></a></h1><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h2><h3 id="原始配置" tabindex="-1"><a class="header-anchor" href="#原始配置"><span>原始配置</span></a></h3><p>拿到原始配置后，去除被注释的代码后的配置如下所示</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># worker进程数，上限取决于服务器的内核数</span>
worker_processes  <span class="token number">1</span><span class="token punctuation">;</span>

events <span class="token punctuation">{</span>

   <span class="token comment"># 每个worker允许连接的 客户端最大连接数</span>
    worker_connections  <span class="token number">1024</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

http <span class="token punctuation">{</span>
   <span class="token comment"># 请求类型</span>
    include       mime.types<span class="token punctuation">;</span>
    default_type  application/octet-stream<span class="token punctuation">;</span>

    sendfile        on<span class="token punctuation">;</span>
    keepalive_timeout  <span class="token number">65</span><span class="token punctuation">;</span>

   <span class="token comment"># 一个server对应一个服务器</span>
    server <span class="token punctuation">{</span>
       <span class="token comment"># nginx监听的端口</span>
        listen       <span class="token number">80</span><span class="token punctuation">;</span>
       <span class="token comment"># 发起请求的域名或ip，比如baidu.com</span>
        server_name  localhost<span class="token punctuation">;</span>
       <span class="token comment"># </span>
        location / <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
            index  index.html index.htm<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

       <span class="token comment"># 50x映射地址</span>
        error_page   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html<span class="token punctuation">;</span>
        location <span class="token operator">=</span> /50x.html <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置结构" tabindex="-1"><a class="header-anchor" href="#配置结构"><span>配置结构</span></a></h3><figure><img src="https://cdn.nlark.com/yuque/0/2023/jpeg/21953536/1676704375003-a921ce35-ec8d-412c-b685-409f6fd1715e.jpeg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="映射静态资源" tabindex="-1"><a class="header-anchor" href="#映射静态资源"><span>映射静态资源</span></a></h3><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 假设该服务器IP为192.168.130.1</span>

<span class="token comment"># 示例1</span>
server <span class="token punctuation">{</span>
   <span class="token comment"># 拦截192.168.130.1:8090的请求</span>
    listen       <span class="token number">8090</span><span class="token punctuation">;</span>
    server_name  localhost<span class="token punctuation">;</span>

   <span class="token comment"># 192.168.130.1:8090/</span>
    location / <span class="token punctuation">{</span>
       <span class="token comment"># 静态资源存放路径</span>
        root   home/user<span class="token punctuation">;</span>
       <span class="token comment"># 想要访问的静态资源，可以是静态页面，也可以是图片，其他</span>
        index  index.html index.htm<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

   <span class="token comment"># 192.168.130.1:8090/demo</span>
    location /demo <span class="token punctuation">{</span>
       <span class="token comment"># 静态资源存放位置</span>
       root   home/user/demo<span class="token punctuation">;</span>
       <span class="token comment"># 默认展示index.html页面</span>
        index  demo.html demo.htm<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二级域名访问" tabindex="-1"><a class="header-anchor" href="#二级域名访问"><span>二级域名访问</span></a></h3><h4 id="背景" tabindex="-1"><a class="header-anchor" href="#背景"><span>背景</span></a></h4><p>现在有一台服务器，一个域名（starve.fun），四个服务，想要实现通过二级域名的方式访问不同的服务。</p><ul><li><code>[nginx.starve.fun](http://nginx.starve.fun)</code>：80，nginx默认</li><li><code>[heart.starve.fun](http://heart.starve.fun)</code>：9999，静态资源</li><li><code>[wechat.starve.fun](http://wechat.starve.fun)</code>：8090，只有一个<code>/test</code>可用，需要让其他请求跳转到配置的首页</li><li><code>[demo.starve.fun](http://demo.starve.fun)</code>：8888/8889/8890，只有<code>/demo/nginx</code>可用，需要让其他请求跳转到配置的首页</li></ul><h4 id="配置-1" tabindex="-1"><a class="header-anchor" href="#配置-1"><span>配置</span></a></h4><p><code>nginx.conf</code></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># worker执行用户，需要有对应资源的访问权限</span>
user  nobody<span class="token punctuation">;</span>
worker_processes  <span class="token number">1</span><span class="token punctuation">;</span>

error_log  logs/error.log<span class="token punctuation">;</span>

pid        logs/nginx.pid<span class="token punctuation">;</span>


events <span class="token punctuation">{</span>
    worker_connections  <span class="token number">1024</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>


http <span class="token punctuation">{</span>
    include       mime.types<span class="token punctuation">;</span>
    default_type  application/octet-stream<span class="token punctuation">;</span>

    sendfile        on<span class="token punctuation">;</span>
    tcp_nopush     on<span class="token punctuation">;</span>

    keepalive_timeout  <span class="token number">65</span><span class="token punctuation">;</span>

    <span class="token function">gzip</span>  on<span class="token punctuation">;</span>

   <span class="token comment"># 引入配置文件</span>
    include     ./demo/*.conf<span class="token punctuation">;</span>

   <span class="token comment"># 默认监听服务nginx，80端口</span>
    server <span class="token punctuation">{</span>
        listen       <span class="token number">80</span><span class="token punctuation">;</span>
        server_name  www.starve.fun starve.fun<span class="token punctuation">;</span>


        location / <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
            index  index.html index.htm<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        error_page   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html<span class="token punctuation">;</span>
        location <span class="token operator">=</span> /50x.html <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>wechat服务</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>upstream wechat <span class="token punctuation">{</span>
    server <span class="token number">101.132</span>.32.220:8090<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

server <span class="token punctuation">{</span>
    listen       <span class="token number">80</span><span class="token punctuation">;</span>
    server_name  wechat.starve.fun<span class="token punctuation">;</span>

    location / <span class="token punctuation">{</span>
        proxy_pass   http://wechat<span class="token punctuation">;</span>
        root   /home/marshio/zmh<span class="token punctuation">;</span>
        index  zmh.html<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>heart服务</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>server <span class="token punctuation">{</span>
    listen       <span class="token number">80</span><span class="token punctuation">;</span>
    server_name  heart.starve.fun<span class="token punctuation">;</span>
    location / <span class="token punctuation">{</span>
        root   /home/marshio/demo<span class="token punctuation">;</span>
        index  heart.html<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>                     
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>demo服务</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>    upstream demo <span class="token punctuation">{</span>
        server <span class="token number">101.132</span>.32.220:8888<span class="token punctuation">;</span>
        server <span class="token number">101.132</span>.32.220:8889<span class="token punctuation">;</span>
        server <span class="token number">101.132</span>.32.220:8890<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    server <span class="token punctuation">{</span>
       listen <span class="token number">80</span><span class="token punctuation">;</span>
       server_name    demo.starve.fun<span class="token punctuation">;</span>
       location    <span class="token punctuation">{</span>
            proxy_pass http://demo<span class="token punctuation">;</span>
            proxy_connect_timeout 3s<span class="token punctuation">;</span>
            proxy_read_timeout 5s<span class="token punctuation">;</span>
            proxy_send_timeout 3s<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配合spring-boot使用" tabindex="-1"><a class="header-anchor" href="#配合spring-boot使用"><span>配合spring boot使用</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>user  nobody<span class="token punctuation">;</span>
worker_processes  <span class="token number">1</span><span class="token punctuation">;</span>

error_log  logs/error.log<span class="token punctuation">;</span>
<span class="token comment">#error_log  logs/error.log  notice;</span>
<span class="token comment">#error_log  logs/error.log  info;</span>

pid        logs/nginx.pid<span class="token punctuation">;</span>


events <span class="token punctuation">{</span>
    worker_connections  <span class="token number">1024</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>


http <span class="token punctuation">{</span>
    include       mime.types<span class="token punctuation">;</span>
    default_type  application/octet-stream<span class="token punctuation">;</span>

    sendfile        on<span class="token punctuation">;</span>

    <span class="token comment">#keepalive_timeout  0;</span>
    keepalive_timeout  <span class="token number">65</span><span class="token punctuation">;</span>

    <span class="token function">gzip</span>  on<span class="token punctuation">;</span>


    upstream demo <span class="token punctuation">{</span>
        server <span class="token number">101.132</span>.32.220:8888<span class="token punctuation">;</span>
        server <span class="token number">101.132</span>.32.220:8889<span class="token punctuation">;</span>
        server <span class="token number">101.132</span>.32.220:8890<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    server <span class="token punctuation">{</span>
        listen       <span class="token number">80</span><span class="token punctuation">;</span>
        server_name  www.starve.fun demo.starve.fun<span class="token punctuation">;</span>

        location / <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
            proxy_pass http://demo<span class="token punctuation">;</span>
            proxy_connect_timeout 3s<span class="token punctuation">;</span>
            proxy_read_timeout 5s<span class="token punctuation">;</span>
            proxy_send_timeout 3s<span class="token punctuation">;</span>
            index  index.html index.htm<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        error_page   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html<span class="token punctuation">;</span>
        location <span class="token operator">=</span> /50x.html <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h2><h3 id="防盗链" tabindex="-1"><a class="header-anchor" href="#防盗链"><span>防盗链</span></a></h3><h2 id="涉及命令" tabindex="-1"><a class="header-anchor" href="#涉及命令"><span>涉及命令</span></a></h2><p>简单的命令不在此赘述，此处只会涉及一些我个人认为<strong>很少使用且相对较难</strong>的命令。</p><ul><li><code>tar</code>，虽然解压工具我也经常使用，但是对于其参数具体的含义还是很模糊，此处还是稍作复习。 <ul><li><code>-z</code>：<code>--gzip</code>、<code>--gunzip</code>、<code>--ungzip</code>，调用gzip执行压缩或解压缩</li><li><code>-x</code>：<code>--extract</code>、<code>--get</code>，解压<code>tar</code>文件</li><li><code>-v</code>：<code>--verbose</code>，列出每一步处理涉及的文件信息，只用一个<code>v</code>时，仅列出文件名，使用两个<code>v</code>时，列出权限、所有者、大小、时间、文件名等信息</li><li><code>-f</code>：<code>--file</code>，指定要处理的文件名</li></ul></li><li><code>ps</code>， <ul><li><code>-e</code></li><li><code>-f</code></li></ul></li><li><code>configure</code>：</li><li><code>make</code></li></ul><p>参考</p>`,40),w={href:"https://thoughtbot.com/blog/the-magic-behind-configure-make-make-install",target:"_blank",rel:"noopener noreferrer"};function z(T,I){const a=l("ExternalLinkIcon");return c(),o("div",null,[n("p",null,[s("官网："),n("a",r,[s("http://nginx.org/"),e(a)])]),n("p",null,[s("下载地址："),n("a",d,[s("http://nginx.org/en/download.html"),e(a)])]),n("p",null,[s("文档："),n("a",u,[s("https://nginx.org/en/docs/"),e(a)])]),v,n("p",null,[s("参考："),n("a",m,[s("https://www.runoob.com/linux/nginx-install-setup.html"),e(a)])]),b,n("p",null,[h,s(" 进入"),n("a",g,[s("pcre下载页"),e(a)]),s("，点击"),n("a",k,[s("Files"),e(a)]),s("，选择"),n("a",f,[s("pcre"),e(a)]),s("，选择要下载的版本，选择下载较多的即可，选中以"),x,s("结尾的文件右键，复制链接地址，然后回到Linux，使用"),_,s("下载")]),y,n("ul",null,[n("li",null,[n("a",w,[s("https://thoughtbot.com/blog/the-magic-behind-configure-make-make-install"),e(a)])])])])}const P=t(p,[["render",z],["__file","Nginx.html.vue"]]),E=JSON.parse('{"path":"/posts/notes/Nginx.html","title":"Nginx","lang":"en-US","frontmatter":{"icon":"pen-to-square","date":"2021-03-17T00:00:00.000Z","category":["Nginx"],"title":"Nginx","tag":["Nginx","Linux"],"description":"官网：http://nginx.org/ 下载地址：http://nginx.org/en/download.html 文档：https://nginx.org/en/docs/ 安装 参考：https://www.runoob.com/linux/nginx-install-setup.html 安装依赖 安装PCRE image.png 进入pcr...","head":[["meta",{"property":"og:url","content":"https://imarshio.github.io/posts/notes/Nginx.html"}],["meta",{"property":"og:site_name","content":"Blog"}],["meta",{"property":"og:title","content":"Nginx"}],["meta",{"property":"og:description","content":"官网：http://nginx.org/ 下载地址：http://nginx.org/en/download.html 文档：https://nginx.org/en/docs/ 安装 参考：https://www.runoob.com/linux/nginx-install-setup.html 安装依赖 安装PCRE image.png 进入pcr..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.nlark.com/yuque/0/2023/png/21953536/1675267655447-2c113300-0610-42c8-8b39-82706daebf38.png#averageHue=%23242e39&clientId=u32476b06-4201-4&from=paste&height=282&id=u3564989c&originHeight=282&originWidth=2489&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32149&status=done&style=none&taskId=u114720a9-013e-4a2e-8a4c-49c9ba96a38&title=&width=2489"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-03-20T14:11:41.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Nginx"}],["meta",{"property":"article:author","content":"Marshio"}],["meta",{"property":"article:tag","content":"Nginx"}],["meta",{"property":"article:tag","content":"Linux"}],["meta",{"property":"article:published_time","content":"2021-03-17T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-20T14:11:41.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Nginx\\",\\"image\\":[\\"https://cdn.nlark.com/yuque/0/2023/png/21953536/1675267655447-2c113300-0610-42c8-8b39-82706daebf38.png#averageHue=%23242e39&clientId=u32476b06-4201-4&from=paste&height=282&id=u3564989c&originHeight=282&originWidth=2489&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32149&status=done&style=none&taskId=u114720a9-013e-4a2e-8a4c-49c9ba96a38&title=&width=2489\\",\\"https://cdn.nlark.com/yuque/0/2023/png/21953536/1675268379945-1f5e11b5-6e18-4983-9080-01e8f84278fe.png#averageHue=%23bcb4ae&clientId=u90a8284f-7b48-4&from=paste&height=704&id=ubb5caac1&originHeight=704&originWidth=1060&originalType=binary&ratio=1&rotation=0&showTitle=false&size=53790&status=done&style=none&taskId=uf7372233-b1dc-420d-b0c7-5b954bd4401&title=&width=1060\\",\\"https://cdn.nlark.com/yuque/0/2023/png/21953536/1675353493122-bea81831-97c4-4d6d-83f7-72cf0c1e13c7.png#averageHue=%2329323d&clientId=u90a8284f-7b48-4&from=paste&height=284&id=u7b269287&originHeight=284&originWidth=581&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26702&status=done&style=none&taskId=ud29fec74-f150-41fb-a1a7-1b545308521&title=&width=581\\",\\"https://cdn.nlark.com/yuque/0/2023/jpeg/21953536/1676704375003-a921ce35-ec8d-412c-b685-409f6fd1715e.jpeg\\"],\\"datePublished\\":\\"2021-03-17T00:00:00.000Z\\",\\"dateModified\\":\\"2024-03-20T14:11:41.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Marshio\\",\\"url\\":\\"https://marshio.com\\"}]}"]]},"headers":[{"level":2,"title":"安装","slug":"安装","link":"#安装","children":[{"level":3,"title":"安装依赖","slug":"安装依赖","link":"#安装依赖","children":[]},{"level":3,"title":"安装PCRE","slug":"安装pcre","link":"#安装pcre","children":[]},{"level":3,"title":"安装Nginx","slug":"安装nginx","link":"#安装nginx","children":[]}]},{"level":2,"title":"启停","slug":"启停","link":"#启停","children":[]},{"level":2,"title":"配置系统服务","slug":"配置系统服务","link":"#配置系统服务","children":[]},{"level":2,"title":"配置","slug":"配置","link":"#配置","children":[{"level":3,"title":"原始配置","slug":"原始配置","link":"#原始配置","children":[]},{"level":3,"title":"配置结构","slug":"配置结构","link":"#配置结构","children":[]},{"level":3,"title":"映射静态资源","slug":"映射静态资源","link":"#映射静态资源","children":[]},{"level":3,"title":"二级域名访问","slug":"二级域名访问","link":"#二级域名访问","children":[]}]},{"level":2,"title":"配合spring boot使用","slug":"配合spring-boot使用","link":"#配合spring-boot使用","children":[]},{"level":2,"title":"使用","slug":"使用","link":"#使用","children":[{"level":3,"title":"防盗链","slug":"防盗链","link":"#防盗链","children":[]}]},{"level":2,"title":"涉及命令","slug":"涉及命令","link":"#涉及命令","children":[]}],"git":{"createdTime":1710904238000,"updatedTime":1710943901000,"contributors":[{"name":"marshio","email":"marshioman@gmail.com","commits":2}]},"readingTime":{"minutes":4.7,"words":1410},"filePathRelative":"posts/notes/Nginx.md","localizedDate":"March 17, 2021","excerpt":"<p>官网：<a href=\\"http://nginx.org/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">http://nginx.org/</a></p>\\n<p>下载地址：<a href=\\"http://nginx.org/en/download.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">http://nginx.org/en/download.html</a></p>\\n<p>文档：<a href=\\"https://nginx.org/en/docs/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://nginx.org/en/docs/</a></p>","autoDesc":true}');export{P as comp,E as data};
