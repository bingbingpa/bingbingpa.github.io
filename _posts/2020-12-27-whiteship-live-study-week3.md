---
layout : post
title : 자바에서 제공하는 연산자
date : 2020-12-27
excerpt : "자바가 제공하는 다양한 연산자에 대해 학습하기"
tags: [whiteship/live-study, java]
categories: [Java]
comments: true
changefreq : daily
---

## whiteship/live-study 3주차 정리
- 목표
    - [자바가 제공하는 다양한 연산자를 학습하세요.](https://github.com/whiteship/live-study/issues/3)
- 학습할 것
    - 산술 연산자
    - 비트 연산자
    - 관계 연산자
    - 논리 연산자
    - instanceof
    - assignment(=) operator
    - 화살표(->) 연산자
    - 3항 연산자
    - 연산자 우선 순위
    - (optional) Java 13. switch 연산자
    
### 1. 산술 연산자
- 산술 연산자는 정수, 부동소수점, 문자열 등 boolean 타입을 제외한 모든 Primitive Type 에서 사용이 가능하다.
- 더하기 연산자: **+** 
    - 만약 + 의 피연산자 중 문자열이 있다면 다른 피연산자도 문자열로 변환된다. 
        - ~~~ java
            int num1 = 10;
            String str1 = "hello";
            System.out.println(num1+str1);  // 10hello
          ~~~
- 빼기 연산자: **-**
    - 더하기 연산처럼 문자열 연산은 불가능 하다. 
- 곱하기 연산자: *
- 나누기 연산자: **/**
    - 두 피연산자가 모두 정수라면 결과도 정수이며, 나머지는 내림으로 없어지고, 피연산자 중 부동소수점이 있다면 결과도 부동소수점이다. 
    - ~~~ java
        System.out.println(7 / 3); // 2
        System.out.println(7 / 3.0); // 2.3333333333333335
      ~~~
    - 정수를 0으로 나누면 **ArithmeticException** 이 발생한다. 
    - 부동소수점을 0으로 나누면 **Infinity** 혹은 **NaN** 이 결과로 나온다. 
- 나머지 연산자: **%**
    - 첫번째 피연산자를 두번째 피연산자로 나누고 남은 나머지를 정수로 리턴하며, 리턴된 결과는 첫번째 피연산자의 부호와 동일하다.
    - 일반적으로 정수 피연산자와 사용되지만 부동소수점에도 사용이 가능하고 결과도 부동소수점으로 리턴한다.
    - ~~~ java
        System.out.println(10 % 4); // 2
        System.out.println(-10 % 4); // -2 (첫번째 피연산자의 부호와 결과의 부호가 동일)
        System.out.println(10 % -4); // 2
        System.out.println(10.313f % 4); // 2.3129997
      ~~~
      
### 2. 비트 연산자
- 비트 연산자는 개별 비트를 조작하는 저수준 연산자로, 부동소수점, boolean, 배열, 객체 등을 피연산자로 사용할 수 없다. 
- 비트 보수: **~**
    - 비트 반전 또는 비트 NOT 연산자. 각 비트를 반전시켜 1을 0으로, 0을 1로 변환한다. 
- AND: **&**
    - 두 정수 피연산자를 AND 연산(비트곱). 두 피연산자의 해당 비트가 모두 1일때만 1, 아니면 0을 리턴한다. 
    - ~~~java
        int num1 = 11;
        int num2 = 15;

        int result1 = num1 & num2; // 11
        
        int n = 150;
        byte b1 = (byte) n;

        System.out.println(Integer.toBinaryString(150)); // 10010110
        System.out.println(b1); // -106
        System.out.println(b1 & 0xff); // 150
      ~~~
    - 위에서 16진수 0xff(255), 이진수로는 11111111 라는 숫자를 & 비트 연산을 한다. int 형은 4바이트 데이터이며, 32자리 비트중 맨 뒤에서 8번째 비트가 1이라고 마이너스로 인식되지 않도록 하기 위해서 & 비트 연산을 한다.
- OR: **\|**
    - 두 정수 피연산자를 OR 연산(비트합)
- XOR: **^**
    - 두 정수 피연산자를 XOR 연산. 두 피연산자의 해당 비트가 같으면 0, 다르면 1을 리턴한다.
- 왼쪽 시프트 연산: **<<**
    - 비트를 왼쪽으로 두 번째 피연산자로 제시된 비트 수 만큼 이동시킨다. 
    - 시프트 될 때 기존의 가장 왼쪽 비트는 삭제되고 가장 오른쪽 비트는 0으로 채워진다. 
    - **시프트 연산 숫자만큼 곱셈이 된다.**
    - ~~~java
        int num = 10; // 00001010
        int result = num << 1; // 00010100
        int result2 = num << 2; // 00101000
      
        System.out.println(result); // 20
        System.out.println(result2); // 40
      ~~~
- 오른쪽 시프트 연산: **>>**
    - 우측으로 두번째 피연산자로 제시된 비트 수 만큼 이동 시킨다.
    - 가장 오른쪽 비트는 삭제되고 기존의 값이 양수인 경우 가장 왼쪽 비트는 0으로 채워지고, 음수인 경우는 1이 채워진다.
    - **시프트 연산 숫자만큼 나눗셈이 된다.**
- 부호없는(unsigned) 오른쪽 시프트 연산: **>>>**
    - 기본적으로 오른쪽 시프트 연산과 동일하지만 부호에 관계없이 왼쪽 비트는 무조건 0으로만 채워진다. 그렇기 때문에 음수에 >>> 연산을 한다면 결과는 양수가 된다. 
    
### 3. 관계 연산자
- 양쪽의 값이 어떤 관계를 갖는지 확인하는 연산자로 값에 따라 true / false 를 리턴한다. 

- |연산자|이름|설명|
|:---:|:---:|:---|
|==|같음|양쪽 값이 같으면 참, 다르면 거짓|
|!=|같지 않음|양쪽 값이 다르면 참, 같으면 거짓|
|>|보다 큼|왼족 값이 크면 참, 같거나 작으면 거짓|
|>=|보다 크거나 같음|왼쪽 값이 크거나 같으면 참, 작으면 거짓|
|<|보다 작음|왼쪽 값이 작으면 참, 같거나 크면 거짓|
|<=|보다 작거나 같음|왼쪽 값이 작거나 같으면 참, 크면 거짓|

### 4. 논리 연산자
- 관계 연산자와 동일하게 양쪽의 값을 비교 후, true / false 를 리턴한다.

- |연산자|설명|
|:---:|:---|
|&&ㅤㅤ|두 연산자가 모두 true 인지 여부를 평가하며, 두 피연산자중 하나라도 false 라면 false 를 리턴한다.|
|\\|\\|ㅤㅤ|두 피연산자 중 하나라도 true 라면 true 를 리턴한다.|
|!ㅤㅤ|단항 연산자로써 해당 값의 결과를 반대로 평가한다.|

### 5. instanceof
- 객체또는 배열값이 어떠한 참조 유형에 맞는 값인지를 평가하는 연산자. 
    - ~~~ java
        System.out.println("hello" instanceof String); // true
        Point point = new Point(10,20);
        if (point instanceof Point) {
            System.out.println(point instanceof Point); // true
        }
      ~~~
      
### 6. assignment(=) operator
- 어떠한 변수에 값을 할당할 때 이 연산자를 사용할 수 있으며, 메모리에 값을 저장하거나 할당한다는 의미이다.
- 산술 연산자 또는 비트 연산자/시프트 연산자와 결합하여 값을 할당할 수도 있다.
    - ~~~java
        int i = 10;
        String s = "hello";
      
        int num = 10;
        
        // 산술 연산자 결합
        num += 2; // num = num + 2
        num -= 3; // num = num - 3
        num *= 2; // num = num * 2
        num /= 2; // num = num / 2
        num %= 3; // num = num % 3
        
        // 비트 연산자 결합
        num &= 2; // num = num & 2
        num |= 3; // num = num | 3
        num ^= 4; // num = num ^ 4
        
        // 시프트 연산자 결합
        num <<= 3; // num = num << 3
        num >>= 4; // num = num >> 4
        num >>>= 2; // num = num >>> 2
      ~~~
      
### 7. 화살표(->) 연산자
- Java8 부터 도입된 연산자로 람다 표현식(Lambda Expression) 이라고 하며 메소드 본문에 해당 실행 가능한 자바코드의 익명 컬렉션이다. 
- 메소드 파라미터 목록, 연산자, 코드 블럭 순으로 구성되며, 코드 블럭이 한 문장으로 끝난다면 중괄호를 생략할 수 있다. 
    - ~~~java
        Runnable r = () -> {
            System.out.println("1");
            System.out.println("2");
        };

        r.run();

        // 코드가 한 문장이면 중괄호 생략 가능
        Runnable t = () -> System.out.println("1");
        t.run();
      ~~~
      
### 8. 3항 연산자
- if ~ else 문장을 연산자로 표현할 수 있고 조건에 따라 결과를 반환할 수 있다. 
- 조건 ? true 일때 결과값 : false 일때 결과값 
    - ~~~java
        int i = 10;
        boolean result = i > 5 ? true : false;
        System.out.println(result);
      ~~~
      
### 9. 연산자 우선 순위
- |우선순위|연산자|
|:---:|:---:|
|1|(), []|
|2|!, ~, ++, --|
|3|*, /, %|
|4|+, -|
|5|<<, >>, >>>|
|6|<, <=, >, >=|
|7|==, !=|
|8|&|
|9|^|
|10|\\||
|11|&&|
|12|\\|\\||
|13|? :(삼항연산자)|
|14|=, *=, /=, %=, +=, -=, <<=, >>=, >>>=, &=, ^=, |=

### 10. Java 13. switch 연산자
- **yield** 키워드를 사용하여 switch 표현식을 리턴할 수 있다. 코드블럭이 한문장일 경우 yield 생략 가능.
- **->** 를 사용하여 case 구문 처리가 가능하다.
    - 기존 switch 문
        - ~~~java
            int result;
            String mode = "a";
    
            switch (mode) {
                case "a":
                    result = 1;
                    break;
                case "b":
                    result = 4;
                    break;
                case "c":
                    result = 4;
                    break;
                default:
                    result = -1;
            }
    
            System.out.println(result);
          ~~~ 
    - java 13 switch 문
        - ~~~java
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
