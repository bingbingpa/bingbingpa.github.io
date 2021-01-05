---
layout : post
title : springBoot Thymeleaf
date : 2020-06-03
excerpt : "springBoot Thymeleaf 기본 설정 방법 정리"
tags: [springBoot, thymeleaf]
categories: [Spring]
comments: true
changefreq : daily
---

### 1. build.gradle 설정  
- thymeleaf, layout-dialect 를 사용하기 위한 의존성을 추가한다. 
~~~ gradle
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect:2.4.1'
~~~

### 2. config 설정 
- thymeleaf 레이아웃을 사용하기 위한 빈을 생성해준다. 
~~~ java
    @EnableWebMvc // Spring 에서 여러 Config 값을 알아서 세팅해준다.
    @Configuration
    public class ServletConfig implements WebMvcConfigurer {
        @Bean
        public LayoutDialect layoutDialect() {
            return new LayoutDialect();
        }
    }
~~~

### 3. controller 
- view 페이지 이동을 위한 기본 컨트롤러 설정 
~~~ java
    @Controller
    @RequestMapping("/sign")
    public class SigninController {
    	
    	@GetMapping("/signin")
    	public String signin(HttpServletRequest request, Model model) {
    
    		return "/sign/signin";
    	}
    }
~~~

### 4. application.properties 
- thymeleaf 관련 설정을 해준다. 개발 단계에서는 cache 는 false 로 설정한다. 
~~~ properties
    spring.thymeleaf.mode=HTML
    spring.thymeleaf.cache=false
    spring.resources.cache.period=0
    spring.devtools.restart.enabled=true
    spring.thymeleaf.prefix=classpath:/templates
    # 재실행 트리거에서 제외할 파일 설정
    spring.devtools.restart.exclude=static/**, templates/**
~~~

### 5. layout 구성 
- 모든 페이지에서 레이아웃으로 사용할 default 페이지를 구성하고 header, footer, menu 등은 fragement 로 구성하여 replace 하는 형태로 사용한다. 
- <img src="/static/img/thymeleaf/layout.png">


### 6. default 레이아웃 구성 
- 모든 페이지에서 사용할 기본 레이아웃을 구성한다. 
- header, footer 는 html 파일로 분리하여 th:replace 로 넣어주었다. 
- 각 페이지마다 사용하는 css, script 가 다르므로 해당 부분은 레이아웃에 추가하지 않고 fragement 로 선언만 해두었다. 
- layout 을 사용하기 위해 다음 네임스페이스를 추가해준다. **xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"**
- $CONTENT_TITLE 은 각 페이지의 타이틀이 되고 \| $LAYOUT_TITLE 은 Spring Sample 이 모든 페이지에 기본으로 들어가게 된다. 
- default.html
~~~ html
    <!DOCTYPE html>
    <html th:lang="${accessibility}" xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <title layout:title-pattern="$CONTENT_TITLE | $LAYOUT_TITLE">Spring Sample</title>
        <th:block layout:fragement="pageCustomStyle"></th:block>
    </head>
    
    <body>
    <div th:replace="/fragments/header"></div>
    
    <th:block layout:fragment="pageCustomContent"></th:block>
    
    <th:block th:replace="/fragments/footer"></th:block>
    
    <th:block layout:fragment="pageCustomScript"></th:block>
    
    </body>
    </html>
~~~
- header.html
~~~ html
    <header id="headerContents">
        header Contents
    </header>
~~~
- footer.html
~~~ html
    <div id="footerContents">
    	ⓒ bingbingpa
    </div>
~~~

### 7. 레이아웃 사용 
- 구성한 레이아웃을 페이지에서 사용하도록 한다. 
- 어떤 레이아웃을 사용할 것인지 다음과 같이 선언해준다. **layout:decorate="/layouts/default"**
- 해당 레이아웃을 사용하여 페이지를 구성하고 **<th:block layout:fragment="pageCustomContent">** 과 같이 재정의한 block은 해당 내용으로 채워진다.
~~~ html
    <!DOCTYPE html>
    <html th:lang="${accessibility}" xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout" layout:decorate="/layouts/default">
    <head>
        <title>test</title>
        <th:block layout:fragment="pageCustomStyle">
    
        </th:block>
    </head>
    <body>
    <th:block layout:fragment="pageCustomContent">
        main Contents
    </th:block>
    
    <th:block layout:fragment="pageCustomScript">
    
    </th:block>
    </body>
    </html>
~~~
- <img src="/static/img/thymeleaf/view.png">

