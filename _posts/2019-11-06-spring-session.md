---
layout : post
title : Springboot Redis HttpSession
date : 2019-11-06
excerpt : "Window Server 환경에서 Spring Boot로 개발한 웹어플리케이션을 redis를 이용하여 세션공유 하는 방법 정리"
tags: [springboot, HttpSession, redis]
categories: [Spring]
comments: true
changefreq : daily
---

## 1. Springboot Redis 세션 클러스터링을 사용하는 이유

- 서버가 한대일 경우 WAS에 세션 정보를 담아두고 사용하면 되지만 서버가 N대로 늘어날 경우 늘어난 서버의 ip, port 정보를 N대의 서버에 일일이 입력해줘야 한다. 따라서 WAS가 제공하는 세션 클러스터링 기능에 의존하지 않고 새로운 저장소를 두고 세션 정보를 두고 공유하게 되면 서버가 늘어나도 저장소 정보만 공유해주면 된다. 
- 세션을 공유하기 위한 저장소로는 Redis를 많이 이용한다. Redis는 데이터 저장소로 가장 I/O 속도가 빠른 장치인 메모리를 사용하고 있고 구조적으로는 key, value 형식의 데이터 처리에 특화되어 있다.

## 2. Redis 설치 및 서비스 등록 

- Redis는 공식적으로 윈도우를 지원하지 않고, [MSOpenTech](https://github.com/MicrosoftArchive/redis/releases)라는 곳에서 지속적으로 윈도우 버전을 릴리즈 하고 있다.
