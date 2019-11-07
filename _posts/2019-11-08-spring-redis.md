---
layout : post
title : Springboot Redis 세션 공유
date : 2019-11-08
excerpt : "Window Server 환경에서 Spring Boot로 개발한 웹어플리케이션을 redis를 이용하여 세션 공유 하는 방법 정리"
tags: [springboot, HttpSession, redis]
categories: [Spring]
comments: true
changefreq : daily
---

### 1. Springboot Redis 세션 클러스터링을 사용하는 이유

- 서버가 한대일 경우 WAS에 세션 정보를 담아두고 사용하면 되지만 서버가 N대로 늘어날 경우 늘어난 서버의 ip, port 정보를 N대의 서버에 일일이 입력해줘야 한다. 따라서 WAS가 제공하는 세션 클러스터링 기능에 의존하지 않고 새로운 저장소를 두고 세션 정보를 두고 공유하게 되면 서버가 늘어나도 저장소 정보만 공유해주면 된다. 
- 세션을 공유하기 위한 저장소로는 Redis를 많이 이용한다. Redis는 데이터 저장소로 가장 I/O 속도가 빠른 장치인 메모리를 사용하고 있고 구조적으로는 key, value 형식의 데이터 처리에 특화되어 있다.

### 2. 세션 공유 시나리오 

- 각각의 서버에는 웹어플리케이션 1, 2, 3, 이 있고 각각의 세션은 연동되어 한 곳에서 로그인 시에 다른 웹어플리케이션과 세션을 공유하여 로그인/ 로그아웃 처리를 해야 한다. 
- 웹어플리케이션이 1,2,3있는 서버 N대가 있고 앞쪽에서 L4나 nginx, HAproxy등으로 부하분산 처리르 해주고 N대의 서버는 세션을 공유 하여 로그인 / 로그아웃을 처리 해야 한다. 

### 3. Redis 설치 및 서비스 등록 

- Redis는 공식적으로 윈도우를 지원하지 않고, [MSOpenTech](https://github.com/MicrosoftArchive/redis/releases)라는 곳에서 지속적으로 윈도우 버전을 릴리즈 하고 있다.
- 별도의 인스톨은 필요하지 않고 해당 zip파일을 받아서 conf파일을 각자의 설정에 맞게 수정 후 서비스로 등록 후 시작해주면 된다. 
- 기본포트는 6379번이고 포트를 포함한 설정정보를 수정하려면 redis.windows.conf 파일을 수정하면 된다. 
- 서비스를 등록하고 redis 서비스를 시작한다. 
~~~ cmd
    redis-server --service-install redis.windows.conf --loglevel verbose
    redis-server --service-start
~~~
- cli로 접속하여 정상적으로 접속이 되는지 확인.(아직 springboot에 redis 설정을 하지 않았으므로 아무것도 없다.)
- redis-cli 
~~~ cmd
    127.0.0.1:6379> 
    127.0.0.1:6379> keys * 
    (empty list or set)
~~~
- flushall : 모든 세션 정보 초기화 
- keys * : 모든 세션 정보 조회 
- get "key" : 해당 키의 세션 정보 조회

### 4. build.gradle 설정 

- redis session을 사용 할 수 있도록 디펜던시 추가 
~~~ gradle
    compile('org.springframework.session:spring-session-data-redis')  
~~~

### 5. RedisConfig 파일 추가 

- redis 연결정보와 RedisTemplate을 Bean으로 추가한다. 
- redisConnectionFactory로는 Jedis 보다 Lettuce가 더 낫다는 글들이 많아서 Lettuce 사용. 
~~~ java
    @Configuration
    @EnableRedisRepositories
    public class RedisConfig {
    
        @Bean
        public RedisConnectionFactory redisConnectionFactory() {
            LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory();
            return lettuceConnectionFactory;
        }

        @Bean
        public RedisTemplate<String, Object> redisTemplate() {
            RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
            redisTemplate.setConnectionFactory(redisConnectionFactory());
            redisTemplate.setKeySerializer(new StringRedisSerializer());
            redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(MyDto.class));
            return redisTemplate;
        }
    }
~~~

### 6. Session에 담아줄 Dto에 Serializable 추가 

- Dto를  Serializable 하지 않을 경우 다음과 같은 에러가 발생하니 꼭 Serializable을 추가해야한다. 
- **DefaultSerializer requires a Serializable payload but received an object of type [MyDto]**
- 웹어플리케이션 1,2,3에서 세션을 공유해야 하기 때문에 각 어플리케이션의 serialVersionUID는 동일하게 설정해야 한다. 

### 7. session 확인 후 로그인 처리 

- 웹 어플리케이션에 로그인시에 해당 session을 redis 설정한 어플리케이션끼리 공유하므로 session 정보를 확인 후 로그인 처리 또는 login페이지로 이동하도록 설정한다.   
~~~ java
    @Controller
    public class LoginController {

        /**
        * 로그인 화면
        * @return
        */
        @GetMapping("/login")
        public String login(HttpServletRequest request, Model model) {

            //사용자 정보가 있을 경우 바로 메인 페이지로 이동 
            MyDto session = (MyDto)request.getSession().getAttribute(MyDto.KEY);
            if(session != null) {
                return "redirect:/main/";
            }

            model.addAttribute("loginForm", new MyDto());

            return "/login/login";
        }
    }
~~~

### 8. 확인 
- 각 어플리케이션에서 다른 어플리케이션으로 접속시 세션이 공유되어 로그인/로그아웃이 정상적으로 되는지 확인 
