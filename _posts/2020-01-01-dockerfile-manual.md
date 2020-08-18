---
layout : post
title : dockerfile 작성 방법 정리
date : 2020-01-01
excerpt : "dockerfile  작성 방법 정리                      "
tags: [docker, dockerfile]
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
~~~ cmd
    docker build -t [생성할 이미지명]:[태그명] [Dockerfile 의 위치]
~~~

### 
