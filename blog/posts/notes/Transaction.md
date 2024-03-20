---
lang: en-US
title: Transactional Usage
description: 虚心接受自己的不足，然后找机会与时间去弥补自己的不足，你会慢慢体会到高处不胜寒的感觉。
tags: 
---


Transactional注解是我们日常开发中经常会用到的注解之一。

其中的参数都代表什么意义？通过这个项目我们一起来探索一下吧。

## 源码

首先我们先看一下Transactional注解都支持哪些参数

```java

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
@SuppressWarnings("all")
public @interface Transactional {

    /**
     * Alias for {@link #transactionManager}.
     * @see #transactionManager
     */
    @AliasFor("transactionManager")
    String value() default "";

    /**
     * A <em>qualifier</em> value for the specified transaction.
     * <p>May be used to determine the target transaction manager, matching the
     * qualifier value (or the bean name) of a specific
     * {@link org.springframework.transaction.TransactionManager TransactionManager}
     * bean definition.
     * @since 4.2
     * @see #value
     * @see org.springframework.transaction.PlatformTransactionManager
     * @see org.springframework.transaction.ReactiveTransactionManager
     */
    @AliasFor("value")
    String transactionManager() default "";

    /**
     * The transaction propagation type.
     * <p>Defaults to {@link Propagation#REQUIRED}.
     * @see org.springframework.transaction.interceptor.TransactionAttribute#getPropagationBehavior()
     */
    Propagation propagation() default Propagation.REQUIRED;

    /**
     * The transaction isolation level.
     * <p>Defaults to {@link Isolation#DEFAULT}.
     * <p>Exclusively designed for use with {@link Propagation#REQUIRED} or
     * {@link Propagation#REQUIRES_NEW} since it only applies to newly started
     * transactions. Consider switching the "validateExistingTransactions" flag to
     * "true" on your transaction manager if you'd like isolation level declarations
     * to get rejected when participating in an existing transaction with a different
     * isolation level.
     * @see org.springframework.transaction.interceptor.TransactionAttribute#getIsolationLevel()
     * @see org.springframework.transaction.support.AbstractPlatformTransactionManager#setValidateExistingTransaction
     */
    Isolation isolation() default Isolation.DEFAULT;

    /**
     * The timeout for this transaction (in seconds).
     * <p>Defaults to the default timeout of the underlying transaction system.
     * <p>Exclusively designed for use with {@link Propagation#REQUIRED} or
     * {@link Propagation#REQUIRES_NEW} since it only applies to newly started
     * transactions.
     * @see org.springframework.transaction.interceptor.TransactionAttribute#getTimeout()
     */
    int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;

    /**
     * A boolean flag that can be set to {@code true} if the transaction is
     * effectively read-only, allowing for corresponding optimizations at runtime.
     * <p>Defaults to {@code false}.
     * <p>This just serves as a hint for the actual transaction subsystem;
     * it will <i>not necessarily</i> cause failure of write access attempts.
     * A transaction manager which cannot interpret the read-only hint will
     * <i>not</i> throw an exception when asked for a read-only transaction
     * but rather silently ignore the hint.
     * @see org.springframework.transaction.interceptor.TransactionAttribute#isReadOnly()
     * @see org.springframework.transaction.support.TransactionSynchronizationManager#isCurrentTransactionReadOnly()
     */
    boolean readOnly() default false;

    /**
     * Defines zero (0) or more exception {@link Class classes}, which must be
     * subclasses of {@link Throwable}, indicating which exception types must cause
     * a transaction rollback.
     * <p>By default, a transaction will be rolling back on {@link RuntimeException}
     * and {@link Error} but not on checked exceptions (business exceptions). See
     * {@link org.springframework.transaction.interceptor.DefaultTransactionAttribute#rollbackOn(Throwable)}
     * for a detailed explanation.
     * <p>This is the preferred way to construct a rollback rule (in contrast to
     * {@link #rollbackForClassName}), matching the exception class and its subclasses.
     * <p>Similar to {@link org.springframework.transaction.interceptor.RollbackRuleAttribute#RollbackRuleAttribute(Class clazz)}.
     * @see #rollbackForClassName
     * @see org.springframework.transaction.interceptor.DefaultTransactionAttribute#rollbackOn(Throwable)
     */
    Class<? extends Throwable>[] rollbackFor() default {};

    /**
     * Defines zero (0) or more exception names (for exceptions which must be a
     * subclass of {@link Throwable}), indicating which exception types must cause
     * a transaction rollback.
     * <p>This can be a substring of a fully qualified class name, with no wildcard
     * support at present. For example, a value of {@code "ServletException"} would
     * match {@code javax.servlet.ServletException} and its subclasses.
     * <p><b>NB:</b> Consider carefully how specific the pattern is and whether
     * to include package information (which isn't mandatory). For example,
     * {@code "Exception"} will match nearly anything and will probably hide other
     * rules. {@code "java.lang.Exception"} would be correct if {@code "Exception"}
     * were meant to define a rule for all checked exceptions. With more unusual
     * {@link Exception} names such as {@code "BaseBusinessException"} there is no
     * need to use a FQN.
     * <p>Similar to {@link org.springframework.transaction.interceptor.RollbackRuleAttribute#RollbackRuleAttribute(String exceptionName)}.
     * @see #rollbackFor
     * @see org.springframework.transaction.interceptor.DefaultTransactionAttribute#rollbackOn(Throwable)
     */
    String[] rollbackForClassName() default {};

    /**
     * Defines zero (0) or more exception {@link Class Classes}, which must be
     * subclasses of {@link Throwable}, indicating which exception types must
     * <b>not</b> cause a transaction rollback.
     * <p>This is the preferred way to construct a rollback rule (in contrast
     * to {@link #noRollbackForClassName}), matching the exception class and
     * its subclasses.
     * <p>Similar to {@link org.springframework.transaction.interceptor.NoRollbackRuleAttribute#NoRollbackRuleAttribute(Class clazz)}.
     * @see #noRollbackForClassName
     * @see org.springframework.transaction.interceptor.DefaultTransactionAttribute#rollbackOn(Throwable)
     */
    Class<? extends Throwable>[] noRollbackFor() default {};

    /**
     * Defines zero (0) or more exception names (for exceptions which must be a
     * subclass of {@link Throwable}) indicating which exception types must <b>not</b>
     * cause a transaction rollback.
     * <p>See the description of {@link #rollbackForClassName} for further
     * information on how the specified names are treated.
     * <p>Similar to {@link org.springframework.transaction.interceptor.NoRollbackRuleAttribute#NoRollbackRuleAttribute(String exceptionName)}.
     * @see #noRollbackFor
     * @see org.springframework.transaction.interceptor.DefaultTransactionAttribute#rollbackOn(Throwable)
     */
    String[] noRollbackForClassName() default {};

}
```

## 解读

| 参数                   | 默认值                                | 可选值                     | 含义                                     |
| ---------------------- | ------------------------------------- | -------------------------- | ---------------------------------------- |
| value                  | ""                                    | -                          | 等同于transactionManager                 |
| transactionManager     | ""                                    | -                          | determine the target transaction manager |
| propagation            | Propagation.REQUIRED                  | Propagation.*              | 事务传播方式                             |
| isolation              | Isolation.DEFAULT                     | Isolation.*                | 事务隔离级别                             |
| timeout                | TransactionDefinition.TIMEOUT_DEFAULT | TransactionDefinition.*    | 事务超时时间                             |
| readOnly               | false                                 | true、false                | 事务只读属性                             |
| rollbackFor            | {}                                    | Class<? extends Throwable> | 指定遇到哪些Throwable类进行回滚          |
| rollbackForClassName   | {}                                    | String[]                   | 指定遇到哪些类名进行回滚                 |
| noRollbackFor          | {}                                    | Class<? extends Throwable> | 指定遇到哪些类不进行回滚                 |
| noRollbackForClassName | {}                                    | String[]                   | 指定遇到哪些类名不进行回滚               |

## rollbackFor

### 用法

```markdown
Defines zero (0) or more exception classes, which must be subclasses of Throwable, indicating which exception types must cause a transaction rollback.
By default, a transaction will be rolling back on RuntimeException and Error but not on checked exceptions (business exceptions). See org.springframework.transaction.interceptor.DefaultTransactionAttribute.rollbackOn(Throwable) for a detailed explanation.
This is the preferred way to construct a rollback rule (in contrast to rollbackForClassName), matching the exception class and its subclasses.
Similar to org.springframework.transaction.interceptor.RollbackRuleAttribute.RollbackRuleAttribute(Class clazz).
```

支持定义当service的方法被调用时（代理），抛出哪些Throwable及其子类才会进行回滚。默认情况只会对RuntimeException及其子类进行回滚，对Exception子类但非RuntimeException的子类不进行回滚。如果指定了RuntimeException范围外的类，那么则支持对指定类及其子类进行回滚，如指定`@Transactional(rollbackFor = Exception.class)`就会对所有的`Exception`及其子类进行回滚。

但是当异常被catch吞掉之后，即使抛出异常也不会回顾。

动手动手

```java
package com.marshio.demo.annotation.springframework.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author marshio
 * @desc Transactional注解的使用，
 * 注意：这里我没有使用IService，而是直接使用了Service
 * @create 2023-12-26 16:33
 */
@Service
public class TransactionalService {

    private final TransactionMapper mapper;

    public TransactionalService(TransactionMapper mapper) {
        this.mapper = mapper;
    }

    @Transactional(rollbackFor = Exception.class)
    @SuppressWarnings("all")
    public Object rollback1(Boolean flag) {
        TransactionEntity entity = new TransactionEntity();
        entity.setName("ma");
        entity.setAge(25);
        entity.setEmail("mashuo@shenqingtech.com");
        int insert = mapper.insert(entity);
        if (flag) {
            // true 执行，报错 ArithmeticException，回滚
            // false 不执行，不报错 ，不回滚
            // throw new ClassCastException();
            return insert / 0;
        }
        return insert;
    }

    @Transactional(rollbackFor = ArithmeticException.class)
    @SuppressWarnings("all")
    public Object rollback2(Boolean flag) {
        TransactionEntity entity = new TransactionEntity();
        entity.setName("zwl");
        entity.setAge(28);
        entity.setEmail("zwl@shenqingtech.com");
        int insert = mapper.insert(entity);

        if (flag) {
            // flag==true ,执行, 报错 ArithmeticException/ClassCastException 回滚
            // flag==false ,不执行，不报错，不回滚
            // throw new ClassCastException("回滚！");
            return insert / 0;
        }
        return insert;
    }

    @Transactional(rollbackFor = BusinessException.class)
    @SuppressWarnings("all")
    public Object rollback3(Boolean flag) throws BusinessException {
        TransactionEntity entity = new TransactionEntity();
        entity.setName("zwl");
        entity.setAge(28);
        entity.setEmail("zwl@shenqingtech.com");
        int insert = mapper.insert(entity);

        if (!flag) {
            // flag==true ,不执行
            // flag==false ,执行，报错 ArithmeticException 回滚
            return insert / 0;
        }
        if (flag) {
            // flag==true ,执行，报错BusinessException，回滚
            // flag==false ,不执行
            throw new BusinessException("code", "回滚");
        }
        return insert;
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @SuppressWarnings("all")
    public Object rollback4(Boolean flag) throws BusinessException {
        TransactionEntity entity = new TransactionEntity();
        entity.setName("ma");
        entity.setAge(25);
        entity.setEmail("mashuo@shenqingtech.com");
        int insert = mapper.insert(entity);

        if (!flag) {
            // flag==true ,不执行
            // flag==false ,执行，报错 ArithmeticException 回滚
            return insert / 0;
        }
        if (flag) {
            // flag==true ,执行，报错 BusinessException，不回滚
            // flag==false ,不执行
            throw new BusinessException("code", "不回滚");
        }
        return insert;
    }

}
```

下图有待验证，以及特殊案例有待补充，但是其原理可以参考下面的**原理**章节

| rollbackFor               | Throwable                                                    | rollback |
| ------------------------- | ------------------------------------------------------------ | -------- |
| Throwable.class           | *                                                            | YES      |
| Exception.class           | Exception & ExceptionSubClasses & Error & ErrorSubClasses    | YES      |
| Error.class               | Error & ErrorSubClasses & RuntimeException & RuntimeExceptionSubClasses | YES      |
| Exception.class           | Error & ErrorSubClasses                                      | NO       |
| Error.class               | Exception & ExceptionSubClasses                              | NO       |
| Default(RuntimeException) | RuntimeException & RuntimeExceptionSubClasses                | YES      |
| RuntimeException.class    | RuntimeException & RuntimeExceptionSubClasses                | YES      |
| RuntimeException.class    | Exception                                                    | NO       |
| ArithmeticException.class | RuntimeException & RuntimeExceptionSubClasses                | YES      |
| RuntimeException.class    | ! (RuntimeException & RuntimeExceptionSubClasses)            | NO       |

### 原理

判断这个类要不要回滚的方法实现为`org.springframework.transaction.interceptor.DefaultTransactionAttribute.rollbackOn(Throwable)`

```java
public interface TransactionAttribute extends TransactionDefinition {

 /**
  * Return a qualifier value associated with this transaction attribute.
  * <p>This may be used for choosing a corresponding transaction manager
  * to process this specific transaction.
  * @since 3.0
  */
 @Nullable
 String getQualifier();

 /**
  * Should we roll back on the given exception?
  * @param ex the exception to evaluate
  * @return whether to perform a rollback or not
  */
 boolean rollbackOn(Throwable ex);

}


public class DefaultTransactionAttribute extends DefaultTransactionDefinition implements TransactionAttribute {

    /*
     *省略上下文
     */
    
    @Override
 public boolean rollbackOn(Throwable ex) {
        // ex为运行时异常或Error时回滚
  return (ex instanceof RuntimeException || ex instanceof Error);
 }

}




public class RuleBasedTransactionAttribute extends DefaultTransactionAttribute implements Serializable {

    /*
     *省略上下文
     */
    
    @Override
    @SuppressWarnings("all")
 public boolean rollbackOn(Throwable ex) {
  if (logger.isTraceEnabled()) {
   logger.trace("Applying rules to determine whether transaction should rollback on " + ex);
  }

  RollbackRuleAttribute winner = null;
  int deepest = Integer.MAX_VALUE;

  if (this.rollbackRules != null) {
   for (RollbackRuleAttribute rule : this.rollbackRules) {
                // 判断
    int depth = rule.getDepth(ex);
    if (depth >= 0 && depth < deepest) {
     deepest = depth;
                    // 只有是定义的可抛出异常类及其子类的时候，才会给winnner赋值为rule
     winner = rule;
    }
   }
  }

  if (logger.isTraceEnabled()) {
   logger.trace("Winning rollback rule is: " + winner);
  }

  // User superclass behavior (rollback on unchecked) if no rule matches.
  if (winner == null) {
   logger.trace("No relevant rollback rule found: applying default rules");
   return super.rollbackOn(ex);
  }

        // 判断抛出的异常类是否为NoRollbackRuleAttribute（定义的不回滚类，与rollbackFor功能相反）
  return !(winner instanceof NoRollbackRuleAttribute);
 }

}


public class RollbackRuleAttribute implements Serializable{
    
    public int getDepth(Throwable ex) {
  return getDepth(ex.getClass(), 0);
 }
    
    /**
     * exceptionClass： 方法实际抛出的异常
     * 找抛出的异常类和定义的可抛出异常类的层级关系，如果是子类，那么depth就是正数，如果刚好是定义的可抛出异常类，那么depth就是0，如果不是子类，那么depth就是-1
     */
 private int getDepth(Class<?> exceptionClass, int depth) {
        // this.exceptionName：期望的异常类名，即rollbackFor定义的类名
  if (exceptionClass.getName().contains(this.exceptionName)) {
   // Found it!
   return depth;
  }
  // If we've gone as far as we can go and haven't found it...
  if (exceptionClass == Throwable.class) {
   return -1;
  }
  return getDepth(exceptionClass.getSuperclass(), depth + 1);
 }
}
```

### 个人好奇

为什么在debug的过程中，`rollbackOn`会调用`RuleBasedTransactionAttribute`类的实现，为什么会好奇呢？因为`RuleBasedTransactionAttribute`的父类为`DefaultTransactionAttribute`，但是他的实现除了`RuleBasedTransactionAttribute`之外还有一个`Ejb3TransactionAnnotationParser`，为什么不是调用`Ejb3TransactionAnnotationParser`的实现呢？

`Ejb3TransactionAnnotationParser`： Enterprise java bean 3.0 事务注解解析

我在跟踪断点的过程中发现如下代码（第34行代码）

```java
@SuppressWarnings("all")
public abstract class TransactionAspectSupport implements BeanFactoryAware, InitializingBean {
    @Nullable
 protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass,
   final InvocationCallback invocation) throws Throwable {

  // If the transaction attribute is null, the method is non-transactional.
  TransactionAttributeSource tas = getTransactionAttributeSource();
  final TransactionAttribute txAttr = (tas != null ? tas.getTransactionAttribute(method, targetClass) : null);
  final TransactionManager tm = determineTransactionManager(txAttr);

  if (this.reactiveAdapterRegistry != null && tm instanceof ReactiveTransactionManager) {
   ReactiveTransactionSupport txSupport = this.transactionSupportCache.computeIfAbsent(method, key -> {
    if (KotlinDetector.isKotlinType(method.getDeclaringClass()) && KotlinDelegate.isSuspend(method)) {
     throw new TransactionUsageException(
       "Unsupported annotated transaction on suspending function detected: " + method +
       ". Use TransactionalOperator.transactional extensions instead.");
    }
    ReactiveAdapter adapter = this.reactiveAdapterRegistry.getAdapter(method.getReturnType());
    if (adapter == null) {
     throw new IllegalStateException("Cannot apply reactive transaction to non-reactive return type: " +
       method.getReturnType());
    }
    return new ReactiveTransactionSupport(adapter);
   });
   return txSupport.invokeWithinTransaction(
     method, targetClass, invocation, txAttr, (ReactiveTransactionManager) tm);
  }

  PlatformTransactionManager ptm = asPlatformTransactionManager(tm);
  final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);

  if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager)) {
   // Standard transaction demarcation with getTransaction and commit/rollback calls.
   TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, joinpointIdentification);

   Object retVal;
   try {
    // This is an around advice: Invoke the next interceptor in the chain.
    // This will normally result in a target object being invoked.
    retVal = invocation.proceedWithInvocation();
   }
   catch (Throwable ex) {
    // target invocation exception
    completeTransactionAfterThrowing(txInfo, ex);
    throw ex;
   }
   finally {
    cleanupTransactionInfo(txInfo);
   }

   if (retVal != null && vavrPresent && VavrDelegate.isVavrTry(retVal)) {
    // Set rollback-only in case of Vavr failure matching our rollback rules...
    TransactionStatus status = txInfo.getTransactionStatus();
    if (status != null && txAttr != null) {
     retVal = VavrDelegate.evaluateTryFailure(retVal, txAttr, status);
    }
   }

   commitTransactionAfterReturning(txInfo);
   return retVal;
  }

  else {
   Object result;
   final ThrowableHolder throwableHolder = new ThrowableHolder();

   // It's a CallbackPreferringPlatformTransactionManager: pass a TransactionCallback in.
   try {
    result = ((CallbackPreferringPlatformTransactionManager) ptm).execute(txAttr, status -> {
     TransactionInfo txInfo = prepareTransactionInfo(ptm, txAttr, joinpointIdentification, status);
     try {
      Object retVal = invocation.proceedWithInvocation();
      if (retVal != null && vavrPresent && VavrDelegate.isVavrTry(retVal)) {
       // Set rollback-only in case of Vavr failure matching our rollback rules...
       retVal = VavrDelegate.evaluateTryFailure(retVal, txAttr, status);
      }
      return retVal;
     }
     catch (Throwable ex) {
      if (txAttr.rollbackOn(ex)) {
       // A RuntimeException: will lead to a rollback.
       if (ex instanceof RuntimeException) {
        throw (RuntimeException) ex;
       }
       else {
        throw new ThrowableHolderException(ex);
       }
      }
      else {
       // A normal return value: will lead to a commit.
       throwableHolder.throwable = ex;
       return null;
      }
     }
     finally {
      cleanupTransactionInfo(txInfo);
     }
    });
   }
   catch (ThrowableHolderException ex) {
    throw ex.getCause();
   }
   catch (TransactionSystemException ex2) {
    if (throwableHolder.throwable != null) {
     logger.error("Application exception overridden by commit exception", throwableHolder.throwable);
     ex2.initApplicationException(throwableHolder.throwable);
    }
    throw ex2;
   }
   catch (Throwable ex2) {
    if (throwableHolder.throwable != null) {
     logger.error("Application exception overridden by commit exception", throwableHolder.throwable);
    }
    throw ex2;
   }

   // Check result state: It might indicate a Throwable to rethrow.
   if (throwableHolder.throwable != null) {
    throw throwableHolder.throwable;
   }
   return result;
  }
 }
}
```

继续跟进

```java
public abstract class TransactionAspectSupport implements BeanFactoryAware, InitializingBean {

    protected TransactionInfo createTransactionIfNecessary(@Nullable PlatformTransactionManager tm,
                                                           @Nullable TransactionAttribute txAttr, final String joinpointIdentification) {

        // If no name specified, apply method identification as transaction name.
        if (txAttr != null && txAttr.getName() == null) {
            txAttr = new DelegatingTransactionAttribute(txAttr) {
                @Override
                public String getName() {
                    return joinpointIdentification;
                }
            };
        }

        TransactionStatus status = null;
        if (txAttr != null) {
            if (tm != null) {
                status = tm.getTransaction(txAttr);
            } else {
                if (logger.isDebugEnabled()) {
                    logger.debug("Skipping transactional joinpoint [" + joinpointIdentification +
                            "] because no transaction manager has been configured");
                }
            }
        }
        return prepareTransactionInfo(tm, txAttr, joinpointIdentification, status);
    }
}
```

## propagation

### 用法

```markdown
The transaction propagation type.
Defaults to Propagation.REQUIRED.
```

## 事务嵌套

## 事务传播

## 事务级联
