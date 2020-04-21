---
layout : post
title : ulimit 설정하기
date : 2019-07-27
excerpt : "too many file opens error를 피하기 위한 ulimit 설정방법                "
tags: [centos, ulimit, too many file opens]
categories: [Linux]
comments: true
changefreq : daily
---


## 1. ulimit? 

- 서버 세팅을 하게 되면 os update 하고 나면 그 다음 하게 되는 ulimit 설정. 근데 이게 정확히 뭔지 몰라서 찾아봤다. 
- **ulimit는 각 유저의 파일 사용에 대해서 할당할 자원을 제한 하는 것으로, 다중 사용자및 프로그램을 기본으로 하는 Linux 시스템에서 특정 유저가 시스템 사용을 독점하는 것을 막아 주는 설정이다. 주로 openfile, corefile 사이즈를 제어하는것에 사용한다. 기본 hard, soft 설정이 있다.**
- **sort 설정 : 새로운 프로그램 생성시 기본으로 적용되는 한도**
- **hard 설정 : 소프트 설정 한도의 최대값**

## 2. ulimit 설정하기
- OS 설치시 기본값은 1024로 되어 있으며 구글링을 해보니 다음과 같이 설정하면 된다고 한다. 
~~~ shell
    $ sudo vi /etc/security/limits.conf 

    *      soft      nofile      65535
    *      hard    nofile       65535  
~~~
- 맨 앞의 **\*** 가 있는 자리는 사용자 계정을 나타내고 **\*** 로 지정하면 모든 사용자 계정에 옵션이 적용된다. 
- 적용 후 따로 재부팅은 필요 없고 다시 접속해서 확인해보면 변경 된 것을 확인 할 수 있다. 

- ulmit -a 

  <img src="/static/img/ulimit/ulimit-a.png">
- ulmit -aH

  <img src="/static/img/ulimit/ulimit-aH.png">
