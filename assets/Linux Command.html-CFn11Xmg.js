import{_ as l}from"./LinuxCommand-20240318-0002-t-AOQcKa.js";import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as d,o,c as r,d as e,e as a,f as s,b as t}from"./app-B2vhDxw4.js";const c={},p=e("p",null,"一个命令的使用总归是先有一个背景的，所以如下命令都是结合适用场景总结出来的。 由于Linux家族过于庞大，每个分支都各有特点，且处理方式不完全一样，所以我会尽量给出常用系统的命令。 这里你需要知道自己的电脑属于哪个发行版，不了解的可以点击了解一下(虽然我也不是很了解，但是可以稍微i提供一点点帮助)。 参考",-1),h={href:"https://phoenixnap.com/kb/linux-commands",target:"_blank",rel:"noopener noreferrer"},u={href:"https://www.runoob.com/linux/linux-command-manual.html",target:"_blank",rel:"noopener noreferrer"},m={href:"https://www.linuxcool.com/",target:"_blank",rel:"noopener noreferrer"},b=e("li",null,null,-1),v=t(`<blockquote><p>如下命令使用中，</p><ul><li>[] 代表可选参数，</li><li>&lt;&gt; 代表可自由输入输入的字符</li><li><ul><li><pre><code>后面跟的是缩写
</code></pre></li></ul></li><li>-- 后面跟的是全拼</li></ul></blockquote><h1 id="文件" tabindex="-1"><a class="header-anchor" href="#文件"><span>文件</span></a></h1><h2 id="ls" tabindex="-1"><a class="header-anchor" href="#ls"><span>ls</span></a></h2><p>查看当前文件夹下有哪些文件</p><h2 id="mkdir" tabindex="-1"><a class="header-anchor" href="#mkdir"><span>mkdir</span></a></h2><p>创建一个文件夹</p><h2 id="touch" tabindex="-1"><a class="header-anchor" href="#touch"><span>touch</span></a></h2><p>创建一个文件</p><h2 id="rm" tabindex="-1"><a class="header-anchor" href="#rm"><span>rm</span></a></h2><p>删除一个文件或文件夹</p><table><thead><tr><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>i</td><td>删除前逐一询问是否删除</td></tr><tr><td>f</td><td>强制删除</td></tr><tr><td>r</td><td>将目录及之下的文件逐一删除</td></tr></tbody></table><h1 id="查看" tabindex="-1"><a class="header-anchor" href="#查看"><span>查看</span></a></h1><h2 id="cat" tabindex="-1"><a class="header-anchor" href="#cat"><span>cat</span></a></h2><p><code>concatenate fiels and print</code>，接所有指定文件并将结果写到标准输出 。</p><h3 id="用法" tabindex="-1"><a class="header-anchor" href="#用法"><span>用法</span></a></h3><p><code>cat [选项]... [文件]...</code></p><h3 id="常用参数" tabindex="-1"><a class="header-anchor" href="#常用参数"><span>常用参数</span></a></h3><table><thead><tr><th></th><th></th><th></th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><h3 id="常用场景" tabindex="-1"><a class="header-anchor" href="#常用场景"><span>常用场景</span></a></h3><h2 id="tail" tabindex="-1"><a class="header-anchor" href="#tail"><span>tail</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 常用的查看生产日志的命令</span>
<span class="token function">tail</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-n</span> <span class="token number">200</span> log.log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="编辑" tabindex="-1"><a class="header-anchor" href="#编辑"><span>编辑</span></a></h1><h2 id="vi" tabindex="-1"><a class="header-anchor" href="#vi"><span>vi</span></a></h2><h2 id="vim" tabindex="-1"><a class="header-anchor" href="#vim"><span>vim</span></a></h2><h2 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h2><h2 id="sed" tabindex="-1"><a class="header-anchor" href="#sed"><span>sed</span></a></h2><p>Stream EDitor，流式编辑器，类似awk，但是没有awk功能强大，但相对简单。</p><h3 id="用法-1" tabindex="-1"><a class="header-anchor" href="#用法-1"><span>用法</span></a></h3><p><code>sed [OPTION]... {script-only-if-no-other-script} [input-file]...</code></p><h3 id="参数" tabindex="-1"><a class="header-anchor" href="#参数"><span>参数</span></a></h3><table><thead><tr><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>i</td><td>直接修改读取的文件内容，<code>sed -i &#39;s///&#39;</code>，支持的界定符:<code>/</code>、<code>@</code>、<code>#</code>、<code>&amp;#124;</code></td></tr><tr><td></td><td></td></tr></tbody></table><h3 id="举例" tabindex="-1"><a class="header-anchor" href="#举例"><span>举例</span></a></h3><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 将/home/text.txt文件中的oldstr替换成newstr</span>
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/oldstr/newstr/&#39;</span> /home/text.txt
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/oldstr/newstr/g&#39;</span> /home/text.txt

<span class="token comment"># 上面的区别就是s///每行找到第一个oldstr并替换后就会结束，s///g不会结束，会替换到最后一个字符串</span>

<span class="token comment"># 如下测试用例，创建两个txt文件，写入abcabca\\nabcabcabca</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://cdn.nlark.com/yuque/0/2023/png/21953536/1679498606268-77b52d4f-a471-4efb-a2e4-b2badb8ae9c8.png#averageHue=%232a343e&amp;clientId=u5ce6f6a9-7c29-4&amp;from=paste&amp;height=347&amp;id=u7873d025&amp;originHeight=347&amp;originWidth=448&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=17823&amp;status=done&amp;style=none&amp;taskId=u4addc969-37de-46d6-9f9d-fdb9ef37560&amp;title=&amp;width=448" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><h1 id="进程" tabindex="-1"><a class="header-anchor" href="#进程"><span>进程</span></a></h1><h2 id="top" tabindex="-1"><a class="header-anchor" href="#top"><span>top</span></a></h2><p><code>top</code>命令可以实时显示系统的运行状态，包括CPU、内存、进程，类似Windows的<strong>任务管理器</strong>，但是更强大，能帮助我们排查服务器异常。</p><h3 id="用法-2" tabindex="-1"><a class="header-anchor" href="#用法-2"><span>用法</span></a></h3><p><code>top -hv | -bcHiOSs -d secs -n max -u|U user -p pid(s) -o field -w [cols]</code></p><h3 id="常用参数-1" tabindex="-1"><a class="header-anchor" href="#常用参数-1"><span>常用参数</span></a></h3><table><thead><tr><th>参数</th><th>说明</th><th>用例</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><h3 id="输出说明" tabindex="-1"><a class="header-anchor" href="#输出说明"><span>输出说明</span></a></h3><p><img src="`+l+'" alt="image.png" loading="lazy"> 第一排：</p><ul><li><code>top - 12:58:55 up 17 days, 19:53</code>：指的是这台服务器到今天的<code>12:58:55</code>启动了17天，19个小时，53分钟。</li><li><code>1 user</code>：指的是这台服务器目前只有一个用户处于登陆状态</li><li><code>load average: 0.01, 0.06, 0.06</code>：系统负载，三个数值指的是1分钟内的负载，5分钟内的负载，15分钟内的负载。</li></ul><p>第二排</p><ul><li><code>Tasks: 107 total</code>：进程数量 <ul><li><code>running</code>：运行中的进程</li><li><code>sleeping</code>：sleeping状态中的进程</li><li><code>stopped</code>：停止的进程</li><li><code>zombie</code>：僵尸进程</li></ul></li></ul><p>第三排</p><ul><li><code>%Cpu(s)</code>: <ul><li><code>us</code>：用户使用CPU</li><li><code>sy</code></li><li><code>ni</code></li><li><code>id</code></li><li><code>wa</code></li><li><code>hi</code></li><li><code>si</code></li><li><code>st</code></li></ul></li></ul><p>第四排/第五排</p>',49),g=t("<li><code>KiB Mem</code> ：以KiB为单位的内存信息 <ul><li><code>total</code>, 服务器总内存大小</li><li><code>free</code>, 未被使用的内存</li><li><code>used</code>, 目前进程占用的内存</li><li><code>buff/cache</code>：缓冲区所占内存</li></ul></li>",1),f=e("code",null,"KiB Swap",-1),k={href:"https://baike.baidu.com/item/SWaP/2666174?fr=aladdin",target:"_blank",rel:"noopener noreferrer"},x=e("ul",null,[e("li",null,[e("code",null,"total"),a("：")]),e("li",null,[e("code",null,"free"),a("：")]),e("li",null,[e("code",null,"used"),a("：")]),e("li",null,[e("code",null,"avail Mem"),a("：")])],-1),_=t(`<p>其他信息</p><ul><li>PID</li><li>USER</li><li>PR</li><li>NI</li><li>VIRT</li><li>RES</li><li>SHR S</li><li>%CPU</li><li>%MEM</li><li>TIME+</li><li>COMMAND</li></ul><h1 id="网络" tabindex="-1"><a class="header-anchor" href="#网络"><span>网络</span></a></h1><h2 id="ping" tabindex="-1"><a class="header-anchor" href="#ping"><span>ping</span></a></h2><p>packet Internet grouper，是一种因特网包探索器，用于测试网络连接量的程序。 ping是TCP/IP体系中应用层的一个命令。 ping可以通过向目标IP发送一个ICMP（Internet Control Message Protocol，因特网报文控制信息协议）报文，测试目的IP是否可达及了解其有关状态。</p><h3 id="功能" tabindex="-1"><a class="header-anchor" href="#功能"><span>功能</span></a></h3><ul><li>检测网络连通性</li><li>检测时延</li></ul><h2 id="netstat" tabindex="-1"><a class="header-anchor" href="#netstat"><span>netstat</span></a></h2><p>显示网络状态。 <strong>参数</strong></p><table><thead><tr><th>参数</th><th>解释</th></tr></thead><tbody><tr><td><code>-a --all</code></td><td>显示所有的Socket</td></tr><tr><td></td><td></td></tr></tbody></table><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">netstat</span> <span class="token parameter variable">-lnt</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="ps" tabindex="-1"><a class="header-anchor" href="#ps"><span>ps</span></a></h2><p>Process Status，用于显示当前进程的状态。 用法： <code>ps [options]</code><code>ps [--help]</code></p><h3 id="🌰" tabindex="-1"><a class="header-anchor" href="#🌰"><span>🌰</span></a></h3><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 查找所有的Java进程  -a代表查询所有 | 代表管道  grep代表过滤出</span>
<span class="token function">ps</span> <span class="token parameter variable">-a</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">java</span>

<span class="token comment"># 排除结果中的grep进程</span>
<span class="token function">ps</span> <span class="token parameter variable">-a</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">java</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token function">grep</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="根据pid查找工作目录" tabindex="-1"><a class="header-anchor" href="#根据pid查找工作目录"><span>根据PID查找工作目录</span></a></h4><p>场景：有一个服务A被同事上线了，但是你不知道这个服务部署在哪了，只知道部署在了哪台服务器以及服务的名称，那么此时你该如何定位到这个服务部署在哪个目录下了呢？ 方法1：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 查找服务PID</span>
<span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;service name&#39;</span>

<span class="token comment"># 终端输出如下：</span>
<span class="token comment"># op       18486     1  0 02:44 ?        00:01:12 java -jar -Xmx1g -Dspring.security.strategy=MODE_INHERITABLETHREADLOCAL stock-surge-1.0-SNAPSHOT.jar</span>

<span class="token comment"># 由上面的输出信息可知服务的PID为18486</span>

<span class="token comment"># 根据服务PID定位可执行文件位置,proc文件包含所有的进程及其详细信息</span>
<span class="token builtin class-name">cd</span> /proc

<span class="token comment"># 找到当前的PID</span>
ll <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">18486</span>

<span class="token comment"># 进入当前PID的目录</span>
<span class="token builtin class-name">cd</span> <span class="token number">18486</span>

<span class="token comment"># 查看cwd对应的引用值即当前工作目录</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以参考：</p>`,19),w={href:"https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/proc.html",target:"_blank",rel:"noopener noreferrer"},y=t(`<p>方法2：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 直接根据lsof 命令查找工作目录</span>
<span class="token comment"># 找到PID</span>
<span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;service name&#39;</span>

<span class="token comment"># 查找相关信息</span>
<span class="token function">lsof</span> <span class="token parameter variable">-p</span> PID
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="查找" tabindex="-1"><a class="header-anchor" href="#查找"><span>查找</span></a></h1><h2 id="find" tabindex="-1"><a class="header-anchor" href="#find"><span>find</span></a></h2><h2 id="locate" tabindex="-1"><a class="header-anchor" href="#locate"><span>locate</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">locate</span> <span class="token function">file</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="系统管理" tabindex="-1"><a class="header-anchor" href="#系统管理"><span>系统管理</span></a></h1><h2 id="sudo" tabindex="-1"><a class="header-anchor" href="#sudo"><span>sudo</span></a></h2><p>查看拥有sudo权限的用户：<code>/etc/sudoers</code></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 非root用户但拥有sudo权限的用户更改其他用户的密码</span>
<span class="token comment"># 先删除该用户密码</span>
<span class="token function">sudo</span> <span class="token function">passwd</span> <span class="token parameter variable">-d</span> user1

<span class="token comment"># 在该该用户设置密码</span>
<span class="token function">sudo</span> <span class="token parameter variable">-u</span> user1 <span class="token function">passwd</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="uname" tabindex="-1"><a class="header-anchor" href="#uname"><span>uname</span></a></h2><p>unix name，用于显示操作系统信息，如内核版本、主机名、处理器等。</p><table><thead><tr><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>a</td><td>显示全部的信息，包括内核名称、主机名、操作系统版本、处理器类型和硬件架构等</td></tr><tr><td>m</td><td>显示处理器类型</td></tr><tr><td>n</td><td>显示主机名</td></tr><tr><td>r</td><td>显示内核版本号</td></tr><tr><td>v</td><td>显示操作系统的版本</td></tr><tr><td>p</td><td>显示处理器类型</td></tr></tbody></table><h1 id="linux三剑客" tabindex="-1"><a class="header-anchor" href="#linux三剑客"><span>Linux三剑客</span></a></h1>`,14),I={href:"https://www.jianshu.com/p/f1402e96c9dd",target:"_blank",rel:"noopener noreferrer"},P=t('<h2 id="grep" tabindex="-1"><a class="header-anchor" href="#grep"><span>grep</span></a></h2><p>global search regular expression and print out the line，全局正则表达式搜索并打印该行，俗称管道，类似一层过滤网，多上一层命令的结果集进行过滤. 用法：<code>grep [options] &lt;pattern&gt; </code></p><p>参数</p><table><thead><tr><th>参数</th><th>解释</th></tr></thead><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table><h2 id="awk" tabindex="-1"><a class="header-anchor" href="#awk"><span>awk</span></a></h2><h2 id="sed-1" tabindex="-1"><a class="header-anchor" href="#sed-1"><span>sed</span></a></h2><h1 id="命令手册" tabindex="-1"><a class="header-anchor" href="#命令手册"><span>命令手册</span></a></h1><p>出自：</p>',8),C={href:"https://phoenixnap.com/kb/wp-content/uploads/2022/11/linuxCommandsAllUsersShouldKnow.pdf",target:"_blank",rel:"noopener noreferrer"},L={href:"https://www.yuque.com/attachments/yuque/0/2023/pdf/21953536/1677561001341-bb64ab76-4777-4fce-a4e5-e637ea631274.pdf",target:"_blank",rel:"noopener noreferrer"};function T(S,D){const n=d("ExternalLinkIcon");return o(),r("div",null,[p,e("ul",null,[e("li",null,[e("a",h,[a("https://phoenixnap.com/kb/linux-commands"),s(n)]),a("（推荐）")]),e("li",null,[e("a",u,[a("https://www.runoob.com/linux/linux-command-manual.html"),s(n)])]),e("li",null,[e("a",m,[a("https://www.linuxcool.com/"),s(n)])]),b]),v,e("ul",null,[g,e("li",null,[f,a("：交换区大小，详细信息可参考："),e("a",k,[a("Swap"),s(n)]),x])]),_,e("ul",null,[e("li",null,[e("a",w,[a("proc"),s(n)])])]),y,e("p",null,[a("可参考："),e("a",I,[a("https://www.jianshu.com/p/f1402e96c9dd"),s(n)])]),P,e("ul",null,[e("li",null,[e("a",C,[a("https://phoenixnap.com/kb/wp-content/uploads/2022/11/linuxCommandsAllUsersShouldKnow.pdf"),s(n)])]),e("li",null,[e("a",L,[a("linuxCommandsAllUsersShouldKnow.pdf"),s(n)])])])])}const A=i(c,[["render",T],["__file","Linux Command.html.vue"]]),N=JSON.parse('{"path":"/posts/notes/Linux%20Command.html","title":"Linux Command","lang":"en-US","frontmatter":{"icon":"pen-to-square","date":"2021-03-17T00:00:00.000Z","category":["Linux"],"title":"Linux Command","tag":["ls"],"description":"一个命令的使用总归是先有一个背景的，所以如下命令都是结合适用场景总结出来的。 由于Linux家族过于庞大，每个分支都各有特点，且处理方式不完全一样，所以我会尽量给出常用系统的命令。 这里你需要知道自己的电脑属于哪个发行版，不了解的可以点击了解一下(虽然我也不是很了解，但是可以稍微i提供一点点帮助)。 参考 https://phoenixnap.com/...","head":[["meta",{"property":"og:url","content":"https://imarshio.github.io/posts/notes/Linux%20Command.html"}],["meta",{"property":"og:site_name","content":"Blog"}],["meta",{"property":"og:title","content":"Linux Command"}],["meta",{"property":"og:description","content":"一个命令的使用总归是先有一个背景的，所以如下命令都是结合适用场景总结出来的。 由于Linux家族过于庞大，每个分支都各有特点，且处理方式不完全一样，所以我会尽量给出常用系统的命令。 这里你需要知道自己的电脑属于哪个发行版，不了解的可以点击了解一下(虽然我也不是很了解，但是可以稍微i提供一点点帮助)。 参考 https://phoenixnap.com/..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.nlark.com/yuque/0/2023/png/21953536/1679498606268-77b52d4f-a471-4efb-a2e4-b2badb8ae9c8.png#averageHue=%232a343e&clientId=u5ce6f6a9-7c29-4&from=paste&height=347&id=u7873d025&originHeight=347&originWidth=448&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17823&status=done&style=none&taskId=u4addc969-37de-46d6-9f9d-fdb9ef37560&title=&width=448"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-03-20T03:10:38.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Linux Command"}],["meta",{"property":"article:author","content":"Marshio"}],["meta",{"property":"article:tag","content":"ls"}],["meta",{"property":"article:published_time","content":"2021-03-17T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-20T03:10:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Linux Command\\",\\"image\\":[\\"https://cdn.nlark.com/yuque/0/2023/png/21953536/1679498606268-77b52d4f-a471-4efb-a2e4-b2badb8ae9c8.png#averageHue=%232a343e&clientId=u5ce6f6a9-7c29-4&from=paste&height=347&id=u7873d025&originHeight=347&originWidth=448&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17823&status=done&style=none&taskId=u4addc969-37de-46d6-9f9d-fdb9ef37560&title=&width=448\\",\\"https://imarshio.github.io/assets/images/LinuxCommand-20240318-0002.png\\"],\\"datePublished\\":\\"2021-03-17T00:00:00.000Z\\",\\"dateModified\\":\\"2024-03-20T03:10:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Marshio\\",\\"url\\":\\"https://marshio.com\\"}]}"]]},"headers":[{"level":2,"title":"ls","slug":"ls","link":"#ls","children":[]},{"level":2,"title":"mkdir","slug":"mkdir","link":"#mkdir","children":[]},{"level":2,"title":"touch","slug":"touch","link":"#touch","children":[]},{"level":2,"title":"rm","slug":"rm","link":"#rm","children":[]},{"level":2,"title":"cat","slug":"cat","link":"#cat","children":[{"level":3,"title":"用法","slug":"用法","link":"#用法","children":[]},{"level":3,"title":"常用参数","slug":"常用参数","link":"#常用参数","children":[]},{"level":3,"title":"常用场景","slug":"常用场景","link":"#常用场景","children":[]}]},{"level":2,"title":"tail","slug":"tail","link":"#tail","children":[]},{"level":2,"title":"vi","slug":"vi","link":"#vi","children":[]},{"level":2,"title":"vim","slug":"vim","link":"#vim","children":[]},{"level":2,"title":"","slug":"","link":"#","children":[]},{"level":2,"title":"sed","slug":"sed","link":"#sed","children":[{"level":3,"title":"用法","slug":"用法-1","link":"#用法-1","children":[]},{"level":3,"title":"参数","slug":"参数","link":"#参数","children":[]},{"level":3,"title":"举例","slug":"举例","link":"#举例","children":[]}]},{"level":2,"title":"top","slug":"top","link":"#top","children":[{"level":3,"title":"用法","slug":"用法-2","link":"#用法-2","children":[]},{"level":3,"title":"常用参数","slug":"常用参数-1","link":"#常用参数-1","children":[]},{"level":3,"title":"输出说明","slug":"输出说明","link":"#输出说明","children":[]}]},{"level":2,"title":"ping","slug":"ping","link":"#ping","children":[{"level":3,"title":"功能","slug":"功能","link":"#功能","children":[]}]},{"level":2,"title":"netstat","slug":"netstat","link":"#netstat","children":[]},{"level":2,"title":"ps","slug":"ps","link":"#ps","children":[{"level":3,"title":"🌰","slug":"🌰","link":"#🌰","children":[]}]},{"level":2,"title":"find","slug":"find","link":"#find","children":[]},{"level":2,"title":"locate","slug":"locate","link":"#locate","children":[]},{"level":2,"title":"sudo","slug":"sudo","link":"#sudo","children":[]},{"level":2,"title":"uname","slug":"uname","link":"#uname","children":[]},{"level":2,"title":"grep","slug":"grep","link":"#grep","children":[]},{"level":2,"title":"awk","slug":"awk","link":"#awk","children":[]},{"level":2,"title":"sed","slug":"sed-1","link":"#sed-1","children":[]}],"git":{"createdTime":1710904238000,"updatedTime":1710904238000,"contributors":[{"name":"marshio","email":"marshioman@gmail.com","commits":1}]},"readingTime":{"minutes":5.3,"words":1589},"filePathRelative":"posts/notes/Linux Command.md","localizedDate":"March 17, 2021","excerpt":"<p>一个命令的使用总归是先有一个背景的，所以如下命令都是结合适用场景总结出来的。\\n由于Linux家族过于庞大，每个分支都各有特点，且处理方式不完全一样，所以我会尽量给出常用系统的命令。\\n这里你需要知道自己的电脑属于哪个发行版，不了解的可以点击了解一下(虽然我也不是很了解，但是可以稍微i提供一点点帮助)。\\n参考</p>\\n<ul>\\n<li><a href=\\"https://phoenixnap.com/kb/linux-commands\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://phoenixnap.com/kb/linux-commands</a>（推荐）</li>\\n<li><a href=\\"https://www.runoob.com/linux/linux-command-manual.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.runoob.com/linux/linux-command-manual.html</a></li>\\n<li><a href=\\"https://www.linuxcool.com/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.linuxcool.com/</a></li>\\n<li></li>\\n</ul>","autoDesc":true}');export{A as comp,N as data};
