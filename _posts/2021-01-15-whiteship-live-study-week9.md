---
layout : post 
title : 자바 예외처리 
date : 2021-01-15 
excerpt : "자바의 예외 처리에 대해 학습하기"
tags: [whiteship/live-study, java]
categories: [Java]
comments: true 
changefreq : daily
---

## whiteship/live-study 9주차 정리
- 목표
    - [자바의 예외 처리에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/9)
- 학습할 것 (필수)
    - 자바에서 예외 처리 방법 (try, catch, throw, throws, finally)
    - 자바가 제공하는 예외 계층 구조
    - Exception 과 Error 의 차이는?
    - RuntimeException 과 RE 가 아닌 것의 차이는?
    - 커스텀한 예외 만드는 방법

### 1. 자바가 제공하는 예외 계층 구조
- 모든 예외 클래스는 Throwable 클래스를 상속 받고 있다.
<img src="/static/img/whiteship-live-study-week9/exception.png" alt="exception">

### 2. Exception 과 Error 의 차이는?
- **Error**
    - 애플리케이션 내에서 핸들링 할 수 없고, 예외처리가 불가능하거나 할 수 없는 심각한 문제로, 주로 JVM 에서 발생되는 것이 많다.
    - 자주 보는 에러로는 **OutOfMemoryError**, **StackOverflowError** 등이 있다.
- **Exception**
    - 애플리케이션 내에서 핸들링 할 수 있는 에러들을 이야기 하며 **예외**라고 한다. 
    - **NullPointerException**, **FileNotFountException** 등이 있다.

### 3. RuntimeException 과 RE 가 아닌 것의 차이는?
- **RuntimeException 은 CheckedException 과 UnCheckedException 을 구분하는 기준이다.**
- **Exception 의 서브 클래스 중 RuntimeException 을 제외한 모든 클래스는 CheckedException 이며, RuntimeException 과 그 서브 클래스들은 UnCheckedException 이다.**
- CheckedException
    - 컴파일 시점에 확인되는 예외
    - 아래와 같은 코드는 컴파일이 불가능 하다.(Cannot resolve symbol 'text')
    ~~~ java
      public class Study {
          private text;
      }
    ~~~
- UncheckedException
    - CheckedException 과 반대로 컴파일 시점에 확인할 수 없는 예외
    - **모든 UncheckedException 은 RuntimeException** 을 상속한다.
    ~~~ java
    List<String> list = new ArrayList<>();
    list.get(0)
    ~~~

- |-|CheckedException|UncheckedException|
|:--|:--|:--|
|확인 가능 시점|컴파일 시점|런타임 시점|
|구분|RuntimeException 을 상속하지 않은 예외|RuntimeException 과 이를 상속한 예외|
|예외 처리|명시적인 예외 처리가 강제됨|예외 처리가 강제되지 않음|
|트랜잭션|예외 발생시 롤백되지 않음|예외 발생시 롤백됨|

### 4. 자바에서 예외 처리 방법 (try, catch, finally, throw, throws, try-with-resources, Assertion)
- try 
    - 예외를 처리할 대상이 되는 코드를 입력하기 위해 사용된다.
    - catch 블록 혹은 finally 블럭이 필수로 필요하다. 
- catch
    - try 블렉에서 발생한 예외를 처리하기 위해 사용된다.
    - catch 블럭이 처리할 수 있는 타입은 **Throwable** 의 서브클래스들이다.
    - try 블럭에서 예외가 던져지면(throw) Java 인터프리터는 던져진 예외와 동일한 타입 혹은 예외의 슈퍼 클래스가 파라미터로 있는 catch 절을 찾는다.
    - java 1.7 부터 여러 예외를 공통으로 하나의 catch 블럭에서 처리 할 수 있다.
- finally
    - 일반적으로 try 블럭의 코드를 정리하는데 사용한다.
    - try 블럭의 코드의 완료와 상관없이 try 블럭이 일부만 실행되더라도 finally 블럭의 실행은 보장된다.
    ~~~ java
      try {
          // 예외 발생 가능성이 있는 코드
      } catch(예외 타입 1 매개변수명 | 예외 타입 2 매개변수명) {
          // 예외타입 처리 코드
      } finally {
          // 항상 처리할 필요가 있는 코드
      }
    ~~~
- throw
    - 인위적으로 예외를 발생시킬 때 사용할 수 있는 예약어
    - 개발자가 의도하지 않은 케이스에 대해 임의로 예외를 발생시킬 때 사용되며, 특정 예외를 만났을 때 구체적인 예외로 처리하고자 할때에도 사용된다.
    ~~~ java
      private void printInt(int i) {
          if (i < 5) {
              throw new IllegalArgumentException("i는 5 이상이어야 합니다.");
          }
          System.out.println("i : " + i);
      }
    ~~~
- throws
    - 발생한 예외 객체를 메소드를 호출한 곳으로 넘긴다.
    - 예외가 발생한 지점에서 try-catch-finally 블록을 이용하여 직접 처리하지 않아도 예외가 발생한 메소드를 호출한 지점으로 예외를 전달 할 수 있다.
    ~~~ java
      private void processException() {
          doCheckedException();
      }
      private void doCheckedException() throws Exception {
          // Exception은 Checked Exception
          throw new Exception();
      }
    ~~~
- try-with-resources
    - java 1.7 부터 사용가능한 문법으로 자동으르 메모리 해제를 해준다.
    - **모든 객체의 메모리를 해제해 주는 것은 아니고, AutoCloseable 인터페이스를 구현한 객체만 가능하다.**
    ~~~ java
      try (
          FileInputStream is = new FileInputStream("file.txt");
          BufferedInputStream bis = new BufferedInputStream(is)
      ) {
          int data = -1;
          while ((data = bis.read()) != -1) {
              System.out.print((char) data);
          }
      } catch (IOException e) {
          e.printStackTrace();
      }
    ~~~
- Assertion
    - java 1.4 부터 사용가능 하다. 
    - Assertion 은 주로 코드에서 설계를 검증하는 기능을 제공한다.
    - boolean 타입의 표현식을 만들어 평가할 수 있고, 그 결과가 false 일 경우 검사가 실패하고 **java.lang.AssertionError** 를 발생시킨다.
    - Assertion 문장은 다음과 같은 두가지 형태를 취한다.
    ~~~ java
    assert 불리언식;
    assert 불리언식:수식;
    ~~~
    ~~~ java
    assert i<0;
    assert age > 0 : "나이는 음수가 될 수 없습니다:" + age;
    ~~~
    - 첫번째 assert 문장은 i가 0보다 작지 않을 경우 AssertionError 를 발생시킨다. 
    - 세번째 assert 문장의 경우는 age 가 0보다 크지 않은 경우 AssertionError 를 발생시키며, 그때 AssertionError 의 예외 메시지는 "나이는 음수가 될 수 없습니다:"와 age 변수를 연결한 문자열이 된다.
    
### 5. 커스텀한 예외 만드는 방법

#### 참고
- [https://blog.baesangwoo.dev/posts/java-livestudy-9week/#error--exception](https://blog.baesangwoo.dev/posts/java-livestudy-9week/#error--exception)
- [https://www.notion.so/3565a9689f714638af34125cbb8abbe8](https://www.notion.so/3565a9689f714638af34125cbb8abbe8)
- [https://softm.tistory.com/entry/Java-Assertion](https://softm.tistory.com/entry/Java-Assertion)
- [https://javacan.tistory.com/entry/79](https://javacan.tistory.com/entry/79)

    
