---
layout : post
title : Ubuntu java 버전 변경하기
date : 2019-08-18
excerpt : "Ubuntu java 버전 변경하기                                          "
tags: [ubuntu, openjdk]
categories: [DevOps]
comments: true
changefreq : daily
---


- 아무 생각 없이 apt로 java를 설치 했는데 openjdk11 이 깔렸다. 프로젝트에서 쓰는건 openjdk8이라서 버전 변경하는 것 찾아보다가 기록! 근데 찾아보니 ubuntu랑 centos랑 버전 변경하는 방법이 다르다고 한거 같은데 일단 집에서는 ubuntu를 사용하고 centos에서는 자바를 직접 설치하지 않고 톰캣에 경로 잡아서 사용하다보니 이건 나중에 필요하면 찾아서 정리하도록 해야겠다.  
- openjdk8을 받으려다가 문득 의문이 들었다. **apt-get**, **apt** 이렇게 혼용되서 사용되던데 무슨 차이가 있는지? 구글링 해보니 다음과 같았다. 
- 둘다 패키지 관리 도구이고 하는 일도 비슷한데 apt-get이 먼저 나오고 apt가 나중에 나왔다고 한다. 그리고 apt-get과 apt-cache를 하나의 명령어로 사용하기 위해 apt가 탄생했으며, 처음 나온건 2014년이지만 우분투 16.04가 런칭되면서 알려지기 시작했다고 한다.
- 찾아보니 apt가 설치 진행 상황을 프로그레스바로 보여주고 업그레이드 할 수 있는 패키지 숫자도 보여주는 등 사용자가 알 수 있는 정보들이 더 많은 것 같다. 
- 아무튼 결국 apt로 openjdk8을 설치 했다. 만약 설치할 패키지 명을 모른다면 다음과 같이 검색해서 패키지 명을 확인 후 설치 하면된다. 
~~~ shell
    $ apt search openjdk*
~~~
<img src="/static/img/openjdk/package.png">

- 설치된 자바 리스트를 확인 한다.
~~~ shell
    $ update-java-alternatives --list

    java-1.11.0-openjdk-amd64      1111       /usr/lib/jvm/java-1.11.0-openjdk-amd64
    java-1.8.0-openjdk-amd64       1081       /usr/lib/jvm/java-1.8.0-openjdk-amd64
~~~
- 아래의 명령어에서 -s 다음에 변경하고자 하는 버전의 이름을 넣어서 실행한다. 
~~~ shell
    $ update-java-alternatives -s java-1.8.0-openjdk-amd64
~~~
- 터미널에서 **java -version** 명령어로 버전이 변경 되었는지 확인한다.
