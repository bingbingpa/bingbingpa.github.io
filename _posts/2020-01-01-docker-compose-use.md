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
    - 

### 2. docker image 에 몽땅 넣어 사용하기 
#docker container run --privileged  -d -p 15432:5432 -p 18080:8080 -v "D:\data\geoserver":"/data/geoserver_data" --name "mago3d" gaia3d/mago3d /sbin/init
### 3. docker compose 를 사용해서 개선하기
 
