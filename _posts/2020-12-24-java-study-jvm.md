---
layout : post
title : JVM 이해하기
date : 2020-12-24
excerpt : "자바 소스 파일(.java)을 JVM 으로 실행하는 과정 이해하기"
tags: [whiteship/live-study, jvm, java]
categories: [Java]
comments: true
changefreq : daily
---

## whiteship/live-study 1주차 정리
- 목표
    - [자바 소스 파일(.java)을 JVM 으로 실행하는 과정 이해하기](https://github.com/whiteship/live-study/issues/1)
- 학습할 것
    - JVM 이란 무엇인가
    - 컴파일 하는 방법
    - 실행하는 방법
    - 바이트코드란 무엇인가
    - JIT 컴파일러란 무엇이며 어떻게 동작하는지
    - JVM 구성 요소
    - JDK와 JRE의 차이

### 1. JAVA, JVM, JDK , JRE
- <img src="/static/img/java-study-jvm/jdk-structure.png">

#### JVM (Java Virtual Machine)
- 자바 가상 머신으로 자바 바이트 코드(.class 파일)를 **OS에 특화된 코드로 변환**(인터프리터와 JIT 컴파일러)하여 실행한다.
    - 자바 실행 : java "자바파일명"명
    - 자바 컴파일 : javac "자바파일명"
    - 자바 바이트코드 확인 : javap -c "클래스파일"
    - 위의 javac, javap 등은 jre 에는 포함되지 않는다.
- 바이트 코드를 실행하는 표준(JVM 자체는 표준)이자 구현체(특정 밴더가 구현한 JVM)다.
- [JVM 스팩](https://docs.oracle.com/javase/specs/jvms/se11/html/)
- JVM 밴더: 오라클, 아마존, Azul 등이 있다.
- JVM 홀로 제공되지 않는다. 최소한의 배포단위는 JRE 이고, 거기에 포함된 것이 JVM 이다.

#### JRE (Java Runtime Environment): JVM + 라이브러리
- 자바 애플리케이션을 실행할 수 있도록 구성된 배포판.
- JVM 과 핵심 라이브러리 및 자바 런타임 환경에서 사용하는 프로퍼티 세팅이나 리소스 파일을 가지고 있다.
- 개발 관련 도구는 포함하지 않는다. (그건 JDK 에서 제공)
- 자바 개발툴은 제공되지 않는다.(javac 가 없다!)
    - jre 구성요소
        - <img src="/static/img/java-study-jvm/jre.png">
    - jdk 구성요소 
        - <img src="/static/img/java-study-jvm/jdk.png">

#### JDK (Java Development Kit): JRE + 개발 툴
- JRE + 개발에 필요할 툴
- 소스 코드를 작성할 때 사용하는 자바 언어는 플랫폼에 독립적이다.
- 오라클은 자바 11부터는 JDK 만 제공하며 JRE 를 따로 제공하지 않는다.
    - java9 부터 module 시스템이 들어와서 필요에 따라 필요한 것들만 JRE 와 같은 형태로 만들 수 있다.
    - module 을 만들어주는 툴로는 [jLink](https://docs.oracle.com/javase/9/tools/jlink.htm#JSWOR-GUID-CECAC52B-CFEE-46CB-8166-F17A8E9280E9) 가 있다.

#### 자바
- 프로그래밍 언어
- JDK 에 들어있는 자바 컴파일러(javac)를 사용하여 바이트코드(.class 파일)로 컴파일 할 수 있다.
- [자바 유료화?](https://medium.com/@javachampions/java-is-still-free-c02aef8c9e04) 오라클에서 만든 Oracle JDK 11 버전부터 상용으로 사용할 때 유료.
    - openJDK 는 Java SE(Standard Edition) 를 오픈 소스로 구현한 것이기 때문에 Java EE(Enterprise Edition) 에서 지원하던 Servlet 관련 도구가 없다.

#### JVM 언어
- [JVM 기반으로 동작하는 프로그래밍 언어](https://en.wikipedia.org/wiki/List_of_JVM_languages)
- 클로저, 그루비, JRuby, Jython, Kotlin, Scala 등이 있다. 

#### 참고 
- [JIT 컴파일러](https://aboullaite.me/understanding-jit-compiler-just-in-time-compiler/)
- [JDK, JRE 그리고 JVM](https://howtodoinjava.com/java/basics/jdk-jre-jvm/)


### 2. JVM 구조

#### 클래스 로더 시스템
- .class 에서 바이트코드를 읽고 메모리에 저장
- 로딩: 클래스 읽어오는 과정
- 링크: 레퍼런스를 연결하는 과정
- 초기화: static 값들 초기화 및 변수에 할당

#### 메모리
- 메소드 영역에는 클래스 수준의 정보 (클래스 이름, 부모 클래스 이름, 메소드, 변수) 저장. 공유 자원이다.
- 힙 영역에는 객체를 저장. 공유 자원이다.
- 스택 영역에는 쓰레드 마다 런타임 스택을 만들고, 그 안에 메소드 호출을 스택 프레임이라 부르는 블럭으로 쌓는다. 쓰레드 종료하면 런타임 스택도 사라진다.
- PC(Program Counter) 레지스터: 쓰레드 마다 쓰레드 내 현재 실행할 instruction 의 위치를 가리키는 포인터가 생성된다.
- 네이티브 메소드 스택
- [자바 메모리 영역 참고 링크](https://javapapers.com/core-java/java-jvm-run-time-data-areas/#Program_Counter_PC_Register)

#### 실행 엔진
- 인터프리터: 바이트 코드를 한줄 씩 실행.
- JIT 컴파일러: 인터프리터 효율을 높이기 위해, 인터프리터가 반복되는 코드를 발견하면 JIT 컴파일러로 반복되는 코드를 모두 네이티브 코드로 바꿔둔다. 그 다음부터 인터프리터는 네이티브 코드로 컴파일된 코드를 바로 사용한다.
- GC(Garbage Collector): 더이상 참조되지 않는 객체를 모아서 정리한다.

#### JNI(Java Native Interface)
- 자바 애플리케이션에서 C, C++, 어셈블리로 작성된 함수를 사용할 수 있는 방법 제공
- [Native 키워드를 사용한 메소드 호출](https://medium.com/@bschlining/a-simple-java-native-interface-jni-example-in-java-and-scala-68fdafe76f5f)  

#### 네이티브 메소드 라이브러리
- C, C++로 작성 된 라이브러리

#### 참고
- [https://www.geeksforgeeks.org/jvm-works-jvm-architecture/](https://www.geeksforgeeks.org/jvm-works-jvm-architecture/)
- [https://dzone.com/articles/jvm-architecture-explained](https://dzone.com/articles/jvm-architecture-explained)
- [http://blog.jamesdbloom.com/JVMInternals.html](http://blog.jamesdbloom.com/JVMInternals.html)
