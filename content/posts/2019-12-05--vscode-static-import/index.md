---
title : vscode lombok & static import 설정
category: "ide"
---

### 1. vscode에서 lombok 사용하기

- 원래는 아무 설정 없이 잘되던건데 어제 vscode 업데이트이후에 lombok이 먹히질 않았다. 그래서 찾아보니 setting.json에 명시적으로 써줘야 한다고 한다.
- 우선 [lombok.jar파일](https://projectlombok.org/)을 다운 받는다.
- 그리고 setting.json에 다음과 같이 명시적으로 적어준다.

~~~ json
"java.jdt.ls.vmargs": "-javaagent:/'파일경로'/lombok.jar -Xbootclasspath/a:/'파일경로'/lombok.jar"
~~~

- 혹시 안된다면 java clean 후 vscode를 리로드하면 된다.

### 2. static import 하기

- vscode를 이클립스 단축키를 쓸 수 있는 익스텐션을 사용중인데 다른 것들은 Ctrl + Shift + O 단축키로 자동 import가 되는데 static인 것들은 import가 안된다... 처음에는 한땀한땀 타이핑 하거나 복붙을 계속 했는데 테스트 코드를 하나둘 쓰다보니 귀찮다... 그래서 삽질 끝에 찾은 결과는 다음과 같다.
- setting.json에 favoriteStaticMembers에 사용하고자 하는 static 패키지들을 추가해주는 것이다. 근데 추가한다고 해도 자동 import 단축키로는 안되고 quick fix(이클립스 기준 단축키 Ctrl + 1)에서 import할 static 메소드를 선택해줘야 한다. 그래도 일일이 치거나 복붙하는 것보단 훨씬 나아진 것 같다.

~~~ json
"java.completion.favoriteStaticMembers": [
    "org.junit.Assert.*",
    "org.junit.Assume.*",
    "org.junit.jupiter.api.Assertions.*",
    "org.junit.jupiter.api.Assumptions.*",
    "org.junit.jupiter.api.DynamicContainer.*",
    "org.junit.jupiter.api.DynamicTest.*",
    "org.mockito.Mockito.*",
    "org.mockito.ArgumentMatchers.*",
    "org.mockito.Answers.*",
    "org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*",
    "org.springframework.test.web.servlet.result.MockMvcResultMatchers.*"
]
~~~
