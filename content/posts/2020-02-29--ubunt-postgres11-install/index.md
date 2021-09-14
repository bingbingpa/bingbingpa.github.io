---
title : postgresql & postgis 설치하기
category: "database"
author: bingbingpa
---

#### 1. 기존에 설치된 postgresql 삭제
- 기존 패키지가 깨끗하게 지워지지 않아서 dpkg를 이용해서 삭제했다. --purge 옵션으로 깨끗하게 삭제가 가능하다.
- 먼저 설치된 postgres 관련 항목들을 찾는다.
~~~shell
dpkg -l | grep postgresql
~~~
- 검색되는 항목들을 모두 삭제한다. 내 경우에는 11, 12가 꼬여서 설치되서 일단 다 지우고 다시 설치하기로 했다.
~~~shell
apt --purge remove postgresql-11 postgresql-11-postgis-2.5 postgresql-11-postgis-2.5-scripts postgresql-12 postgresql-12-postgis-3 postgresql-12-postgis-3-scripts postgresql-client-11 postgresql-client-12 postgresql-client-common postgresql-common
~~~
- 삭제 후 다시 검색해서 설치된 패키지가 있는지 확인하고, 남아있는 폴더들을 삭제한다.
- 우분투의 경우는 /var/lib/postgresql 아래에 해당 버전의 데이터 디렉토리가 생기고 /etc/postgresql/ 아래에 해당 버전의 설정 파일들이 생긴다.

#### 2. postgresql & postgis 설치하기
- 먼저 다음과 같이 postgresql 저장소를 추가해준다.
~~~ shell
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
~~~
- postgresql & postgis 설치하기
~~~shell
apt install -y postgresql-12
apt install -y postgresql-12-postgis-3
~~~
- 다음 명령어로 5432(postgresql 기본포트)로 정상적으로 실행되고 있는지 확인한다.
~~~shell
ss -tunelp | grep 5432
~~~

##### 3. 패스워드 변경 및 확인
- 원격에서 접속이 필요하다면 postgresql.conf파일에 listen_address를 변경해주고 특정 ip만 허용하고자 한다면 pg_hab.conf 파일을 변경하도록 한다. 일단 나는 로컬에서만 사용할거기 때문에 별도의 설정은 하지 않았다. 만약 설정 파일을 변경한다면 서비스를 재시작해줘야 적용된다.
- 초기 설치시 postgres계정의 패스워드가 설정되어 있지 않으므로 postgres 계정으로 변경후 psql로 들어가서 패스워드를 변경해준다.
~~~shell
psql -U postgres
~~~
~~~sql
alter user postgres with password 'postgres';
~~~
- 패스워드 변경후 pgadmin으로 접속 또는 psql로 접속하여 postgis를 설치한다. 설치된 버전이 apt로 설치한 버전이 맞는지 확인하고 data_directory로 확인해 본다.
~~~sql
create extension postgis();
select postgis_version();
show data_directory;
~~~
