---
layout : post
title : Intellij 시작 오류 조치
date : 2021-01-05
excerpt : "Intellij 시작 시 Address already in use 오류 해결하기"
tags: [intellij]
categories: [IDE]
comments: true
changefreq : daily
---

- intellij 시작시 다음과 같은 오류가 발생할경우 아래와 같이 조치가 가능하다.
    - <img src="/static/img/intellij-start-error/error.png" alt="error.png">
- intellij 는 실행되면서 6942에서 6991번 포트 중 사용 가능한 첫번째 포트를 바인딩하는데 해당 범위에 사용가능한 포트가 존재하지 않아 에러가 난다고 한다. 
- windows 에서 WSL2로 전환하고 Docker Desktop 을 사용하면서부터 보게 된 에러인데 Hyper-V가 설정되면 윈도우 시작시 포트들을 가져가버리기 때문인 것 같다.
- 해결방법
    - 관리자 권한으로 PowerShell 을 시작하고 다음 명령어들을 입력한다.
        ~~~ shell
            dism.exe /Online /Disable-Feature:Microsoft-Hyper-V
            # 이후 윈도우를 재시작
            netsh int ipv6 add excludedportrange protocol=tcp startport=6942 numberofports=10
            # JetBrains 사의 IDE를 동시에 10개 이상은 안 쓸 거 같아 10개 정도만 예약.
            dism.exe /Online /Enable-Feature:Microsoft-Hyper-V /All
        ~~~
