---
layout : post
title : 자바 인터페이스
date : 2021-01-09
excerpt : "자바 인터페이스 학습하기"
tags: [whiteship/live-study, java]
categories: [Java]
comments: true
changefreq : daily
---

## whiteship/live-study 8주차 정리
- 목표
    - [자바의 인터페이스에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/8)
- 학습할 것 (필수)
    - 인터페이스 정의하는 방법 
    - 인터페이스 구현하는 방법
    - 인터페이스 레퍼런스를 통해 구현체를 사용하는 방법
    - 인터페이스 상속
    - 인터페이스의 기본 메소드 (Default Method), 자바 8
    - 인터페이스의 static 메소드, 자바 8
    - 인터페이스의 private 메소드, 자바 9
    
### 1. 인터페이스 정의하는 방법 
- 인터페이스의 모든 메소드는 추상적이다.
- 인터페이스는 공용 API 를 정의하기 때문에 암시적으로 **public** 이므로 public 키워드는 생략하는 것이 일반적이다. 
- 인스턴스 필드를 정의할 수 없다.(필드는 구현의 세부사항이고 인터페이스는 구현이 아니라 사양이다.)
- 인터페이스는 인스턴스화 할수 없으므로 생성자가 필요 없다.
- 인터페이스는 중첩될 수 있다.
- **java 8**부터 인터페이스에 **static** 메소드를 정의할 수 있다.
- **java 8**부터 인터페이스에 **default** 메소드를 정의할 수 있다.
- **java 9**부터 인터페이스에 **private** 메소드를 정의할 수 있다. 
- ~~~java
    public interface Animal {
        String getName();
        int getLegs();
    }
  ~~~

### 2. 인터페이스 구현하는 방법
- 상속에 **extends** 키워드를 사용했다면, 인터페이스는 **implements** 키워드를 사용한다. 
- 상속은 부모의 기능들을 재사용하는 개념이라면, 인터페이스는 공통의 기능들을 정의하고 이를 구현하는 클래스에서 해당 기능들을 필수적으로 **Override** 하여 구현해야 한다.
- ~~~java
    public class Cat implements Animal {

        @Override
        public String getName() {
            return "고양이";
        }
    
        @Override
        public int getLegs() {
            return 4;
        }
    }
  ~~~

### 3. 인터페이스 레퍼런스를 통해 구현체를 사용하는 방법
- 인터페이스는 구현체를 통해서 인스턴스 생성이 가능하다.
- 구현체를 통해 인스턴스를 생성할때 인터페이스 타입으로도 생성이 가능하다.
- ~~~java
    Cat cat = new Cat();
    Animal cat = new Cat();
  ~~~
      
### 4. 인터페이스 상속
- 인터페이스는 다른 인터페이스를 상속(확장) 할 수 있으며, 클래스가 다른 클래스를 상속하는 것과 동일하게 **extends** 키워드를 사용하여 인터페이스를 상속할 수 있다. 
- **인터페이스는 클래스와 다르게 여러 인터페이스를 상속 할 수 있다.**
- 부모 인터페이스의 모든 메소드와 상수를 상속하고 새 메소드와 상수를 정의 할 수 있다.
- ~~~java
    public interface PrintableAnimal extends Animal {
        void print();
    }
    
    // 구현 클래스
    public class Puppy implements PrintableAnimal {
    
        // Animal 인터페이스 메소드 구현
        @Override
        public String getName() {
            return "강아지";
        }
    
        // Animal 인터페이스 메소드 구현
        @Override
        public int getLegs() {
            return 4;
        }
    
        // PrintableAnimal 인터페이스 메소드 구현
        @Override
        public void print() {
            System.out.println("이름 : " + getName());
            System.out.println("다리개수 : " + getLegs());
        }
    
    }
  ~~~
  
### 5. 인터페이스의 기본 메소드 (Default Method), 자바8
- **default method 는 java8 부터 사용 가능하다.**
- 인터페이스가 **default** 키워드로 선언되면 메소드를 구현할 수 있고, 이를 구현하는 클래스는 default 메소드를 오버라이딩 할 수 있다. 
- ~~~ java
    public interface PrintableAnimal extends Animal {

    default void print() {
        System.out.println("이름 : " + getName());
        System.out.println("다리개수 : " + getLegs());
    }
  ~~~

### 6. 인터페이스의 static 메소드, 자바 8
- **static method 는 java8 부터 사용 가능하다.**
- static 메소드 이므로 상속이 불가능하다. 
- ~~~ java
    public interface PrintableAnimal extends Animal {

        static String getDescription() {
            return "출력기능이 있는 동물 인터페이스";
        }
    } 
  
    // 사용 
    System.out.println(PrintableAnimal.getDescription());
  ~~~

### 7. 인터페이스의 private 메소드, 자바 9
- **private method 는 java9 부터 사용 가능하다.**
- private 메소드 이기 때문에 인터페이스에서 구현이 되어 있어야 한다.
- 구현체에서 구현할 수 없고, 자식 인터페이스에서도 상속이 불가능하다. 
- static 메소드도 private 로 쓸 수 있다.
