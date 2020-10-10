---
layout : post
title : docker-compose 활용하기
date : 2020-01-01
excerpt : "docker compose 를 활용해서 프로젝트 환경 구성하기                     "
tags: [docker, dockerfile, docker-compose]
categories: [Server]
comments: true
changefreq : daily
---

### 1. docker image 사용하기 
- docker hub 에 있는 image 를 받아서 사용
~~~ cmd
    docker container run -d  -p 15432:5432 --name "postgres" -e POSTGRES_PASSWORD=postgres postgis/postgis:12-master
~~~
- 문제점 
    - 리눅스에서 기본적으로 사용하던 wget, unzip, clear 명령 등을 사용할 수 없다. 
    - 위 이미지는 postgis 만을 위한 image 이므로 다른 것을 사용 하려면 용도에 맞는 이미지를 별도의 container 로 실행시켜야 한다. 
    - 필요에 따라 n 개의 container 를 생성 및 실행하고 각각 관리해야하는 불편함이 있다. 

### 2. docker image 에 몽땅 넣어 사용하기 
- centos 이미지를 받아서 거기에 db, tomcat, java, rabbitmq 등을 몽땅 설치해서 image 로 배포 해서 사용 
~~~ cmd
    docker container run --privileged  -d -p 15432:5432 -p 18080:8080 -v "D:\data\geoserver":"/data/geoserver_data" --name "mago3d" gaia3d/mago3d /sbin/init
~~~
- 문제점 
    - 개발과정에서 발생하는 db 스키마 변경 및 환경 구성을 항상 최신으로 유지하기가 쉽지 않다. 
    - centos image 위에 모든 것을 설치해서 배포하기 때문에 용량이 크다. 
    - privileged 권한으로 실행하면서 container 에 불필요한 파일들이 늘어나 용량이 증가한다. 
    - <img src="/static/img/docker-compose-use/docker-size.png">
    
### 3. docker compose 를 사용해서 개선하기
- 필요한 환경 구성을 Dockerfile 에 작성하고 docker compose 를 이용해서 관리하기  

#### 3.1. postgresql
- 커맨드창을 색감있게 보기 위한 설정 파일과 vim 에디터 설정 파일을 복사해서 빌드한다. 
~~~ dockerfile
    FROM postgis/postgis:12-master
    
    COPY .vimrc /root/.vimrc
    COPY bashrc /color-config
    
    RUN \
        apt-get update && \
        apt-get install -y vim && \
        cat color-config >> /etc/bash.bashrc
~~~

#### 3.2. geoserver
- tomcat image 에 geoserver war 를 받아서 압축을 풀고 cors 설정을 해준다. 
~~~ dockerfile
    FROM tomcat:9.0.38-jdk11-adoptopenjdk-openj9
    
    ENV JAVA_OPTS=-D-Xms4096m-Xmx4096m
    
    RUN \
        apt-get update && \
        apt-get install -y vim wget unzip && \
        rm -rf /usr/local/tomcat/webapps/* && \
        cd /tmp && wget http://sourceforge.net/projects/geoserver/files/GeoServer/2.17.3/geoserver-2.17.3-war.zip && \
        unzip /tmp/geoserver-2.17.3-war.zip -d /usr/local/tomcat/webapps && \
        rm -rf /tmp/geoserver-2.17.3-war.zip
    
    # Enable CORS
    RUN sed -i '\:</web-app>:i\
    <filter>\n\
        <filter-name>CorsFilter</filter-name>\n\
        <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>\n\
        <init-param>\n\
            <param-name>cors.allowed.origins</param-name>\n\
            <param-value>*</param-value>\n\
        </init-param>\n\
        <init-param>\n\
            <param-name>cors.allowed.methods</param-name>\n\
            <param-value>GET,POST,HEAD,OPTIONS,PUT</param-value>\n\
        </init-param>\n\
    </filter>\n\
    <filter-mapping>\n\
        <filter-name>CorsFilter</filter-name>\n\
        <url-pattern>/*</url-pattern>\n\
    </filter-mapping>' /usr/local/tomcat/conf/web.xml
~~~

#### 3.3. rabbitmq
- rabbitmq 에서 사용할 사용자와 queue 등을 미리 작성해둔 json 파일을 image 에 복사해서 빌드한다.
~~~ dockerfile
    FROM rabbitmq:3.8.9-management
    
    COPY definitions.json /etc/rabbitmq/
    
    RUN apt-get update && apt-get install -y vim
~~~

#### 3.4. docker-compose
~~~ dockerfile
    version: '3'
    volumes:
      oim-geoserver-data:
    
    services:
      db:
        container_name: oim-db
        restart: always
        build:
          context: ./doc/docker/postgres
          dockerfile: Dockerfile
        volumes:
          - ./doc/database:/database:ro
          - ./init-user-db.sh:/docker-entrypoint-initdb.d/init-user-db.sh:ro
        ports:
          - 15432:5432
          - 18080:8080
    
      geoserver:
        container_name: oim-geoserver
        restart: always
        image: gaia3d/geoserver:oim-2.17.3
    #    build:
    #      context: ./doc/docker/geoserver
    #      dockerfile: Dockerfile
        volumes:
          - oim-geoserver-data:/geoserver-data
        network_mode: "service:db"
    
      rabbitmq:
        container_name: oim-rabbitmq
        restart: always
        image: gaia3d/rabbitmq:oim-3.8.9
    #    build:
    #      context: ./doc/docker/rabbitmq
    #      dockerfile: Dockerfile
        ports:
          - 5672:5672
          - 15672:15672
~~~

## docker 개발환경 실행하기 
    - docker-compose.yml 파일이 있는 경로에서 다음 실행
    - docker-compose up -d

## 변경된 db 반영시에는 지우고 다시 실행
    - -v 옵션을 줘야 docker 에서 사용하는 volume(geoserver-data) 이 모두 삭제됨. geoserver 의 데이터를 유지하고 싶을 경우에는 -v 옵션 생략
    - docker-compose down -v
    - docker image rm openindoormap_db 
    - docker-compose up -d

## Dockerfile, docker-compose.yml 파일만 변경되었을 경우에는 다시 빌드
    - docker-compose up -d --build

## geoserver docker 에서 로컬 데이터 사용하기
    - docker-compose 파일의 volume 마운트 하는 부븐 "oim-geoserver-data:/geoserver-data" 에서 oim-geoserver-data(docker 내부에서 자동으로 관리하는 volume)을
    로컬 호스트의 경로로 마운트하고 docker-compose up -d --build 으로 실행하여 사용하거나 geoserver container 에 마운트 한 geoserver-data 폴더 안으로 파일을 복사하여 사용
    (docker container cp "로컬파일" oim-geoserver:/geoserver-data)
