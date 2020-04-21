---
layout : post
title : 방화벽 정책 설정 
date : 2019-07-30
excerpt : "Centos7에서 firewall을 이용해서 방화벽 설정하기                                         "
tags: [firewall]
categories: [Linux]
comments: true
changefreq : daily
---



## 1. firewall 명령어로 포트 열기

- firewall 명령어를 통해 포트를 열 수 있다. **zone은 서버의 용도에 맞게 사전에 정의된 네트워크의 신뢰 레벨**을 의미한다는데... 난 아직까지는 zone을 따로 추가하지 않고 그냥 public으로 쓰고 있다.
- 포트를 추가하고 나면 반드시 firewall을 reload해야지 적용된다. 
- 적용된 포트는 **sudo firewall-cmd --zone=public --list-all** 명령어로 확인 할 수 있다.
- 특정 IP의 포트만 허용하는것도 firewall 명령어로 할 수 있다는데 이건 그냥 xml수정하는게 편해서 xml을 수정해서 적용했다. 
- **아래와 같이 하면 모든IP에 대해서 해당 포트가 열리기 때문에 주의해야 한다.**
~~~ shell
    sudo firewall-cmd --permanent --zone=public --add-port='허용포트'/tcp
    sudo firewall-cmd --reload
    sudo firewall-cmd --zone=public --list-all
~~~

## 2. firewall xml 수정해서 포트 설정하기 

- 일반 사용자 계정으로는 해당 결로에 접근이 안되므로 root계정으로 변경하고  **/etc/firewall/zones/public.xml** 파일의 zone태그안에 아래 내용을 추가하면 된다. 따로 추가한 zone이 있다면 해당 zone의 xml을 수정하면 된다. 
- ip/뒤에 붙는 숫자는 허용할 IP대역대를 의미한다. IP는 8bit.8bit.8bit.8bit 으로 이루어져 있는데 뒤에 숫자의 비트수만큼 일치하는 IP에 대해 허용한다는 뜻이다. 
~~~ xml
    <rule family="ipv4">
        <source address="192.168.0.1/24"/>
        <port protocol="tcp" port="22"/>
    <accept/>
    </rule>
~~~
