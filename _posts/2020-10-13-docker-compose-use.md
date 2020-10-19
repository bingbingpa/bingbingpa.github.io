---
layout : post
title : docker 로 개발환경 구성하기
date : 2020-10-13
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
    - 리눅스에서 기본적으로 사용하던 wget, unzip, clear 명령 등이 없어서 설치해줘야 한다. 
    - 위 이미지는 postgis 만을 위한 image 이므로 다른 것을 사용 하려면 용도에 맞는 이미지를 별도의 container 로 실행시켜야 한다. 
    - 필요에 따라 n 개의 container 를 생성 및 실행하고 각각 관리해야하는 불편함이 있다. 

### 2. docker image 에 몽땅 넣어 사용하기 
- centos image 를 받아서 거기에 db, tomcat, java, rabbitmq 등을 몽땅 설치해서 image 로 배포 해서 사용 
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
- postgis image 에 타임존, 디비명, 유저, 패스워드 인코딩, 허용ip 를 설정해준다. 디비명은 변수로 지정한 이름으로 만들어진다. 
- shell, vim 의 가독성을 위한 설정파일을 복사한다. 
~~~ dockerfile
    FROM postgis/postgis:12-master
    
    COPY .vimrc /root/.vimrc
    COPY bashrc /color-config
    
    ENV TZ=Asia/Seoul
    ENV POSTGRES_DB=oim
    ENV POSTGRES_USER=postgres
    ENV POSTGRES_PASSWORD=postgres
    ENV POSTGRES_INITDB_ARGS="--encoding=UTF-8"
    ENV ALLOW_IP_RANGE=0.0.0.0/0
    
    RUN \
        apt-get update && \
        apt-get install -y vim && \
        cat color-config >> /etc/bash.bashrc
~~~

#### 3.2. geoserver
- tomcat image 에 geoserver war 를 받아서 압축을 풀고 cors 설정을 해준다. 
- setenv 파일을 복사하지 않고 ENV 로 geoserver 데이터 경로나 캐시 경로를 설정 해줄 수 있다. 
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
- rabbitmq 의 관리자 플러그인을 사용하기 위해 기본 rabbitmq 가 아닌 rabbitmq-management image 를 사용한다. 
- rabbitmq 에서 사용할 사용자와 queue 등을 미리 작성해둔 json 파일을 image 에 복사해서 빌드한다.
~~~ dockerfile
    FROM rabbitmq:3.8.9-management
    
    COPY definitions.json /etc/rabbitmq/
    
    RUN apt-get update && apt-get install -y vim
~~~

#### 3.4. docker-compose
- 초기 한번은 모든 Dockerfile 을 빌드하여 이미지를 생성하고, 변동 가능성이 적은 geoserver, rabbitmq 등은 만들어진 image 를 docker hub 에 등록하여 해당 image 를 사용한다. 
- geoserver, rabbitmq 등의 버전을 변경하거나 Dockerfile 에 변경사항이 있을 경우에는 주석된 build 부분을 해제하고 image 를 주석하고 실행하면 된다. 
- db 는 docker-entrypoint-initdb.d 경로에 스크립트나 sql 을 복사해두면 container 가 실행되면서 해당 내용들을 실행시켜준다.
- geoserver 에 마운트하는 볼륨은 docker 내부에서 자동으로 관리하도록 한다. 
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

#### 3.5. 실행하기 
- docker-compose.yml 파일이 있는 경로에서 다음 실행
- -d 는 백그라운드에서 실행한다는 옵션이고, container 가 생성되고 위에서 설정한 compose 파일에 restart 가 always 로 되어 있으므로, 개발장비가 재부팅 되어도 자동으로 실행 된다. 
~~~ cmd
    docker-compose up -d
~~~

#### 3.6. 변경된 db 반영하기 
- -v 옵션을 줘야 docker 에서 사용하는 volume(geoserver-data) 이 모두 삭제된다. geoserver 의 데이터를 유지하고 싶을 경우에는 -v 옵션을 생략한다. 
- db Dockerfile 을 재빌드할때는 다음의 명령어를 사용해도 되지만, 이렇게 할경우 이전에 만들어진 image 가 그대로 남아 있으므로, 기존에 생성된 이미지를 지우고 다시 빌드 하는게 더 나은것 같다. 
~~~ cmd
    docker-compose build --no-cache 
~~~ 
~~~ cmd
    docker-compose down -v
    docker image rm openindoormap_db 
    docker-compose up -d
~~~

#### 3.7. geoserver docker 에서 호스트의 파일 사용하기
- docker-compose 파일의 volume 마운트 하는 부분 "oim-geoserver-data:/geoserver-data" 에서 oim-geoserver-data(docker 내부에서 자동으로 관리하는 volume)을
로컬 호스트의 경로로 마운트하고 docker-compose up -d --build 으로 실행하여 사용하거나 geoserver container 에 마운트 한 geoserver-data 폴더 안으로 파일을 복사하여 사용 할 수 있다.
(docker container cp "로컬파일" oim-geoserver:/geoserver-data)

### 4. 삽질한 내용... 
- Dockerfile 에 RUN 명령은 가급적 **\\**(개행) 과 **&&** 을 써서 하나의 RUN 명령에 이어서 쓰는것이 좋다. RUN, COPY, CMD 등 Dockerfile 에서 사용가능한 명령어 마다 레이어(image) 가 생성되므로, 불필요하게 많은 
레이어가 생성되지 않도록 하기 위해 하나의 RUN 명령에 작성하도록 한다. 
    - RUN 명령 2개로 Dockerfile 을 작성하는 경우
    ~~~ dockerfile
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
    - <img src="/static/img/docker-compose-use/run-one.png">
    - 하나의 커맨드 마다 RUN 명령을 사용하는 경우
    ~~~ dockerfile
        RUN apt-get update
        RUN apt-get install -y vim wget unzip
        RUN rm -rf /usr/local/tomcat/webapps/*
        RUN cd /tmp && wget http://sourceforge.net/projects/geoserver/files/GeoServer/2.17.3/geoserver-2.17.3-war.zip
        RUN unzip /tmp/geoserver-2.17.3-war.zip -d /usr/local/tomcat/webapps
        RUN rm -rf /tmp/geoserver-2.17.3-war.zip
        
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
    - <img src="/static/img/docker-compose-use/run-multi.png"> 
- Dockerfile 로부터 이미지를 만들 때 docker build 명령은 Dockerfile 을 포함하는 디렉토리(서브디렉토리를 포함한다)를 모두 Docker 데몬으로 전송한다.
 그래서 Dockerfile 의 저장 위치는 빈 디렉토리를 만들고 거기에 Dockerfile 을 놓아두고 이미지를 작성하는 방법을 권장한다.
    - Dockerfile 경로에 파일이 없는 경우
    - <img src="/static/img/docker-compose-use/dockerfile-build1.png"> 
    - Dockerfile 경로에 파일이 있는 경우 
    - <img src="/static/img/docker-compose-use/dockerfile-build2.png">
- postgis image 는 타임존이 한국시간이 아니므로 반드시 Dockerfile 작성시 환경변수로 **ENV TZ=Asia/Seoul** 과 같이 줘야지 제대로 된 시간을 사용 할 수 있다. 
- postgis image 에서 psql 은 **docker-entrypoint-initdb.d** 폴더에 작성한 스크립트만 실행이 가능하다. 
- 컨테이너간 네트워크를 공유하는 경우에는 다음과 같이 설정해줘야 한다.(예를 들어 geoserver container 에서 db container 의 네트워크를 공유해서 postgis 저장소를 등록하는 경우)
    - service:"docker-compose 파일에 기술한 서비스명"
    ~~~ dockerfile
        services:
              db:
                build:
                  context: ./doc/docker/postgres
                  dockerfile: Dockerfile
                ports:
                  - 15432:5432
                  - 18080:8080
            
              geoserver:
                image: gaia3d/geoserver:oim-2.17.3
                network_mode: "service:db"
    ~~~
        


