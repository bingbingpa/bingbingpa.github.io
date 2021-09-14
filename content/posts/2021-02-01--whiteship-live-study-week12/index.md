---
title : 자바 애노테이션
category: "java"
---

## whiteship/live-study 12주차 정리
- 목표
    - [자바의 애노테이션에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/12)
- 학습할 것 (필수)
    - 애노테이션 정의하는 방법
    - @retention
    - @target
    - @documented
    - 애노테이션 프로세서

<br>

### 1. 애노테이션 정의하는 방법
- 애노태이션
    - Java 5 부터 등장한 기능
    - 본래 주석이라는 뜻으로, 인터페이스를 기반으로 한 문법이며, 주석과는 그 역할이 다르지만 주석처럼 코드에 달아 클래스에 특별한 의미를 부여하거나 기능을 주입할 수 있다.
    - 해석되는 시점을 정할 수도 있다.(Retention policy)
- 정의하는 방법
    - 인터페이스에 @ 를 붙여주면 애노테이션으로 쓸 수 있다.
    ~~~ java
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.TYPE, ElementType.FIELD})
    @Inherited // 상속이 되는 어노테이션이 되도록 설정한다.
    public @interface MyAnnotation {

        // default 값을 안줄 경우 해당 어노테이션을 사용하는 곳에서 값들을 줘야한다.
        // @MyAnnotaion(name ="bibibi", number=10) 과 같은 형태로 선언된 필드에 대한 값을 줘야 한다.
        // 하나의 필드를 선언할 때 value() 라고 주면 어노테이션을 사용하는 곳에서 @MyAnnotation(name="test"), 대신 @MyAnnotation("test") 과 같은 형태로 필드이름을 생략 할 수 있다.자
        // 여러개의 필드를 선언할때는 하나의 필드를 value() 라고 쓰더라도 모두 써줘야한다.
        String value() default "shpark";

        int number() default  100;
    }
    ~~~

<br>

### 2. @retention
- 어느 시점까지 어노테이션의 메모리를 가져갈 지 설정한다.
    - SOURCE: 애노테이션을 사실상 주석처럼 사용한다. 컴파일러가 컴파일할 때 해당 애노테이션의 메모리를 버린다.
    - CLASS: 컴파일러가 컴파일에서는 애노테이션의 메모리를 가져가지만 실질적으로 런타임시에는 사라지게 된다.
      런타임시에 사라진다는 것은 리플렉션으로 선언된 애노테이션 데이터를 가져올 수 없게 된다는 것을 뜻한다.
    - RUNTIME: 애노테이션을 런타임시에까지 사용할 수 있다. JVM 이 자바 바이트코드가 남긴 class 파일에서 런타임 환경을 구성하고 런타임을 종료할 때까지 메모리는 살아 있다.

<br>

### 3. @target
- 애노테이션을 적용할 수 있는 대상(위치) 를 나타낸다. 만약, Target 에 선언된 대상과 다른 대상에 애노테이션을 적용할 경우 컴파일 에러가 발생한다.
    - TYPE:  class, interface, annotation, enum 에만 적용 가능
    - FIELD: 필드, enum 상수에만 적용 가능
    - METHOD: 메소드에만 적용 가능
    - PARAMETER: 파라미터에만 적용가능
    - CONSTRUCTOR: 생성자에만 적용 가능
    - LOCAL_VARIABLE: 지역 변수에만 적용 가능
    - ANNOTATION_TYPE: 애노테이션에만 적용 가능
    - PACKAGE: 패키지에만 적용 가능
    - TYPE_PARAMETER: 자바 8부터 추가 되었으며, 타입 파라미터(T,E 와 같은)에만 적용 가능
    - TYPE_USE: 자바 8부터 추가되었으며, (JLS 의 15가지 타입)[https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.11]과 타입 파라미터에 적용 가능
    - MODULE: 모듈에만 적용 가능

<br>

### 4. @documented
- javadoc 으로 api 문서를 만들 때 어노테이션에 대한 설명도 포함하도록 지정

<br>

### 5. 애노테이션 프로세서
- 컴파일 타임에 애노테이션 정보를 참고하여 코드를 분석하고 생성하는 등의 작업을 할 수 있는 기능으로, 스프링의 의존성 주입을 예로 들 수 있다.


