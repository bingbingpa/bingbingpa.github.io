---
layout : post
title : facebook 댓글 플러그인 추가 
date : 2019-07-14
excerpt : "github 페이지에 facebook 댓글 플러그인을 추가하는 방법           "
tags: [facebook 댓글 플러그인]
categories: [Jekyll]
comments: true
changefreq : daily
---


## 1. github page에 facebook 댓글 플러그인 추가하기

- [FaceBook개발자 문서](https://developers.facebook.com/)사이트에서 내 앱을 생성한다. 
- 사이트의 문서 탭에서 Social Plugins -> 댓글을 선택하고 [링크](https://developers.facebook.com/docs/plugins/comments/) 이동
- 코드 받기를 누르면 두개의 코드가 나타난다. 하나는 댓글 플러그인을 로드하는 부분이고 하나는 댓글 플러그인을 적용할 html에 관련된 코드다. 

<img src="/static/img/facebookPlugin/faceboock-code.png">

- 스크립트를 로드하는 코드는 적당한 위치에 추가하고 댓글 플러그인이 들어가는 html의 코드는 post.html에 넣어주었다. 
- 여기서 **data-href**는 다음처럼 써야 해당 포스트에 해당하는 댓글을 볼 수 있다.
- " "안의 내용은 중괄호 두개로 묶어서 liquid 변수로 사용해야 한다.
~~~ html
    data-href="site.url | append: page.url"
~~~




