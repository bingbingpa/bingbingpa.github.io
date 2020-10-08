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
#### 3.3. rabbitmq
#### 3.4. docker-compose
~~~ dockerfile
    version: '3'
    #volumes:
    #  mago3d-postgres-data:
    #  mago3d-geoserver-data:
    
    services:
      db:
    #    image: postgis/postgis:12-master
        container_name: oim-db
        restart: always
        build:
          context: ./doc/docker/postgres
          dockerfile: Dockerfile
        volumes:
          - ./doc/database:/database
          - ./init-user-db.sh:/docker-entrypoint-initdb.d/init-user-db.sh
        ports:
          - 15433:5432
        environment:
          - TZ=Asia/Seoul
          - POSTGRES_DB=lhdt
          - POSTGRES_USER=postgres
          - POSTGRES_PASSWORD=postgres
          - POSTGRES_INITDB_ARGS=--encoding=UTF-8
          - ALLOW_IP_RANGE=0.0.0.0/0
      #geoserver:
      #rabbitmq:
~~~
