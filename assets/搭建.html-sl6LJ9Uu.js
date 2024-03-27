import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as l,o,c as p,d as n,e as s,f as e,b as i}from"./app-BseHs4it.js";const c={},r=i(`<p>MySQL安装</p><p>1、删除MariaDB</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 查看是否有mariaDB</span>
<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> mariadb

<span class="token comment"># 删除</span>
<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-e</span> mariadb-libs-5.5.68-1.el7.x86_64

<span class="token comment"># 如果上面那条语句不行，就强制删除</span>
<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-e</span> <span class="token parameter variable">--nodeps</span> mariadb-libs-5.5.68-1.el7.x86_64

<span class="token comment"># 再检查一遍</span>
<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> mariadb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、安装MySQL</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 查看是否安装MySQL</span>
<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> mysql

<span class="token comment"># 选择要下载的MySQL版本，进入官网进行下载rpm包</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.1、MySQL官网查找自己需要下载的MySQL版本</p>`,6),m={href:"https://dev.mysql.com/downloads/mysql/",target:"_blank",rel:"noopener noreferrer"},d={href:"https://downloads.mysql.com/archives/community/",target:"_blank",rel:"noopener noreferrer"},u=i(`<div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 查看版本</span>
<span class="token function">cat</span> /etc/redhat-release

<span class="token comment"># 查看Linux系统的内核版本</span>
<span class="token function">uname</span> <span class="token parameter variable">-r</span>

<span class="token comment"># 选择如下包</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/image-20220921001105685.png#id=qXo5t&amp;originHeight=79&amp;originWidth=931&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none&amp;title=" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure><p>2.2、安装MySQL</p><blockquote><p>MySQL提供了多种软件安装方式</p><p>1、rpm方式，将软件包下载到指定目录下，在该目录下执行“rpm -ivh 包名”命令。支持离线</p><p>2、deb方式，下载软件包，执行“dpkg -i 包名”命令。支持离线</p><p>3、yum方式，确定正常联网，执行“yum install 软件包名”命令等等。不支持离线</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 将下好的rpm包导入Linux，然后复制到对应的目录，这里我选择opt目录，一般情况下，自己下载的软件都放在这里</span>
<span class="token builtin class-name">cd</span> /opt

<span class="token comment"># 创建存储目录</span>
<span class="token function">mkdir</span> mysql5

<span class="token comment"># 移动，所有5.0的MySQL所需文件</span>
<span class="token function">mv</span> /home/marshio/Downloads/mysql-community-*-5* mysql5

<span class="token comment"># 依次安装，需按照顺序</span>
<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> mysql-community-common-5.7.38-1.el7.x86_64.rpm

<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> mysql-community-libs-5.7.38-1.el7.x86_64.rpm

<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> mysql-community-client-5.7.38-1.el7.x86_64.rpm

<span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> mysql-community-server-5.7.38-1.el7.x86_64.rpm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>-i：表示安装，</p><p>-v：表示显示安装过程，</p><p>-h：表示显示进度</p></blockquote><figure><img src="https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/image-20220925141628669.png#id=cM51P&amp;originHeight=461&amp;originWidth=804&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none&amp;title=" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure><p>2.3、初始化MySQL</p><p>修改配置</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 创建data目录和log目录</span>
<span class="token function">mkdir</span> <span class="token punctuation">{</span>data,log<span class="token punctuation">}</span>

<span class="token comment"># 修改配置文件</span>
<span class="token function">sudo</span> <span class="token function">vim</span> /etc/my.cnf

<span class="token comment"># 源文件</span>
<span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
<span class="token assign-left variable">datadir</span><span class="token operator">=</span>/var/lib/mysql
<span class="token assign-left variable">socket</span><span class="token operator">=</span>/var/lib/mysql/mysql.sock

<span class="token comment"># Disabling symbolic-links is recommended to prevent assorted security risks</span>
symbolic-links<span class="token operator">=</span><span class="token number">0</span>

log-error<span class="token operator">=</span>/var/log/mysqld.log
pid-file<span class="token operator">=</span>/var/run/mysqld/mysqld.pid

<span class="token comment"># 修改之后</span>
<span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
<span class="token assign-left variable">datadir</span><span class="token operator">=</span>/opt/mysql5/data
<span class="token assign-left variable">socket</span><span class="token operator">=</span>/opt/mysql5/data/mysql.sock

<span class="token comment"># Disabling symbolic-links is recommended to prevent assorted security risks</span>
symbolic-links<span class="token operator">=</span><span class="token number">0</span>

log-error<span class="token operator">=</span>/opt/mysql5/log/mysqld.log
pid-file<span class="token operator">=</span>/var/run/mysqld/mysqld.pid

<span class="token comment"># 初始化</span>
mysqld <span class="token parameter variable">--initialize</span>

<span class="token comment"># 给对应的文件</span>

<span class="token comment"># 启动服务</span>
<span class="token function">sudo</span> systemctl start mysqld
<span class="token comment"># 或者</span>
<span class="token function">service</span> mysqld start

<span class="token comment"># 如果启动失败，则需要查看日志</span>
<span class="token comment"># 首先查看日志位置，找到 log-error 的文件位置，并查看，一般情况下MySQL的日志文件位于/var/log/mysqld.log，找到[ERROR]</span>
<span class="token function">cat</span> /etc/my.cnf
<span class="token function">cat</span> /var/log/mysqld.log

<span class="token comment"># 如果提示类似不能写入，没有权限等问题，则需要赋予相应权限</span>
<span class="token function">chown</span> mysql:mysql <span class="token parameter variable">-R</span> filename
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>开启端口</p><p>firewall-cmd</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># </span>
<span class="token function">sudo</span> firewall-cmd --list-ports

<span class="token function">sudo</span> firewall-cmd <span class="token parameter variable">--zone</span><span class="token operator">=</span>public <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">3306</span>/tcp

<span class="token function">sudo</span> firewall-cmd <span class="token parameter variable">--reload</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改密码</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 查看默认密码，默认密码是在MySQL启动时自动给root用户创建的</span>
<span class="token function">cat</span> /etc/my.cnf
<span class="token function">cat</span> /var/log/mysqld.log <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;password&#39;</span>
mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-sql line-numbers-mode" data-ext="sql" data-title="sql"><pre class="language-sql"><code><span class="token comment"># 修改默认密码</span>
<span class="token keyword">ALTER</span> <span class="token keyword">USER</span> <span class="token string">&#39;root&#39;</span><span class="token variable">@&#39;localhost&#39;</span> IDENTIFIED <span class="token keyword">BY</span> <span class="token string">&#39;Abc123...&#39;</span>

<span class="token comment"># 修改root访问IP路径为所有</span>
<span class="token keyword">UPDATE</span> <span class="token keyword">user</span> <span class="token keyword">SET</span> host<span class="token operator">=</span><span class="token string">&#39;%&#39;</span> <span class="token keyword">WHERE</span> <span class="token keyword">user</span><span class="token operator">=</span><span class="token string">&#39;root&#39;</span><span class="token punctuation">;</span>

<span class="token comment"># 刷新访问权限，或者重启MySQL</span>
FLUSH <span class="token keyword">PRIVILEGES</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1ryh8QL+A*kg</p>`,17);function v(b,k){const a=l("ExternalLinkIcon");return o(),p("div",null,[r,n("p",null,[s("最新版MySQL："),n("a",m,[s("https://dev.mysql.com/downloads/mysql/"),e(a)])]),n("p",null,[s("旧版MySQL："),n("a",d,[s("https://downloads.mysql.com/archives/community/"),e(a)])]),u])}const h=t(c,[["render",v],["__file","搭建.html.vue"]]),f=JSON.parse('{"path":"/posts/notes/MySQL/%E6%90%AD%E5%BB%BA.html","title":"安装","lang":"en-US","frontmatter":{"icon":"pen-to-square","date":"2021-03-17T00:00:00.000Z","order":1,"category":["mysql"],"title":"安装","tag":["环境搭建"],"description":"MySQL安装 1、删除MariaDB 2、安装MySQL 2.1、MySQL官网查找自己需要下载的MySQL版本 最新版MySQL：https://dev.mysql.com/downloads/mysql/ 旧版MySQL：https://downloads.mysql.com/archives/community/ imageimage 2.2、...","head":[["meta",{"property":"og:url","content":"https://imarshio.github.io/posts/notes/MySQL/%E6%90%AD%E5%BB%BA.html"}],["meta",{"property":"og:site_name","content":"Blog"}],["meta",{"property":"og:title","content":"安装"}],["meta",{"property":"og:description","content":"MySQL安装 1、删除MariaDB 2、安装MySQL 2.1、MySQL官网查找自己需要下载的MySQL版本 最新版MySQL：https://dev.mysql.com/downloads/mysql/ 旧版MySQL：https://downloads.mysql.com/archives/community/ imageimage 2.2、..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/image-20220921001105685.png#id=qXo5t&originHeight=79&originWidth=931&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title="}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-03-27T15:15:14.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"安装"}],["meta",{"property":"article:author","content":"Marshio"}],["meta",{"property":"article:tag","content":"环境搭建"}],["meta",{"property":"article:published_time","content":"2021-03-17T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-27T15:15:14.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"安装\\",\\"image\\":[\\"https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/image-20220921001105685.png#id=qXo5t&originHeight=79&originWidth=931&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=\\",\\"https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/image-20220925141628669.png#id=cM51P&originHeight=461&originWidth=804&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=\\"],\\"datePublished\\":\\"2021-03-17T00:00:00.000Z\\",\\"dateModified\\":\\"2024-03-27T15:15:14.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Marshio\\",\\"url\\":\\"https://marshio.com\\"}]}"]]},"headers":[],"git":{"createdTime":1711552058000,"updatedTime":1711552514000,"contributors":[{"name":"marshio","email":"marshioman@gmail.com","commits":2}]},"readingTime":{"minutes":2.55,"words":765},"filePathRelative":"posts/notes/MySQL/搭建.md","localizedDate":"March 17, 2021","excerpt":"<p>MySQL安装</p>\\n<p>1、删除MariaDB</p>\\n<div class=\\"language-bash\\" data-ext=\\"sh\\" data-title=\\"sh\\"><pre class=\\"language-bash\\"><code><span class=\\"token comment\\"># 查看是否有mariaDB</span>\\n<span class=\\"token function\\">sudo</span> <span class=\\"token function\\">rpm</span> <span class=\\"token parameter variable\\">-qa</span> <span class=\\"token operator\\">|</span> <span class=\\"token function\\">grep</span> mariadb\\n\\n<span class=\\"token comment\\"># 删除</span>\\n<span class=\\"token function\\">sudo</span> <span class=\\"token function\\">rpm</span> <span class=\\"token parameter variable\\">-e</span> mariadb-libs-5.5.68-1.el7.x86_64\\n\\n<span class=\\"token comment\\"># 如果上面那条语句不行，就强制删除</span>\\n<span class=\\"token function\\">sudo</span> <span class=\\"token function\\">rpm</span> <span class=\\"token parameter variable\\">-e</span> <span class=\\"token parameter variable\\">--nodeps</span> mariadb-libs-5.5.68-1.el7.x86_64\\n\\n<span class=\\"token comment\\"># 再检查一遍</span>\\n<span class=\\"token function\\">sudo</span> <span class=\\"token function\\">rpm</span> <span class=\\"token parameter variable\\">-qa</span> <span class=\\"token operator\\">|</span> <span class=\\"token function\\">grep</span> mariadb\\n</code></pre></div>","autoDesc":true}');export{h as comp,f as data};
