---
title : 자바 제어문
category: "whiteship-live-study"
author: bingbingpa
---

## whiteship/live-study 4주차 정리
- 목표
    - [자바가 제공하는 제어문을 학습하세요.](https://github.com/whiteship/live-study/issues/4)
- 학습할 것 (필수)
    - 선택문
    - 반복문

- 과제 (옵션)
    - 과제 0. JUnit 5 학습하세요.
        - intellij, 이클립스, VS Code 에서 JUnit 5로 테스트 코드 작성하는 방법에 익숙해 질 것.
        - 이미 JUnit 알고 계신분들은 다른 것 아무거나!
        - 더 자바, 테스트 강의도 있으니 참고하세요~
    - 과제 1. live-study 대시 보드를 만드는 코드를 작성하세요.
        - 깃헙 이슈 1번부터 18번까지 댓글을 순회하며 댓글을 남긴 사용자를 체크 할 것.
        - 참여율을 계산하세요. 총 18회에 중에 몇 %를 참여했는지 소숫점 두자리가지 보여줄 것.
        - [Github 자바 라이브러리](https://github-api.kohsuke.org/)를 사용하면 편리합니다.
        - 깃헙 API 를 익명으로 호출하는데 제한이 있기 때문에 본인의 깃헙 프로젝트에 이슈를 만들고 테스트를 하시면 더 자주 테스트할 수 있습니다.
    - 과제 2. LinkedList 를 구현하세요.
        - LinkedList 에 대해 공부하세요.
        - 정수를 저장하는 ListNode 클래스를 구현하세요.
        - ListNode add(ListNode head, ListNode nodeToAdd, int position)를 구현하세요.
        - ListNode remove(ListNode head, int positionToRemove)를 구현하세요.
        - boolean contains(ListNode head, ListNode nodeToCheck)를 구현하세요.
    - 과제 3. Stack 을 구현하세요.
        - int 배열을 사용해서 정수를 저장하는 Stack 을 구현하세요.
        - void push(int data)를 구현하세요.
        - int pop()을 구현하세요.
    - 과제 4. 앞서 만든 ListNode 를 사용해서 Stack 을 구현하세요.
        - ListNode head 를 가지고 있는 ListNodeStack 클래스를 구현하세요.
        - void push(int data)를 구현하세요.
        - int pop()을 구현하세요.
    - 과제 5. Queue 를 구현하세요.
        - 배열을 사용해서 한번
        - ListNode 를 사용해서 한번.

### 1. 선택문
- switch 문
    - switch 에 선언된 변수가 case 의 값을 만족시킬 때 해당 부분의 실행문을 실행시킨 뒤 break 를 통해 빠져나간다.
    ~~~java
      switch (변수) {
          case 값1 :
              실행문;
              break;
          case 값2 :
              실행문;
              break;
          default;
      }
    ~~~
    - java 13 부터는 switch 문에서 **->** 와 **yield** 키워드를 사용하여 다음과 같은 형태로 사용할 수 있다.
    ~~~java
      String mode = "a";
      int result = switch (mode) {
          case "a" -> 1;
          case "b", "c" -> {
              System.out.println("this is b or c");
              yield 4;
          }
          default -> -1;
      };
    ~~~
- if ~ else 문
    - if 내 선언된 조건식이 true 일 경우 실행문1을 false 일 경우 실행문2를 실행
    ~~~java
      if (조건식) {
          실행문1;
      } else {
          실행문2;
      }
     ~~~
- else if 문
    -  if 내에 선언된 조건이 일치할 경우, 그 범위 내의 실행문을 실행시키고 모두 일치하지 않을 경우 else 의 내용을 실행한다. 순차적으로 진행되기 때문에 앞 조건을 만족시킬 경우 뒷 조건을 실행하지 않는다.
   ~~~java
      if (조건식) {
            실행문1;
      } else if (조건식) {
            실행문2;
      } else if (조건식) {
            실행문3;
      } else {
            실행문4;
      }
    ~~~

### 2. 반복문
- for 문
    - for 문은 초기화한 변수가 조건식에 만족하는 경우에 해당 실행문을 실행하고, 증감식을 통해 변수의 값을 증감하는 것을 반복한다. 변수가 조건식에 만족하지 않을 경우 for 문이 종료된다.
    ~~~java
      for (변수초기화 ; 조건식 ; 증감식) {
         실행문;
      }
    ~~~
- for ~ each 문
    - 향상된 for 문이라고도 불리며, 자바 5버전부터 추가된 구문이다. 일반적으로 배열이나 Collection 클래스를 반복하는데 사용된다.
    - 인덱스를 생성해 접근하는 단순 for 문 보다 수행속도가 조금 더 빠르고, 코드의 가독성이 더 좋다.
    ~~~java
      for ( 각 요소 값 : 배열이나 컨테이너 값 ) {
          반복 수행할 작업
      }
    ~~~
- while 문
    - 조건식이 true 일 경우 코드를 실행하고 false 일 경우 반복문을 종료한다. 다만 여기서 주의해야 할 점은 조건식이 계속 참일 경우 무한 루프를 돌게 되므로 **while 내에 반드시 조건식을 빠져 나올 수 있는 구문이 있어야 한다.**
    ~~~java
      while (조건식) {
          반복 수행할 작업;
      }
    ~~~
- do ~ while 문
    - while 문과 비슷하지만 do ~ while 문은 조건식에 상관없이 무조건 한번 수행 후에 조건식을 판별한다. 어떠한 반복 작업 수행에서 꼭 한번은 수행되어야 하는 경우가 있다면 do ~ while 을 사용한다.
    ~~~java
      do {
          반복 수행할 작업;
      } while (조건식);
    ~~~
- continue 문
    - 해당 반복부분만 탈출하고 다음 반복을 이어서 수행한다.
    - 아래의 코드를 예로 들면 i 가 3인 경우는 skip 하고 반복문을 계속 수행하게 된다.
    ~~~java
      for (int i=0; i < 5; i++) {
          if (i==3) continue;
      }
    ~~~
- break 문
    - 즉시 해당 반복문을 빠져나간다.
    - 아래의 코드를 예로 들면 i 가 2인 경우까지 반복문이 수행후 종료된다.
    ~~~java
      for (int i=0; i < 5; i++) {
          if (i==3) break;
      }
    ~~~
