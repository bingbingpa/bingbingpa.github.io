---
layout : post
title : Web Application Server 와 servlet
date : 2020-12-13
excerpt : "web application server 동작 이해하기                     "
tags: [was, servlet, java]
categories: [Java]
comments: true
changefreq : daily
---

- DB 조회나 다양한 로직 처리를 요구하는 동적인 컨텐츠를 제공하기 위해 만들어진 Application Server
    - <img src="/static/img/was/was-vs-web.png">
- 이러한 동적인 컨텐츠를 제공하기 위해 CGI(Common Gateway Interface) 프로그램이 등장했으며, 펄(Perl)스크립트나 C, Python, PHP 같은 언어로 작성되었다.
    - <img src="/static/img/was/process.png">
- Servlet : 클라이언트 요청을 처리하고 처리 결과를 클라이언트에 전송하는 자바 프로그램
    - <img src="/static/img/was/thread.png">
- process 와 thread 의 차이점 
    - process 
        - 컴퓨터에서 연속적으로 실행되고 있는 컴퓨터 프로그램 
        - 메모리에 올라와 독립적으로 실행되고 있는 프로그램의 인스턴스 
        - 각각의 프로세스가 운영체제로부터 CPU 자원, 독립된 메모리 영역등을 할당 받는다.
        - <img src="/static/img/was/process-flow.png">
    - thread
        - process 내에서 실행되는 여러 흐름의 단위 
        - process 가 할당받은 자원을 이용하는 실행의 단위
        - thread 는 프로세스 내에서 각각 stack 만 따로 할당받고 code, data, heap 영역을 공유한다.
        - <img src="/static/img/was/thread-flow.png">
초간단 servlet 프로그램 만들기
    - HttpServlet 추상 클래스를 상속받는 클래스 구현 
        - 자바의 유료화 정책으로 openJDK 를 사용하는데, openJDK 는 Java SE(Standard Edtion) 를 오픈 소스로 구현한 것이기 때문에 Java EE(Enterprise Edtion) 에서 지원하던 Servlet 관련 도구가 없다.
        - was(tomcat 사용) 에 내장되어 있는 servlet-api.jar 를 사용한다.
        
    ~~~ java
        import javax.servlet.ServletConfig;
        import javax.servlet.ServletException;
        import javax.servlet.http.HttpServlet;
        import javax.servlet.http.HttpServletRequest;
        import javax.servlet.http.HttpServletResponse;
        import java.io.IOException;
        import java.io.PrintWriter;
        
        public class Servlet extends HttpServlet {
            
            public Servlet() {
                System.out.println("Servlet Constructor");
            }
            
            @Override
            public void init(ServletConfig config) throws ServletException {
                System.out.println("init called");
                super.init();
            }
        
            @Override
            public void destroy() {
                System.out.println("destroy called");
                super.destroy();
            }
        
            @Override
            protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                System.out.println("service called");
                super.service(request, response);
            }
        
            @Override
            protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                System.out.println("doPost called");
            }
        
            @Override
            public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
                System.out.println("doGet called");
                PrintWriter out = response.getWriter();
                java.util.Date today = new java.util.Date();
                out.println("<html>" +
                        "<body>" +
                        "<h1 align=center>Hello Mago3D!!!!!</h1>" +
                        "<br>" + today + "</body>" + "</html>");
            }
        }
    ~~~
- java 파일 컴파일 하기
    ~~~ java
        javac -classpath "톰캣경로"/lib/servlet-api.jar -d classes Servlet.java
    ~~~
- web.xml 이라는 배포 서술자(DD, Deployment Descriptor) 를 작성
    ~~~ xml
        <web-app xmlns="http://java.sun.com/xml/ns/j2ee"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd"
                 version="2.4">
                <servlet>
                    <servlet-name>hello servlet</servlet-name>
                    <servlet-class>Servlet</servlet-class>
                </servlet>
        
                <servlet-mapping>
                    <servlet-name>hello servlet</servlet-name>
                    <url-pattern>/hello</url-pattern>
                </servlet-mapping>
        </web-app>
    ~~~

- 톰캣에 배포하기
    - webapps 하위 경로에 contextPath 가 되는 폴더 생성
    - contextPath 하위에 WEB-INF, classes 폴더 생성 
    - 컴파일한 java 파일(Servlet.class) 을 classes 폴더로 이동 
    - web.xml 파일을 WEB-INF 폴더로 이동
    - 톰캣 경로/bin/catalina.bat run  실행
        - windows 환경에서는 catalina.out 파일이 생성되지 않게 기본 설정이 되어 있으므로 startup.bat 가 아닌 catalina.bat 파일로 실행하여 init(), doGet() 메소드 등이 실행되고 콘솔에 로그가 찍히는 것을 확인한다.
        
- 서블릿에는 main() 메소드가 없는데 어떻게 실행이 되는걸까?… 
- 서블릿은 컨테이너라 부르는 자바 애플리케이션의 지배를 받는다.
    -  사용자로부터 서블릿에 대한 요청(동적 페이지 요청)을 받으면, 서블릿을 바로 호출하는 것이 아니라, 서블릿을 관리하고 있는 컨테이너에게 이 요청을 넘긴다.
- 컨테이너의 역할
    - 통신 지원 : 서버와 통신하기 위하여 개발자가 직접 Server Socket 을 만들고, 특정 포트에 리스닝하는 등의 복잡한 일을 하지 않아도 된다. 이런 통신 기능들을 API 로 제공하므로 개발자는 서블릿에 비즈니스 로직 개발에만 집중 할 수 있다.
    - 생명주기 관리 : 서블릿 클래스를 로딩하여 인스턴스화하고, 초기화 메소드를 호출하고, 요청이 들어오면 적절한 서블릿 메소드를 호출한다.
    - 멀티스레딩 지원
    - 선언적인 보안 관리
- 컨테이너의 동작 과정
- <img src="/static/img/was/container-flow1.png>
- <img src="/static/img/was/container-flow2.png">
      


          


