---
layout : post
title : centos8 postgresql12&postgis 설치하기  
date : 2020-04-26
excerpt : "docker 로 centos8 container 에 postgresql12&postgis 설치 하기"
tags: [postgresql, centos]
categories: [DataBase]
comments: true
changefreq : daily
---
- centos 최신 이미지 pull 
~~~ bash
    docker image pull centos
~~~
- container 생성 
    - systemctl 을 사용하기 위해서는 privileged 옵션을 사용해야 하고 실행 커맨드는 /sbin/init 를 사용한다. privileged 옵션을 사용하는 것이 보안에는 취약하다고 하지만 개발 환경을 하나의 컨테이너에 담아서 쓰기 위해서 일단 이렇게... 
~~~ bash
    docker container run --privileged  -d -p 15432:5432  --name "postgres" centos /sbin/init
~~~     
- 컨테이너 접속? 
~~~ bash
    docker exec -it postgres /bin/bash
~~~
- 업데이트 : centos8 부터는 yum 대신 dnf를 사용한다. 
~~~ bash
    dnf -y update
~~~
- centos docker 컨테이너에서 clear가 안되서 가능하도록 패키지 설치 
~~~ bash
    dnf install ncurses
~~~
- 저장소 추가 후 postgresql 설치   
~~~ bash
    dnf -y install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm 
~~~
~~~ bash
    dnf -y module disable postgresql
~~~
~~~ bash
    dnf -y install postgresql12 postgresql12-server
~~~
~~~ bash
    dnf -y install epel-release yum-utils
~~~
~~~ bash
    dnf config-manager --enable pgdg12
~~~
- db init : 필요에 따라 initdb 할 때 인코딩과 data 경로를 설정 할 수도 있다.  
~~~ bash
    /usr/pgsql-12/bin/postgresql-12-setup initdb
~~~
- container 시작 시 자동 시작 되도록 설정 
~~~ bash
    systemctl enable postgresql-12
~~~
~~~ bash
    systemctl start postgresql-12
~~~
- postgis 설치 
~~~ bash
    dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
~~~
~~~ bash
    dnf config-manager --set-enabled PowerTools
~~~
~~~ bash
    dnf -y install postgis30_12
~~~
- 설치 후 postgres 로 사용자 변경후 psql 로 접속해서 postgis 가 정상 설치되는지 확인 
~~~ bash
    su posgres
    psql -U postgres 
~~~
~~~ sql
    create extension postgis;
~~~
