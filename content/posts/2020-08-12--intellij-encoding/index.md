---
title : intellij 테스트 코드 한글 깨짐 해결 방법
category: "ide"
author: bingbingpa
---

- intellij 에서 테스트 코드에 한글이 깨지는 경우
![before](./before.png)
- 인텔리제이 프로그램 메뉴 중 Help -> Edit Custom VM Options.. 에서 다음 문구를 추가 한다.
~~~ properties
    -Dfile.encoding=UTF-8
~~~
- intellij 를 재실행 하고 테스트를 실행 하면 한글 결과가 잘 뜬다.
![after](./after.png)


