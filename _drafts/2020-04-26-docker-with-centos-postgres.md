---
layout : post
title : centos8 & postgresql12&postgis 설치하기  
date : 2020-04-26
excerpt : "docker 로 centos8 container 에 postgresql12&postgis 설치 하기"
tags: [intellij]
categories: [IDE]
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
- 컨테이너 bash 
~~~ bash
    docker exec -it postgres /bin/bash
~~~
- 업데이트 : centos8 부터는 yum 대신 dnf를 사용한다. 
~~~ bash
    dnf update
~~~
- 저장소 추가 후 postgresql 설치   
~~~ bash
    yum -y install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm 
~~~
~~~ bash
    dnf -qy module disable postgresql
~~~
~~~ bash
    dnf -y install postgresql12 postgresql12-server
~~~
~~~ bash
    /usr/pgsql-12/bin/postgresql-12-setup initdb
~~~
- postgis 설치 
~~~ bash
    dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
~~~
~~~ bash
    dnf config-manager --set-enabled PowerTools
~~~
~~~ bash
    dnf install postgis30_12
~~~
