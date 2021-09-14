---
title : postgresql pg-dump
category: "database"
author: bingbingpa
---

##  postgresql 백업하기!

- 같은 버전의 DB 같은 경우에는 pg_dump로 손쉽게 sql 파일로 백업이 가능
~~~ sql
pg-dump "DB명" > "백업파일명".sql
~~~
- 특정 테이블만 백업할 경우에는 -t 옵션을 사용하고 원격 서버의 DB를 백업할 경우에는 -h 옵션을 사용하고 원격서버 ip를 입력한다.
- 나같은 경우에는 접속한 DB서버와 원격 DB서버의 버전이 달라서 copy 명령을 통해 csv파일로 복사 후에 해당 파일을 import 했다.
- psql -h "원격서버IP" -U "유저명" 으로 접속 후 패스워드 입력!
~~~ sql
\copy ("SELECT QUERY") to "/저장할 경로.csv" CSV HEADER;
~~~
- 이렇게 하면 쿼리 결과가 해당 경로에 csv 파일로 떨어지고 해당 파일을 import 할 수 있다.
- 참고로 **postgresql에서는 select * from information_schema.columns where table_name='테이블명';** 쿼리로 해당 테이블의 스키마를 조회 할 수 있다.
- **[참고]** psql에서 \t를 하면 쿼리 결과를 보기 좋다.


