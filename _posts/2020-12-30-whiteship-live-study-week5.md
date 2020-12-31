---
layout : post
title : 자바 클래스
date : 2020-12-30
excerpt : "자바의 Class 에 대해 학습하기              "
tags: [whiteship/live-study, java]
categories: [Java]
comments: true
changefreq : daily
---

## whiteship/live-study 5주차 정리
- 목표
    - [자바의 Class 에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/5)
- 학습할 것 (필수)
    - 클래스 정의하는 방법
    - 객체 만드는 방법 (new 키워드 이해하기)
    - 메소드 정의하는 방법
    - 생성자 정의하는 방법
    - this 키워드 이해하기
  
- 과제 (옵션)
    - int 값을 가지고 있는 이진 트리를 나타내는 Node 라는 클래스를 정의하세요.
    - int value, Node left, right 를 가지고 있어야 합니다.
    - BinaryTree 라는 클래스를 정의하고 주어진 노드를 기준으로 출력하는 bfs(Node node)와 dfs(Node node) 메소드를 구현하세요.
    - DFS 는 왼쪽, 루트, 오른쪽 순으로 순회하세요.

### 1. 클래스를 정의하는 방법
- 클래스를 프로그래밍적 언어로 표현하자면 어떠한 객체의 변수(variable), 메소드(method)의 집합이라고 표현할 수 있으며, 현실세계에 빗대어 말하자면 **동일한 속성과 행위를 수행하는 객체의 집합**이라고 표현 할 수 있다.
- 클래스 구조
    - 필드(field) : 해당 클래스 객체의 상태 속성을 나타내며, 멤버 변수라고도 불린다. 여기서 초기화하는 것을 필드 초기화 또는 명시적 초기화라고 한다.
        - 인스턴스 변수 : 이름에서 알 수 있듯이 인스턴스가 갖는 변수이며, 인스턴스를 생성할 때 만들어진다. 서로 독립적인 값을 가지며 heap 영역에 할당되고 gc 에 의해 관리된다.
        - 클래스 변수 : 정적을 의미하는 **static** 키워드가 인스턴스 변수 앞에 붙으면 클래스 변수이다. 해당 클래스에서 파생된 모든 인스턴스는 이 변수를 공유한다.
    - 메서드(method) : 메서드는 해당 객체의 어떠한 동작을 나타낸다. 
        - 인스턴스 메서드 : 인스턴스 변수와 연관된 작업을 하는 메소드로 인스턴스를 통해 호출할 수 있으므로 반드시 먼저 인스턴스를 생성해야 한다. 
        - 클래스 메서드(정적 메서드) : 인스턴스를 생성하지 않고 **클래스 이름.메서드이름(매개변수)**와 같이 호출 가능하다.
    - 생성자(constructor) : 객체가 생성된 직후에 클래스의 객체를 초기화하는데 사용되는 코드 블록이다. 메서드와 달리 리턴 타입이 없으며, 클래스엔 최소 한개 이상의 생성자가 존재하며, 생성자가 없으면 매개변수가 없는 생성자가 실행된다.
    - 초기화 블록(initializer) : 초기화 블록 내에서는 조건문, 반복문 등을 사용해 명시적 초기화에선 불가능한 초기화를 수행할 수 있다.
        - 클래스 초기화 블록 : 클래스 변수 초기화에 쓰인다.
        - 인스턴스 초기화 블록 : 인스턴스 변수 초기화에 쓰인다.
            - 클래스 변수 초기화 : 기본값 -> 명시적 초기화 -> 클래스 초기화 블록
            - 인스턴스 변수 초기화 : 기본값 -> 명시적 초기화 -> 인스턴스 초기화 블록 -> 생성자
    - 객체 생성이 각각의 초기화 블록이 실행되는 순서는 아래의 코드를 수행해보면 클래스초기화 블록 -> 인스턴스 초기화 블록 -> 생성자의 순으로 실행되는 것을 확인 할 수 있다.
        - ~~~java
            class Study {               // 클래스
                static String classVar; // 클래스 변수
            
                static {                // 클래스 초기화 블록
                    System.out.println("클래스 초기화 블록");
                    classVar = "Class Variable";
                }
            
                String constructor;
                String instanceVar;     // 인스턴스 변수
            
                {                       // 인스턴스 초기화 블록
                    instanceVar = "Instance Variable";
                    System.out.println("인스턴스 초기화 블록");
                }
            
                Study() {                // 생성자
                    constructor = "Constructor";
                    System.out.println("생성자 블록");
                }
            
                static void classMethod() {   // 클래스 메서드
                    System.out.println(classVar);
                }
            
                void instanceMethod() {       // 인스턴스 메서드
                    System.out.println(instanceVar);
                }
            }
          ~~~
    - 접근 제어자
        - 제어자 : 클래스, 변수, 메서드의 선언부에 함계 사용되어 부가적인 의미를 부여한다.
        - 접근 제어자 : 해당 클래스 또는 멤버를 정해진 범위에서만 접근할 수 있도록 통제하는 역할을 한다. 참고로 default 는 아무것도 붙이지 않았을때를 의미한다.
            - 접근 제어자 : public, protected, default, private
            - 그 외 : static, final, abstract, transient, synchronized, volatile 등등...
        
            - |접근제어자|동일 클래스|동일 패키지|child 클래스|그 외의 영역|
            |:---:|:---:|:---:|:---:|:---:|
            |public|O|O|O|O|
            |protected|O|O|O||
            |(default)|O|O|||
            |private|O||||
        
            - static : 변수, 메서드는 객체가 아닌 클래스에 속한다. 
            - final
                - 클래스 앞에 붙으면 해당 클래스는 상속 불가 
                - 변수 또는 메서드 앞에 붙으면 수정되거나 오버라이딩 불가
            - abstract
                - 클래스 앞에 붙으면 추상 클래스가 되어 객체 생성이 불가하고, 사용하기 위해서는 상속 받아야 한다. 
                - 변수 앞에 지정할 수 없다.
                - 메서드 앞에 붙는 경우는 오직 추상 클래스 네에서의 메서드밖에 없으며, 해당 메서드는 선언부만 존재하고 구현부는 상속한 클래스의 메서드에 의해 구현되어야 한다.
            - transient : 변수 또는 메서드가 포함된 객체를 직렬화할 때 해당 내용은 무시된다. 
            - synchronized : 메서드는 한번에 하나의 쓰레드에 의해서만 접근 가능하다. 
            - volatile : 해당 변수의 조작에 CPU 캐시가 쓰이지 않고 항상 메인 메모리부터 읽힌다.
                - 하드웨어에서 메모리로 정보가 올라가는 데에도 시간이 많이 걸리지만, 메모리에서 CPU 로 정보가 넘어가는데도 시간이 걸린다. 그렇기 때문에 CPU 에서는 캐싱이라는 기법을 사용한다. 
                - 자바의 바이트 코드는 JVM 에 의해서 이러한 최적화 과정을 거치는데, 병렬처리에서는 이러한 캐싱 처리가 가시성 문제가 발생할 수 있기 때문에
                해당 변수는 캐시를 사용하지 말고 메모리에서 가져와 써라는 의미로 volatile 제어자를 사용한다. 
             
### 2. 객체 만드는 방법 (new 키워드 이해하기)
- 객체를 생성 하려면 **new** 키워드를 생성자 중 하나와 함께 사용하면 된다. 
- new 키워드는 새 객체에 메모리를 할당하고 해당 메모리에 대한 참조값을 반환하여 **클래스를 인스턴스화한다.** 일반적으로 객체가 메모리에 할당되면 인스턴스라 부른다. 

### 3. 메소드 정의하는 방법
- ~~~java
    public String getType (String name) {
        구현부
    }
  ~~~
- 접근 제어자 및 기타 제어자(public)
- 변환 타입(String) : 메서드가 모든 작업을 수행한 뒤에 반환할 타입을 명시한다.
- 메서드 이름(getType) : 메서드명은 동사여야 하고 lowerCamelCase 를 따르며 뜻이 명확하게 하도록 하자.
- 매개 변수 리스트(String name) : 메서드에서 사용할 매개변수들을 명시한다.
- 메서드 시그니처 : 컴파일러는 메서드 시그니처를 보고 오버로딩(overloading) 을 구별한다.
- 접근 제어자(public) 부터 매개 변수 리스트(String name) 까지를 선언부라고 한다.
 
### 4. 생성자 정의하는 방법
- 생성자를 명시하지 않으면 컴파일러가 자동으로 기본 생성자를 생성한다. 하지만 기본 생성자가 아닌 다른 형태의 생성자만 명시했다면 기본 생성자는 생성되지 않는다. 
    ~~~ java
        Point() {}  // 기본 생성자
        
        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }
    ~~~
  
### 5. this 키워드 이해하기
- this 는 인스턴스 자신을 가르키는 참조 변수이고 this() 는 생성자를 뜻하며, 상속한 부모 클래스의 값이나 생성자를 사용할 때는 super, super() 를 사용한다. 
- this 의 사용은 총 3가지 형태로 사용된다.
    - 클래스의 속성과 매개변수의 이름이 같을 때
        ~~~ java
            public Class Test{
                   int a;
                   
                   public Test(int a){
                        this.a = a;
                   }
            }
        ~~~
        - 위 코드에서 생성자에서 클래스의 속성인 a 를 매개변수 a 로 초기화 해준다. 만약 a = a 와 같이 쓴다면 인스턴스 변수 a 는 초기화 되지 않는다. 
    - 오버로딩된 다른 생성자를 호출할 때
        - ~~~java
            public class Layer {
            
                int layerId;
                String layerName;
            
                public Layer() {
                    this(0, null);
                }
            
                public Layer(int layerId) {
                    this(layerId, null);
                }
            
                public Layer(String layerName) {
                    this(0, layerName);
                }
          
                public Layer(int layerId, String layerName) {
                    this.layerId = layerId;
                    this.layerName = layerName;
                }
            }
          ~~~
    - 인스턴스 자신의 참조값을 전달하고 싶을 때 
        - ~~~java
            public class Layer {
                    
                int layerId;
                String layerName;
            
                public Layer(int layerId, String layerName) {
                    this.layerId = layerId;
                    this.layerName = layerName;
                }
          
                public Layer getLayerInstance() {
                    return this;
                }
            }
          ~~~
        - 위와 같이 인스턴스를 리턴하는 함수와 직접 생성한 인스턴스를 비교해보면 같은 결과가 나온다.
            - ~~~java
                Layer layer3 = new Layer(10, "테스트");
                Layer layer4 = layer3.getLayerInstance();
        
                assertThat(layer3).isEqualTo(layer4);
              ~~~ 
              
### 6. 클래스, 객체, 인스턴스
- 클래스(Class)
    - 객체를 만들어 내기 위한 설계도 혹은 틀. 연관되어 있는 변수와 메서드의 집합
- 객체(Object)
    - 소프트웨어 세계에 **구현할 대상**. 클래스에 선언된 모양 그대로 생성된 실체로, 객체는 모든 인스턴스를 대표하는 포괄적인 의미를 갖는다.    
- 인스턴스(Instance)
    - 설계도를 바탕으로 소프트웨어 세계에 **구현된 구체적인 실체**. 객체를 소프트웨어에 실체화 하면 그것을 **인스턴스**라고 부르며, 실체화된 인스턴스는 메모리에 할당된다.
    - 객체가 메모리에 할당되어 실제 사용될 때 인스턴스라고 부른다. 
- 클래스 vs 객체 
    - 클래스는 '설계도', 객체는 '설계도로 구현한 모든 대상' 을 의미한다.
- 객체 vs 인스턴스
    - 클래스의 타입으로 선언되었을때 객체라고 부르고, 그 객체가 메모리에 할당되어 실제 사용될 때 인스턴스라고 부른다. 
    - 객체는 현실 세계에 가깝고, 인스턴스는 소프트웨어 세계에 가깝다. 
    - 객체는 '실체', 인스턴스는 '관계' 에 초점을 맞춘다.

### 사용한 테스트 코드 저장소
- [https://github.com/bingbingpa/whiteship-live-study](https://github.com/bingbingpa/whiteship-live-study)
