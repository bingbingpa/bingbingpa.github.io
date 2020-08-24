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
- 베이스 이미지에 지정되어 있을 때는 그 명령을 덮어쓴다. 

### 컨테이너 간 연결(links)
- 예시)
~~~ dockerfile
    links:
        - logserver
        - logserver:1og01
~~~

### 컨테이너 간 통신(ports/expose)
- 컨테이너가 공개하는 포트는 ports 로 지정한다. 
- '호스트 머신의 포트 번호:컨테이너의 포트 번호'를 지정하거나, 컨테이너의 포트 번호만 지정한다. 또한 컨테이너의 포트 번호만 지정한 경우는 호스트 머신의 포트는 랜덤한 값으로 설정된다.
- YAML은 xx:yy 형식을 시간으로 해석하므로 포트 번호를 설정할 때는 반드시 겹따옴표로 둘러싸서 문자열을 정의해야 한다. 
- 예시)
~~~ dockerfile
    ports:
        - "3000"
        - "8000:8000"
        - "49100:22"
        - "127.0.0.1:8001:8001"
~~~ 
- 호스트 머신에 대한 포트를 공개하지 않고 링크 기능을 사용하여 연결하는 컨테이너에게만 포트를 공개할 때는 **expose**를 지정한다.
