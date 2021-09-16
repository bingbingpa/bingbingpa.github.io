---
title : 자바 람다식
category: "whiteship-live-study"
author: bingbingpa
---

## whiteship/live-study 15주차 정리
- 목표
    - [자바의 람다식에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/15)
- 학습할 것 (필수)
    - 람다식 사용법
    - 함수형 인터페이스
    - Variable Capture
    - 메소드, 생성자 레퍼런스

<br>

### 1. 람다식 사용법
- 람다 표현식은 익명 클래스를 단순화하여 그 표현식을 메서드의 인수로 전달하거나 인터페이스의 객체를 생성할 수 있는 기능을 제공한다.
- 람다 표현식을 사용하지 않은 방식의 코드
  ~~~ java
  Thread thread = new Thread(new Runnable() {
      @Override
      public void run() {
          System.out.println("Hello World");
      }
  });
  ~~~
- 람다 표현식으로 전환하기
  ~~~ java
  Thread thread1 = new Thread(() -> System.out.println("Hello Lambda"));
  thread1.start();
  ~~~
- 람다 표현식의 상세 문법

  |유형|예제|설명|
  |:--|:--|:--|
  |파라미터 값 소비|(String name) -> System.out.println(name)|- 파라미터를 전달된 값을 기반으로 데이터를 처리하고 완료한다. <br> - 리턴 타입이 void 유형이다.|
  |불 값 리턴|(String value) -> "somevalue".equals(value)|- 파라미터를 전달된 값을 기반으로 불 값을 리턴한다. <br> - 주로 전달된 값의 유효성을 검증하거나 전달된 값들을 비교하는 작업을 한다.|
  |객체 생성|() -> new SomeClass()|- 파라미터로 전달되는 것 없이 객체를 생성하여 리턴값도 없다.|
  |객체 변형|(String a) -> a.substring(0,10)|- 파라미터로 전달된 값을 변경해서 다른 객체로 리턴한다.|
  |값을 조합|(int min, int max) -> (min + max) / 2| - 파라미터로 전달된 값을 조합해서 새로운 값을 리턴한다.|

<br>

### 2. Variable Capture
- **람다 표현식에서 외부 변수를 참조하기 위해서는 반드시 final 이거나 final 과 유사한 조건이어야 한다.**
- final 키워드를 붙이지 않더라도 값이 할당된 이후에 변경될 가능성이 없다면 컴파일러는 final 변수와 동일하게 취급하며, 람다 표현식에서 활용하더라도 컴파일 오류가 발생하지 않는다.

<br>

### 3. 함수형 인터페이스
- **람다 표현식을 쓸 수 있는 인터페이스는 오직 public 메서드 하나만 가지고 있는 인터페이스여야 한다.**
- 자바8에서는 이러한 인터페이스를 특별히 **함수형 인터페이스**라고 부르고, 함수형 인터페이스에서 제공하는 단 하나의 추상 메서드를 **함수형 메서드**라고 부른다.
- 인터페이스에 오직 하나의 추상 메서드만 있다면 함수형 인터페이스로 인식되지만, 아래와 같이 **애노테이션을 붙이면 좀 더 명확하게 함수형 인터페이스임을 알 수 있고,
또한 실수로 함수형 인터페이스에 메서드를 추가했을 때 컴파일 에러를 일으켜서 문제를 사전에 예방할 수 있다.**
  ~~~ java
  @FunctionalInterface
  public interface Consumer<T> {
      void accept(T t);
  }
  ~~~
- 대표 함수형 인터페이스

  |인터페이스명|메서드명|내용|
  |:--|:--|:--|
  |Consumer<T>|void accept(T t)|- 파라미터를 전달해서 처리한 후 결과를 리턴 받을 필요가 없을 때 사용한다.|
  |Function<T,R>|R apply(T t)|- 전달할 파라미터를 다른 값으로 변환해서 리턴할 때 사용한다. <br> - 주로 값을 변경하거나 매핑할 때 사용한다.|
  |Predicate<T>|boolean test(T t)|- 전달받은 값에 대해 true/false 값을 리턴할 때 사용한다. <br> - 주로 데이터를 필터링하거나, 조건에 맞는지 여부를 확인하는 용도로 사용한다.|
  |Supplier<T>|T get()|- 파라미터 없이 리턴 값만 있는 경우 사용한다.|

<br>

### 4. 메소드, 생성자 레퍼런스
- **함수룰 메서드의 파라미터로 전달하는 것을 메서드 참조라고 부른다.**
- 메서드 참조의 장점은 람다 표현식과는 달리 코드를 여러 곳에서 재사용 할 수 있고 자바의 기본 제공 메서드뿐만 아니라 직접 개발한 메서드도 사용할 수 있으며, 코드의 가독성도 높일 수 있다.
- **람다 표현식도 마찬가지지만, 메서드 참조 역시 코드 자체를 전달하는 것이지 실행 결과를 전달하는 것은 아니다.** 전달된 코드가 함수형 인터페이스 내부에서 실행될 때 비로소 의미 있는 데이터 결과가 나온다.
- 메서드 참조를 정의하는 문법 두가지
    - 클래스명::메서드명
    - 객체 변수명::메서드명
  ~~~ java
  public class MethodReferenceExample {

      public static MethodReferenceExample of() {
          return new MethodReferenceExample();
      }

      // 데이터 처리 로직 정의
      public static void executeMethod(String entity) {
          if (entity != null && !"".equals(entity)) {
              System.out.println("Contents : " + entity);
              System.out.println("Length : " + entity.length());
          }
      }

      // 대문자로 변경하는 코드
      public void toUpperCase(String entity) {
          System.out.println(entity.toUpperCase());
      }

      // 실행하는 예
      public static void main(String[] args) {
          List<String> list = List.of("a", "b", "c");

          // 정적 메서드 참조
          list.forEach(MethodReferenceExample::executeMethod);
          // 한정적 메서드 참조
          list.forEach(MethodReferenceExample.of()::toUpperCase);
          // 비한정적 메서드 참조
          list.stream().map(String::toUpperCase).forEach(System.out::println);
      }
  }
  ~~~
- **정적 메서드 참조**
    - static 으로 정의한 메서드를 참조할 때 사용한다. 가장 이해하기 쉽고 사용하기 편리하다.
- **비한정적 메서드 참조**
    - public 혹은 protected 로 정의한 메서드를 참조할 때 사용하며 static 메서드를 호출하는 것과 유사하다.
    - 스트림에서 필터와 매핑 용도로 많이 사용한다.
    - 스트림에 포함된 항목과 참조하고자 하는 객체가 반드시 일치해야 한다.
    - 람다 표현식 내부에서 생성한 객체의 메서드를 참조할 때 사용한다.
- **한정적 메서드 참조**
    - 이미 외부에서 선언된 객체의 메서드를 호출하거나, 객체를 직접 생성해서 메서드를 참조할 때 사용한다.
- **생성자 참조**
    - 클래스명::new
    - 새로운 객체를 생성해서 리턴해야 하는 경우에 사용하면 유용하다.
    ~~~ java
      public class ConstructorReferenceExample {
          private String name;

          public ConstructorReferenceExample(String name) {
              this.name = name;
          }

          @Override
          public String toString() {
              return "name ======= " + name;
          }

          public static void main(String[] args) {
              List<String> list = List.of("Macbook", "Samsung", "Dell", "LG");

              // 람다 표현식
              list.stream().map((String name) -> new ConstructorReferenceExample(name))
                      .forEach((ConstructorReferenceExample data) -> System.out.println(data));

              // 생성자 참조로 변환
              list.stream().map(ConstructorReferenceExample::new)
                      .forEach((ConstructorReferenceExample data) -> System.out.println(data));

              // 생성자 참조, 메서드 참조로 변환
              list.stream().map(ConstructorReferenceExample::new)
                      .forEach(System.out::println);
          }
      }
    ~~~
<br>

#### 참조
- Practical 모던 자바 *-인사이트-*

#### 작성한 코드 저장소
- [https://github.com/bingbingpa/whiteship-live-study](https://github.com/bingbingpa/whiteship-live-study)
