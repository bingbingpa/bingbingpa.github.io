---
layout : post
title : 웹접근성 향상 시키기
date : 2020-02-27
excerpt : "웹접근성을 향상 시키기 위해 제대로 알고 사용하기.                    "
tags: [웹접근성]
categories: [HTML]
comments: true
changefreq : daily
---

### 1. 접근 가능한 숨김 텍스트 

- display:none 일 경우 스크린리더에서 읽을 수 없다. 이렇게 숨겨놓은 건 없는것과 같다. 
~~~ css
.hiddenTag {
    display:none;    
}
~~~

- visibility:hidden은 사용자에게 가시적으로 보여지지 않도록 하여 사용자에게 정보를 전달하지 않겠다라는 것이기 때문에, 스크린리더 역시 해당 정보 사용자에게 전달해주지 않게 된다. 
~~~ css
.hiddenTag {
    visibility:hidden;
    position:absolute;
}
~~~

- css의 들여쓰기 기능을 이용해서 텍스트를 아주 멀리 보내버리는 방법인데, 초점이 문서 바깥으로 나가버리는 현상이 생길 수 있고, 검색엔진 최적화에 좋지 않은 영향을 미치므로 사용하지 않도록 한다. 
~~~ css
.hiddenTag {
    text-indent:-9999px;
}
~~~

- 초점 이동, 대화형 요소인 경우 마우스 포인터 반응 문제 등이 발생하고 일부 스크린리더에서는 읽어주지 않으므로 사용하지 않도록 한다. 
~~~ css
.hiddenTag {
    opacity:0;
}
~~~

- 결론적으로 아래의 css를 사용해야 한다. width:0; height:0 으로 처리된 블럭은 면적이 없기 때문에 키보드가 접근이 안되는 브라우저가 있으므로 width:1px; height:1px 지정하는 방법을 권장한다.
- block formatting context 일 경우 
~~~ css
.hiddenTag {
    overflow: hidden;
    border: 0;
    margin: -1px;
    width: 1px;
    height: 1px;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
}
~~~
- inline formattion context 일 경우 
~~~ css
.hiddenTag {
    overflow: hidden;
    display: inline-block;
    border: 0;
    margin: -1px;
    width: 1px;
    height: 1px;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
}
~~~

[접근 가능한 숨김 텍스트 관련 참고 사이트](https://mulder21c.github.io/2019/03/22/screen-hide-text/)  

### 2. 입력 요소와 일대일로 대응하지 않는 label  

- 명시적 방식은 label 의 for 속성과 input 의 id 속성을 명시함으로써, 연결해주는 방식을 의미한다.
~~~ html 
<label for="search">검색어</label> 
<input type="text" id="search"/>
~~~
- 암시적 방식은 label 태그 안에 input 태그를 넣음으로써, for 속성을 명시하지않더라도 암묵적으로 연결하는 방식이다.
~~~ html
<label>검색어
    <input type="text" id="search"/>
    <input type="text" id="order"/>
</label>
~~~

- 검색 조건과 같이 하나의 label에 여러가지 조건의 폼이 연결되어야 할 경우가 있는데, 명시적 방식과 암시적 방식 모두 웹접근성에 어긋나지 않지만 구버전의 스크린리더를 사용하는 경우에는 암시적 방식을 읽지 못하는 경우도 있다. 이 경우에는 추가적인 조건의 폼에 title을 써주고 lable을 숨김 태그로 사용하여 모든 스크린리더에서 읽을 수 있도록 처리했다. 
~~~ html
    <label for="searchWord" class="hiddenTag">검색유형</label>
    <select id="searchWord" name="searchWord" title="검색유형">
        <option value="user_id">아이디</option>
        <option value="user_name">사용자명</option>
    </select>
    <label for="searchOption" class="hiddenTag">검색옵션</label>
    <select id="searchOption" title="검색옵션">
        <option value="0">일치<option>
        <option value="1">포함<option>
    <select>
    <label for="searchValue">검색어</label>
    <input type="text" id="searchValue"/>
~~~

### 3. a 태그에 올바른 onclick 사용 

- 잘못된 사용 방법 
~~~ html
    // 키보드를 통한 이벤트를 실행 시킬 수 없음.
    <a href="#" onclick="myfunction()"> 

    // href 속성에 스크립트를 사용할 수 없음.
    <a href="javascript:myfunction()"> 
~~~

- 올바른 사용 방법 
~~~ html
    <a href="이동url" onclick="myfunction(this.href);return false;">
~~~
