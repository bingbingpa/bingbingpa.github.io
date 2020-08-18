---
layout : post
title : Dockerfile 작성 방법 정리
date : 2020-01-01
excerpt : "Dockerfile  작성 방법 정리                      "
tags: [docker, Dockerfile]
categories: [Server]
comments: true
changefreq : daily
---

### Dockerfile 이란?
- 베이스가 되는 이미지에 각종 미들웨어를 설치 및 설정하고, 개발한 애플리케이션의 실행 모듈을 전개 하기 위한 애플리케이션의 실행 기반의 모든 구성 정보를 기술한다. 

### Dockerfile 의 기본 구문 

|옵션|설명|
|:---|:---|
|FROM|베이스 이미지 지|
|RUN|명령 실행|
|CMD|컨테이너 실행 명령|
|LABEL|라벨 설정|
|EXPOSE|포트 익스포트|
|ENV|환경변수|
|ADD|파일/디렉토리 추가|
|COPY|파일 복사|
|ENTRYPOINT|컨테이너 실행 명령| 
|VOLUME|볼륨 마운트|
|USER|사용자 지정|
|WORKDIR|작업 디렉토리|
|ARG|Dockerfile 안의 변수|
|ONBUILD|빌드 완료 후 실행되는 명령|
|STOPSIGNAL|시스템 콜 시그널 설정|
|HEALTHCHECK|컨테이너의 헬스 체크|
|SHELL|기본 쉘 설정|     
  

### Dockerfile 로부터 Docker 이미지 만들기 
~~~ dockerfile
    docker build -t [생성할 이미지명]:[태그명] [Dockerfile 의 위치]
~~~

### 명령 실행(RUN 명령)
~~~ dockerfile
    RUN [실행하고 싶은 명령]
~~~
- RUN 명령은 여러개를 사용 할 수 있지만, 사용할 때 마다 레이어가 생성되므로 RUN 명령은 한 줄에 쓰는 것이 좋다. 또한 RUN 명령은 \로 줄 바꿈을 넣어서 가독성을 높일 수 있다.

### 데몬 실행(CMD 명령)
~~~ dockerfile
    CMD [실행하고 싶은 명령]
~~~
- RUN 명령은 이미지를 작성하기 위해 실행하는 명령을 기술하지만, CMD 명령은 이미지를 바탕으로 생성된 컨테이너 안에서 명령을 실행한다. 
- Dockerfile 에는 하나의 CMD 명령을 기술 할 수 있고, 만일 여러 개를 지정하면 마지막 명령만 유효하다. 

### 데몬 실행(ENTRYPOINT 명령)
~~~ dockerfile
    EXTRYPOINT [실행하고 싶은 명령]
~~~
- ENTRYPOINT 명령에서 지정한 명령은 docker container run명령을 실행 했을 때 실행된다.
- CMD 명령의 경우는 컨테이너 시작 시에 실행하고 싶은 명령을 정의해도 docker container run 명령 실행 시에 인수로 새로운 명령(ENTRYPOINT)을 지정한 경우 이것을 우선 실행한다. 
- ENTRYPOINT 명령으로는 실행하고 싶은 명령 자체를 지정하고 CMD 명령으로는 그 명령의 인수를 지정하면, 컨테이너를 실행했을 때의 기본 작동을 결정할 수 있다.
- 예시) 
    ~~~ dockerfile
       ENTRYPOINT ["top"]
       CMD ["d", "10"] 
    ~~~  

