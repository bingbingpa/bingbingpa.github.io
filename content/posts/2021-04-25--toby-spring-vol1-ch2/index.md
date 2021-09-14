---
title : 토비의 스프링 3.1(vol1) - 2장 테스트
category: "spring"
---

- 토비의 스프링 2장을 보고 최신 스프링버전에서 테스트 해보고 정리한 내용.
- 애플리케이션이 계속 변하고 복잡해져 가는데 그에 대응하는 **첫번째 전략**이 확장과 변화를 고려한 객체지향적 설계와 그것을 효과적으로 담아낼 수 있는 **IoC/DI** 같은 기술 이라면,
  **두 번째 전략**은 만들어진 코드를 확신할 수 있게 해주고, 변화에 유연하게 대처할 수 있는 자신감을 주는 **테스트 기술**이다.
- [예제 소스](https://github.com/bingbingpa/dev-book/blob/master/toby-spring)

### 2.1 작은 단위의 테스트
- **작은 단위의 코드에 대해 테스트를 수행한 것을 단위 테스트(unit test)라고 한다.**
- 테스트하고자 하는 대상이 명확하다면 그 대상에만 집훙해서 테스트하는 것이 바람직하다.
- 데스트는 가능하면 작은 단위로 쪼개서 집중해서 할 수 있어야 한다.
- **테스트의 관심이 다르다면 테스트할 대상을 분리하고 집중해서 접근해야 한다.**
- 단위를 넘어서는 다른 코드들은 신경 쓰지 않고, 참여하지도 않고 테스트가 작동할 수 있으면 좋다.
- 단위 테스트를 하는 이유는 개발자가 설계하고 만든 코드가 원래 의도한 대로 동작하는지를 개발자 스스로 빨리 확인받기 위해서다. 이때 **확인의 대상과 조건이 간단하고 명확할수록 좋다.**

<br>

### 2.2 JUnit 테스트
- assertThat() 메소드는 첫 번째 파라미터의 값을 뒤에 나오는 매처(matcher)라고 불리는 조건으로 비교해서 일치하면 다음으로 넘어가고, 아니면 테스트가 실패하도록 만들어준다.
- **테스트를 작성할 때 부정적인 케이스를 먼저 만드는 습관을 들이는게 좋다.**
- JUnit 이 하나의 테스트 클래스를 가져와 테스트를 수행하는 방식
    - 1) 테스트 클래스에서 @Test 가 붙은 테스트 메소드를 모두 찾는다.(JUnit4 에서는 테스트 메소드에 public 을 붙여야 했지만 JUnit5 에서는 붙이지 않아도 된다.)
    - 2) **테스트 클래스의 오브젝트를 하나 만든다.**
    - 3) @BeforeEach 가 붙은 메소드가 있으면 실행한다.
    - 4) @Test 가 붙은 메소드를 하나 호출하고 테스트 결과를 저장해둔다.
    - 5) @AfterEach 가 붙은 메소드가 있으면 실행한다.
    - 6) 나머지 테스트 메소드에 대해 2~5번을 반복한다.
    - 7) 모든 테스트의 결과를 종합해서 돌려준다.
- 각 테스트 테스트 메소드를 실행할 때마다 테스트 클래스의 오브젝트를 새로 만든다. 한번 만들어진 테스트 클래스의 오브젝트는 하나의 테스트 메소드를 사용하고 나면 버려진다.
    - 각 테스트가 서로 영향을 주지 않고 독립적으로 실행됨을 확실히 보장해주기 위해 매번 새로운 오브젝트를 만든다.
    - 인스턴스 변수를 사용하더라도 다음 테스트 메소드가 실행될 때는 새로운 오브젝트가 만들어져서 다 초기화 된다.
- 1장에서 main 에서 실행한 테스트를 JUnit 테스트 적용하기
    - JUnit4 에서는 예외상황을 위한 테스트를 할 때 **@Test(expected=EmptyResultDataAccessException.class)** 와 같이 테스트 애노테이션에 테스트 중에 발생할 것으로 기대하는
    예외 클래스를 지정했지만 JUnit5 에서는 해당 기능이 없어진 것 같다. 대신 Assertions.assertThrows 를 이용하도록 했다.
    ~~~ java
      @Test
      void andAndGet() throws SQLException, ClassNotFoundException {
          ApplicationContext context = new AnnotationConfigApplicationContext(UserDaoFactory.class);
          UserDao dao = context.getBean("userDao", UserDao.class);

          User user1 = new User("user1", "name1", "test1");
          User user2 = new User("user2", "name2", "test2");

          dao.deleteAll();
          assertThat(dao.getCount(), is(0));


          dao.add(user1);
          dao.add(user2);
          assertThat(dao.getCount(), is(2));

          User userget1 = dao.get(user1.getId());
          assertThat(userget1.getName(), is(user1.getName()));
          assertThat(userget1.getPassword(), is(user1.getPassword()));

          User userget2 = dao.get(user2.getId());
          assertThat(userget2.getName(), is(user2.getName()));
          assertThat(userget2.getPassword(), is(user2.getPassword()));
      }

      @Test
      public void getUserFailure() throws SQLException {
          ApplicationContext context = new AnnotationConfigApplicationContext(UserDaoFactory.class);
          UserDao dao = context.getBean("userDao", UserDao.class);

          dao.deleteAll();
          assertThat(dao.getCount(), is(0));
          Assertions.assertThrows(EmptyResultDataAccessException.class, () -> {
              dao.get("unknown_id");
          });
      }
    ~~~
- JUnit4 와 JUnit5 의 차이점

  |JUnit 4|JUnit 5|
    |:---|:---|
  |@Category(Class)|@Tag(String)|
  |@RunWith, @Rule, @ClassRule|@ExtendWith, @RegisterExtension|
  |@Ignore|@Disabled|
  |@Before, @After, @BeforeClass, @AfterClass|@BeforeEach, @AfterEach, @BeforeAll, @AfterAll|
- **문제점**
    - @BeforeEach 메소드가 테스트 메소드 개수만큼 반복되기 때문에 애플리케이션 컨텍스트도 세 번 만들어지는데, 빈이 많아지고 복잡해지면 애플리케이션 컨텍스트 생성에 적지 않은 시간이 걸릴 수 있다.
    - 애플리케이션 컨텍스트가 초기화될 때 어떤 빈은 독자적으로 많은 리소스를 할당하거나 독립적인 스레드를 띄위기도 한다. 이런 경우에는 테스트를 마칠 때마다 애플리케이션 컨텍스트 내의 빈이 할당한
    리소스 등을 깔끔하게 정리해주지 않으면 다음 테스트에서 새로운 애플리케이션 컨텍스트가 만들어지면서 문제를 일으킬 수 있다.

<br>

### 2.3 스프링 테스트 적용
- @ExtendWith(SpringExtension.class)
    - Junit 프레임워크의 테스트 실행 방법을 확장할 때 사용하는 애노테이션이다.
    - SpringExtension 은 스프링 5에 추가된 JUnit 5의 주피터(Jupiter) 모델에서 스프링 테스트컨텍스트(TestContext)를 사용할 수 있도록 해준다.
- @ContextConfiguration
    - 자동으로 만들어줄 애플리케이션 컨텍스트의 설정파일 위치를 지정한 것이다.
- @Autowired
    - 스프링의 DI 에 사용되는 특별한 애노테이션이다.
    - @Autowired 가 붙은 인스턴스 변수가 있으면, 테스트 컨텍스트 프레임워크는 변수 타입과 일치하는 컨텍스트 내의 빈을 찾아서, 타입이 일치하는 빈이 있으면 인스턴스 변수에 주입해준다.
~~~ java
  @ExtendWith(SpringExtension.class)
  @ContextConfiguration(classes = UserDaoFactory.class)
  public class UserDaoTest {
          @Autowired
          ApplicationContext context;
          private UserDao dao;

          private User user1;
          private User user2;
          private User user3;

          @BeforeEach
          public void setUp() {
              this.dao = context.getBean("userDao", UserDao.class);

              this.user1 = new User("user1", "name1", "test1");
              this.user2 = new User("user2", "name2", "test2");
              this.user3 = new User("user3", "name3", "spring");

          }

          @Test
          public void andAndGet() throws SQLException, ClassNotFoundException {
             ...
          }

          @Test
          public void getUserFailure() throws SQLException {
              ...
          }


          @Test
          public void count() throws SQLException, ClassNotFoundException {
             ...
          }
  }
~~~
- 스프링의 JUnit 확장기능은 테스트가 실행되기 전에 딱 한 번만 애플리케이션 컨텍스트를 만들어두고, 테스트 오브젝트가 만들어질 때마다 특별한 방법을 이용해 애플리케이션 컨텍스트 자신을 테스트 오브젝트의 특정 필드에 주입해 준다.
- **스프링은 테스트 클래스 사이에서도 애플리케이션 컨텍스트를 공유하게 해준다.**
- **꼭 필요하지 않다면 테스트에서도 가능한 한 인터페이스를 사용해서 애플리케이션 코드와 느슨하게 연결해두는 편이 좋다.**
- **항상 스프링 컨테이너 없이 테스트할 수 있는 방법을 가장 우선적으로 고려하자. 이 방법이 테스트 수행 속도가 가장 빠르고 테스트 자체가 간결하다.**
- **인터페이스를 두고 DI 를 적용해야 하는 이유**
    - 소프트웨어 개발에서 절대로 바뀌지 않는 것은 없다. 언젠가 변경이 필요한 상황이 닥쳤을 때 수정에 들어가는 시간과 비용의 부담을 줄이기 위해서 인터페이스를 사용하는 편이 낫다.
    - 클래스의 구현 방식은 바뀌지 않는다고 하더라도 인터페이스를 두고 DI 를 적용하게 해두면 다른 차원의 서비스 기능을 유연하게 도입할 수 있다.
    - DI 는 테스트가 작은 단위의 대상에 대해 독립적으로 만들어지고 실행되게 하는데 중요한 역할을 한다.

<br>

### 2.4 학습 테스트
- 다양한 조건에 따른 기능을 손쉽게 확인해 볼 수 있다.
- 학습 테스트 코드를 개발 중에 참고할 수 있다.
- 프레임워크나 제품을 업그레이드할 때 호환성 검증을 도와준다.
- 테스트 작성에 대한 좋은 훈련이 된다.
- 버그 테스트
    - 테스트의 완성도를 높여준다.
    - 버그의 내용을 명확하게 분석하게 해준다.
    - 기술적인 문제를 해결하는 데 도움이 된다.

### 정리
- 테스트는 자동화돼야 하고, 빠르게 실행할 수 있어야 한다.
- main() 테스트 대신 JUnit 프레임워크를 이용한 테스트 작성이 편리하다.
- **테스트 결과는 일관성이 있어야 한다. 코드의 변경 없이 환경이나 테스트 실행 순서에 따라서 결과가 달라지면 안된다.**
- 테스트는 포괄적으로 작성해야 한다. 충분한 검증을 하지 않는 테스트는 없는 것보다 나쁠 수 있다.
- **코드 작성과 테스트 수행의 간격이 짧을수록 효과적이다.**
- **테스트하기 쉬온 코드가 좋은 코드다.**
- 테스트를 먼저 만들고 테스트를 성공시키는 코드를 만들어가는 테스트 주도 개발 방법도 유용하다.
- 테스트 코드도 애플리케이션 코드와 마찬가지로 적절한 리팩토링이 필요하다.
- @BeforeEach, @AfterEach 를 사용해서 테스트 메소드들의 공통 중비 작업과 정리 작업을 처리할 수 있다.
- 동일한 설정파일을 사용하는 테스트는 하나의 애플리케이션 컨텍스트를 공유한다.
- 기술의 사용 방법을 익히고 이해를 돕기 위해 학습 테스트를 작성하자.
- 오류가 발견될 경우 그에 대한 버그 테스트를 만들어 두면 유용하다.
