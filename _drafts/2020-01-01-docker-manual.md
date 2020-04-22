---
layout : post
title : docker 시작하기 
date : 2020-01-01
excerpt : "docker 를 활용한 환경 구축 방법에 대한 정리                    "
tags: [docker]
categories: [Server]
comments: true
changefreq : daily
---

## docker image, container 
- image : 필요한 프로그램, 라이브러리, 소스 등을 설치한 뒤에 이를 파일로 만든 것이다.
- container : 이미지가 실행된 상태가 컨테이너(Container) 이다. 운영체제로 본다면 이미지는 일종의 실행파일, 컨테이너는 프로세스와 유사한 개념이다.

## docker 상태 확인 
- 버전 확인 : docker 의 버전이나 go 언어의 버전, OS, 아키텍처를 확인 할 수 있다. 
~~~ cmd
    docker version
~~~
- 실행 환경 확인 : docker 실행 환경의 상세 설정 표시(컨테이너 수, docker 버전, 스토리지 드라이버 종류, OS 종류, 아키텍처 등)
~~~ cmd
    docker system info
~~~
- 디스크 이용 상황 : 상세 내용을 확인할 때는 --v 옵션을 지정한다. 
~~~ cmd
    docker system df 
~~~

## docker 이미지 조작 
- 이미지 다운로드 : docker image pull [옵션] 이미지명[:태그명]
    - 태그명을 생락하면 최신판(latest)을 취득한다.
    ~~~ cmd
        docker image pull centos:7
    ~~~ 
    - -a 옵션을 지정하면 모든 태그를 취득 할 수 있다. 또한 -a 옵션을 지정할 때는 docker 이미지명에 태그를 지정할 수 없다.
    ~~~ cmd
        docker image pull -a centos
    ~~~
    - 이미지명에 취득할 url 을 지정할 수도 있다. url 은 프로토콜(https://)을 제외하고 지정한다.
- 이미지 목록 표시
~~~ cmd
    docker image ls [옵션] [리포지토리명]
~~~

    - 지정 할 수 있는 주요 옵션
      
        |옵션|설명|
        |:---|:---|
        |-all, -a|모든 이미지를 표시|
        |\--digests|다이제스트(이미지를 고유하게 식별하기 위한값)를 표시할지 말지|
        |\--no-trunc|결과를 모두 표시|
        |\--quiet, -q|docker 이미지 ID만 표시|
        
- 이미지 상세 정보 확인 : 이미지 ID, 작성일, docker 버전, cpu 아키텍처 등을 JSON 형태로 표시한다. 
~~~ cmd
    docker image inspect <이미지명>
~~~
- 이미지 태그 설정 : **docker hub 에 등록하기 위해서는 <사용자명/repository명:태그명> 과 같은 명명 규칙을 사용해야 한다.**
~~~ cmd
    docker image tag <원본이미지명> <변경할이미지명:태그명>
~~~
- 이미지 검색 : docker hub 에 공개되어 있는 이미지를 검색한다. 
~~~ cmd
    docker search [옵션] <검색 키워드>
~~~

    - 지정할 수 있는 주요 옵션 
    
        |옵션|설명|
        |:---|:---|
        |\--no-trunc|결과를 모두 표시|
        |\--limit n|n건의 검색 결과를 표시|
        |\--filter=stars=n|즐겨찾기의 수(n 이상)를 지정|

- 이미지 삭제 
~~~ cmd
    docker image rm [옵션] 이미지명 [이미지명] 
~~~
    
    - 지정할 수 있는 주요 옵션 
        
        |옵션|설명|
        |:---|:---|
        |\--force, -f|이미지를 강제로 삭제|
        |\--no-prune|중간 이미지를 삭제하지 않음|
            
- 사용하지 않는 이미지 삭제 
~~~ cmd
    docker image prune [옵션]
~~~
    
    - 지정할 수 있는 주요 옵션 
            
        |옵션|설명|
        |:---|:---|
        |\--all, -a|사용하지 않는 이미지를 모두 삭제|
        |\--force, -f|이미지를 강제로 삭제|
        
- docker hub 에 로그인 
~~~ cmd
    docker login [옵션] [서버]
~~~

    - 지정할 수 있는 주요 옵션 
                
        |옵션|설명|
        |:---|:---|
        |\--password, -p|비밀번호|
        |\--username, -u|사용자명|
        
- 이미지 업로드 : **업로드 하는 이미지명은 유저명/repository:태그명 이어야 하고, repository 는 docker hub 에서 생성해 주어야 한다.** 태그명이 없을 경우 latest 버전으로 업로드 된다.
~~~ cmd
    docker image push 이미지명[:태그명]
~~~ 
    
## docker 컨테이너 생성 / 시작 / 정지 
  
  

