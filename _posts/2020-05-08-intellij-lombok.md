---
layout : post
title : intellij lombok 관련 삽질 정리 
date : 2020-05-08
excerpt : "intellij lombok 관련 오류 해결하기(build.gradle 설정)"
tags: [intellij, lombok]
categories: [IDE]
comments: true
changefreq : daily
---

- eclipse 를 사용했을 때에는 아래와 같이 build.gradle 을 설정하고 코드를 실행해도 에러가 발생하지 않았다. 
~~~ gradle
    compileOnly 'org.projectlombok:lombok' 
~~~
- 하지만.... intellij 에서 실행할 경우에는 build.gradle 에 다음과 같이 추가해 줘야한다. 
~~~ gradle 
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
~~~
