---
layout : post
title : postgreSQL 고가용성
date : 2020-05-31
excerpt : "postgreSQL 12 공식 문서 postgreSQL High Availability, Load Balancing, and Replication"
tags: [postgres, replication, high Availability, Load Balancing, 고가용성]
categories: [Database]
comments: true
changefreq : daily
---

### 1. 정의 
- 고가용성(HA, High Availability)이란 서버와 네트워크, 프로그램 등의 정보 시스템이 상당히 오랜 기간 동안 지속적으로 정상 운영이 가능한 성질을 말한다.
- **데이터를 수정할 수있는 서버**를 read/writer, **master**, primary server 라고 한다. 
- **master 의 변경 사항을 추적 하는 서버**를 **standby**, secondary server 라고 한다. 
- **마스터 서버로 승격 될 때까지 연결할 수없는 대기 서버를 warm standby server 라고 하며, 연결을 허용 하고 읽기 전용 쿼리를 제공 하는 서버를 hot standby server 라고 한다.**
- 일부 솔루션은 동기식이므로 모든 서버가 트랜잭션을 커밋 할 때까지 데이터 수정 트랜잭션이 커밋 된 것으로 간주되지 않는다. 이렇게하면 장애 조치 (failover)시 데이터를 잃지 않고 모든 부하 분산 서버가 쿼리 한 서버에 상관없이 일관된 결과를 반환한다. 
- 반대로 비동기 솔루션을 사용하면 커밋 시간과 다른 서버로의 전파 사이에 약간의 지연이 발생하여 백업 서버로 전환 할 때 일부 트랜잭션이 손실 될 수 있으며, 로드 밸런싱 된 서버가 약간 오래된 결과를 반환 할 수 있습니다. 비동기 통신은 동기화가 너무 느릴 때 사용된다.

### 2. 여러 해결 기법 비교
- Shared Disk Failover
    - 하나의 디스크에 여러개의 Postgres 인스턴스를 사용하며, master 서버가 망가지면 대기하던 서버가 해당 디스크를 마운트해서 사용한다. 
    - master 서버가 실행 중일 때 대기 서버가 공유 스토리지에 절대 액세스하지 않아야 한다.
    - **고가의 SAN 스토리지를 사용 하거나 그보다 좀 저렴한 iscsi 스토리지를 사용한다.** 
    - **NAS 기반 nfs 파일 시스템을 데이터 저장 공간으로는 절대로 사용하지 않는 것이 관례이다.** nfs 파일 시스템은 잦은 읽기 쓰기 환경에서는 속도와 안전성을 보장하지 않기 때문이다.
     
- File System(Block Device) Replication
    - 파일 시스템 레벨의 복제
    - standby 서버에 대한 write 는 master 서버와 동일한 순서대로 수행 되어야 한다.  
    - 주로 DRBD(Distributed Replication Block Device) 라는 Linux 용 파일 시스템 복제 솔루션을 사용한다.

- Write-Ahead Log Shipping
    - WAL : 데이터 무결성을 보장하는 표준 방법이며, 데이터베이스의 변경 내용을 기록하는 파일이다. wal 파일은 pg_waldump 명령어로 읽을 수 있다. 
    - <img src="/static/img/postgresHighAvailability/wla-file.png"> 
    - **WAL(트랜잭션 로그)를 스트리밍이나 파일 기반으로 전달해서 standby 서버를 동기화 한다.** 
    - **standby 서버를 hot standby server(읽기 전용 쿼리를 제공 하는 서버)로 만들어 추가적으로 활용 할 수 있다.**
    - WAL file log shipping : WAL 파일 자체를 standby 서버로 전송한다.(file copy) 
        - master 서버에 지정된 WAL 파일의 크기를 다 채워야 standby 서버로 전송이 일어나기 때문에, 만약 WAL 파일을 다 채우지 못한 상태에서 master 서버에 장애가 발생하면 WAL 파일을 다 채우지 못해서 전달되지 못한 로그는 유실된다. 
    - streaming log shipping : WAL 파일 저장 여부와 관계 없이 로그 내용을 standby 서버로 직접 전달한다.
        - master, standby 서버간의 네트워크에 문제가 없다는 가정하에 거의 실시간으로 동작한다.
        - wal_keep_segements 값에 따라 WAL 파일의 저장 개수가 정해지는데, standby 서버에 장애가 발생할 경우 만약 이 값이 32라면 master 서버에서 33번째 WAL을 쓰기 시작하면 1번째 파일은 유실되고, standby 서버가 다시 동작하더라도 데이터를 동기화 하는 방법은 다시 구축하는 방법 밖에는 없다.
        - 위와 같은 상황을 방지하기 위해서 standby 서버로 보낼 WAL 파일을 그냥 버리지 않고, 별도의 공간에 저장 후 standby 서버에 장애가 발생했을 경우에 [restore command](https://www.postgresql.org/docs/12/runtime-config-wal.html#GUC-RESTORE-COMMAND) 를 사용하여 복구 할 수 있다. 단, 별도의 저장공간이 필요하다.    

- Logical Replication
    - 변경된 데이터를 스트림으로 다른 서버로 보내며, 테이블 단위로 리플리케이션 될 수도 있다.
    - **N : N 의 구독자(subscribers) 와 게시자(publishers) 모델을 사용한다.** 
    - 일반적으로 게시자 데이터의 스냅샷을 만들어서 구독자에게 복사하는 것으로 리플리케이션이 시작되고 게시자의 변경 내용이 실시간으로 구독자에게 전송되어 게시자와 동일한 순서로 데이터를 적용한다.
    - 활용 사례
        - N 대의 서버가 게시자가 되고 1대의 서버가 구독자가 되어 여러 서버의 정보를 하나의 서버로 모아서 분석 목적으로 사용.
        - 논리적인 형태의 복제이기 때문에 다른 플랫폼 postgres 인스턴스간의 복제(Linux -> Windows) 가능.
    - 구독자가 읽기 전용으로 사용되는 경우 충돌이 발생하지 않지만, 구독자가 동일한 테이블에 대한 쓰기를 수행하면 충돌이 발생할 수 있다.
    
- Trigger-Based Master-Standby Replication
    - 데이터 변경을 주 서버가 받아서 처리하고 비동기적으로 복제 서버에 보낸다.
    - 테이블 단위로 컨트롤 가능
    - master 서버가 실행중인 동안 standby 서버는 hot standby 서버로 읽기 전용 조회에 응답 할 수 있고 여러 대의 standby 서버를 지원한다.
    - 대기 서버를 비동기식으로 (일괄 적으로) 업데이트 하므로 장애 조치 중에 데이터가 손실 될 수 있다.
    - DDL replication 은 지원하지 않는다.
    
- Statement-Based Replication Middleware
    - <img src="/static/img/postgresHighAvailability/pg-pool.png">
    - **미들웨어 프로그램이 모든 SQL 쿼리를 가로 채서 하나 또는 모든 서버로 보내며, 각 서버는 독립적으로 작동한다.**
    - 모든 서버가 변경 사항을 수신 할 수 있도록 읽기 / 쓰기 쿼리를 모든 서버로 보낸다. 
    - 읽기 전용 쿼리는 단 하나의 서버로 전송해서 서버간 부하를 줄일 수 있다.
    - 각 서버는 독립적으로 작동 하기 때문에 브로드 캐스트 시 random(), CURRENT_TIMESTAMP, sequence 와 같은 값은 각 서버마다 다를 수 있다. 
    - 모든 서버의 값을 동일하게 갖기 위한 방법1    
        - 어플리케이션이 단일 서버에서 값을 조회해서 쓰기에 사용한다.
    - 모든 서버의 값을 동일하게 갖기 위한 방법2
        - 미들웨어는 데이터 수정 쿼리만 master 서버로 전송하고, 미들웨어가 아닌 일반적인 마스터 대기 복제를 통해 대기 서버로 전파한다.
    - **주의 사항** 
        - **한 서버에서 트랜잭션이 시작되어 커밋 되었다면, 다른 모든 서버에서도 모두 커밋되어야 그 트랜잭션이 유효하다고 처리되어야한다.** 
        - **특정 서버에서 롤백된다면, 그 트랜잭션은 모든 서버에서 롤백되어야한다.** 
        - 이것을 구현하기 위해서는 미들웨어가 2중 커밋(two-phase commit)을 이용한다.(postgreSQL의 PREPARE TRANSACTION, COMMIT PREPARED 명령)    
    - Pgpool-II 및 Continuous 텅스텐 은 이러한 유형의 복제에 해당한다.
    
- Asynchronous Multimaster Replication
    - 비동기 멀티 마스터 복제는 시간차를 두고 서로 통신하게 된다. 
    - 데이터가 충돌이 나면 사용자가 해결 할 수 있는 방법을 제공하거나, 충돌 해결 정책에 따라 자동으로 해결 할 수 있는 기능이 있어야 한다.
    - Bucardo 라는 제품이 있다.
    
- Synchronous Multimaster Replication
    - 동기식으로 작업하기 때문에 자료 변경이 빈번한 환경이라면, 단독 운영 서버 환경 보다 성능이 더 떨어질 수 있다.
    - PostgreSQL에서는 이 방식의 복제 기능은 제공하지 않는다.
    
 - **기능 비교 표**
<img src="/static/img/postgresHighAvailability/table.png">

### 3. Write-Ahead Log Shipping 
- PostgreSQL Streaming Replication 은 기본이 비동기 방식이다.
- 동기식 복제 방식은 하나의 트랜잭션을 하나 이상의 standby 서버에 반영하고, 그 결과를 master 서버가 확인하는 방식이며, master, standby 서버 모두 트랜잭션이 트랜잭션 로그 파일에 기록 되었을 경우에만 정상처리 되었다고 판단한다.
- 동기식 복제 방식은 자료의 안정성을 제공하지만, standby 서버의 작업 완료 응답을 확인하는 작업까지 포함하므로 그 만큼의 지연시간이 생길 수 밖에 없다. 
- 기본적인 WAL 파일을 이용한 복제는 다음과 같은 방식으로 동작하며, 본 글에서는 기본적인 streaming replication 을 설정하는 방법에 대해서만 다룬다.  
<img src="/static/img/postgresHighAvailability/wal-log-shipping.png">

#### 3.1. postgresql 9.6 / 12 차이점 비교 
- <img src="/static/img/postgresHighAvailability/change-list.png"> 

#### 3.2. docker container 생성
- 아래부터 진행되는 모든 과정은 docker container 환경에서 테스트를 진행한다. 테스트에 사용한 이미지는 centos8.1 이미지에 postgresql12.3 을 설치하여 테스트 하였다.
- master container 생성
~~~ bash
    docker container run --privileged -d -p 25432:5432 --name "master" gaia3d/mago3d-postgresql /sbin/init
~~~
- slave container 생성 
~~~ bash
    docker container run --privileged -d -p 25433:5432 --name "slave" gaia3d/mago3d-postgresql /sbin/init
~~~
- container에 연결 하기
~~~ bash
    docker exec -it master bash
~~~

#### 3.3. master 서버 설정 
- master 서버의 설정은 크게 replication role 을 가진 유저를 생성하고, standby 서버가 master 서버에 접근하기 위한 보안 설정과 replication을 위한 설정 3가지로 나눌 수 있다.  
- replicator 역할의 유저 생성
    ~~~ bash
        su postgres 
        psql -U postgres
    ~~~ 
    ~~~ sql
        CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'secret';
    ~~~
    - user가 정상적으로 생성되었는지 확인(\du)
    <img src="/static/img/postgresHighAvailability/user-list.png">
    
- pg.hba.conf 설정 
    - type / database / user / address / method(인증방식) 을 작성 후 저장후 postgresql 을 재시작한다.
    - **address 는 standby 서버의 ip 를 작성하도록 한다.**
    - docker 를 사용해서 테스트 할 경우 container 의 ip 를 작성하도록 한다.  
    ~~~ bash
        host    replication     replicator      standbyIP/32             md5
    ~~~
    ~~~ bash
        systemctl restart postgresql-12
    ~~~

- postgresql.conf 설정
    - wal_level(enum)
        - WAL 파일에 기록되는 정보의 양을 결정한다. 기본값은 replica 로 WAL 아카이빙(archive mode) 및 streaming replication 을 위해서는 replica 이상을 사용해야 한다. 
        - 9.6 이전 버전에서는 archive, hot_standby 두 값을 쓸 수 있었으며, 12버전에서는 이 설정값을 사용 시 모두 replica로 처리 된다. 
    - max_wal_senders(integer)
        - standby 서버 또는 streaming 기본 백업 클라이언트로부터의 최대 동시 연결수를 지정한다. (기본값 : 10)
        - 이 값이 0일 경우는 replication 이 비활성화 된다.
        - 일반적으로 standby 서버의 개수 +1 개로 설정한다.  
    - wal_keep_segments(integer)
        - standby 서버가 streaming replication을 위해 과거 로그 파일을 가져와야 하는 경우 pg_wal 디렉토리에 저장되는 과거 로그 파일 세그먼트의 최소 수를 지정하며, 각 세그먼트는 일반적으로 16MB 이다.
        - wal segment 가 너무 빨리 갱신 되어 빠른 속도로 사라지게 되고, standby 서버에 기록되는 wal segment 가 master 서버의 wal 갱신 속도를 따라가지 못하면 replication이 중단 된다. 
    - wal_sender_timeout(integer)
        - 지정된 시간 이상 작동되지 않은 복제 연결이 중단 된다. 기본값은 60초이고, 0일 경우 비활성화 된다.
    ~~~ bash
        wal_level = replica
        max_wal_senders = 2
        wal_keep_segments = 32
        wal_sender_timeout = 60s
    ~~~
    - 설정 파일 저장후 pg 재시작 
    ~~~
        systemctl restart postgresql-12
    ~~~
      
#### 3.4 Standby 서버 설정 
- pg_basebackup 으로 master db 를 복사할때 옵션을 사용해서 자동으로 replication 설정을 할 수 있다. **ip 는 master 의 ip를 써준다.**
- -D : 복사할 data 경로를 지정한다. (postgresql data 파일 경로로 지정해야 한다.)
- -Xs : wal 파일을 stream 방식으로 쓴다. 
- -P : 진행사항을 표시한다.
- **-R : replication 을 위한 설정을 적용한다.**  
~~~ bash
    pg_basebackup -h masterIP -U replicator -p 5432 -D /pg_data -Xs -P -R
~~~
- root 계정으로 복사 했으므로 data 경로의 권한은 postgres로 변경해준다. 
~~~ bash
    chown -R postgres:postgres /pg_data
~~~
- standby 서버 실행 
~~~ bash
    systemctl start postgresql-12
~~~
- data 폴더에 standby.signal 파일이 있는지와 postgresql.auto.conf 파일에 master 의 정보가 정상적으로 작성되었는지 확인한다. 
    - <img src="/static/img/postgresHighAvailability/standby-signal.png">

#### 3.5 테스트 
- 테스트는 master 에 테이블을 하나 생성하고 insert 쿼리 후 standby 서버에 정상적으로 반영이 되는지 확인한다. 
- master
    ~~~ bash
        su postgres
        psql -U postgres
    ~~~ 
    ~~~ sql
        CREATE TABLE test (id serial, name character varying);
        INSERT INTO test (name) VALUES ('tester');
    ~~~
- standby 
    - **postgres 9.6 의 경우는 postgresql.conf 파일의 hot_standby 기본 옵션이 'off' 로 되어 있어 psql 사용이 불가능하다. 해당 옵션을 on으로 변경후 pg를 재시작후 테스트를 하도록 한다.** 
    ~~~ bash
        su postgres
        psql -U postgres
    ~~~ 
    ~~~ sql
        SELECT * FROM test;
    ~~~

#### 3.6. 모니터링
- master 에서는 walsender 가 standby 에서는 walreceiver 가 잘 실행되고 있는지 확인한다.
~~~ bash
    ps -ef | grep wal
~~~ 
- <img src="/static/img/postgresHighAvailability/wal-check.png">
- master 에서는 pg_stat_replication 을 standby 에서는 pg_stat_wal_receiver view를 각각 psql로 조회해본다.
- <img src="/static/img/postgresHighAvailability/pg-stat.png"> 
- master 서버에서 select pg_current_wal_lsn(); 쿼리 결과의 값이 pg_stat_replication view 를 조회한 값중 sent_lsn 값과 차이가 많이 나면
 master 서버가 부하가 많이 걸리거나 네트워크 상황이 좋지 않은 경우이고, standby 서버에서 select pg_last_wal_receive_lsn();
 쿼리 결과의 값이 sent_lsn 값과 차이가 많이 나면 standby 서버가 부하가 많이 걸리거나 네트워크 상황이 좋지 않은 경우이다.    
    

### 4. 장애 처리 
- streaming replication 은 수동으로 standby 서버를 master 서버로 승격시켜주고 연결된 application 의 db 접속 정보를 변경해 주어야 한다. 자동 장애 처리를 위해서는 pg-pool2 와 같은 미들웨어를 사용해야 한다. 
- standby 서버 master 서버로 승격 
    - **pg_ctl promote** 호출하거나 postgresql.conf 파일에 **promote_trigger_file** 파일을 작성하면 된다. 
    ~~~ bash
        su postgres
        ./usr/pgsql-12/bin/pg_ctl promote -D /pg_data/
    ~~~
    - data 경로에 standby.siganl 파일이 사라졌는지 확인한다. 
- 새로운 master 서버 pg_hba.conf 파일 수정
    - 장애 서버에서 새로운 master 서버의 데이터를 복사하기 위해 장애 서버의 접근을 허용해준다. 
    ~~~ bash
        host    replication     replicator      장애서버IP/32             md5
    ~~~
    ~~~ bash
        systemctl restart postgresql-12
    ~~~
    
- 장애 서버 standby 서버로 변경 
    - 기존 데이터 디렉토리를 백업하고 pg_basebackup 으로 새로운 master 서버의 DB를 복사한다. 
    ~~~ bash
        mv /pg_data /pg_backup
        pg_basebackup -h 새로운masterIP -U replicator -p 5432 -D /pg_data  -Xs -P -R
    ~~~
    - postgresql 시작 
    ~~~ bash
        systemctl restart postgresql-12
    ~~~
3.5 테스트과정을 반복한다. 

