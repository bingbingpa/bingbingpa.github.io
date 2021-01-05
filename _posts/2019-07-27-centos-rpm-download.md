---
layout : post
title : rpm download 하기
date : 2019-07-27
excerpt : "인터넷이 되지 않는 환경에서 서버 구축시 rpm 다운받아서 설치하기"
tags: [centos, rpm, downloadonly]
categories: [DevOps]
comments: true
changefreq : daily
---


## rpm 패키지 다운받기 

- 인터넷이 되지 않은 로컬 환경에서 설치하기 위해서는 rpm파일들을 미리 준비해야 하는데 그 방법은 다음과 같다. 
- centos 7을 기준으로 했을때 yum에 --downloadonly 라는 옵션이 있다. 만약 yum --help 목록에서 이 옵션이 없다면 **sudo yum install yum-downloadonly** 명령어를 통해 해당 플러그인을 설치한다. 
- rpm을 다운받을 때는 아무것도 설치 되어 있지 않은 클린한 OS에서 하는 것을 추천하는데 이유는 기존에 사용중인 OS일경우 다운로드 받고자 하는 패키지와 의존성이 있는 것들이 설치 되어 있을 수도 있기 때문이다. 

- OS update 패키지를 받을 때 
~~~ shell
    $ sudo yum update --downloadonly --downloaddir=’다운받을 디렉토리’(OS 업데이트 패키지)
~~~ 
- 필요한 설치 패키지를 받을 때
~~~ shell
    $ sudo yum install --downloadonly --downloaddir=’다운받을 디렉토리’  ‘설치할 패키지’
~~~ 

 
