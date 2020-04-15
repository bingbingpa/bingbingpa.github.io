---
layout : post
title : intellij 단축키  
date : 2020-04-06
excerpt : "intellij(windows & linux)  단축키 정리"
tags: [intellij]
categories: [개발환경]
comments: true
changefreq : daily
---

### 꼭 기억해야 할 단축키
- **스마트 코드 완성 : Ctrl + Shift + Space**
- **모두 검색 : Double Shift**
- **quick fix : Alt + Enter**
- **Generate Code(생성자, getter, setter, override 등) : Alt + Insert**
- **파라미터 정보 : Ctrl + P**
- **확장 선택(선택 영역이 점점 확장된다.) : Ctrl + W**
- **확장 선택(선택 영역이 점점 줄어든다.) : Ctrl + Shift + W**
- **최근 파일들 팝업 : Ctrl + E**
- **Rename(참조되는 모든 이름이 변경된다.) : Shift + F6**
 
### General
- **도구 창 열기 : Alt + #[0-9]**
- 모두 저장 : Ctrl + S 
- 파읠 동기화 : Ctrl + Alt + Y
- **eidtor 창 최대 최소 토글 : Ctrl + Shift + F12**   
- Color, Code Style, keymap, view mode, Look and Fell 스키마 변경 : Ctrl + BackQuote(`)
- **settings dialog 열기 : Ctrl + Alt + S** 
- project dialog 열기 : Ctrl + Alt + Shift + S 
- **Action 찾기 팝업 : Ctrl + Shift + A** 

### Debugging

- Step over / into : F8 / F7
- Smart step over / into : Shift + F8 / Shift + F7
- 현재커서위치까지 실행 : Alt + F9
- 표현식 사용 팝업 : Alt + F8
- 다음브레이크 포인트까지 실행 : F9
- 브레이크 포인트 토글 : Ctrl + F8
- 모들 브레이크 포인트 보기 팝업 : Ctrl + Shift + F8

### Search / Replace

- **모두 검색 : Double Shift**
- **현재 editor 파일에서 검색(열린 파일이 없을경우 동작하지 않음) : Ctrl + F**
- 다음 찾기 / 이전 찾기(열린 파일이 없을경우 동작하지 않음) : F3 / Shift + F3
- 현재 파일에서 바꾸기 : Ctrl + R
- path 에서 찾기 : Ctrl + Shift + F 
- path 에서 바꾸기 : Ctrl + Shift + R  
- **현재 커서가 있는 항목 선택 : Alt + j** 
- **현재 커서가 있는 항목과 같은 이름 모두 선택 : Ctrl + Alt + Shift + J**
- 모두 선택된 것중에서 가장 마지막 항목부터 unselect : Alt + Shift + J 

### Editing

- **기본 코드 완성 : Ctrl + Space**
- **스마트 코드 완성 : Ctrl + Shift + Space**
- **;콜론으로 끝나면 문장끝으로 이동 아니면 한줄 엔터 : Ctrl + Shift + Enter**
- **파라미터 정보 : Ctrl + P** 
- 빠른 문서 조회 : Ctrl + Q 
- 간단한 정보 : Ctrl + mouse
- **Generate Code(생성자, getter, setter, override 등) : Alt + Insert**
- **Override methods : Ctrl + O**
- **Implement methods : Ctrl + I**
- **코드 블럭(if, while, try catch 등) : Ctrl + Alt + T**
- **단순 주석 토글 : Ctrl + /** 
- **블럭 단위 주석 토글 : Ctrl + Shift + /**   
- **확장 선택(선택 영역이 점점 확장된다.) : Ctrl + W**
- **확장 선택(선택 영역이 점점 줄어든다.) : Ctrl + Shift + W**
- **Context 정보보기 : Alt + Q**
- **quick fix : Alt + Enter**
- **Reformat Code(적용영역선택, import 최적화 등을 한번에 할 수 있는 팝업) : Ctrl + Alt + L** 
- **import 최적화 : Ctrl + Alt + O**
- **자동 들여쓰기 : Ctrl Alt + l**
- **선택한 라인 indent / unindent : Tab / Shift + Tab**
- 한줄 복사 : Ctrl + D
- 한줄 삭제 : Ctrl + Y
- **undo : Ctrl + Z** 
- **redo : Ctrl + Shift + Z** 
- 선택 영역 한줄에 쓰기 : Ctrl + Shift + J
- 스마트 라인 나누기(문자열일 경우 자동으로 + 로 붙여서 여러줄에 쓴다.) : Ctrl + Enter
- 스마트 new line(커서가 현재 줄의 끝이 아니더라도 엔터가 된다.) : Shift + Enter 
- **대소문자 토글 : Ctrl + Shift + U**
- 코드 블록 끝 / 시작 까지 선택 : Ctrl + Shift + ] / [ 
- 단어의 끝까지 삭제 : Ctrl + Delete 
- 단어의 처음까지 삭제 : Ctrl + Backspace
- 코드 블록 확장 / 축소 : Ctrl + NumPad + / - 
- 모두 확장 : Ctrl + Shift + NumPad + 
- 모두 축소 : Ctrl + Shift + NumPad - 
- **현재 에디터 탭 닫기 : Ctrl + F4**
- 현재 에디터 새창으로 띄우기 : Shift + F4
- 메소드 간의 위치 변경 : Ctrl + Shift + 위/아래 
- css (예:#myDiv>ul>li*5) : Tab

### Refactoring 
- **파일 복사 : F5**
- **파일 이동 : F6**
- **safe delete : Alt + Delete** 
- **Rename : Shift + F6**
- **Refactor this(현재 editor 파일의 이동, 복사 extract 등 설정) : Ctrl + Alt + Shift + T**
- **Change Signature(파일의 접근제어, 이름, 파라미터등을 수정) : Ctrl + F6** 
- inline(메소드를 인라인 처리한다.) : Ctrl + Alt + N 
- **Extract Method : Ctrl + Alt + M** 
- **Extract Variable : Ctrl + Alt + V**
- Extract Field : Ctrl + Alt + F 
- Extract Constant : Ctrl + Alt + C 
- Extract Parameter : Ctrl + Alt + P 

### Navigation 
- **클래스로 이동 : Ctrl + N**
- **파일로 이동 : Ctrl + Shift + N**
- **메소드로 이동 : Ctrl + Alt + Shift + N**
- editor tab 이동 : Alt + Right / Left 
- 이전에 활성화 되었던 tool window : F12 
- **tool window 에서 editor 로 이동 : ESC**
- **활성화된 tool window hide : Shift + ESC**
- **라인으로 이동 : Ctrl + G** 
- **최근 파일 팝업 : Ctrl + E**
- **마지막 수정 위치로 이동 : Ctrl + Shift + Backspace**
- **현재 파일의 모든 view : Alt + F1**
- **선언 위치로 이동 : Ctrl + B, Ctrl + Click** 
- **구현 위치로 이동 : Ctrl + Alt + B**
- **definition 빠른 조회 : Ctrl + Shift + I**
- 타입 정의된 위치로 이동 : Ctrl + Shift + B
- 슈퍼 메소드/슈퍼 클래스로 이동 : Ctrl + U 
- **이전/다음 메소드로 이동 : Alt + Up / Down**
- **파일 구조 팝업 : Ctrl + F12**
- **Type hierarchy : Ctrl + H**
- **Method hierarchy : Ctrl + Shift + H**
- **Call hierarchy : Ctrl + Alt + H**
- 이전 / 다음 표시된 에러 : F2 / Shift + F2 
- **네비게이션 bar 표시 : Alt + Home**
- 북마크 토글 : F11
- 북마크 표시(숫자, 영문) : Ctrl + F11
- 넘버링된 북마크로 이동 : Ctrl + #[0-9]
- 북마크 표시 : Shift : F11
- 새로운 테스트 생성 및 이동 : Ctrl + Shift + T

### Compile and Run
- **컴파일 : Ctrl + F9**
- 선택된 파일 또는 패키지/모듈 컴파일 : Ctrl + Shift + F9
- 선택된 configuration run/debug : Alt + Shift + F10/F9
- **Run/Debug : Shift + F10/F9**

### Usage Search
- **전체 찾기(tool window) / 파일에서 찾기 : Alt + F7 / Ctrl + F7**
- 현재파일에서 검색어 하이라이트 : Ctrl + Shift + F7
- **검색 팝업 Ctrl + Alt + F7**

### VCS / Local History(git)
- **commit : Ctrl + K**
- **update project : Ctrl + T**
- **push commits : Ctrl + Shift + K**
- **VCS 팝업 : Alt + BackQuote(`)**
 
### Live Templates 
- Surround with Live Template : Ctrl + Alt + J
- Insert Live Template : Ctrl + J
