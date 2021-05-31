---
layout : post
title : docker 시작하기 
date : 2020-04-23
excerpt : "docker 기본적인 사용 방법 정리"
tags: [docker]
categories: [Infra]
comments: true
changefreq : daily
---

## docker image, container 
- image : 필요한 프로그램, 라이브러리, 소스 등을 설치한 뒤에 이를 파일로 만든 것이다.
- container : 이미지가 실행된 상태가 컨테이너(Container) 이다. 운영체제로 본다면 이미지는 일종의 실행파일, 컨테이너는 프로세스와 유사한 개념이다.
- **아래에서 사용되는 명령어는 [] 는 하나의 입력값을, <> 는 여러개의 입력값을 의미한다.** 

## 1. docker 상태 확인 
- 버전 확인 : docker 의 버전이나 go 언어의 버전, OS, 아키텍처를 확인 할 수 있다. 
~~~ cmd
    docker version
~~~
- 실행 환경 확인 : docker 실행 환경의 상세 설정 표시(컨테이너 수, docker 버전, 스토리지 드라이버 종류, OS 종류, 아키텍처 등)
~~~ cmd
    docker system info
~~~
- 디스크 이용 상황 : 상세 내용을 확인할 때는 --v 옵션을 지정한다. 
~~~ cmd
    docker system df 
~~~

## 2. docker 이미지 조작 
- 이미지 다운로드 : docker image pull [옵션] 이미지명[:태그명]
    - 태그명을 생락하면 최신판(latest)을 취득한다.
    ~~~ cmd
        docker image pull centos:7
    ~~~ 
    - -a 옵션을 지정하면 모든 태그를 취득 할 수 있다. 또한 -a 옵션을 지정할 때는 docker 이미지명에 태그를 지정할 수 없다.
    ~~~ cmd
        docker image pull -a centos
    ~~~
    - 이미지명에 취득할 url 을 지정할 수도 있다. url 은 프로토콜(https://)을 제외하고 지정한다.
- 이미지 목록 표시
~~~ css
    docker image ls [옵션] [리포지토리명]
~~~

    - 지정 할 수 있는 주요 옵션
      
        |옵션|설명|
        |:---|:---|
        |-all, -a|모든 이미지를 표시|
        |\--digests|다이제스트(이미지를 고유하게 식별하기 위한값)를 표시할지 말지|
        |\--no-trunc|결과를 모두 표시|
        |\--quiet, -q|docker 이미지 ID만 표시|
        
- 이미지 상세 정보 확인 : 이미지 ID, 작성일, docker 버전, cpu 아키텍처 등을 JSON 형태로 표시한다. 
~~~ css
    docker image inspect <이미지명>
~~~
- 이미지 commit 히스토리 보기 
~~~ css
    docker image history <이미지명>
~~~
- 이미지 태그 설정 : **docker hub 에 등록하기 위해서는 [사용자명/repository명:태그명] 과 같은 명명 규칙을 사용해야 한다.**
~~~ css
    docker image tag [원본이미지명] [변경할이미지명:태그명]
~~~
- 이미지 검색 : docker hub 에 공개되어 있는 이미지를 검색한다. 
~~~ css
    docker search [옵션] <검색 키워드>
~~~

    - 지정할 수 있는 주요 옵션 
    
        |옵션|설명|
        |:---|:---|
        |\--no-trunc|결과를 모두 표시|
        |\--limit n|n건의 검색 결과를 표시|
        |\--filter=stars=n|즐겨찾기의 수(n 이상)를 지정|

- 이미지 삭제 
~~~ css
    docker image rm [옵션] 이미지명 [이미지명] 
~~~
    
    - 지정할 수 있는 주요 옵션 
        
        |옵션|설명|
        |:---|:---|
        |\--force, -f|이미지를 강제로 삭제|
        |\--no-prune|중간 이미지를 삭제하지 않음|
            
- 사용하지 않는 이미지 삭제 
~~~ css
    docker image prune [옵션]
~~~
    
    - 지정할 수 있는 주요 옵션 
            
        |옵션|설명|
        |:---|:---|
        |\--all, -a|사용하지 않는 이미지를 모두 삭제|
        |\--force, -f|이미지를 강제로 삭제|
        
- docker hub 에 로그인 
~~~ css
    docker login [옵션] [서버]
~~~

    - 지정할 수 있는 주요 옵션 
                
        |옵션|설명|
        |:---|:---|
        |\--password, -p|비밀번호|
        |\--username, -u|사용자명|
        
- 이미지 업로드 : **업로드 하는 이미지명은 유저명/repository:태그명 이어야 하고, repository 는 docker hub 에서 생성해 주어야 한다.** 태그명이 없을 경우 latest 버전으로 업로드 된다.
~~~ css
    docker image push 이미지명[:태그명]
~~~ 
    
## 3. docker 컨테이너 생성 / 시작 / 정지 

- 컨테이너 생성 : 이미지로부터 컨테이너를 생성한다. 이미지의 실체는 'docker 에서 서버 기능을 작동 시키기 위해 필요한 디렉토리 및 파일들' 이다. 구체적으로는 Linux의 작동에 필요한 /etc 나 /bin 등과 같은 디렉토리 및 파일들이다.
~~~ css
    docker container create [이미지명]
~~~
- 컨테이너 상세 정보 확인 
~~~ css
    docker container inspect <컨테이너 식별자>
~~~
- 컨테이너 생성 및 시작 
~~~ css
    docker container run [옵션] 이미지명[:태그명] [인수] 
~~~

    - 지정할 수 있는 주요 옵션 
                    
        |옵션|설명|
        |:---|:---|
        |\--attach, -a|표준 입출력, 오류 출력|
        |\--cidfile|컨테이너 ID를 파일로 출력|
        |\--detach, -d|컨테이너를 생성하고 백그라운드에서 실행|
        |\--interactive, -i|컨테이너의 표준 입력을 연다.|
        |\--tty, -t|단말기 디바이스를 사용한다.|
        
        ~~~ cmd
            docker container run -it --name "test1" centos /bin/cal
        ~~~ 
        - docker container run : 컨테이너를 생성 및 실행
        - -it : 콘솔에 결과를 출력하는 옵션 
        - \--name "test" : 컨테이너명
        - centos : 이미지명(해당 이미지가 없을 경우 pull 받는다.)
        - /bin/cal : 컨테이너에서 실행할 명령. /bin/bash를 실행하면 컨테이너 안에서 명령 조작을 할 수 있고 컨테이너를 종료시키려면 exit 명령을 입력하여 쉘을 종료 시킨다.
     
  
- 컨테이너의 백그라운드 실행
~~~ css
    docker container run [실행 옵션] 이미지명[:태그명] [인수]
~~~
    
    - 지정할 수 있는 주요 옵션 
                        
        |옵션|설명|
        |:---|:---|
        |\--detach, -d|백그라운드에서 실행|
        |\--user, -u|사용자명을 지정|
        |\--rm|명령 실행 완료 후에 컨테이너를 자동으로 삭제|
        |\--restart=<옵션>|명령의 실행 결과에 따라 재시작을 하는 옵션|
        
        - \--restart 옵션  
                                
            |설정값|설명|
            |:---|:---|
            |no|재시작하지 않는다.|
            |on-failure|종료 스테이터스가 0이 아닐 때 재시작한다.|
            |on-failure:횟수n|종료 스테이터스가 0이 아닐 때 n번 재시작한다.|
            |always|항상 재시작한다.|
            |unless-stopped|최근 컨테이너가 정지 상태가 아니라면 항상 재시작한다.|
        
        ~~~ cmd
            docker container run -d centos /bin/ping localhost
        ~~~
        - docker container run : 컨테이너를 생성 및 실행 
        - -d : 백그라운드에서 실행하는 옵션
        - centos : 이미지명 
        - /bin/ping localhost : 컨테이너에서 실행할 명령
 
- 컨테이너의 네트워크 설정 
~~~ css
    docker container run [네트워크 옵션] 이미지명[:태그명] [인수]
~~~

    - 지정할 수 있는 주요 옵션  
                                    
        |옵션|설명|
        |:---|:---|
        |\--add-host=[호스트명:IP 주소]|컨테이너의 /etc/hosts에 호스트명과 ip주소를 정의|
        |\--dns=[IP 주소]|컨테이너용 DNS 서버의 IP 주소 지정|
        |\-expose|지정한 범위의 포트 번호를 할당|
        |\--mac-address=[MAC 주소]|컨테이너의 MAC 주소를 지정|
        |\--net=[bridge \|none \|container:<name \| id> \|host\|NETWORK]|컨테이너의 네트워크를 지정(default:host)|
        |\--hostname, -h|컨테이너 자신의 호스트명을 지정|
        |\--publish, -p[호스트의 포트 번호]:컨테이너의 포트 번호]|호스트와 컨테이너의 포트 매핑(-p 옵션을 여러개 사용하여 컨테이너의 멀티 포트를 호스트 포트와 매핑 할 수 있다.)|
        |\--publish-all, -P|호스트의 임의의 포트를 컨테이너에 할당|
        
        - 예시
        ~~~ cmd
            docker container run -d -p 8080:80 nginx
        ~~~

- 자원을 지정하여 컨테이너 생성 및 실행 
~~~ css
    docker container run [자원 옵션] 이미지명[:태그명] [인수]
~~~
    
    - 지정할 수 있는 주요 옵션  
                                        
        |옵션|설명|
        |:---|:---|
        |\--cpu-shares, -c|CPU 사용 배분(비율)|
        |\--memory, -m|사용할 메모리를 제한하여 실행(단위는 b, k, m, g 중 하나)|
        |\--volume=[호스트의 디렉토리]:[컨테이너의 디렉토리], -v|호스트와 컨테이너의 디렉토리를 공유|
        
        - 예시
        ~~~ cmd
            docker container run --cpu-shares=512 --memory=1g centos
        ~~~
        ~~~ cmd
            docker container run run -v /Users/home/webapp:/usr/share/nginx/html nginx
        ~~~
        
- 컨테이너를 생성 및 시작하는 환경을 지정 
~~~ css
    docker container run [환경설정 옵션] 이미지명[:태그명] [인수]
~~~

    - 지정할 수 있는 주요 옵션  
                                        
        |옵션|설명|
        |:---|:---|
        |\--env=[환경변수], -e|환경변수를 설정한다.|
        |\--env-file=[파일명]|환경변수를 파일로부터 설정한다.|
        |\--read-only=[true \| false|컨테이너의 파일 시스템을 읽기 전용으로 만든다.|
        |\--workdir=[패스], -w|컨테이너의 작업 디렉토리를 지정한다.|
        |-\--user=[사용자명], -u|사용자명 또는 UID를 지정한다.|
        
- 가동 컨테이너 목록 표시 
~~~ css
    docker container ls [옵션]
~~~

    - 지정할 수 있는 주요 옵션  
                                            
        |옵션|설명|
        |:---|:---|
        |\--all, -a|실행 중/정지 중인 것도 포함하여 모든 컨테이너를 표시|
        |\--filter, -f|표시할 컨테이너의 필터링|
        |\--format|표시 포맷을 지정|
        |\--last, -n|마지막으로 실행된 n건의 컨테이너만 표시|
        |\--latest, -l|마지막으로 실행된 컨테이너만 표시|
        |\--no-trunc|정보를 생략하지 않고 표시|
        |\--quiet, -q|컨테이너 ID만 표시|
        |\--size, -s|파일 크기 표시|
        
        - 예시
        ~~~ cmd
            docker container ls -a -f name=test1
        ~~~
        ~~~ cmd
            docker container ls -a -f exited=0
        ~~~

- 컨테이너 가동 확인 : 상태 확인 종료는 Ctrl + c
~~~ css
    docker container stats [컨테이너 식별자]
~~~
- 컨테이너에서 실행 중인 프로세스 확인
~~~ css
    docker container top [컨테이너 식별자]
~~~ 
- 실행중인 컨테이너 size 확인 
~~~ css
    docker ps --size
~~~
- 정지하고 있는 컨테이너 시작 
~~~ css
    docker container start [옵션] <컨테이너 식별자> [컨테이너 식별자]
~~~

    - 지정할 수 있는 주요 옵션  
                                                
        |옵션|설명|
        |:---|:---|
        |\--attach, -a|표준 출력, 표준 오류 출력을 연다.|
        |\--interactive, -i|컨테이너의 표준 입력을 연다.|
        
- 컨테이너 정지 
~~~ css
    docker container stop [옵션] <컨테이너 식별자> [컨테이너 식별자]
~~~

    - 지정할 수 있는 주요 옵션  
                                                    
        |옵션|설명|
        |:---|:---|
        |\--time, -t|컨테이너의 정지 시간을 지정(default:10초)|
        
- 컨테이너 재시작 
~~~ css
    docker container restart [옵션] <컨테이너 식별자> [컨테이너 식별자]
~~~

    - 지정할 수 있는 주요 옵션  
                                                    
        |옵션|설명|
        |:---|:---|
        |\--time, -t|컨테이너의 정지 시간을 지정(default:10초)|
        
- 컨테이너 삭제 
~~~ css
    docker container rm [옵션] <컨테이너 식별자> [컨테이너 식별자]
~~~

    - 지정할 수 있는 주요 옵션  
                                                        
        |옵션|설명|
        |:---|:---|
        |\--force, -f|실행 중인 컨테이너를 강제로 삭제|
        |\--volumes, -v|할당한 볼륨을 삭제|
        
- 정지 중인 모든 컨테이너 삭제 
~~~ cmd
    docker container prune
~~~
- 컨테이너 중단/재개
~~~ css
    docker container pause/unpause <컨테이너 식별자> [컨테이너 식별자]
~~~

- 네트워크 목록 표시 : docker 는 기본값으로 bridge, host, none 이 세 개의 네트워크를 만들고, 컨테이너 시작 시에 네트워크를 지정하지 않을 때는 기본값인 bridge 로 컨테이너가 시작된다.
~~~ css
    docker network ls [옵션]
~~~

    - 지정할 수 있는 주요 옵션  
                                                    
        |옵션|설명|
        |:---|:---|
        |\--filter=[driver \| id \| lable \| name \| scope\| type], -f|출력 필터|
        |\--no-trunc|상세 정보를 출력|
        |\--quite, -q|네트워크 ID만 표시|

- 네트워크 작성 
~~~ css
    docker network create [옵션] 네트워크 컨테이너명
~~~

    - 지정할 수 있는 주요 옵션  
                                                    
        |옵션|설명|
        |:---|:---|
        |\--driver=[bridge \| overlay], -d|네트워크 브리지 또는 오버레이(default:bridge)|
        |\--ip-range|컨테이너에 할당하는 IP 주소의 범위를 지정|
        |\--subnet|서브넷을 CIDR 형식으로 지정|
        |\--ipv6|IPv6 네트워크를 유효화할지 설정(true/false)|
        |\--lable|네트워크에 설정하는 라벨|

- 네트워크 연결/연결해제
~~~ css
    docker network connect/disconnect [옵션] 네트워크 컨테이너명
~~~

    - 네트워크 연결 시 지정할 수 있는 주요 옵션  
                                                    
        |옵션|설명|
        |:---|:---|
        |\--ip|IPv4주소|
        |\--ip6|IPv6주소|
        |\--alias|앨리어스명|
        |\--link|다른 컨테이너에 대한 링크|
        
- 네트워크 상세 정보 확인
~~~ css
    docker network inspect [옵션] 네트워크 컨테이너명
~~~
- 네트워크 삭제 : 네트워크를 삭제하려면 docker network disconnect 명령을 사용하여 연결 중인 모든 컨테이너와의 연결을 해제해야 한다.
~~~ css
    docker network rm [옵션] 네트워크 컨테이너명
~~~

## 4. 가동 중인 docker 컨테이너 조작 

- 가동 컨테이너 연결 
    - **-d 옵션으로 백그라운드에서 실행중인 컨테이너에는 attach 할 수 없다.**
    - 컨테이너에서 분리 : Ctrl + p, Ctrl + q 
~~~ css
    docker container attach [컨테이너 식별자]
~~~

- 가동 컨테이너에서 프로세스 실행 : 실행 중인 컨테이너에서만 실행 가능.
~~~ css
    docker container exec [옵션] <컨테이너 식별자> <실행할 명령> [인수]
~~~

    - 지정할 수 있는 주요 옵션  
                                                        
        |옵션|설명|
        |:---|:---|
        |\--detach, -d|명령을 백그라운드에서 실행|
        |\--interactive, -i|컨테이너의 표준 입력을 연다.|
        |\--tty, -t|단말기 디바이스를 사용한다.|
        |\--user, -u|사용자명을 지정한다.|
        
    - 예시
    ~~~ cmd
        docker container exec -it nginx /bin/echo "Hello world"
    ~~~

- 컨테이너 이름 변경 
~~~ css
    docker container rename [현재이름] [변경할이름]
~~~

- 컨테이너 안의 파일을 복사 
~~~ css
    docker container cp [컨테이너 식별자]:[컨테이너 안의 파일 경로] [호스트의 디렉토리 경로]
~~~
~~~ css
    docker container cp [호스트의 파일] [컨테이너 식별자]:[컨테이너 안의 파일 경로]
~~~

- 컨테이너 조작의 변경 내용 확인 : A-파일 추가, D-파일 삭제, C-파일 수정
~~~ css
    docker container diff [컨테이너 식별자]
~~~

## 5. docker 이미지 생성

- 컨테이너로부더 이미지 작성
~~~ css
    docker container commit [옵션] <컨테이너 식별자> [이미지명:[태그명]]
~~~

    - 지정할 수 있는 주요 옵션  
                                                        
        |옵션|설명|
        |:---|:---|
        |\--author, -a|작성자를 지정|
        |\--message, -m|메시지를 지정|
        |\--change, c|commit 시 dockerfile 명령을 지정|
        |\--pause, -p|컨테이너를 일시 정지하고 commit|
        
- 컨테이너를 tar 파일로 출력
~~~ css
    docker container export [컨테이너 식별자] > [출력경로\파일명].tar
~~~
    - 예시
    ~~~ cmd
        docker container export nginx > latest.tar
    ~~~
    
- tar 파일로부터 이미지 작성 
~~~ css
    docker image import [파일 또는 URL]  [이미지명:[태그명]]
~~~
    - 예시
    ~~~ cmd
        docker image import d:\test.tar test:1.0
    ~~~

- 이미지 저장
~~~ css
   docker image save -o [출력경로\파일명].tar [이미지명]
~~~

- 이미지 읽어 들이기 : 파일명이 아닌 save 로 저장한 이미지명으로 읽어 들인다.  
~~~ css
    docker image load -i [입력경로\파일명].tar
~~~

- 불필요한 이미지/컨테이너 일괄 삭제 
~~~ css
    docker system prune [옵션]
~~~

    - 지정할 수 있는 주요 옵션  
                                                            
        |옵션|설명|
        |:---|:---|
        |\--all, -a|사용하지 않는 리소스를 모두 삭제|
        |\--force, -f|강제적으로 삭제|
    
