---
layout : post
title : 리눅스에서 톰캣 서비스 등록하기
date : 2019-07-27
excerpt : "리눅스에서 톰캣 서비스 등록하고 자동 시작하는 방법"
tags: [centos, service]
categories: [DevOps]
comments: true
changefreq : daily
---


## 1. Centos7 환경에서 톰캣 서비스 등록

- **/usr/lib/systemd/system/** 경로에 등록하고자 하는 서비스명.service 파일을 생성한다. 
- 대략 다음과 같이 서비스 파일을 만들면 된다. 
- user와 ExecStart/ExecStop경로만 잘 적어주면 별 오류 없이 서비스가 잘 등록 된다. 
~~~ shell
    [Unit]
    Description=해당 서비스에 대한 설명
    After=syslog.target
    
    [Service]
    Type=forking
    User=사용자명
    Group=사용자그룹
    ExecStart=/톰캣경로/bin/startup.sh
    ExecStop=/톰캣경로/shutdown.sh
    SuccessExitStatus=143
    
    [Install]
    WantedBy=multi-user.target
~~~
- 서비스를 시작하는 방법은 **service**와 **systemctl**이 있는데 service는 centos6이전 버전구문이고 systemctl은 centos7이후 버전의 구문이다. 근데 난 service가 익숙해서 아직도 service로 사용중... 
- 서비스를 시작하는 방법은 service "/usr/lib/systemd/system/경로에 생성한 서비스 파일명" start 를 하면 된다. 
- 종료할 때는 **stop**을 사용하고 재시작은 **restart** 현재 서비스의 상태는 **status**로 볼 수 있다.

## 2. 서비스 자동 시작 설정

- 서비스를 자동 시작하는게 그리 좋은것은 아니라고 하는데... 이번에 진행한 프로젝트에서는 장거리에서 유지 보수의 어려움 때문에 서비스를 자동 시작하도록 설정했다. 
- 설정 방법은 다음과 같다.
~~~ shell
sudo systemctl enable "서비스명"
~~~
- 다음 명령어로 서비스가 정상적으로 자동 시작으로 등록되었는지 확인 해 볼 수 있다. 
~~~ shell
sudo systemctl list-unit-files --type service | grep enabled
~~~
