---
layout : post
title : Docker Compose 작성 방법 및 명령어 정리
date : 2020-08-27
excerpt : "Docker Compose  작성 방법 및 명령어 정리"
tags: [docker, docker-compose]
categories: [DevOps]
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

### 서비스의 의존관계 정의(depends_on)
- 컨테이너의 시작 순서만 제어할 뿐 컨테이너상의 애플리케이션이 이용 가능해 질 때까지 기다리고 제어를 하지 않는다. 
- 의존관계에 있는 데이터베이스 서비스의 준비가 끝날 때까지 기다리는 것은 아니기 때문에 애플리케이션 측에서 이에 대한 대책을 세워야 한다. 

### 컨테이너 환경변수 지정(environment/env_file)
- 배열 형식 또는 해시 형식으로 지정 가능 
- 예시)
~~~ dockerfile
    # 배열 형식으로 지정 
    environment:
        - HOGE=fuga
        - FOO
    # 해시 형식으로 지정 
    environment :
        HOGE: fuga
        FOO:
~~~
- 설정할 변수가 많을 경우에는 파일을 지정 할 수 있다. 
~~~ dockerfile
    HOGE-fuga
    FOO=bar
~~~
- 위의 내용을 yml 파일에 다음과 같이 기술한다.
~~~ dockerfile
    env_file : envfile명 
~~~
- 파일명을 여러개 지정할 수도 있다. 
~~~ dockerfile
    env_file:
        - ./envfile1
        - ./app/envfile2
        - /tmp/envfile3
~~~

### 컨테이너 데이터 관리(volumes/volumes_from)
- 컨테이너에 볼륨을 마운트할 때 사용한다. 
- 호스트 측에서 마운트할 경로를 지정하려면 호스트의 디렉토리 경로:컨테이너의 디렉토리 경로를 지정한다. 
- 볼륨 지정 뒤에 **ro**를 지정하면 볼륨을 읽기 전용으로 마운트 할 수 있다. 설정 파일이 저장된 볼륨 등과 같이 쓰기를 금지하고 싶은 경우에 지정한다. 
~~~ dockerfile
    volumes:
        - ~/configs:/etc/configs/:ro
~~~
- 다른 컨테이너로부터 모든 볼륨을 마운트 할 때는 volumes_from에 컨테이너명을 지정한다. 

### Docker Compose 의 주요 서브 명령 

|서브 명령|설명|
|:---|:---|
|up|컨테이너 생성/시작|
|ps|컨테이너 목록 표시|
|logs|컨테이너 로그 출력|
|run|컨테이너 실행|
|start|컨테이너 시작|
|stop|컨테이너 정지|
|restart|컨테이너 재시작|
|pause|컨테이너 일시 정지|
|unpause|컨테이너 재개|
|port|공개 포트 번호 표시|
|config|구성 확인|
|kill|실행 중인 컨테이너 강제 정지|
|rm|컨테이너 삭제|
|down|리소스 삭제|

#### 여러 컨테이너 생성(up)
~~~ bash
    docker-compose up [옵션] [서비스명 .]
~~~

|옵션|설명|
|:---|:---|
|-d|백그라운드에서 실행한다.|
|\--no-deps|링크 서비스를 시작하지 않는다.|
|\--build|이미지를 빌드 한다.|
|\--no-build|이미지를 빌드하지 않는다.|
|-t, \--timeout|컨테이너의 타임아웃을 초로 지정(기본10초)한다.|
|\--scale SERVICE=서비스 수|서비스 수를 지정한다.|

- 작성한 docker-compose.yml을 바탕으로 여러 개의 컨테이너를 생성하여 시작할 때 쓰는 명령어
- 예를 들어 yml 파일에 server_a와 server_b라는 2개의 정의가 있고, server_a의 컨테이너를 10개, server_b의 컨테이너를 20개 시작시킬 때 다음과 같이 지정할 수 있다.
~~~ bash
    docker-compose up --scale server_a=10 --scale server_b=20
~~~

#### 여러 리소스의 일괄 삭제(down)
~~~ bash
    docker-compose down [옵션]
~~~

|옵션|설명|
|:---|:---|
|\--rmi all|모든 이미지를 삭제|
|\--rmi local|커스텀 태그가 없는 이미지만 삭제|
|-v, \--volumes|Compose 정의 파일의 데이터 볼륨을 삭제|

- compose 정의 파일을 바탕으로 docker-compose up 명령으로 생성한 컨테이너나 Docker 이미지를 모아서 삭제할 때 사용하는 명령어
- 실행중인 컨테이너를 정지시키고, Docker 이미지, 네트워크, 데이터 볼륨을 일괄적으로 삭제한다. 
 
