---
title : 코프링 일주일 공부하고 정리하는 글
category: "kotlin"
author: bingbingpa
---

### 필드 주입 방법

  - 다음의 코드에서 필드 주입은 동작하지 않는다. 필드 타입들이 null 이 될 수 없기 때문에 컴파일 타임에서 에러가 발생한다.
    - ~~~kotlin
        @Controller
        class ArticleController {
            @Autowired
            private var articleService : ArticelService

            @Autowired
            private var tagService : TagService
        }
      ~~~
  - 생성자 주입으로 변경. 변수는 val 로 해야 한다. val 는 변경 불가능한(immutable) 참조를 지정하는 변수다.
    - ~~~Kotlin
        @Controller
        class ArticleController(
            private val articleService : ArticelService
            private val tagService : TagService) {
        }
      ~~~
  - 필드 주입이 필요하면 지연 초기화를 사용 한다. lateinit 변경자를 붙이면 프로퍼티를 나중에 초기화 할 수 있다. 이때 이 프로퍼티는 항상 var 여야 한다.
    - ~~~kotlin
        @Controller
        class ArticleController {
            @Autowired
            private lateinit var articleService : ArticelService

            @Autowired
            private lateinit var tagService : TagService
        }
      ~~~

### @RequestParam

- @RequestParam 의 필수 파라미터를 나타낼 때 required 속성을 사용하지 않음
    - ~~~ kotlin
        @RequestMapping("/")
        @Controller
        class SearchController {
            @GetMapping
            fun search(@RequestParam(required = true) keyword : String?) {
                return "/result"
            }
        }
      ~~~
- 위의 keyword 라는 값을 필수 값으로 만들기 위해서는 null 이 불가능한 타입으로 바꿔줘야 한다.
    - ~~~ kotlin
        @RequestMapping("/")
        @Controller
        class SearchController {
            @GetMapping
            fun search(@RequestParam keyword : String) {
                return "/result"
            }
        }
      ~~~

 ### java 의 static 키워드 대체하기

- companion object 를 사용하여 정적 필드와 메소드를 정의
    - ~~~java
        public class Article {
            public static final String DEFAULT_THUMBNAIL = "..";

            public static String thumbnail() {
                ...
            }
        }
      ~~~
    - ~~~kotlin
        class Article {
            companion object {
                val DEFAULT_THUMBNAIL = ".."

                fun thumbnail(): String {
                    ...
                }
            }
        }
      ~~~
- kotlin 코드를 자바에서 참조해야 한다면 다음과 같이 const, @JvmStatic 키워드를 추가해야 한다.
    - ~~~kotlin
        class Article {
            companion object {
                const val DEFAULT_THUMBNAIL = ".."

                @JvmStatic
                fun thumbnail(): String {
                    ...
                }
            }
      ~~~

### 테스트

- 생성자 주입
    - ~~~kotlin
        @TestConstructor(autowireMode = AutowireMode.ALL)
        internal class ForumControllerTests(val mockMvc: MockMvc) {
            ...
        }
      ~~~
- mocMvc 테스트
  - 기존 자바에서 작성할 때
    - ~~~java
        mockMvc.perform(
            get("/forum/topics").accept(MediaType.TEXT_HTML)
        ).andExpect(
            status().isOK
        ).andExpect(
            view().name("forum/topics")
        ).andExpect(
            model().attributeExists("topics")
        )
      ~~~
  - 코틀린에서 작성할 때(*com.ninja-squad:springmockk 를 사용하면 조금 더 간결하게 mock 을 사용할 수 있다.*)
    - ~~~kotlin
        mockMvc.get("/forum/topics") {
            accept = MediaType.TEXT_HTML
        }.andExpect {
            status { isOK() }
            view { name("forum/topics") }
            model { attributeExists("topics") }
        }
      ~~~

###spring data JPA

- findByIdOrNull()(spring data 2.1.4(springBoot 2.1.2)에 추가). kotlin extension function 으로 구현되어 있다.
  - ~~~ kotlin
    val optionalUser: Optional<User> = userRepository.findById(1)
    optionalUser.map { it.username }.orElse("")
    optionalUser.orElse(null)?.username ?: ""
    ~~~
  - 위 코드를 이렇게 간단히 쓸 수 있다.
  - ~~~kotlin
    val user: User? = userRepository.findByIdOrNull(1)
    user?.username ?: ""
    ~~~
- JPA Entity
  - java 코드
    - ~~~java
        @Entity
        public class Person(
            @Id
            @GeneratedValue
            private Long id;

            @Column(nullable = false)
            private String name;

            // optional
            private String phoneNumber;

            // getters, setters
        }
      ~~~
  - kotlin 코드
      - jpa entity 는 기본 생성자가 필요하기 때문에 **kotlin("plugin.jpa")** 가 필요하다.
      - 해당 플러그인은 @Entity, @Embeddable, @MappedSuperClass 을 사용하면 자동으로 기본 생성자를 만들어준다.
    - ~~~kotlin
        @Entity
        class Person(
            @Id
            @GeneratedValue
            var id: Long?,

            @Column(nullable = false)
            var name: String,

            var phoneNumber: String?
        )
      ~~~

### kotlin plugin

- ~~~kotlin
    plugins {
        val kotlinVersion = "1.6.10"
        kotlin("plugin.spring") version kotlinVersion
        kotlin("plugin.jpa") version kotlinVersion
    }
  ~~~
- plugins.spring
  - 해당 플러그인을 사용하면 @Component, @Async, @Transactional, @Cacheable, @SpringBootTest, @Configuration,
    @Controller, @RestController, @Service, @Repository 어노테이션에 *app-open*을 자동으로 추가한다.(kotlin-allopen, plugin.spring 은 동일한 프로젝트다.)
  - 코틀린에서 기본적으로 클래스는 final 이며, 해당 플러그인으로 open 키워드가 추가되게 된다.
  - **Spring Boot 2.x 버전부터는 CGLIB Proxy 방식으로 Bean 을 관리하는데,  CGLIB Proxy 는 Target Class 를 상속받아 생성하기 때문에
    open 으로 상속이 가능한 상태이어야 한다. 그래서 all-open 플러그인이 필요하다.**
- plugins.jpa
  - 위에서 언급한 것처럼 @Entity, @Embeddable, @MappedSuperClass 어노테이션을 사용하면 *no-arg*생성자(기본생성자)가 자동으로 생성된다.
  - **Hibernate 는 Reflection 으로 객체를 생성하기 때문에 protected 이상의 생성자가 필요하다.**
- all-open JPA
  - all-open 은 아래처럼 명시적으로 선언해줘야 한다.
    - ~~~kotlin
        allOpen {
            annotation("javax.persistence.Entity")
            annotation("javax.persistence.MappedSuperclass")
            annotation("javax.persistence.Embeddable")
        }
      ~~~
  - **jpa 에서 all-open 이 필요한 이유**
      - Lazy Loading 을 하기 위해서는 Proxy 객체이어야 하는데, kotlin 은 기본적으로 final 이기 때문에 Proxy 객체를 생성하지 못한다.
      - 그래서 all open 을 명시적으로 선언해줘서 상속이 가능하도록 해야 Proxy 객체가 만들어지고 Lazy Loading 을 사용할 수 있다.

### **똑같이 생겼지만 의미가 다른 코틀린과 자바의 코드**
- |        |    kotlin    |   java    |
      |:------------:|:---------:|:---:|
  | T       | non-nullable | nullable  |
  | class   |    final     | non-final |
  | List<T> |  immutable   |  mutable  |

### 참조 사이트

- [PAYCO 매거진 서버 Kotlin 적용기](https://www.youtube.com/watch?v=wiJqu7xoH58)
- [어디 가서 코프링 매우 알은 체하기! : 9월 우아한테크세미나](https://www.youtube.com/watch?v=ewBri47JWII&list=PLgXGHBqgT2TtGi82mCZWuhMu-nQy301ew)
- [#자프링외길12년차 #코프링2개월생존기](https://www.youtube.com/watch?v=RBQOlv0aRl4)
- [스프링캠프 2019 [Track 1 Session 6] : Kotlin + Spring Data JPA](https://www.youtube.com/watch?v=Ou_-DFaAUhQ)
- [Kotlin 으로 Spring 개발할 때](https://cheese10yun.github.io/spring-kotlin/)
