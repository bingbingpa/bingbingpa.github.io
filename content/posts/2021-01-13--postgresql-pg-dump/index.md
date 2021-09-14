---
title : PostgreSQL pg_dump
category: "database"
author: bingbingpa
---

#### 특정 테이블을 insert sql 로 덤프
~~~ shell
pg_dump -U [계정명] -p [포트번호] -t [테이블명] -a -O --inserts -E UTF8 [데이터베이스명] > dump.sql
~~~
- 로컬에 있는 postgres 를 덤프할 경우 포트 번호는 생략해도 된다.
- 만약 원격에 있는 postgres 를 덤프할 경우 원격의 postgres 와 pg_dump 를 실행하는 클라이언트의 postgres 버전이 맞이 않을 경우 pg_dump 가 되지 않을 수도 있다.

#### 여러 테이블을 insert sql 로 덤프
~~~ shell
pg_dump -U [계정명] -p [포트번호] -t [테이블명1] -t [테이블명2] -t [테이블명3] -a -O --inserts -E UTF8 [데이터베이스명] > dump.sql
~~~
- **-t 옵션을 빼면 database 전체가 덤프된다.**
- option 참고

  |옵션|설명|
  |:---|:---|
  |-U, --username=NAME|database 에 연결할 사용자|
  |-t, --table=TABLE|dump 대상 table(s)|
  |-a, --data-only|sql schema 를 제외한 데이터만 덤프|
  |-O, --no-owner|일반 텍스트 형식 테이블 owner skip|
  |--inserts|insert 명령으로 덤프|
  |-E, --encoding=ENCODING|덤프 데이터 인코딩 설정|
