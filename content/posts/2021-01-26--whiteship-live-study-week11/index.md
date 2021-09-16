---
title : 자바 열거형
category: "whiteship-live-study"
author: bingbingpa
---

## whiteship/live-study 11주차 정리
- 목표
    - [자바의 열거형에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/11)
- 학습할 것 (필수)
    - enum 정의하는 방법
    - enum 이 제공하는 메소드 (values()와 valueOf())
    - java.lang.Enum
    - EnumSet

<br>

### 1. enum 정의하는 방법
- enum: 컴퓨터 프로그래밍에서 Enumerated Type(열거형 타입)을 줄여서 보통 Enum 이라고 쓴다.
  요소, 멤버라 불리는 명명된 값의 집합을 이루는 자료형이다. 열거자 이름들은 일반적으로 해당 언어의 상수 역할을 하는 식별자이다. *- Wikipedia -*
- enum 을 정의하는 방법
    - 가장 단순한 형태
    ~~~ java
      public enum Season {
          WINTER, SPRING, SUMMER, FALL
      }
    ~~~
    - 데이터와 메서드가 있는 형태
    ~~~ java
      public enum Coin {
          PENNY(1), NICKEL(5), DIME(10), QUARTER(25);

          private final int value;

          Coin(int value) {
              this.value = value;
          }

          public int value() {
              return value;
          }
      }
    ~~~
    - 메소드 오버라이드: 추상 메소드를 오버라이드 하여 같은 메소드 시그니처로 다른 결과값을 만들어 낼 수 있다.
    ~~~ java
      public enum Operator {
          PLUS("+") {
              @Override
              public int calculate(int num1, int num2) {
                  return num1 + num2;
              }
          },
          MINUS("-") {
              @Override
              public int calculate(int num1, int num2) {
                  return num1 - num2;
              }
          },
          MULTIPLY("*") {
              @Override
              public int calculate(int num1, int num2) {
                  return num1 * num2;
              }
          },
          DIVIDE("/") {
              @Override
              public int calculate(int num1, int num2) {
                  return num1 / num2;
              }
          };

          private String symbol;

          Operator(String symbol) {
              this.symbol = symbol;
          }

          public abstract int calculate(int num1, int num2);
      }
    ~~~
    ~~~ java
    assertThat(Operator.MINUS.calculate(10, 3)).isEqualTo(7);
    ~~~
    - lambda 식 : java8 이상에서는 람다식을 활용하면 추삼ㅇ 메소드를 오버라이드 하지 않고도 함수를 상태값을 갖는 enum 으로 변경할 수 있다.
    ~~~ java
      public enum OperatorLambda {
          PLUS("+", (num1, num2) -> num1 + num2),
          MINUS("-", (num1, num2) -> num1 - num2),
          MULTIPLY("*", (num1, num2) -> num1 * num2),
          DIVIDE("/", (num1, num2) -> num1 / num2);

          private final String symbol;
          private final BiFunction<Integer, Integer, Integer> expression;

          OperatorLambda(String symbol, BiFunction<Integer, Integer, Integer> expression) {
              this.symbol = symbol;
              this.expression = expression;
          }

          public int calculate(int num1, int num2) {
              return expression.apply(num1, num2);
          }
      }
    ~~~

<br>

### 2. enum 이 제공하는 메소드
- |메소드 타입|메소드 명|설명|
|:--|:--|:--|
|Static Method|valueOf(String arg)|String 값을 enum 에서 가져온다.|
|Static Method|values()|enum 의 요소들을 순서대로 enum 타입의 배열로 리턴|
|Static 이 아닌 Method|name()|호출된 값의 이름을 String 으로 리턴|
|Static 이 아닌 Method|compareTo(E o)|enum 과 지정된 객체의 순서를 비교. 지정된 객체보다 작은 경우 음의 정수, 동일하면 0, 크면 양의 정수 리턴|
|Static 이 아닌 Method|equals(Object other)|지정된 객체가 enum 정수와 같은 경우 true 리턴|

- **ordinal 메서드는 해당 상수가 몇 번째인지를 리턴할 뿐이고, 쓸모가 없다. 이 값에 의존하는 코드를 작성하는 것도 좋은 선택이 아니다. 쓰지 않는 것이 좋다.**
- Most programmers will have no use for this method. It is designed for use by sophisticated enum-based data structures, such as EnumSet and EnumMap.
  (대부분의 프로그래머는 이 메서드를 쓸 일이 없다. 이 메서드는 EnumSet 과 EnumMap 같이 열거 타입 기반의 범용 자료구조에 쓸 목적으로 설계되었다.) *- Java API 문서 -*

<br>

### 3. java.lang.Enum
- java.lang.Enum 클래스는 열거 타입의 베이스 클래스이다.
- **모든 enum 은 암시적으로 java.lang.Enum 클래스를 확장한다. 자바에서 클래스는 하나의 클래스만 상속 할 수 있으므로 enum 은 다른 것을 확장 할 수 없다.**
- 또한 java.lang.Enum 클래스를 확장한 것이기 때문에 valueOf(), name() 등의 메소드들을 사용할 수 있다.

<br>

### 4. EnumSet
- EnumSet 은 enum 타입에 사용하기 위한 특수한 Set 구현이다.
- 고전적인 방법인 bit flag, bit mask 를 굳이 쓰지 말고 EnumSet 을 사용하도록 한다. EnumSet 은 내부적으로 bit flag 를 사용하고 있어 빠르며, 더 안전하게 다룰 수 있게 해준다.
- 다음과 같이 사용한다.
~~~ java
  EnumSet<Planet> planets = EnumSet.of(Planet.NEPTUNE, Planet.EARTH);
  EnumSet<Planet> all = EnumSet.allOf(Planet.class);
  EnumSet<Planet> none = EnumSet.noneOf(Planet.class);
~~~
- 동기화가 필요하다면 Collections.synchronizedSet 을 사용한다.
~~~ java
  Set<MyEnum> s = Collections.synchronizedSet(EnumSet.noneOf(MyEnum.class));
~~~

<br>

#### 참조 링크
- [https://velog.io/@ljinsk3/Enum%EC%9C%BC%EB%A1%9C-%EB%8B%A4%ED%98%95%EC%84%B1%EC%9D%84-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95](https://velog.io/@ljinsk3/Enum%EC%9C%BC%EB%A1%9C-%EB%8B%A4%ED%98%95%EC%84%B1%EC%9D%84-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95)
- [https://johngrib.github.io/wiki/java-enum/](https://johngrib.github.io/wiki/java-enum/)
- [https://parkadd.tistory.com/50](https://parkadd.tistory.com/50)
