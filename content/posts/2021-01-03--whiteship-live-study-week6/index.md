---
title : 자바 상속
category: "java"
author: bingbingpa
---

## whiteship/live-study 6주차 정리
- 목표
    - [자바의 상속에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/6)
- 학습할 것 (필수)
    - 자바 상속의 특징
    - super 키워드
    - 메소드 오버라이딩
    - 다이나믹 메소드 디스패치 (Dynamic Method Dispatch)
    - 추상 클래스
    - final 키워드
    - Object 클래스

### 1. 자바 상속의 특징
- 상속이란
    - **부모클래스의 변수와 메소드를 무려받는 것**으로, 상속을 통해 코드의 재사용성을 통해 코드의 간결성을 확보할 수 있다.
    - 상속을 받으면 부모클래스의 변수와 메소드를 가져다 쓸 수 있지만, 접근제어자에 따라 상속하여도 사용할 수 없는 변수 및 메소드들도 있다.
    - 상속은 extends 라는 키워드를 사용해서 이루어진다.
    ~~~ java
      class 자식클래스명 extends 부모클래스명 {
      }
    ~~~
- 상속의 특징
    - 자바에서의 상속은 단일 상속만 가능하다. 아래의 형태와 같은 다중 상속은 불가능 하다.
    ~~~ java
      class 자식클래스명 extends 부모클래스명, 다른부모클래스명 {
      }
    ~~~
    - 자바의 계층 구조 최상위에는 java.lang.Object 클래스가 존재한다. 모든 클래스는 별도로 상속을 받지 않더라고 기본적으로 Object 클래스를 상속 받는다.
    - 부모의 메소드와 변수만 상속되며, 생성자는 상속되지 않는다.

### 2. super 키워드
- 자식클래스가 부모클래스로부터 상속받은 멤버를 사용하고자 할때 사용한다.
~~~ java
  class Parent {
      int a = 10;
  }
  class Child {
      int a = 20;

      void childMethod() {
          System.out.println(this.a); // 20
          System.out.println(super.a); // 10
      }
  }
~~~
- 부모 클래스의 생성자를 호출할 때 사용할 수 있다.

### 3. 메소드 오버라이딩과 오버로드
- 메소드 오버라이딩
    - **부모 클래스로부터 상속받은 메소드를 자식 클래스에서 재정의 하는것.**
    - 자식 클래스에서는 오버라이딩 하고자 하는 **메소드의 이름, 매개변수, 리턴타입이 모두 같아야 한다.**
    ~~~ java
      class Parent {
          public void print() {
              System.out.println("부모 클래스");
          }
      }

      class Child extends Parent {
          @Override
          public void print() {
              System.out.println("자식 클래");
          }
      }
    ~~~
- 메소드 오버로드
    - 한 클래스 내에 이미 사용하려는 이름과 같은 이름을 가진 메소드가 있더라도 **매개변수의 개수 또는 타입이 다르면, 같음 이름을 사용해서 메소드를 정의할 수 있다.**
    - 리턴값만 다른 것은 오버로딩 할 수 없다.
    ~~~ java
      class OverloadingMethods {
          public void print() {
              System.out.println("오버로딩1");
          }

          String print(Integer a) {
              System.out.println("오버로딩2");
              return a.toString();
          }

          void print(String a) {
              System.out.println("오버로딩3");
              System.out.println(a);
          }

          String print(Integer a, Integer b) {
              System.out.println("오버로딩4");
              return a.toString() + b.toString();
          }
      }
    ~~~
- 오버로딩 vs 오버라이딩
    - |구분|overriding|overloading|
    |:---:|:---:|:---:|
    |리턴형|동일해야 한다.|달라도 된다.|
    |메소드형|동일해야 한다.|동일해야 한다.|
    |메소드명|동일해야 한다.|동일해야 한다.|
    |매개변수|동일해야 한다.|달라야만 한다.|
    |적용범위|**상속관계**에서 적용된다.|**같은 클래스**내에서 적용된다.|

### 4. 다이나믹 메소드 디스패치 (Dynamic Method Dispatch)
- 메소드 디스패치란 어떤 메소드를 호출할지 결정하여 실제로 실행시키는 과정이다.
- 자바는 런타임 시 객체를 생성하고, 컴파일 시에는 생성할 객체 타입에 대한 정보만 공유한다.
- 스태틱 메소드 디스패치(Static Method Dispatch)
    - 구현 클래스를 통해 컴파일 시점에 컴파일러가 어떤 메소드를 호출할지 명확하게 알고 있는 경우.
        - 메소드를 오버로딩하면 매개변수 타입과 갯수에 따라 어떤 메소드를 호출할지 알 수 있는 경우.
        - 상위 클래스가 있더라도 하위 클래스(구현 클래스)로 선언을 하고 하위 클래스의 인스턴스를 생성하는 경우.
        ~~~ java
          public class StaticMethodDispatch {

              public static void method1() {
                  System.out.println("스태틱 메소드 디스패치1");
              }

              public void method2() {
                  System.out.println("스태틱 메소드 디스패치2");
              }

              public void method2(String value) {
                  System.out.println(value);
              }
          }
        ~~~
        ~~~ java
          public class StaticMethodDispatchMain {
              public static void main(String[] args) {

                  StaticMethodDispatch.method1();
                  StaticMethodDispatch staticMethodDispatch = new StaticMethodDispatch();
                  staticMethodDispatch.method2();
                  staticMethodDispatch.method2("스태틱 메소드 디스패치3");
              }
          }
        ~~~
- 다이나믹 메소드 디스패치(Dynamic Method Dispatch)
    - 수퍼클래스의 메서드를 오버라이딩 하거나, 인터페이스나 추상 클래스에 정의된 추상 메소드를 호출하는 경우로, 호출되는 메소드가 런타임 시 동적으로 결정되는 것.
        - 인터페이스 또는 추상 클래스로 선언하고 구현/상속 받은 하위 클래스의 인스턴스를 생성하는 것.
        - 컴파일러가 알고 있는 타입에 대한 정보를 토대로 런타임 시 해당 타입의 객체를 생성하고 메소드를 호출하는 것.
        ~~~ java
          public class Parent {

              public void method() {
                  System.out.println("Parent 의 메소드");
              }
          }
        ~~~
        ~~~ java
          public class Child1 extends  Parent{

              @Override
              public void method() {
                  System.out.println("Child1 의 메소드");
              }
          }
        ~~~
        ~~~ java
          public class Child2 extends  Parent{

              @Override
              public void method() {
                  System.out.println("Child2 의 메소드");
              }
          }
        ~~~
        ~~~ java
          public interface DispatchInterface {
              void method();
          }
        ~~~
        ~~~ java
          public class DispatchImpl implements DispatchInterface {

              @Override
              public void method() {
                  System.out.println( "DispatchImpl 의 메소드");
              }
          }
        ~~~
        ~~~ java
          public class DynamicMethodDispatch {

              public static void main(String[] args) {
                  Parent p1 = new Child1();
                  Parent p2 = new Child2();

                  DispatchInterface impl = new DispatchImpl();

                  p1.method();
                  p2.method();
                  impl.method();

              }
          }
        ~~~

### 5. 추상 클래스
- 클래스를 만들기 위한 일종의 설계도로 **인스턴스를 생성할 수 없는 클래스이다.** 이를 사용하기 위해서는 반드시 자식 클래스에서 상속을 받아 클래스를 모두 구현해야 한다.
- 반드시 하나 이상의 추상 세더르를 포함하고 있어야 하고, 생성자와 멤버변수, 일반메서드 모두를 가질 수 있다.
~~~ java
  abstract class 클래스이름 {
  }
~~~

### 6. final 키워드
- final 키워드는 초기화를 한번만 한다는 의미로 총 세가지 의미로 사용된다.
    - final 변수 : 보통 상수를 의미한다. 생성자나 대입연산자를 통해 한번만 초기화 가능한 변수이다.
    - final 메소드 : 오버라이드하거나 숨길 수 없다.
    - final 클래스 : 해당 클래스는 상속할 수 없음을 의미하며, 상속을 할 수 없기 때문에 상속 계층에서 마지막 클래스라는 의미이다.

### 7. Object 클래스
- java.lang.Object 클래스는 **모든 클래스의 최상위 클래스이다.**
    - |메소드|설명|
    |:---|:---|
    |boolean equals(Object obj)|두 객체가 같은 지 비교한다.(같으면 true, 틀리면 false)|
    |String toString()|객체의 문자열을 반환한다.|
    |protected Object clone()|객체를 복사한다.|
    |protected void finalize()|가비지 컬렉션 직전에 객체의 리소르를 정리할 때 호출한다.|
    |Class getClass()|객체의 클래스형을 반환한다.|
    |int hashCode()|객체의 코드값을 반환한다.|
    |void notify()|wait 된 스레드 실행을 재개할 때 호출한다.|
    |void notifyAll()|wait 된 모든 스레드 실행을 재개할 때 호출한다.|
    |void wait()|스레드를 일시적으로 중지할 때 호출한다.|
    |void wait(long timeout)|주어진 시간만큼 스레드를 일시적으로 중지할 때 호출한다.|
    |void wait(long timeout, int nanos)|주어진 시간만큼 스레드를 일시적으로 중지할 때 호출한다.|



### 참조 링크
- [https://blog.naver.com/swoh1227/222181505425](https://blog.naver.com/swoh1227/222181505425)
- [https://blog.naver.com/sejonghumble/222183439699](https://blog.naver.com/sejonghumble/222183439699)
- [https://github.com/mongzza/java-study/blob/main/study/6%EC%A3%BC%EC%B0%A8.md](https://github.com/mongzza/java-study/blob/main/study/6%EC%A3%BC%EC%B0%A8.md)
