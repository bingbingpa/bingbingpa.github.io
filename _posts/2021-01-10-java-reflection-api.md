---
layout : post
title : 자바 reflection API
date : 2021-01-10
excerpt : "자바 reflection API 를 이용해 custom DI 애노테이션 만들기"
tags: [java, reflection]
categories: [Java]
comments: true
changefreq : daily
---

### 1. Java Reflection 정의
- 리플렉션이란 객체를 통해 클래스의 정보를 분석해 내는 프로그램 기법을 말한다. 
- 스프링의 다음과 같은 코드가 reflection 을 이용한 예라고 볼 수 있다. 
    - @Service, @Autowired 등과 같은 애노테이션을 사용해서, 직접 인스턴스를 생성해주지 않아도 쓸 수 있게 된다.
    - ~~~java
      @Service
      public class BookService {
          @Autowired
          BookRepository bookRepository;
      }
      ~~~

### 2. 클래스 정보 조회 
- Class<T> 에 접근하는 방법 
    - 클래스.class 로 가져온다.
    ~~~java
      Class<Book> bookClass = Book.class;
    ~~~
    - 인스턴스를 생성한 경우에는 getClass() 로 가져온다.
    ~~~java
      Book book = new Book();
      Class<? extends Book> aClass = book.getClass();
    ~~~
    - FQCN((fully Qualified Class Name), 클래스가 속한 패키지명을 모두 포함한 클래스) 문자열로 클래스를 가져온다.
    ~~~java
      Class<?> aClass1 = Class.forName("me.bingbingpa.Book");
    ~~~
- Class<T> 를 통해 할 수 있는 것
    - 필드 목록, 메소드 목록, 상위 클래스, 인터페이스, 애노테이션, 생성자 등등... 많은 것들을 조회 할 수 있다.
    - 다음과 같이 Book 클래스와 인스턴스가 있다고 했을 때, 아래의 코드와 같은 것들을 할 수 있다. 
    ~~~java
      Class<Book> bookClass = Book.class;
      Book book = new Book();
    ~~~
    - 클래스의 public 한 필드만 조회하기
    ~~~java
      Arrays.stream(bookClass.getFields()).forEach(System.out::println);
    ~~~
    - 접근제어자 상관없이 모두 조회하기(특정 이름을 파라미터로 줄 수도 있다.)
        - **private 한 값들까지 모드 접근하기 위해서는 setAccessible 값을 true 로 주어야 한다.** 
        ~~~java
          Arrays.stream(bookClass.getDeclaredFields()).forEach(f -> {
              try {
                  f.setAccessible(true); 
                  System.out.printf("%s %s\n", f, f.get(book));
              } catch (IllegalAccessException e) {
                  e.printStackTrace();
              }
          });
        ~~~
    - modifiers : 접근제어자의 타입을 체크 할 수 있다.
    ~~~java
      Arrays.stream(Book.class.getDeclaredFields()).forEach(f -> {
          int modifiers = f.getModifiers();
          System.out.println(f);
          System.out.println(Modifier.isPrivate(modifiers));
          System.out.println(Modifier.isStatic(modifiers));
      });
    ~~~
    - 메소드 조회하기
    ~~~java
      Arrays.stream(bookClass.getMethods()).forEach(System.out::println);
    ~~~
    - 생성자 조회하기
    ~~~java
      Arrays.stream(bookClass.getDeclaredConstructors()).forEach(System.out::println);
    ~~~
    - 슈퍼 클래스 조회하기(상속받는 클래스는 하나다.)
    ~~~java
      Class<? super MyBook> superClass = MyBook.class.getSuperclass();
    ~~~
    - 인터페이스 조회하기
    ~~~java
      Arrays.stream(MyBook.class.getInterfaces()).forEach(System.out::println);
    ~~~
    
### 3. 애노테이션과 리플렉션
- 중요 애노테이션
    - @Retention: 해당 애노테이션을 언제까지 유지할 것인가? 소스, 클래스, 런타임 
    - @Inherit: 해당 애노테이션을 하위 클래스까지 전달할 것인가?
    - @Target: 어디에 사용할 수 있는가를 정의한다. 메소드, 필드, 패키지 등등 다양한 곳에 적용 할 수 있다.
        - ElementType.ANNOTATION_TYPE
        - ElementType.CONSTRUCTOR
        - ElementType.FIELD
        - ElementType.LOCAL_VARIABLE
        - ElementType.METHOD
        - ElementType.PACKAGE
        - ElementType.PARAMETER
        - ElementType.TYPE

- 리플렉션
    - getAnnotations(): 상속받은 (@Inherit) 애노테이션까지 조회
    - getDeclaredAnnotations(): 자기 자신에만 붙어있는 애노테이션 조회

### 4. 클래스 정보 수정 또는 실행 
- 클래스의 정보를 수정 또는 실행하기 위해서는 먼저 다음과 같이 클래스 인스턴스를 만들어야 한다. 
    - Class.newtInstance() 는 deprecated 됐으며, 이제부터는 생성자를 통해서 만들어야 한다.
    - 아래 코드에서는 String class 를 받는 생성자로 인스턴스를 생성하기 때문에 String class 를 파라미터로 줘야한다.
    - ~~~ java
      public class Book {
          private String B = "B"; 
      
          public Book() { }
        
          public Book(String b) {
              B = b;
          }
      }
      ~~~
    - ~~~java
      Class<?> bookClass = Class.forName("me.bingbingpa.Book");
      Constructor<?> constructor = bookClass.getConstructor(String.class);
      Book book = (Book) constructor.newInstance("mybook");
      System.out.println(book);
      ~~~
- 리플렉션을 이용해서 특정 필드, 메소드 값 조회 변경
~~~java
  Class<?> bookClass = Class.forName("me.bingbingpa.Book");
  Constructor<?> constructor = bookClass.getConstructor(String.class);
  Book book = (Book) constructor.newInstance("mybook");
~~~
    - static 한 값 조회 및 변경 
        - set method 에서 첫번째 인자는 특정 인스턴스인데 여기서는 static 변수이기 때문에 인스턴스를 넘겨주지 않아도 된다.
        ~~~java
          Field a = Book.class.getDeclaredField("A");
          System.out.println(a.get(null));
          a.set(null, "AAA");
          System.out.println(a.get(null));
        ~~~
    - 인스턴스의 필드 조회 및 변경
    ~~~ java
      Field b = Book.class.getDeclaredField("B");
      b.setAccessible(true); //private 값을 가져올때 true 로 설정해줘야 한다.
      System.out.println(b.get(book)); //인스턴스명을 파라미터로 줘야 한다.
      b.set(book, "BBBB");
      System.out.println(b.get(book));
    ~~~
    - private method 실행하기
    ~~~ java
      Method c = Book.class.getDeclaredMethod("c");
      c.setAccessible(true);
      c.invoke(book); // 메소드 실행
    ~~~
    - public method(parameter: int, int)
    ~~~java
      Method sum = Book.class.getDeclaredMethod("sum", int.class, int.class);
      int invoke = (int)sum.invoke(book, 1, 2);// 메소드 실행
      System.out.println(invoke);
    ~~~

### 5. reflection API 를 이용해서 DI 프레임워크 만들기 
- inject 애노테이션 만들기
~~~ java
  @Retention(RetentionPolicy.RUNTIME)
  public @interface Inject {
  }
~~~
- repository class 만들기
~~~ java
  public class BookRepository {
  }
~~~
- service class 만들기
~~~java
  public class BookService {

      @Inject
      BookRepository bookRepository;
  }
~~~
- 자동 주입 해줄 ContainerService 만들기 
~~~java
  public class ContainerService {

      public static <T> T getObject(Class<T> classType) {
          T instance = createInstance(classType);
          Arrays.stream(classType.getDeclaredFields()).forEach(f-> {
              // @Inject 이 붙은 필드일 경우 인스턴스를 생성해준다.
              if (f.getAnnotation(Inject.class) != null) {
                  Object fieldInstance = createInstance(f.getType());
                  f.setAccessible(true);
                  try {
                      f.set(instance, fieldInstance);
                  } catch (IllegalAccessException e) {
                      throw new RuntimeException(e);
                  }
              }
          });
          return instance;
      }
      
      private static <T> T createInstance(Class<T> classType) {
          try {
              return classType.getConstructor(null).newInstance();
          } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
              throw new RuntimeException(e);
          }
      }
  }
~~~
- 테스트
    - junit 을 통해 테스트 해보면 BookService 에 인터페이스로 선언된 bookRepository 가 null 이 아닌 것을 확인 할 수 있다.
    ~~~java
      BookService bookService = ContainerService.getObject(BookService.class);
      assertNotNull(bookService);
      assertNotNull(bookService.bookRepository);
    ~~~
