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
      


          


