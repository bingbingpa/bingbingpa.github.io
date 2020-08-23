---
layout : post
title : Docker Compose 작성 방법 정리
date : 2020-01-01
excerpt : "Docker Compose  작성 방법 정리                      "
tags: [docker, docker-compose]
categories: [Server]
comments: true
changefreq : daily
---

### Docker Compose 
- 여러 컨테이너를 모아서 관리하기 위한 툴 
- docker-compose.yml 파일에 컨테이너의 구성 정보를 정의함으로써 동일 호스트상의 여러 컨테이너를 일괄적으로 관리 할 수 있다. 
- yml 파일에 기술하는 version 은 docker engine 버전에 따라 달라진다. 

### 이미지 지정(image)
- Docker 컨테이너의 바탕이 되는 베이스 이미지를 지정할 때 사용 한다. image 에는 이미지의 이름 또는 이미지 ID 중 하나를 지정한다. 
- 베이스 이미지는 로컬 환경에 있으면 그것을 사용하고, 로컬 환경에 없으면 Docker Hub 로부터 자동으로 다운로드 한다. 
- 이미지의 태그를 지정하지 않은 경우는 최신 버전(latest)이 다운로드 된다.

### 이미지 빌드(build)
- 이미지의 작성을 Dockerfile 에 기술 하고 그것을 자동으로 빌드하여 베이스 이미지로 지정할 때는 build 를 지정한다. build 에는 Dockerfile 의 파일 경로를 지정 한다. 
- Docker 이미지를 빌드할 때에 인수를 args 로 지정할 수 있다. bool 연산자를 사용하는 경우는 따옴표로 둘러싸야 한다. 
- 예시)
~~~ dockerfile
    services:
        webserver:
            build:
                args:
                    projectno: 1
                    user: asa 
~~~

### 컨테이너 안에서 작동하는 명령 지정(command/entrypoint)