---
title : ubuntu에서 jekyll 설치하기
category: "etc"
author: bingbingpa
---

- ubuntu 에서 jekyll 을 설치하는 방법을 정리. 참고로 windows 에서 ubuntu 를 사용하기 위해서는 제어판 - 프로그램 및 기능 - windows 기능 켜기/끄기 에서 Linux 용 Windows 하위 시스템을 체크하고 재부팅이 필요하다.
- 재부팅후에 ms store 에서 ubuntu 를 검색해서 설치하면 windows 에서 ubuntu 를 사용할 수 있다. 실행은 직접 ubuntu 를 검색해서 실행하거나 cmd 창에서 **bash**를 입력해서 실행할 수 있다.
- 설치 방법은 다음과 같다.
- 먼저 update 를 해준다. window ubuntu 일 경우 reboot 는 하지 않고 cmd 창을 다시 실행하면 된다.
- windows ubuntu 의 경우는 권한 관련 문제가 있어서 root 계정으로 설치를 진행했다.
~~~shell
sudo apt update
sudo apt -y upgrade
sudo reboot
~~~
~~~shell
sudo apt -y install make build-essential
~~~
~~~shell
sudo apt -y install ruby ruby-dev
~~~
- 이부분은 windows ubuntu 에서 root 로 진행했다면 넘어가도 된다.
~~~shell
export GEM_HOME=$HOME/gems
export PATH=$HOME/gems/bin:$PATH
~~~
~~~shell
source ~/.bashrc
source ~/.zshrc
~~~
- jekyll & bundler 설치
~~~shell
gem install bundler
gem install jekyll
~~~
- 설치가 완료되면 jekyll 프로젝트 경로로 이동해서 server를 실행한다. 기본포트는 4000번이다.
~~~shell
jekyll serve
~~~
