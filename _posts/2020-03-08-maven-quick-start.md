---
layout : post
title : maven 프로젝트 생성
date : 2020-03-08
excerpt : "커맨드에서 mvn archetype:generate 로 maven 프로젝트 생성하기"
tags: [maven]
categories: [BuildTool]
comments: true
changefreq : daily
---

## maven project 생성하기(archetype:generate)

- maven 프로젝트를 생성하고자 하는 경로로 이동(윈도우라면 maven이 환경변수에 등록되어 있어야 한다.)
~~~shell
    mvn archetype:generate
~~~
- 잠시 기다리면 다음과 같은 텍스트들이 출력된다. 
~~~shell
    [INFO] Scanning for projects...
    [INFO] 
    [INFO] ------------------< org.apache.maven:standalone-pom >-------------------
    [INFO] Building Maven Stub Project (No POM) 1
    [INFO] --------------------------------[ pom ]---------------------------------
    [INFO] 
    [INFO] >>> maven-archetype-plugin:3.1.1:generate (default-cli) > generate-sources @ standalone-pom >>>
    [INFO] 
    [INFO] <<< maven-archetype-plugin:3.1.1:generate (default-cli) < generate-sources @ standalone-pom <<<
    [INFO] 
    [INFO] 
    [INFO] --- maven-archetype-plugin:3.1.1:generate (default-cli) @ standalone-pom ---
    [INFO] Generating project in Interactive mode
    [INFO] No archetype defined. Using maven-archetype-quickstart (org.apache.maven.archetypes:maven-archetype-quickstart:1.0)
    Choose archetype:
    .... 중략 ... 

    Choose org.apache.maven.archetypes:maven-archetype-quickstart version:
~~~
- 이 상태에서 엔터를 치면 가장 최신의 maven-archetype quickstart version이 선택 된다. 
<img src="/static/img/maven-quick-start/maven-quick-start.png">
- groupId : 프로젝트를 생성하는 개인 또는 단체를 의미하는 ID
- artifactId : 생성하는 프로젝트의 ID. 이 이름으로 폴더가 만들어 지게 된다. 
- version : 프로그램의 버전을 지정한다. 기본적으로 "1.0-SNAPSHOT"라고 되어 있다.
- package : 프로그램을 배치할 패키지를 지정한다. 디폴트로 groupID가 그대로 설정되어 있다. 
- 모든 정보를 입력 후 생성되는 maven 프로젝트의 구성은 다음과 같다. 
~~~text
    my-app
    |-- pom.xml
    `-- src
        |-- main
        |   `-- java
        |       `-- com
        |           `-- mycompany
        |               `-- app
        |                   `-- App.java
        `-- test
            `-- java
                `-- com
                    `-- mycompany
                        `-- app
                            `-- AppTest.java
~~~
