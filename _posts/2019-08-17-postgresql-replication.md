---
layout : post
title : postgreSQL Replication
date : 2019-08-17
excerpt : "postgreSQL Master / Slave 이중화 하기"
tags: [postgresql, replication, dbBackup]
categories: [DataBase]
comments: true
changefreq : daily
---



## 1. postgreSQL Replication? 
- PostgreSQL에는 여러가지 Replication 방법이 있는데 Master/Master의 이중화는 아직 써본적이 없어서 Master/Slave로 구성했던 Streaming Replication에 대해 기록하려고 한다. Streaming Replication은 WAL(Write  Ahead Log)를 전달해서 Replication을 Transaction Log Shipping 하는 방법중에 하나이다. WAL은 Databse 변경 사항만을 저장한 Log를 말하며, Transaction Log Shipping을 이용한 Replication은 양쪽 DB의 원본이 동일하게 출발하였다면 Primary DB Server에서 발생하는 변경사항을 기록한 WAL 파일들을 다른 DB Server에 순서에 맞춰 적용시키면 동일한 DB가 된다는 개념을 바탕으로 이루어 졌다. [참고사이트](https://browndwarf.tistory.com/4)

## 2. Master Server 설정 
### 2-1. Replication(복제)를 위한 user 생성
- Replication을 담당할 사용자 계정을 추가한다. 
~~~ shell
$ psql -U postgres 
~~~
~~~ sql
postgres=#  CREATE ROLE replicator WITH LOGIN REPLICATION;
~~~
- psql에서 **\du** 명령으로 유저가 정상적으로 등록 되었는지 확인 할 수 있다.
<img src="/static/img/replication/user.png">

### 2-2. 권한 설정 
- 생성한 replication user가 복제할 수 있게 권한을 부여하고 외부에서 접근 할 수 있도록 postgres.conf 파일과 pg_hba.conf 파일을 수정한다.
~~~shell
$ sudo su postgres
bash-4.2$ vi postgres.conf
    listen_address = ‘*’
~~~
~~~shell
bash-4.2$ vi pg_hba.conf
    host    replication replicator    “Slave IP”/32    trust
~~~

### 2-3. replication 관련 설정 
- postgres.conf 파일을 다시 한번 수정한다.
- wal_level : replication이 가능한 wal이 생성된다.
    - logical : hot_standby + WAL로부터 논리적 변경 집합을 사용하는 데 필요한 정보. WAL 볼륨이 증가하여 백업 서버가 많아 지면 성능이 저하된다고 한다.
    - hot_standby : archive + 백업서버의 읽기 전용 쿼리를 지원한다. 
- archive_mode : WAL archive 파일을 위한 디스크 확보가 어렵거나 DB의 유지 보수 점검이 어려울 경우에 off로 설정 할수도 있다. 단점으로는 슬레이브 DB의 데이터 갱신이 장시간 지연되었을 경우 그 이후 데이터 처리가 정확히 반영되지 못할 수도 있다. 마스터 DB와 동기화가 이뤄지지 않았을 경우에는 다시 마스터 DB의 복제를 해야 할 필요도 생긴다.
- max_wal_senders : 접속가능한 슬레이브의 접속수를 설정한다.( 슬레이브 수 + 1)
- wal_keep_segments : 리플리케이션용으로 남겨둘 WAL 파일의 수를 지정한다. (8~32가 적당)
~~~ shell
$ sudo su postgres
bash-4.2$ vi postgres.conf
    wal_level = hot_standby
    archive_mode = on
    max_wal_senders = 2
    wal_keep_segments = 32
    max_replication_slots = 2
~~~

### 2-4. Replication Slot생성
- Replication Slot을 생성하기 위해서는 위에서 변경된 postgresql.conf가 반영된 상태에서 postgreSQL을 재시작 후에 진행 하도록 한다. (sudo service postgresql-"버전" restart)
~~~ shell 
$ sudo su postgres
$ psql -U postgres 
~~~
~~~ sql
postgres=# SELECT * FROM pg_create_physical_replication_slot('replication_slot');
~~~
<img src="/static/img/replication/slot.png">

## 3. Slave Server 설정
### 3-1. Master DB 복사 
- Slave Server는 postgresql만 설치된 상태에서 진행 하도록 한다. 만약 설정할 db data폴더가 있다면 지우거나 백업 후 실행 하도록 한다.
- 복사하고자 하는 Master server 와 Slaver server 간의 포트를 열어주어야 한다.  
- pg_basebackup을 이용해서 DB를 복사하도록 하고 pg_basebackup과 data폴더 경로는 설치하는 환경에 맞게 바꿔주어야 한다. 
~~~ shell
$ sudo su postgres 
bash-4.2$ /usr/pgsql-9.6/bin/pg_basebackup -R -h “마스터IP” -D /data/pg_data/ -U replicator -v -P -xlog-method=stream
~~~

### 3-2. postgres.conf 설정 
- postgres.conf 파일을 수정한다. 
~~~ text 
listen_addresses = '*'
hot_standby = on 
hot_standby_feedback = on 
~~~

### 3-3. recovery.conf 설정 
- DB 복사후에 초기에는 recovery.conf 파일이 없으므로 복사한 postgres의 데이터 폴더에 파일을 생성한다. 
- **primary_slot_name은 Master server에서 설정한 slot name을 작성한다.**
~~~ text
standby_mode = 'on'
primary_conninfo = 'user=replicator host=”마스터IP” port=5432 sslmode=prefer sslcompression=1 krbsrvname=postgres'
primary_slot_name='replication_slot'
~~~

## 4. 설정 확인
- Standby Server의 PostgreSQL Service를 가동 시키면 위에서 설정한 설정 값에 의해 Streaming Replication이 동작하게 된다. 
- Master Server의 pg_stat_replication view를 확인해본다. 
<img src="/static/img/replication/view.png">
- systemctl로 service status를 조회해 본다. 
<img src="/static/img/replication/status.png">

## 5. Test 
- Master server에서 테이블을 하나 생성후 샘플 데이터를 넣고 Slave server에서 정상적으로 생기는지 확인한다 
    - Master Server 
    ~~~sql
      postgres=# CREATE TABLE test (id serial, name character varying);
      postgres=# INSERT INTO test (name) VALUES ('tester');
    ~~~
    - Slave server
    ~~~sql
      postgres=# SELECT * FROM test;
    ~~~

