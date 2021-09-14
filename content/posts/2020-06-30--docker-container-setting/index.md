---
title : docker container 기본 설정
category: "infra"
---

### 1. 업데이트 및 필요 패키지 설치

~~~ bash
    dnf install -y epel-release
    dnf update -y
    dnf install -y vim unzip make wget sudo ncurses
~~~

### 2. container timezone 설정

~~~ bash
    timedatectl set-timezone Asia/Seoul
~~~

### 3. postgresql timezone 설정

- postgresql.conf 파일을 다음과 같이 수정 후 재시작한다.
~~~ conf
    timezone = 'Asia/Seoul'
    log_timezone = 'Asia/Seoul'
~~~

### 4. vim 설정
- 홈디렉토리의 최상위에 다음 내용의 파일을 만든다
~~~ bash
    vi ~/.vimrc
~~~
~~~ vimrc
    set hlsearch " 검색어 하이라이팅
    set nu " 줄번호
    set autoindent " 자동 들여쓰기
    set scrolloff=2
    set wildmode=longest,list
    set ts=4 "tag select
    set sts=4 "st select
    set sw=1 " 스크롤바 너비
    set autowrite " 다른 파일로 넘어갈 때 자동 저장
    set autoread " 작업 중인 파일 외부에서 변경됬을 경우 자동으로 불러옴
    set cindent " C언어 자동 들여쓰기
    set bs=eol,start,indent
    set history=256
    set laststatus=2 " 상태바 표시 항상
    "set paste " 붙여넣기 계단현상 없애기
    set shiftwidth=4 " 자동 들여쓰기 너비 설정
    set showmatch " 일치하는 괄호 하이라이팅
    set smartcase " 검색시 대소문자 구별
    set smarttab
    set smartindent
    set softtabstop=4
    set tabstop=4
    set ruler " 현재 커서 위치 표시
    set incsearch
    set statusline=\ %<%l:%v\ [%P]%=%a\ %h%m%r\ %F\
    " 마지막으로 수정된 곳에 커서를 위치함
    au BufReadPost *
    \ if line("'\"") > 0 && line("'\"") <= line("$") |
    \ exe "norm g`\"" |
    \ endif
    " 파일 인코딩을 한국어로
    if $LANG[0]=='k' && $LANG[1]=='o'
    set fileencoding=korea
    endif
    " 구문 강조 사용
    if has("syntax")
     syntax on
    endif
~~~

### 5. bash 컬러 설정
- /etc/bashrc 파일의 하단에 다음과 같이 추가 후 저장
~~~ bashrc
    PS1='\[\e[01;36m\]\u\[\e[01;37m\]@\[\e[01;33m\]\H\[\e[01;37m\]:\[\e[01;32m\]\w\[\e[01;37m\]\$\[\033[0;37m\] '

    if [ -x /usr/bin/dircolors ]; then
        test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
        alias ls='ls --color=auto'
        alias grep='grep --color=auto'
        alias fgrep='fgrep --color=auto'
        alias egrep='egrep --color=auto'
    fi
~~~
