---
layout : post
title : Centos7 user 계정 sudo 권한 
date : 2019-07-21
excerpt : "리눅스 환경에서 일반 사용자 계정에 sudo 권한을 부여하는 방법             "
tags: [visudo, sudo, centos]
categories: [Linux]
comments: true
changefreq : daily
---


## 일반 사용자 계정에  root 권한 주기 

- 리눅스에서 일반 사용자 계정을 사용하다 보면 root의 권한이 필요할 경우가 있다. 그럴때마다 root로 계정을 변경해서 사용 할 수 도 있지만 해당 user계정에 root 권한을 부여하여 사용 할 수 있다.
- **visudo**를 이용하거나 **/etc/sudousers** 파일을 직접편집하여 권한을 부여 할 수 있는데 visudo가 문법체크를 해주는 visudo를 쓰는게 더 낫다고 한다. 
- **sudo visudo**로 파일내에서 **##Allow root** 부분을 찾아서 그 밑에 root권한을 부여할 계정 정보를 적고 나머지는 root와 동일하게 쓰고 저장한다. 
~~~ shell
    '사용자 계정명'     ALL=(ALL)       ALL
~~~ 
- 설정이 정상적으로 되면 해당 사용자 계정으로  root 권한이 필요할 경우 명령어 앞에 sudo를 쓰고 입력하면 된다. 

 
