---
layout : post
title : intellij 한글 깨짐 해결 방법
date : 2020-08-12
excerpt : "intellij 테스트 코드 한글 깨짐 해결 하기"
tags: [intellij, encoding]
categories: [IDE]
comments: true
changefreq : daily
---

- intellij 에서 테스트 코드에 한글이 깨지는 경우 
- <img src="/static/img/intellij-encoding/before.png">
- 인텔리제이 프로그램 메뉴 중 Help -> Edit Custom VM Options.. 에서 다음 문구를 추가 한다.
~~~ text
    -Dfile.encoding=UTF-8
~~~
- intellij 를 재실행 하고 테스트를 실행 하면 한글 결과가 잘 뜬다.
- <img src="/static/img/intellij-encoding/after.png">
    
  
