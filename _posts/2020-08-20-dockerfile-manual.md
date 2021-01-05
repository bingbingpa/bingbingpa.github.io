---
layout : post
title : Dockerfile 작성 방법 정리
date : 2020-08-20
excerpt : "Dockerfile  작성 방법 정리"
tags: [docker, Dockerfile]
categories: [DevOps]
comments: true
changefreq : daily
---

### Dockerfile 이란?
- 베이스가 되는 이미지에 각종 미들웨어를 설치 및 설정하고, 개발한 애플리케이션의 실행 모듈을 전개 하기 위한 애플리케이션의 실행 기반의 모든 구성 정보를 기술한다. 

### Dockerfile 의 기본 구문 

|옵션|설명|
|:---|:---|
|FROM|베이스 이미지|
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

### 빌드 완료 후에 실행되는 명령(ONBUILD 명령)
~~~ dockerfile
    ONBUILD [실행하고 싶은 명령]
~~~
- ONBUILD 명령은 자신의 Dockerfile로부터 생성한 이미지를 베이스 이미지로 한 다른 Dockerfile을 빌드할 때 실행하고 싶은 명령을 기술한다. 
- 예시
~~~ dockerfile
    # 베이스 이미지 설정 
    FROM ubuntu:17.10

    # Nginx 설치 
    RUN apt-get -y update && apt-get -y upgrade
    RUN apt-get -y install nginx

    # 포트 지정 
    EXPOSE 80 

    # 웹 콘텐츠 배치 
    ONBUILD ADD website.tar /var/www/html

    # Nginx 실행 
    CMD ["nginx", "-g", "daemon off;"]
~~~ 

### 시스템 콜 시그널의 설정(STOPSIGNAL 명령)
~~~ dockerfile
    STOPSIGNAL [시그널]
~~~
- 컨테이너를 종료할 때에 송신하는 시그널을 설정할 때 사용한다.  

### 컨테이너의 헬스 체크 명령(HEALTHCHECK 명령)
~~~ dockerfile
    HEALTHCHECK [옵션] CMD 실행할 명령
~~~
- 컨테이너 안의 프로세스가 정상적으로 작동하고 있는지를 체크하고 싶을 때 사용한다. 

|옵션|설명|기본값|
|:---|:---|:---|
|\--interval=n|헬스 체크 간격|30S|
|\--timeout=n|헬스 체크 타임아웃|30S|
|\--retries=N|타임아웃 횟수|3|

### 환경변수 설정(ENV 명령)
~~~ dockerfile
    ENV [key] [value]
~~~
~~~ dockerfile
    ENV [key]=[value]
~~~
- Dockerfile 안에서 환경변수를 설정하고 싶을 때 사용하고, 위의 두 가지 서식중 하나로 기술한다.

### 작업 디렉토리 지정(WORKDIR 명령)
~~~ dockerfile
    WORKDIR [작업 디렉토리 경로]
~~~
- Dockerfile에서 정의한 명령을 실행하기 위한 작업용 디렉토리를 지정할 때 사용한다. 만일 지정한 디렉토리가 존재하지 않으면 새로 작성하고, WORKDIR 명령은 Dockerfile 안에서 여러 번 사용 할 수 있다.

### 사용자 지정(USER 명령)
~~~ dockerfile
    USER [사용자명/UID]
~~~
- 이미지 실행이나 Dockerfile의 다음과 같은 명령을 실행하기 위한 사용자를 지정할 때 사용한다. 
    - RUN 명령
    - CMD 명령
    - ENTRYPOINT 명령 
    
### 라벨 지정(LABEL 명령)
~~~ dockerfile
    LABEL <키 명>=<값>
~~~
- 이미지에 버전 정보나 작성자 정보, 코멘트 등과 같은 정보를 제공할 때 사용한다.

### 포트 설정(EXPOSE 명령)
~~~ dockerfile
    EXPOSE <포트 번호>
~~~
- 컨테이너의 공개 포트 번호를 지정할 때 사용한다. 

### Dockerfile 내 변수의 설정(ARG 명령)
~~~ dockerfile
    ARG <이름> [=기본값]
~~~
- Dockerfile 안에서 사용할 변수를 정의 할 때 사용한다. 이 ARG 명령을 사용하면 변수의 값에 따라 생성되는 이미지의 내용을 바꿀 수 있다. 
- 환경변수인 ENV와는 달리 이 변수는 Dockerfile 안에서만 사용할 수 있다. 
- 예시) 
~~~ dockerfile
    ARG YOURNAME="asa"
    RUN echo $YOURNAME
~~~

### 기본 쉘 설정(SHELL 명령)
~~~ dockerfile
    SHELL ["쉘의 경로", "파라미터"]
~~~
- 쉘 형식으로 명령을 실행할 때 기본 쉘을 설정할 때 사용한다. SHELL명령을 지정하지 않았을 때 Linux의 기본 쉘은 ["/bin/sh","-c"], Windows는 ["cmd", "/S", "/C"]이 된다.

### 파일 및 디렉토리 추가(ADD 명령)
~~~ dockerfile
    ADD <호스트의 파일 경로> <Docker 이미지 파일 경로>
~~~
- 이미지에 호스트상의 파일이나 디렉토리를 추가할 때 사용하며, 호스트상의 파일이나 디렉토리, 원격 파일을 Docker 이미지 안으로 복사한다. 

### 빌드에 불필요한 파일 제외 
- **.dockerignore**이라는 이름의 파일 안에 해당 파일명을 기술하면 제외된다. 

### 파일 복사(COPY 명령)
~~~ dockerfile
    COPY <호스트의 파일 경로> <Docker 이미지의 파일 경로>
~~~
- 이미지에 호스트상의 파일이나 디렉토리를 복사할 때 사용한다. 
- ADD 명령과 비슷하다. 하지만 ADD 명령은 원격 파일의 다운로드나 아카이브의 압축 해제 등과 같은 기능을 갖고 있지만, COPY 명령은 호스트상의 파일을 이미지 안으로 **복사하는** 처리만 한다. 
이 때문에 단순이 이미지 안에 파일을 배치하기만 하고 싶을 때는 COPY 명령을 사용한다. 
- **Dockerfile로부터 이미지를 만들 때 docker build 명령은 Dockerfile을 포함하는 디렉토리(서브디렉토리를 포함한다)를 모두 Docker 데몬으로 전송한다. 그래서 Dockerfile의 
저장 위치는 빈 디렉토리를 만들고 거기에 Dockerfile을 놓아두고 이미지를 작성하는 방법을 권장한다.**

### 볼륨 마운트(VOLUME 명령)
~~~ dockerfile
    VOLUME ["/마운트 포인트"]
~~~
- 이미지에 볼률을 할당할 때 사용한다. 
- 지정한 이름의 마운트 포인트를 작성하고, 호스트나 그 외 다른 컨테이너로부터 볼륨의 외부 마운트를 수행한다.
- 컨테이너는 영구 데이터를 저장하는 데는 적합하지 않다. 그래서 영구 저장이 필요한 데이터는 컨테이너 밖의 스토리지에 저장하는 것이 좋다. 
- 영구 데이터는 Docker의 호스트 머신상의 볼륨에 마운트하거나 공유 스토리지를 볼륨으로 마운트 하는 것이 가능하다. 
