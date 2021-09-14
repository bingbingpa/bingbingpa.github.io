---
title : docker 에 haproxy 설치
category: "infra"
author: bingbingpa
---

### 1. DockerFile 작성
- centos 에서 dnf 로 haproxy 를 설치하면 1.8.5 버전인가가 설치된다. 현재 최신 버전은 2.1.5 버전인데... 그래서 소스를 받아서 컴파일 해야한다.
- haproxy docker image 로 테스트 하면 되지만 우리가 쓰는 서버는 다 centos 다 보니 이런 삽질을 했다.
- haproxy 를 컴파일하고 유저 만들고 이런건 되는데 systemctl 이 안되서 서비스 등록은 불가능하고 딱 설치까지만 삽질한 내용을 정리해본다.

~~~ dockerfile
    FROM centos:8

    ENV HAPROXY_MJR_VERSION=2.1 \
        HAPROXY_VERSION=2.1.5

    RUN \
        dnf install -y epel-release && \
        dnf update -y && \
        dnf install -y passwd && dnf install -y sudo && dnf install -y ncurses && \
        # haproxy 컴파일을 위한 패키지 추가(USER_SYSTEMD로 컴파일하기 위해 systemd-devel 패키지 필수)
        dnf install -y inotify-tools wget tar gzip make gcc perl pcre-devel zlib-devel systemd-devel && \
        # haproxy download & install
        wget -O /tmp/haproxy.tgz http://www.haproxy.org/download/${HAPROXY_MJR_VERSION}/src/haproxy-${HAPROXY_VERSION}.tar.gz && \
        tar -zxvf /tmp/haproxy.tgz -C /tmp && \
        cd /tmp/haproxy-* && \
        make TARGET=linux-glibc USE_PCRE=1USE_ZLIB=1 USE_SYSTEMD=1 && \
        make install && \
        # 폴더 생성 및 유저 생성
        mkdir -p /var/lib/haproxy && \
        mkdir -p /var/log/haproxy && \
        mkdir -p /etc/haproxy/certs && \
        mkdir -p /etc/haproxy/errors && \
        groupadd haproxy && adduser haproxy -g haproxy && chown -R haproxy:haproxy /var/lib/haproxy && \
        adduser -m gaia3d && \
        # 설치파일 제거
        rm -rf /tmp/haproxy* && \
        dnf remove -y make gcc pcre-devel && \
        dnf clean all && rm -rf /var/cache/dnf
~~~

### 2. service 등록
- /usr/lib/systemd/system 경로에 service 파일 작성

~~~ vim
    [Unit]
    Description=HAProxy Load Balancer
    After=network.target

    [Service]
    Environment="CONFIG=/etc/haproxy/haproxy.cfg" "PIDFILE=/run/haproxy.pid"
    ExecStartPre=haproxy -f $CONFIG -c -q
    ExecStart=haproxy -Ws -f $CONFIG -p $PIDFILE
    ExecReload=haproxy -f $CONFIG -c -q
    ExecReload=/bin/kill -USR2 $MAINPID
    KillMode=mixed
    Type=notify

    [Install]
    WantedBy=multi-user.target
~~~

~~~ bash
    systemctl daemon-reload
~~~

### 3. haproxy.cfg 파일 작성
~~~ vim
    #---------------------------------------------------------------------
    # Global settings
    #---------------------------------------------------------------------
    global
        # to have these messages end up in /var/log/haproxy.log you will
        # need to:
        #
        # 1) configure syslog to accept network log events.  This is done
        #    by adding the '-r' option to the SYSLOGD_OPTIONS in
        #    /etc/sysconfig/syslog
        #
        # 2) configure local2 events to go to the /var/log/haproxy.log
        #   file. A line like the following can be added to
        #   /etc/sysconfig/syslog
        #
        #    local2.*                       /var/log/haproxy.log
        #
        log         127.0.0.1 local2

        chroot      /var/lib/haproxy
        pidfile     /var/run/haproxy.pid
        maxconn     4000
        user        haproxy
        group       haproxy
        daemon

        # turn on stats unix socket
        stats socket /var/lib/haproxy/stats

    #---------------------------------------------------------------------
    # common defaults that all the 'listen' and 'backend' sections will
    # use if not designated in their block
    #---------------------------------------------------------------------
    defaults
        mode                    http
        log                     global
        option                  httplog
        option                  dontlognull
        option http-server-close
        option forwardfor       except 127.0.0.0/8
        option                  redispatch
        retries                 3
        timeout http-request    10s
        timeout queue           1m
        timeout connect         10s
        timeout client          1m
        timeout server          1m
        timeout http-keep-alive 10s
        timeout check           10s
        maxconn                 3000

    #---------------------------------------------------------------------
    # main frontend which proxys to the backends
    #---------------------------------------------------------------------
    frontend main
        bind *:80
        stats uri /haproxy?stats
        acl url_static       path_beg       -i /static /images /javascript /stylesheets
        acl url_static       path_end       -i .jpg .gif .png .css .js

        use_backend static          if url_static
        default_backend             app

    #---------------------------------------------------------------------
    # static backend for serving up images, stylesheets and such
    #---------------------------------------------------------------------
    backend static
        balance     roundrobin
        server      static 127.0.0.1:4331 check

    #---------------------------------------------------------------------
    # round robin balancing between the various backends
    #---------------------------------------------------------------------
    backend app
        balance     roundrobin
        server  app1 127.0.0.1:5001 check
        server  app2 127.0.0.1:5002 check
        server  app3 127.0.0.1:5003 check
        server  app4 127.0.0.1:5004 check
~~~

### 4. haproxy start
~~~ bash
    systemctl start haproxy
~~~
