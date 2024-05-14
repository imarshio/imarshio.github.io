---
icon: pen-to-square
star: true
title: Spring Bean(未完成)
order: 34
category:
  - Logging Framework
tag:
  - spring bean
---

## Spring启动间都发生了什么？

<https://docs.spring.io/spring-framework/docs/3.0.x/reference/overview.html>

Springboot作为我们最常用的一款框架，其启动流程、注册机制、容器管理、bean加载、启动后是如何保持服务一直运行的，这些问题你都清楚嘛？

如果你也不清楚，那么我们来一起看看SpringBoot是如何启动的吧，在这里你会了解到Springboot是如何启动的，并且是如何支持上述问题的。

问题清单

- 启动流程
- 注册机制
- 容器管理
- bean加载过程
- 日志框架
- 启动后是如何保持服务一直运行的？

流程图我后续会整理到：<https://www.processon.com/diagraming/63e39fc810a38f1c1873131e>

接下来我们跟踪源码进入Spring的启动过程，看看Spring启动时都发生了什么？

## 1.1 入口

```java
// 首先，我们从SpringApplication类开始，SpringApplication类是SpringBoot的入口点，SpringBoot启动时，会调用SpringApplication.run方法
// SpringApplication.run方法会调用SpringApplication.run方法，SpringApplication.run方法会调用SpringApplication.run方法，SpringApplication.run方法会调用SpringApplication.run方法，SpringApplication.run方法会调用SpringApplication()
@SpringBootApplication
public class BootProcessApplication {

    public static void main(String[] args) {
        // 1.1启动入口
        SpringApplication.run(BootProcessApplication.class, args);
    }
}
```

### 1.2 调用SpringApplication.run方法

```java
public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
    // 调用SpringApplication.run方法
    return run(new Class[]{primarySource}, args);
}

public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
    // 调用SpringApplication.run方法,声明一个SpringApplication对象，对对象的属性进行初始化
    return (new SpringApplication(primarySources)).run(args);
}

public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    this.resourceLoader = resourceLoader;
    Assert.notNull(primarySources, "PrimarySources must not be null");
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
    // 获取应用类型
    this.webApplicationType = WebApplicationType.deduceFromClasspath();
    setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
    this.mainApplicationClass = deduceMainApplicationClass();
}

// 调用SpringApplication.run方法，这个方法可以让我们看到Spring启动期间大致做了什么事
public ConfigurableApplicationContext run(String... args) {
    // 定义全局的计时器
    StopWatch stopWatch = new StopWatch();
    // 开始计时
    stopWatch.start();
    // 定义Spring应用上下文的变量
    ConfigurableApplicationContext context = null;
    // 定义SpringBoot异常报告栈
    Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList();
    // 1.3 配置headless mode，详情可以参考下面的注释
    this.configureHeadlessProperty();
    // 1.4 获取SpringBoot监听器并启动监听器
    SpringApplicationRunListeners listeners = this.getRunListeners(args);
    listeners.starting();

    Collection exceptionReporters;
    try {
        // 获取SpringBoot启动参数： []
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
        // 1.5 准备SpringBoot环境变量
        ConfigurableEnvironment environment = this.prepareEnvironment(listeners, applicationArguments);
        this.configureIgnoreBeanInfo(environment);
        // 打印SpringBoot启动banner
        Banner printedBanner = this.printBanner(environment);
        // 1.6 创建Spring应用上下文
        context = this.createApplicationContext();
        exceptionReporters = this.getSpringFactoriesInstances(SpringBootExceptionReporter.class, new Class[]{ConfigurableApplicationContext.class}, context);
        // 2.1 准备SpringBoot上下文，重点1
        this.prepareContext(context, environment, listeners, applicationArguments, printedBanner);
        // 3.1 刷新SpringBoot上下文，重点2
        this.refreshContext(context);
        // 刷新完成后的动作，空方法！！
        this.afterRefresh(context, applicationArguments);
        stopWatch.stop();
        if (this.logStartupInfo) {
            (new StartupInfoLogger(this.mainApplicationClass)).logStarted(this.getApplicationLog(), stopWatch);
        }

        listeners.started(context);
        // 4.1 运行SpringBoot上下文
        this.callRunners(context, applicationArguments);
    } catch (Throwable var10) {
        this.handleRunFailure(context, var10, exceptionReporters, listeners);
        throw new IllegalStateException(var10);
    }

    try {
        listeners.running(context);
        return context;
    } catch (Throwable var9) {
        this.handleRunFailure(context, var9, exceptionReporters, (SpringApplicationRunListeners) null);
        throw new IllegalStateException(var9);
    }
}

```

### 1.3 配置headless mode

```java
// 1.3 配置headless mode
private void configureHeadlessProperty() {
    // 结合上下文，可以知道，这里是给java.awt.headless设置默认值（根据上下文可知）：true
    // java.awt.headless参数的意义是：在没有显示器的、键盘、鼠标等设备的情况下，程序可以运行
    // 可以通过：System.setProperty("java.awt.headless", "true"); 或者添加启动参数：java -Djava.awt.headless=true
    // Headless mode is a system configuration in which the display device, keyboard, or mouse is lacking. 
    // Sounds unexpected, but actually you can perform different operations in this mode, even with graphic data.
    System.setProperty("java.awt.headless", System.getProperty("java.awt.headless", Boolean.toString(this.headless)));
}
```

### 1.4 获取SpringBoot监听器并启动监听器

```java
// 1.4 获取SpringBoot启动监听器
private SpringApplicationRunListeners getRunListeners(String[] args) {
    Class<?>[] types = new Class<?>[]{SpringApplication.class, String[].class};
    // 1.4.1 定义SpringBoot启动监听器
    return new SpringApplicationRunListeners(logger,
            // SpringApplicationRunListener,跟踪源码可以看到，这个接口的实现为EventPublishingRunListener
            getSpringFactoriesInstances(SpringApplicationRunListener.class, types, this, args));
}

// 1.4.2 获取Spring工厂实例
private <T> Collection<T> getSpringFactoriesInstances(Class<T> type, Class<?>[] parameterTypes, Object... args) {
    // 这里获取到的classLoader是AppClassLoader
    ClassLoader classLoader = getClassLoader();
    // Use names and ensure unique to protect against duplicates
    Set<String> names = new LinkedHashSet<>(SpringFactoriesLoader.loadFactoryNames(type, classLoader));
    List<T> instances = createSpringFactoriesInstances(type, parameterTypes, classLoader, args, names);

    AnnotationAwareOrderComparator.sort(instances);
    return instances;
}

/**
 *
 * @param type SpringApplicationRunListener
 * @param parameterTypes SpringApplication.class, String[].class
 * @param classLoader AppClassLoader
 * @param args []
 * @param names class的完整类名
 * @return List<T>
 * @param <T> 类
 */
private <T> List<T> createSpringFactoriesInstances(Class<T> type, Class<?>[] parameterTypes,
                                                   ClassLoader classLoader, Object[] args, Set<String> names) {
    List<T> instances = new ArrayList<>(names.size());
    // 1.4.2.1 遍历SpringBoot启动监听器
    for (String name : names) {
        try {
            Class<?> instanceClass = ClassUtils.forName(name, classLoader);
            Assert.isAssignable(type, instanceClass);
            Constructor<?> constructor = instanceClass.getDeclaredConstructor(parameterTypes);
            // 熟悉的代码，同样的反射构造
            T instance = (T) BeanUtils.instantiateClass(constructor, args);
            instances.add(instance);
        } catch (Throwable ex) {
            throw new IllegalArgumentException("Cannot instantiate " + type + " : " + name, ex);
        }
    }
    return instances;
}

// 1.4.3 初始化SpringBoot启动监听器
class SpringApplicationRunListeners {
    // 注意这里两个类是不一样的，不是递归调用哦
    void starting() {
        // 区别SpringApplicationRunListeners：SpringApplicationRunListener，可以这么理解，
        // SpringApplicationRunListeners是SpringApplicationRunListener的集合（代理）
        for (SpringApplicationRunListener listener : this.listeners) {
            listener.starting();
        }
    }
}

public interface SpringApplicationRunListener {
    default void starting() {
    }
}

public class EventPublishingRunListener implements SpringApplicationRunListener, Ordered {

    @Override
    public void starting() {
        // 广播一个新的事件：new ApplicationStartingEvent(this.application, this.args)，表示SpringBoot应用正在启动
        this.initialMulticaster.multicastEvent(new ApplicationStartingEvent(this.application, this.args));
    }
}
```

有关监听器这里还有一些细节，其方法的具体意义跟其方法命名一致，即字面意思。

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.io.support.SpringFactoriesLoader;

@SuppressWarnings("all")
public interface SpringApplicationRunListener {

    /**
     * Called immediately when the run method has first started. Can be used for very
     * early initialization.
     *
     * 翻译过来就是：在应用启动的时候调用，用于最开始的初始化
     */
    default void starting() {
    }

    /**
     * Called once the environment has been prepared, but before the
     * {@link ApplicationContext} has been created.
     * @param environment the environment
     */
    default void environmentPrepared(ConfigurableEnvironment environment) {
    }

    /**
     * Called once the {@link ApplicationContext} has been created and prepared, but
     * before sources have been loaded.
     * @param context the application context
     */
    default void contextPrepared(ConfigurableApplicationContext context) {
    }

    /**
     * Called once the application context has been loaded but before it has been
     * refreshed.
     * @param context the application context
     */
    default void contextLoaded(ConfigurableApplicationContext context) {
    }

    /**
     * The context has been refreshed and the application has started but
     * {@link CommandLineRunner CommandLineRunners} and {@link ApplicationRunner
     * ApplicationRunners} have not been called.
     * @param context the application context.
     * @since 2.0.0
     */
    default void started(ConfigurableApplicationContext context) {
    }

    /**
     * Called immediately before the run method finishes, when the application context has
     * been refreshed and all {@link CommandLineRunner CommandLineRunners} and
     * {@link ApplicationRunner ApplicationRunners} have been called.
     * @param context the application context.
     * @since 2.0.0
     */
    default void running(ConfigurableApplicationContext context) {
    }

    /**
     * Called when a failure occurs when running the application.
     * @param context the application context or {@code null} if a failure occurred before
     * the context was created
     * @param exception the failure
     * @since 2.0.0
     */
    default void failed(ConfigurableApplicationContext context, Throwable exception) {
    }

}
```

### 1.5 准备SpringBoot环境变量

```java
private ConfigurableEnvironment prepareEnvironment(SpringApplicationRunListeners listeners,
                                                   ApplicationArguments applicationArguments) {
    // Create and configure the environment
    ConfigurableEnvironment environment = getOrCreateEnvironment();
    // 配置环境变量
    configureEnvironment(environment, applicationArguments.getSourceArgs());
    ConfigurationPropertySources.attach(environment);
    // 监听器发布 程序环境准备已完成
    listeners.environmentPrepared(environment);
    bindToSpringApplication(environment);
    if (!this.isCustomEnvironment) {
        environment = new EnvironmentConverter(getClassLoader()).convertEnvironmentIfNecessary(environment,
                deduceEnvironmentClass());
    }
    ConfigurationPropertySources.attach(environment);
    return environment;
}

@SuppressWarnings("all")
private ConfigurableEnvironment getOrCreateEnvironment() {
    if (this.environment != null) {
        return this.environment;
    }
    switch (this.webApplicationType) {
        case SERVLET:
            // Servlet环境，构造器
            return new StandardServletEnvironment();
        case REACTIVE:
            return new StandardReactiveWebEnvironment();
        default:
            return new StandardEnvironment();
    }
}
```

### 1.6 创建Spring应用上下文 *重点*

```java

// 上下文变量，初始化为null
private Class<? extends ConfigurableApplicationContext> applicationContextClass;

// 1.10 创建Spring应用上下文
@SuppressWarnings("all")
protected ConfigurableApplicationContext createApplicationContext() {
    Class<?> contextClass = this.applicationContextClass;
    // 初次创建时applicationContextClass为null
    if (contextClass == null) {
        try {
            // 启动时，因为带了spring-boot-starter-web依赖，所以在启动时，webApplicationType为SERVLET
            switch (this.webApplicationType) {
                case SERVLET:
                    contextClass = Class.forName(DEFAULT_SERVLET_WEB_CONTEXT_CLASS);
                    break;
                case REACTIVE:
                    contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
                    break;
                default:
                    contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
            }
        } catch (ClassNotFoundException ex) {
            throw new IllegalStateException(
                    "Unable create a default ApplicationContext, please specify an ApplicationContextClass", ex);
        }
    }
    // 实例化上下文，通过反射去调用方法的构造方法进行实例化，在这里有很多需要注意的地方，具体如下
    return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
}
```

#### 1.6.1 实例化content

接上文，`(ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass)`
看似简单的一段代码，实则中间发生了好多你不一定知道的事情，下面就让我们来一探究竟吧。

跟代码往下走你可以发现最终的目的为`org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext`
类声明一个新的实例

而这个类的实例化过程如下

```java
public class AnnotationConfigServletWebServerApplicationContext extends ServletWebServerApplicationContext
        implements AnnotationConfigRegistry {

    private final AnnotatedBeanDefinitionReader reader;

    private final ClassPathBeanDefinitionScanner scanner;

    private final Set<Class<?>> annotatedClasses = new LinkedHashSet<>();

    private String[] basePackages;

    /**
     * Create a new {@link AnnotationConfigServletWebServerApplicationContext} that needs
     * to be populated through register (a method in this class that I didn't show) calls 
     * and then manually refresh ( another method).
     */
    public AnnotationConfigServletWebServerApplicationContext() {
        // 想必大家都知道BeanDefinition在spring中是非常重要的
        // 而这里给大家展示了应用上下文在初始化时是如何使用这些BeanDefinition的
        // 注解bd读取器（加载器），类路径bd读取器（加载器）
        this.reader = new AnnotatedBeanDefinitionReader(this);
        this.scanner = new ClassPathBeanDefinitionScanner(this);
    }
}
```

我们可以看下这个类的继承与实现关系网

![img](https://cdn.nlark.com/yuque/0/2024/png/21953536/1709441514491-4b612119-0910-471d-918c-e0779c04909a.png)

#### 1.6.2 AnnotatedBeanDefinitionReader实例化过程

```java
@SuppressWarnings("all")
public class AnnotatedBeanDefinitionReader {

    private final BeanDefinitionRegistry registry;

    private BeanNameGenerator beanNameGenerator = AnnotationBeanNameGenerator.INSTANCE;

    private ScopeMetadataResolver scopeMetadataResolver = new AnnotationScopeMetadataResolver();

    private ConditionEvaluator conditionEvaluator;


    /**
     * Create a new {@code AnnotatedBeanDefinitionReader} for the given registry.
     * <p>If the registry is {@link EnvironmentCapable}, e.g. is an {@code ApplicationContext},
     * the {@link Environment} will be inherited, otherwise a new
     * {@link StandardEnvironment} will be created and used.
     * @param registry the {@code BeanFactory} to load bean definitions into,
     * in the form of a {@code BeanDefinitionRegistry}
     * @see #AnnotatedBeanDefinitionReader(BeanDefinitionRegistry, Environment)
     * @see #setEnvironment(Environment)
     */
    public AnnotatedBeanDefinitionReader(BeanDefinitionRegistry registry) {
        // 在上面的步骤中，会调用这个方法，这个方法会调用下面的方法 
        this(registry, getOrCreateEnvironment(registry));
    }

    /**
     * Create a new {@code AnnotatedBeanDefinitionReader} for the given registry,
     * using the given {@link Environment}.
     * @param registry the {@code BeanFactory} to load bean definitions into,
     * in the form of a {@code BeanDefinitionRegistry}
     * @param environment the {@code Environment} to use when evaluating bean definition
     * profiles.
     * @since 3.1
     */
    public AnnotatedBeanDefinitionReader(BeanDefinitionRegistry registry, Environment environment) {
        Assert.notNull(registry, "BeanDefinitionRegistry must not be null");
        Assert.notNull(environment, "Environment must not be null");
        this.registry = registry;
        this.conditionEvaluator = new ConditionEvaluator(registry, environment, null);
        // 上main都是正常的调用，没什么特殊的逻辑，直到这里
        AnnotationConfigUtils.registerAnnotationConfigProcessors(this.registry);
    }
}
```

#### 1.6.3 registerAnnotationConfigProcessors

注册注解配置处理器

```java
    // 最终方法会调用到这里
public static Set<BeanDefinitionHolder> registerAnnotationConfigProcessors(
        BeanDefinitionRegistry registry, @Nullable Object source) {
    // 这里我们需要想一下，beanFactory是什么时候被放进来的？
    // 答案看 1.6.3.1
    DefaultListableBeanFactory beanFactory = unwrapDefaultListableBeanFactory(registry);
    if (beanFactory != null) {
        if (!(beanFactory.getDependencyComparator() instanceof AnnotationAwareOrderComparator)) {
            // 依赖排序，通过设置@Priority来设置排序大小
            beanFactory.setDependencyComparator(AnnotationAwareOrderComparator.INSTANCE);
        }
        if (!(beanFactory.getAutowireCandidateResolver() instanceof ContextAnnotationAutowireCandidateResolver)) {
            // 设置自动注册情况的解析器
            beanFactory.setAutowireCandidateResolver(new ContextAnnotationAutowireCandidateResolver());
        }
    }
    
    // 声明一个存储bean定义的holder的集合
    Set<BeanDefinitionHolder> beanDefs = new LinkedHashSet<>(8);

    if (!registry.containsBeanDefinition(CONFIGURATION_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(ConfigurationClassPostProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, CONFIGURATION_ANNOTATION_PROCESSOR_BEAN_NAME));
    }

    if (!registry.containsBeanDefinition(AUTOWIRED_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(AutowiredAnnotationBeanPostProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, AUTOWIRED_ANNOTATION_PROCESSOR_BEAN_NAME));
    }

    // Check for JSR-250 support, and if present add the CommonAnnotationBeanPostProcessor.
    if (jsr250Present && !registry.containsBeanDefinition(COMMON_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(CommonAnnotationBeanPostProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, COMMON_ANNOTATION_PROCESSOR_BEAN_NAME));
    }

    // Check for JPA support, and if present add the PersistenceAnnotationBeanPostProcessor.
    if (jpaPresent && !registry.containsBeanDefinition(PERSISTENCE_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition();
        try {
            def.setBeanClass(ClassUtils.forName(PERSISTENCE_ANNOTATION_PROCESSOR_CLASS_NAME,
                    AnnotationConfigUtils.class.getClassLoader()));
        } catch (ClassNotFoundException ex) {
            throw new IllegalStateException(
                    "Cannot load optional framework class: " + PERSISTENCE_ANNOTATION_PROCESSOR_CLASS_NAME, ex);
        }
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, PERSISTENCE_ANNOTATION_PROCESSOR_BEAN_NAME));
    }

    if (!registry.containsBeanDefinition(EVENT_LISTENER_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(EventListenerMethodProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, EVENT_LISTENER_PROCESSOR_BEAN_NAME));
    }

    if (!registry.containsBeanDefinition(EVENT_LISTENER_FACTORY_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(DefaultEventListenerFactory.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, EVENT_LISTENER_FACTORY_BEAN_NAME));
    }

    return beanDefs;
}
```

##### 1.6.3.1 解答

> 当我们在步骤1.6 中调用BeanUtils.instantiateClass(contextClass)方法时，根据Java的双亲委派机制，一个子类被加载时，其父类一定会先被加载，
> 而AnnotationConfigServletWebServerApplicationContext的父类中的GenericApplicationContext在初始化时会声明一个beanFactory

#### 1.6.4 ClassPathBeanDefinitionScanner实例化过程

同`AnnotatedBeanDefinitionReader`.

## 2.1 准备SpringBoot上下文 *重点*

```java
private void prepareContext(ConfigurableApplicationContext context, ConfigurableEnvironment environment,
                            SpringApplicationRunListeners listeners, ApplicationArguments applicationArguments, Banner printedBanner) {
    // 设置上下文环境
    context.setEnvironment(environment);
    // 2.2 前置处理
    postProcessApplicationContext(context);
    // 2.3 程序上下文初始化
    applyInitializers(context);
    // 发布事件：程序进入prepared阶段
    listeners.contextPrepared(context);
    if (this.logStartupInfo) {
        // 日志启动，在此之前日志系统不会输出内容
        logStartupInfo(context.getParent() == null);
        logStartupProfileInfo(context);
    }
    // Add boot specific singleton beans，添加启动时指定的单例bean，获取bean工厂
    ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
    beanFactory.registerSingleton("springApplicationArguments", applicationArguments);
    if (printedBanner != null) {
        beanFactory.registerSingleton("springBootBanner", printedBanner);
    }
    if (beanFactory instanceof DefaultListableBeanFactory) {
        ((DefaultListableBeanFactory) beanFactory)
                .setAllowBeanDefinitionOverriding(this.allowBeanDefinitionOverriding);
    }
    if (this.lazyInitialization) {
        context.addBeanFactoryPostProcessor(new LazyInitializationBeanFactoryPostProcessor());
    }
    // Load the sources
    Set<Object> sources = getAllSources();
    Assert.notEmpty(sources, "Sources must not be empty");
    load(context, sources.toArray(new Object[0]));
    // 发布事件：上下文进入loaded阶段
    listeners.contextLoaded(context);
}
```

### 2.2 应用上下文的前置处理

```java
// 应用上下文的前置处理
@SuppressWarnings("all")
protected void postProcessApplicationContext(ConfigurableApplicationContext context) {
    // bean name 生成器
    if (this.beanNameGenerator != null) {
        context.getBeanFactory().registerSingleton(AnnotationConfigUtils.CONFIGURATION_BEAN_NAME_GENERATOR,
                this.beanNameGenerator);
    }
    // 资源加载器
    if (this.resourceLoader != null) {
        if (context instanceof GenericApplicationContext) {
            ((GenericApplicationContext) context).setResourceLoader(this.resourceLoader);
        }
        if (context instanceof DefaultResourceLoader) {
            ((DefaultResourceLoader) context).setClassLoader(this.resourceLoader.getClassLoader());
        }
    }
    // 添加转换服务
    if (this.addConversionService) {
        context.getBeanFactory().setConversionService(ApplicationConversionService.getSharedInstance());
    }
}
```

### 2.3 初始化容器前的处理

```java
// 如果我们有定制化需求，我们也可以自己实现这个接口
@SuppressWarnings("all")
protected void applyInitializers(ConfigurableApplicationContext context) {
    // 通过getInitializers() 我们可以知道Springboot内置的初始化器都有哪些
    for (ApplicationContextInitializer initializer : getInitializers()) {
        Class<?> requiredType = GenericTypeResolver.resolveTypeArgument(initializer.getClass(),
                ApplicationContextInitializer.class);
        Assert.isInstanceOf(requiredType, context, "Unable to call initializer.");
        initializer.initialize(context);
    }
}

// 接口
public interface ApplicationContextInitializer<C extends ConfigurableApplicationContext> {

    /**
     * Initialize the given application context.
     * @param applicationContext the application to configure
     */
    void initialize(C applicationContext);

}
```

补充，如何添加自实现的initializer

```java
@Order(199)
public class ApplicationContextInitializerUsage implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    // 日志
    private static final Log log = LogFactory.getLog(ApplicationContextInitializerUsage.class);

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        // 在初始化容器之前，可以对容器进行一些初始化操作
        log.info("ApplicationContextInitializerUsage.initialize()");
        log.info("applicationContext is active " + applicationContext.isActive());
        log.info("applicationContext application name: " + applicationContext.getApplicationName());
        log.info("applicationContext display name :" + applicationContext.getDisplayName());
        log.info("applicationContext beanFactory : " + applicationContext.getBeanFactory());
        log.info("applicationContext beanDefinition count :" + applicationContext.getBeanDefinitionCount());
        log.info("applicationContext BeanDefinitionNames :" + Arrays.toString(applicationContext.getBeanDefinitionNames()));
        // log.info("applicationContext AutowireCapableBeanFactory :" + applicationContext.getAutowireCapableBeanFactory());
        log.info("applicationContext class loader :" + applicationContext.getClassLoader());
        log.info("applicationContext startup date :" + applicationContext.getStartupDate());
    }
}

@Slf4j
@SpringBootApplication
public class BootProcessApplication {

    public static void main(String[] args) {
        // 启动入口
        // SpringApplication.run(BootProcessApplication.class, args);

        // 声明
        SpringApplication app = new SpringApplication(BootProcessApplication.class);

        // 注册启动器
        app.addInitializers(new ApplicationContextInitializerUsage());

        // 启动
        app.run();
    }
}
```

## 3.1 刷新SpringBoot上下文 *重点*

```java
@SuppressWarnings("all")
public class SpringApplication {
    private void refreshContext(ConfigurableApplicationContext context) {
        if (this.registerShutdownHook) {
            // 检测勾子，如果为true，就注册一个结束前调用的勾子
            try {
                context.registerShutdownHook();
            } catch (AccessControlException ex) {
                // Not allowed in some environments.
            }
        }
        // 进入实际的refresh
        refresh((ApplicationContext) context);
    }

    @Deprecated
    protected void refresh(ApplicationContext applicationContext) {
        Assert.isInstanceOf(ConfigurableApplicationContext.class, applicationContext);
        refresh((ConfigurableApplicationContext) applicationContext);
    }

    protected void refresh(ConfigurableApplicationContext applicationContext) {
      applicationContext.refresh();
    }
    
    // ... 深入digging
}

```

上面的方法调用的是如下抽象类的方法，这里我们需要牢记类的继承关系图

```java
// 最终会找一个抽象类，可以大致了解一下这个类的方法大体干了什么
@SuppressWarnings("all")
public abstract class AbstractApplicationContext extends DefaultResourceLoader
        implements ConfigurableApplicationContext {
    
    @Override
    public void refresh() throws BeansException, IllegalStateException {
      synchronized (this.startupShutdownMonitor) {
        // Prepare this context for refreshing.
        // 3.2 准备上下文刷新，即context
        prepareRefresh();
    
        // Tell the subclass to refresh the internal bean factory.
        // 3.3 获取beanFactory
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
    
        // Prepare the bean factory for use in this context.
        // 3.4 beanFactory的初始化
        prepareBeanFactory(beanFactory);
    
        try {
          // Allows post-processing of the bean factory in context subclasses.
          // 3.5 beanFactory的前置处理
          postProcessBeanFactory(beanFactory);
    
          // Invoke factory processors registered as beans in the context.
          // 3.6 调用
          invokeBeanFactoryPostProcessors(beanFactory);
    
          // Register bean processors that intercept bean creation.
          // 3.7 注册 Bean 后处理器
          registerBeanPostProcessors(beanFactory);
    
          // Initialize message source for this context.
          // 3.8 初始化上下文的消息源
          initMessageSource();
    
          // Initialize event multicaster for this context.
          // 3.9 初始化应用事件组播器
          initApplicationEventMulticaster();
    
          // Initialize other special beans in specific context subclasses.
          // 3.10 初始化其他指定的bean
          onRefresh();
    
          // Check for listener beans and register them.
          // 注册监听器
          registerListeners();
    
          // Instantiate all remaining (non-lazy-init) singletons.
          // 3.11 实例化其他的单例模式
          finishBeanFactoryInitialization(beanFactory);
    
          // Last step: publish corresponding event.
          // 3.12 
          finishRefresh();
        }
    
        catch (BeansException ex) {
          if (logger.isWarnEnabled()) {
            logger.warn("Exception encountered during context initialization - " +
                    "cancelling refresh attempt: " + ex);
          }
    
          // Destroy already created singletons to avoid dangling resources.
          destroyBeans();
    
          // Reset 'active' flag.
          cancelRefresh(ex);
    
          // Propagate exception to caller.
          throw ex;
        }
    
        finally {
          // Reset common introspection caches in Spring's core, since we
          // might not ever need metadata for singleton beans anymore...
          // 重置通用缓存
          resetCommonCaches();
        }
      }
    }
    
    protected void finishRefresh() {
      // Clear context-level resource caches (such as ASM metadata from scanning).
      clearResourceCaches();
  
      // Initialize lifecycle processor for this context.
      initLifecycleProcessor();
  
      // Propagate refresh to lifecycle processor first.
      getLifecycleProcessor().onRefresh();
  
      // Publish the final event.
      publishEvent(new ContextRefreshedEvent(this));
  
      // Participate in LiveBeansView MBean, if active.
      LiveBeansView.registerApplicationContext(this);
 }
}
```

### 3.2 准备上下文刷新

```java
@SuppressWarnings("all")
protected void prepareRefresh() {
    // Switch to active.
    this.startupDate = System.currentTimeMillis();
    this.closed.set(false);
    this.active.set(true);

    if (logger.isDebugEnabled()) {
        if (logger.isTraceEnabled()) {
            logger.trace("Refreshing " + this);
        }
        else {
            logger.debug("Refreshing " + getDisplayName());
        }
    }

    // Initialize any placeholder property sources in the context environment.
    // 初始化参数源，其实这里没做什么实际的事情
    initPropertySources();

    // Validate that all properties marked as required are resolvable:
    // see ConfigurablePropertyResolver#setRequiredProperties
    // 校验参数是否合法
    getEnvironment().validateRequiredProperties();

    // Store pre-refresh ApplicationListeners...
    if (this.earlyApplicationListeners == null) {
        this.earlyApplicationListeners = new LinkedHashSet<>(this.applicationListeners);
    }
    else {
        // Reset local application listeners to pre-refresh state.
        this.applicationListeners.clear();
        this.applicationListeners.addAll(this.earlyApplicationListeners);
    }

    // Allow for the collection of early ApplicationEvents,
    // to be published once the multicaster is available...
    this.earlyApplicationEvents = new LinkedHashSet<>();
}
```

### 3.3 获取beanFactory

```java
@SuppressWarnings("all")
protected ConfigurableListableBeanFactory obtainFreshBeanFactory() {
    refreshBeanFactory();
// 返回的也是context中的beanFactory
    return getBeanFactory();
}

@Override
@SuppressWarnings("all")
protected final void refreshBeanFactory() throws IllegalStateException {
    if (!this.refreshed.compareAndSet(false, true)) {
        throw new IllegalStateException(
                "GenericApplicationContext does not support multiple refresh attempts: just call 'refresh' once");
    }
// 还记得这里的beanFactory是在什么时候声明的吗？
    this.beanFactory.setSerializationId(getId());
}
```

在记一遍

```java
// 在createApplicationContext的时候，初始化的类的父类GenericApplicationContext的初始化方法中，新声明了一个beanFactory，就是我们现在即将使用的

public GenericApplicationContext() {
    this.beanFactory = new DefaultListableBeanFactory();
}
```

### 3.4 beanFactory的初始化

```java
//  
@SuppressWarnings("all")
protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    // Tell the internal bean factory to use the context's class loader etc.
    beanFactory.setBeanClassLoader(getClassLoader());
    beanFactory.setBeanExpressionResolver(new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));
    beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, getEnvironment()));

    // Configure the bean factory with context callbacks.
    beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));
    beanFactory.ignoreDependencyInterface(EnvironmentAware.class);
    beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);
    beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);
    beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);
    beanFactory.ignoreDependencyInterface(MessageSourceAware.class);
    beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);

    // BeanFactory interface not registered as resolvable type in a plain factory.
    // MessageSource registered (and found for autowiring) as a bean.
    beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);
    beanFactory.registerResolvableDependency(ResourceLoader.class, this);
    beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);
    beanFactory.registerResolvableDependency(ApplicationContext.class, this);

    // Register early post-processor for detecting inner beans as ApplicationListeners.
    // 这里需要看一下，下一步要用到
    beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));

    // Detect a LoadTimeWeaver and prepare for weaving, if found.
    if (beanFactory.containsBean(LOAD_TIME_WEAVER_BEAN_NAME)) {
        beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));
        // Set a temporary ClassLoader for type matching.
        beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));
    }

    // Register default environment beans.
    if (!beanFactory.containsLocalBean(ENVIRONMENT_BEAN_NAME)) {
        beanFactory.registerSingleton(ENVIRONMENT_BEAN_NAME, getEnvironment());
    }
    if (!beanFactory.containsLocalBean(SYSTEM_PROPERTIES_BEAN_NAME)) {
        beanFactory.registerSingleton(SYSTEM_PROPERTIES_BEAN_NAME, getEnvironment().getSystemProperties());
    }
    if (!beanFactory.containsLocalBean(SYSTEM_ENVIRONMENT_BEAN_NAME)) {
        beanFactory.registerSingleton(SYSTEM_ENVIRONMENT_BEAN_NAME, getEnvironment().getSystemEnvironment());
    }
}
```

## 4.1 运行SpringBoot上下文 *重点*

```java
private void callRunners(ApplicationContext context, ApplicationArguments args) {
    List<Object> runners = new ArrayList<>();
    runners.addAll(context.getBeansOfType(ApplicationRunner.class).values());
    runners.addAll(context.getBeansOfType(CommandLineRunner.class).values());
    AnnotationAwareOrderComparator.sort(runners);
    for (Object runner : new LinkedHashSet<>(runners)) {
        if (runner instanceof ApplicationRunner) {
            callRunner((ApplicationRunner) runner, args);
        }
        if (runner instanceof CommandLineRunner) {
            callRunner((CommandLineRunner) runner, args);
        }
    }
}
```

> TIPS : BeanUtils.instantiateClass()，是一个很不错的Spring专用的工具类

参考

- [Headless配置]<https://www.oracle.com/technical-resources/articles/javase/headless.html>
