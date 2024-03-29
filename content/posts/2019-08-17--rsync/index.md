---
title : rsync를 이용한 파일 동기화
category: "infra"
author: bingbingpa
---



## 1. ssh 설정

- rsync를 통한 파일 동기화를 스케줄을 실행해 같은 시간에 반복적으로 돌릴 경우 원격 서버 접속시 패스워드를 묻게 되므로 ssh key를 설정하여 스케줄을 실행 할 때 패스워드를 사용하지 않고 접속하도록 설정한다.
~~~ shell
$ ssh-keygen
~~~
- 입력창에 엔터를 쳐서 key를 생성하고 생성된 key를 동기화에 사용할 서버에 카피한다.
~~~ shell
$ ssh-copy-id -i id_rsa.pub "원격접속계정"@"원격접속IP"
~~~
- ssh의 커넥션 시간을 설정한다.
~~~ shell
  <Master>
  $ sudo vi /etc/ssh/ssh_config
  Host *
      ServerAliveInterval 60
      ServerAliveCountMax 6

  <Slave(동기화할 원격서버)>
  $ sudo vi /etc/ssh/ssh_config
  Host *
      ClientAliveInterval 60
      ClientAliveCountMax 6
~~~
- 원격 서버에 ssh로 접속해서 패스워드를 묻지 않고 바로 접속이 되는지 테스트 해본다.
~~~ shell
$ ssh "원격접속계정"@"원격접속IP"
~~~

## 2. rsync 설치

- master 서버와 slave 서버에 모두 rsync를 설치 한다.
~~~ shell
$ sudo yum install rsync
$ sudo service rsyncd start
~~~
- master/slave 모두 정상적으로 rsync 데몬이 실행중인지 status를 확인 한다(sudo service rsyncd status)

## 3. 네트워크 대역폭 확인

- rsync로 파일 동기화시에 네트워크 대역폭을 설정하지 않으면 전송되는 파일의 크기가 클 경우 rsync가 많은 네트워크 대역을 사용하기 때문에 다른 서비스에 영향을 줄 수 있기 때문에 네트워크 대역폭을 확인하고 적절하게 네트워크 대역의 limit를 설정한다.
- 임의의 파일을 하나 생성하고 rsync로 원격 서버에 동기화 하는 시간을 살펴본다.
- 파일 전송에 걸리는 초당 시간을 확인하고 rsync의 전송 네트워크 대역폭을 설정한다.
~~~ shell
$ dd if=/dev/zero of="파일명" count=1024000 bs=1024
$ time rsync -v "생성한파일" "원격접속계정"@"원격 서버":"파일생성위치"
~~~

## 4. 스케줄링

- crontab을 이용하여 매일 같은 시간에 동기화가 되도록 설정한다.
~~~ shell
    　* * * * * "실행할 커맨드"
~~~
- 각각 분, 시간, 일, 월, 요일을 의미하며 개행을 하지 않고 한줄에 모두 써야 한다.
- |Field|Description|Allowed Value|
|:---:|:---:|:---:|
|MIN|Minute field|0 to 59|
|HOUR|Hour field|0 to 23|
|DOM|Day of Month|1-31|
|MON|Month field|1-12|
|DOW|Day Of Week|0-6|
|CMD|Command|Any command to be executed.|
- crontab -e 를 커맨드창에 입력하여 입력창이 나오면 아래와 같이 설정한다.
~~~ shell
$ crontab -e
　* 00 * * * rsync -avz --delete --bwlimit="네트워크대역폭" --log-file="로그파일위치" "master동기화경로" "원격접속계정"@"원격접속IP":"slave동기화경로"
~~~
~~~ shell
:wq(저장)
~~~
- 위에 설정한 내용은 다음과 같다. 매일 00시에 해당 커맨드를 실행하여 master와 slave의 디렉토리를 동기화하고 로그파일은 지정한 위치에 생성되고 bwlimit옵션에 설정한 네트워크 대역폭으로 해당 파일들을 전송하며, --delete옵션에 의해 mater에서 삭제된 파일은 slave에서 삭제되게 된다.
