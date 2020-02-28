---
layout : post
title : postgresql & postgis 설치하기
date : 2020-02-27
excerpt : "ubuntu 18.04 버전에서 기존 postgres삭제하고  postgresql11 & postgis3.0설치하기"
tags: [postgresql]
categories: [DataBase]
comments: true
changefreq : daily
---

#### 1. 기존에 설치된 postgresql 삭제 
- 기존 패키지가 깨끗하게 지워지지 않아서 dpkg를 이용해서 삭제했다. --purge 옵션으로 깨끗하게 삭제가 가능하다. 
- 먼저 설치된 postgres 관련 항목들을 찾는다. 
~~~ shell
    dpkg -l | grep postgresql
~~~
- 검색되는 항목들을 모두 삭제한다. 내 경우에는 11, 12가 꼬여서 설치되서 일단 다 지우고 다시 설치하기로 했다. 
~~~ shell
    sudo apt-get --purge remove postgresql-11 postgresql-11-postgis-2.5 postgresql-11-postgis-2.5-scripts postgresql-12 postgresql-12-postgis-3 postgresql-12-postgis-3-scripts postgresql-client-11 postgresql-client-12 postgresql-client-common postgresql-common
~~~
- 삭제 후 다시 검색해서 설치된 패키지가 있는지 확인하고, 남아있는 폴더들을 삭제한다. 
- 


