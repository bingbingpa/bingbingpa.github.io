---
title : 자바 패키지
category: "java"
---

## whiteship/live-study 7주차 정리
- 목표
    - [자바의 패키지에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/7)
- 학습할 것 (필수)
    - package 키워드
    - import 키워드
    - 클래스패스
    - CLASSPATH 환경변수
    - -classpath 옵션
    - [접근지시자](https://bingbingpa.github.io/java/whiteship-live-study-week5/)

### 1. package 키워드
- **패키지**란 클래스나 인터페이스 등을 모은 단위이다.
- 관련 클래스를 그룹화하고 포함된 클래스의 네임스페이스를 정의하는 역할을 한다.
- 모든 클래스에는 정의된 클래스 이름과 패키지 이름이 있다.
- 이 둘을 합쳐야 완전하게 한 클래스를 표현한다고 할 수 있으며, **FQCN(Fully Qualified Class Name)** 이라고 한다.
    - 예) String 클래스의 패키지는 java.lang 이며, FQCN 은 java.lang.String 이 된다.

### 2. import 키워드
- **import** 키워드는 다른 패키지에 있는 클래스나 인터페이스 등을 참조할 때 사용한다.
- 동일 패키지의 클래스나 **java.lang** 패키지의 클래스는 import 구문 없이 참조 가능한다.
- 만약 한 패키지의 여러 클래스를 임포트 하려면 * 를 사용하면 되지만 추천하지는 않는다. 불필요한 클래스들까지 임포트하기 때문이다.
- 정적 멤버도 임포트가 가능하다.
    - 예) import static java.lang.System.out;

### 3. 클래스패스
- JVM 혹은 JAVA 컴파일러가 사용하는 파라미터인데 클래스나 패키지를 찾을 때 기준이 되는 경로를 말한다.
- java 명령을 통해 클래스 파일을 실행할 때 **클래스 파일을 찾는 기준이 되는 경로를 클래스패스**라고 하며 기본적으로는 java 명령을 실행하는 위치를 말한다.

### 4. CLASSPATH 환경변수
- windows 의 경우에는 고급 시스템설정 - 환경 변수 에서 설정 가능하며, 상단은 사용자가 사용할 환경변수, 아래는 사용자와 상관없이 전역으로 사용할 환경변수를 지정한다.
- 리눅스의 경우에는 환경변수 설정을 읽는 순서는 다음과 같으며, 보통은 사용자의 home 경로의  .bash_profile 에 설정한다.
    - /etc/profile -> /etc/bashrc -> /etc/inputrc -> $HOME/.bash_profile -> $HOME/.bashrc -> $HOME/.inputrc

### 5. -classpath 옵션
- 컴파일러가 컴파일 하기 위해서 필요로 하는 참조할 클래스 파일들을 찾기 위해서 컴파일시 파일 경로를 지정해주는 옵션이다.
- classpath 대신 단축어인 cp 를 사용해도 된다.
- ~~~java
  javac <options> <source files>
  ~~~
  - 예) java -classpath /home/java;/home/test/Hello.java
