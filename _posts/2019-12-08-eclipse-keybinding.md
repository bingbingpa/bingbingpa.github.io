---
layout : post
title : eclipse 단축키
date : 2019-12-08
excerpt : "마우스를 조금이라도 덜 쓰기 위해 eclipse 단축키 기억하기."
tags: [eclipse]
categories: [DevEnvironment]
comments: true
changefreq : daily
---

#### vscode로 자바웹개발을 하려다보니 안되는 것들이 많아서 결국 다시 eclipse를 쓰기로 했다. eclipse라도 제대로 쓰기 위해 유용한 단축키를 정리해 본다.

#### 1. 이동 관련 단축키 
- ctrl + H : find 및 replace  
- **ctrl + T : 타입의 상속구조(Interface 안에 Impl Method 찾아갈때 유용하다.)**
- ctrl + F3 : 타입의 멤버들을 보여주고 선택시 해당 위치로 이동 
- **alt + shift + W : Editor창에서 Navigator등으로 이동할 때**
- ctrl + L : 특정 라인으로 이동
- ctrl + shift + R : 특정리소스를 바로 열고자 하는 경우 
- ctrl + . : 다음 오류 부분으로 가기 
- ctrl + , : 이전 오류 부분으로 가기 
- F12 : 에디터로 커서 이동 
- **ctrl + W : 에디터의 파일 닫기**
- ctrl + shift + F4 : 열린 파일 모두 닫기 
- ctrl + PageUp, ctrl + PageDown : 에디터 창간의 이동
- **ctrl + F6 : 에디터 창에 열려 있는 파일 목록 리스트 업**

#### 2. Edit 관련 단축키 
- alt + 위아래 화살표 : 커서가 위치한 코드 라인 이동 
- ctrl + shift + F : 자동 들여쓰기(블럭 지정 가능)
- ctrl + space : 어휘 자동 완성 
- ctrl + shift + O : 자동 임포트 
- ctrl + 1 : quick fix 
- ctrl + d : 라인 삭제 
- **alt + shift + R : 지정한 블록 rename** 
- ctrl + /(ctrl + shift + C) : 선택 블록 주석처리/제거 
- ctrl + shift + X : 대문자로 변환 
- ctrl + shift + Y : 소문자로 변환
- alt + shift + s : source 메뉴 보기 

#### 3. 디버깅 관련 단축키 
- ctrl + shift + B : 현재 커서의 위치에 브레이크 포인트 설정/해제
- F11 : 디버깅 시작
- F5 : 한 줄씩 실행하되 함수일 경우 그 함수 내부로 들어감(Step Into)
- F6 : 한 줄씩 실행(Step Over)
- F7 : 현재 함수의 끝까지 실행하여 현재 함수를 벗어난다.
- F8 : 다음 브레이킹 포인트로 이동 
- Ctrl + R : 현재 라인까지 실행