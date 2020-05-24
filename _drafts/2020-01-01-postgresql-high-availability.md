---
layout : post
title : postgreSQL High Availability, Load Balancing, and Replication
date : 2020-01-01
excerpt : "postgreSQL 12 공식 문서 내용 정리                                    "
tags: [postgres, replication, high Availability, Load Balancing]
categories: [DataBase]
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
    - **WAL(트랜잭션 로그)를 스트리밍이나 파일 기반으로 전달해서 standby 서버를 동기화 한다.** 
    - **standby 서버를 hot standby server(읽기 전용 쿼리를 제공 하는 서버)로 만들어 추가적으로 활용 할 수 있다.**
    - WAL 파일은 9.6 기준 pg_xlog 폴더에, 12기준 pg_wal 폴더에 저장된다. 
    - WAL file log shipping : WAL 파일 자체를 standby 서버로 전송한다.(file copy) 
        - master 서버에 지정된 WAL 파일의 크기를 다 채워야 standby 서버로 전송이 일어나기 때문에, 만약 WAL 파일을 다 채우지 못한 상태에서 master 서버에 장애가 발생하면 WAL 파일을 다 채우지 못해서 전달되지 못한 로그는 유실된다. 
    - streaming log shipping : WAL 파일 저장 여부와 관계 없이 로그 내용을 standby 서버로 직접 전달한다.
        - master, standby 서버간의 네트워크에 문제가 없다는 가정하에 거의 실시간으로 동작한다.
        - wal_keep_segements 값에 따라 WAL 파일의 저장 개수가 정해지는데, standby 서버에 장애가 발생할 경우 만약 이 값이 32라면 master 서버에서 33번째 WAL을 쓰기 시작하면 1번째 파일은 유실되고, standby 서버가 다시 동작하더라도 데이터를 동기화 하는 방법은 다시 구축하는 방법 밖에는 없다.   

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
    - master 서버가 실행중인 동안 standby 서버는 hot standby 서버로 읽기 전용 조회에 응답 할 수 있고 여러 대의 standby 서버를 지한다.
    - 대기 서버를 비동기식으로 (일괄 적으로) 업데이트 하므로 장애 조치 중에 데이터가 손실 될 수 있다.
    
- Statement-Based Replication Middleware원
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
    - 데이터가 충돌이 나면 사용자가 해결 할 수 있는 방법을 제공하거나, 충돌 해결 정책에 따라 자동으로 해결 할 수 있는 기능이 있어야한다.
    - Bucardo 라는 제품이 있다.
    
- Synchronous Multimaster Replication
    - 동기식으로 작업하기 때문에 자료 변경이 빈번한 환경이라면, 단독 운영 서버 환경 보다 성능이 더 떨어질 수 있다.
    - PostgreSQL에서는 이 방식의 복제 기능은 제공하지 않는다.
    
 - **기능 비교 표**
<img src="/static/img/postgresHighAvailability/table.png">

### 3. Write-Ahead Log Shipping 

#### 3.1. master 서버 설정 
- 
