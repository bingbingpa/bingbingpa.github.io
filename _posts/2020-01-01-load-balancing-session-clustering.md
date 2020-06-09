---
layout : post
title : Load Balancing, Session Clustering
date : 2020-01-01
excerpt : "Centos8 에서 haproxy, apache/nginx, tomcat 으로 Load Balancing, Session Clustering 환경 구축하기"
tags: [apache, tomcat, nginx, Load Balancing, Session Clustering]
categories: [Server]
comments: true
changefreq : daily
---

### 1. 테스트 환경 및 버전  
- 모든 테스트는 docker 에서 진행 
- centos : CentOS Linux release 8.1.1911(centos 버전 확인은 cat /etc/centos-release)
- haproxy : 2.1.5
- apache : 2.4
- nginx : 1.18.0
- tomcat : 9.0.35
- db container : gaia3d/mago3d-postgresql(postgresql-12.3) docker image
- application : mago3d-CMS([mago3d 브런치](https://github.com/Gaia3D/mago3d-CMS/tree/mago3d)) 

### 2. 네트워크 구성도
- img

### 3. container 설정 
- 테스트에는 db, haproxy, apache-tomcat 2 개 총 4개의 컨테이너가 필요하고 apache-tomcat은 하나의 설정이 완료 된 후 이를 복사하여 사용한다.

#### 3.1. 네트워크 설정 
- 테스트 시 모든 사람들이 동일한 ip를 사용하도록 네트워크를 만들어서 사용한다.
~~~
    cmd> docker network create --subnet=172.18.0.0/16 mynetwork 
~~~

#### 3.2. database
- database 는 gaia3d 의 mago3d-postgresql 이미지를 사용하도록 한다. (컨테이너끼리만 접근하므로 별도의 host port는 바인딩하지 않는다.) 
~~~  cmd
    cmd> docker container run --privileged --net mynetwork --ip 172.18.0.10  -d --name "container-db" gaia3d/mago3d-postgresql /sbin/init
~~~

#### 3.3. haproxy
~~~  cmd
    cmd> docker container run --privileged --net mynetwork --ip 172.18.0.11  -d -p 80:80 -p 9090:9090 --name "haproxy" gaia3d/haproxy /sbin/init
~~~

#### 3.4. apache-tomcat
- mago3d-CMS 저장소의 doc-docker 폴더경로에서 다음을 실행해서 container 를 생성한다. 
~~~ cmd
    cmd> docker build apache-tomcat -t apache-tomcat
    cmd> docker container run --privileged --net mynetwork --ip 172.18.0.12  -d -p 10080:80 -p 18081:8081 -p 19090:9090 --name "apache-tomcat1" apache-tomcat /sbin/init
~~~

### 4. 유저 생성 및 sudo 권한 설정
- tomcat 과 관련된 다음의 모든 과정은 생성한 apache-tomcat1 컨테이너에 접근하여 수행한다. 
~~~ cmd
    cmd> docker exec -it apache-tomcat1 bash
~~~
- root 계정외의 별도의 계정을 생성하고 서비스 실행을 위한 권한만 부여한다. 
~~~ bash
    adduser -m gaia3d
~~~
- 유저 생성 후 **passwd** 명령으로 패스워드를 설정해준다. 
~~~ bash
    passwd gaia3d
~~~
- 생성한 계정에 필요한 명령만 권한을 준다. **/etc/sudoers** 를 직접 수정할 수도 있지만. visudo를 사용 할 경우 파일 수정 시 오타나 문법 오류 등을 검사해 주므로 visudo를 사용한다. 
~~~ bash
    sudo visudo
    gaia3d  ALL=NOPASSWD:   /bin/systemctl
~~~
<img src="/static/img/web-load-balancing/visudo.png">

### 5. tomcat 설정
- container 에는 dockerfile 을 통해 미리 다운 받은 jdk와 tomcat이 있다. 이를 /home/생성한 유저폴더 경로로 옮겨주고 권한은 해당 유저의 권한으로 변경해준다. 
~~~ bash
    mv /setup /home/gaia3d/
    chown -R gaia3d:gaia3d /home/gaia3d/setup
~~~
- 이후 작업은 생성한 사용자로 진행한다. 
~~~ bash
    su gaia3d
~~~

#### 5.1. 압축 해제 / 경로 설정 
~~~ bash
    cd /home/gaia3d/setup
    tar -xvzf jdk-11.tgz
    tar -xvzf tomcat.tgz
    mkdir ../tools && mv apache-tomcat-9.0.36 mago3d-tomcat && mv mago3d-tomcat ../tools && mv jdk-11.0.2 ../tools 
~~~

#### 5.2. 환경설정
#### 5.2.1. 자바 경로 및 메모리 설정
- linux 의 경우에는 setenv.sh 파일을 만들어 작성하고, windows 의 경우에는 setenv.bat 파일을 만들어 작성한다. 
- **windows 의 경우 서비스로 등록시 setenv.bat 파일을 읽지 않기 때문에 service.bat 에 설정하거나 환경 변수로 등록해야 한다.**    
~~~ bash
    cd /home/gaia3d/tools/mago3d-tomcat/bin
    vi setenv.sh
~~~
~~~ text
    export JAVA_HOME=/home/gaia3d/tools/jdk-11.0.2
    export JAVA_OPTS=-D-Xms4096m-Xmx4096m
~~~
- tomcat cache 설정 
~~~ bash
    vi /home/gaia3d/tools/mago3d-tomcat/conf/context.xml
~~~
~~~ text
    <Resources cachingAllowed="true" cacheMaxSize="100000"/>
~~~

#### 5.2.2. application 경로 설정 
- server.xml 설정 : service 엘리먼트를 다음과 같이 수정한다. 
~~~ bash
    vi /home/gaia3d/tools/mago3d-tomcat/conf/server.xml
~~~
- **배치되는 application 의 경로는 docBase로 절대 경로를 잡아준다.** webapp 밑에 배치하지 않는 이유는 
apllication 에서 로그 파일을 쓸 경우 webapp 밑에 있는 경우 충돌이나 에러가 발생하는 경우가 있어 별도의 폴더에 배치하여 사용한다. 
- **application의 의도치 않은 재시작 및 덮어쓰기를 방지하기 위해 unpackWARs, autoDeploy, reloadable 옵션은 false 로 변경한다.**   
~~~ xml
     <Service name="Catalina">
    
        <Connector port="9090" protocol="HTTP/1.1"
                   connectionTimeout="20000"
                   redirectPort="8446" />
    
        <!--<Connector port="8049" protocol="AJP/1.3" redirectPort="8446" />-->
    
        <Engine name="Catalina" defaultHost="localhost" jvmRoute="admin1">
    
          <Realm className="org.apache.catalina.realm.LockOutRealm">
    
            <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
                   resourceName="UserDatabase"/>
          </Realm>
    
          <Host name="localhost"  appBase="webapps"
                unpackWARs="false" autoDeploy="false">
    
            <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
                   prefix="localhost_access_log" suffix=".txt"
                   pattern="%h %l %u %t &quot;%r&quot; %s %b" />
            <Context docBase="/home/gaia3d/tools/mago3d-tomcat/source/mago3d-admin" path="" reloadable="false" />
          </Host>
        </Engine>
      </Service>
    
      <Service name="Catalina2">
    
        <Connector port="8081" protocol="HTTP/1.1"
                   connectionTimeout="20000"
                   redirectPort="8447" />
    
        <!--<Connector port="8059" protocol="AJP/1.3" redirectPort="8447" />-->
    
        <Engine name="Catalina2" defaultHost="localhost" jvmRoute="user1">
    
          <Realm className="org.apache.catalina.realm.LockOutRealm">
    
            <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
                   resourceName="UserDatabase"/>
          </Realm>
    
          <Host name="localhost"  appBase="webapps"
                unpackWARs="false" autoDeploy="false">
    
            <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
                   prefix="localhost_access_log2" suffix=".txt"
                   pattern="%h %l %u %t &quot;%r&quot; %s %b" />
            <Context docBase="/home/gaia3d/tools/mago3d-tomcat/source/mago3d-user" path="" reloadable="false" />
          </Host>
        </Engine>
      </Service>
~~~

#### 5.2.3. application 배치
- **resources/develop/application.properties 수정**
    - mago3d-CMS jdbc url 은 localhost 로 되어 있으므로 생성한 container-db 의 ip로 변경해준다.
- 프로젝트 빌드 
    - profile 을 develop 으로 해서 빌드한다. 
    - **springBoot 2.3.0 버전부터는 gradle-6.2.2 보다 상위 버전의 gradle 로 변경후 빌드해야 한다.**
    ~~~ cmd
        cmd> gradle clean -xtest
        cmd> gradle build -xtest -Pprofile=develop
    ~~~   
- mago3d-CMS 프로젝트를 빌드 후 war 파일을 컨테이너로 복사한다. 
~~~ cmd
    cmd> docker container cp d:\mago3d-user-0.0.1-SNAPSHOT.war apache-tomcat1:/home/gaia3d/setup
    cmd> docker container cp d:\mago3d-admin-0.0.1-SNAPSHOT.war apache-tomcat1:/home/gaia3d/setup
~~~
- 복사한 파일 권한 설정 및 이동 
~~~ bash
    chown gaia3d:gaia3d /home/gaia3d/setup/*.war
    su gaia3d
    cd /home/gaia3d/tools/mago3d-tomcat/ && mkdir -p source/mago3d-admin && mkdir -p source/mago3d-user
    cd /home/gaia3d/setup/
    unzip mago3d-admin-0.0.1-SNAPSHOT.war -d ../tools/mago3d-tomcat/source/mago3d-admin/
    unzip mago3d-user-0.0.1-SNAPSHOT.war -d ../tools/mago3d-tomcat/source/mago3d-user/
~~~

#### 5.2.4. log 설정 
- 톰캣에서 서비스되는 어플리케이션의 비즈니스 로그는 기본적으로 톰캣의 logs/catalina.out 파일에 기록되는데 로그 설정을 따로 하지 않으면 
계속 이 파일에 로그가 기록되어 파일 사이즈가 계속 커지게 된다. 따라서 별도의 설정이 필요한데 /etc/rogrotate.conf 에 로그 설정을 하는 방법이 있고 
logback이나 log4j를 사용하는 방법이 있는데 여기서는 현재 프로젝트에 사용하고 있는 logback을 사용해서 로그 설정을 한다.
- 먼저 기존에 기록되던 catalina.out 파일에 더이상 로그를 쓰지 않도록 설정한다.
~~~ bash
    vi /home/gaia3d/tools/mago3d-tomcat/bin/catalina.sh
~~~
~~~ bash
    CATALINA_OUT=/dev/null
~~~
<img src="/static/img/web-load-balancing/catalina.png">
- logback 설정 확인 
    - build 시 설정한 profile 대로 로그 파일이 파일로 생성 되도록 설정 되어 있는지 확인 한다. 
    <img src="/static/img/web-load-balancing/logback.png">    

     
#### 5.2.5. service 등록 
~~~ bash
    exit(root 계정으로 변경)
    vi /usr/lib/systemd/system/mago3d-tomcat.service
~~~
~~~ text
    [Unit]
    Description=gis
    After=syslog.target
    
    [Service]
    Type=forking
    User=gaia3d
    Group=gaia3d
    ExecStart=/home/gaia3d/tools/mago3d-tomcat/bin/startup.sh
    ExecStop=/home/gaia3d/tools/mago3d-tomcat/bin/shutdown.sh
    SuccessExitStatus=143
    
    [Install]
    WantedBy=multi-user.target
~~~
- 서비스 자동 재시작 등록 및 daemon 리로드 후 서비스 시작
~~~ bash
    systemctl enable mago3d-tomcat && systemctl daemon-reload && systemctl start mago3d-tomcat
~~~

### 6. session clustering 설정

### 7. apache 설정
- apache 설정과 관련된 부분은 root 계정으로 진행한다.
#### 7.1. complie 관련 패키지 설치
~~~ bash
    dnf install -y gcc gcc-c++ httpd-devel redhat-rpm-config
~~~ 

#### 7.2. apache 설치 
~~~ bash
    dnf install -y httpd
~~~

#### 7.3. 압축해제 및 컴파일
- apache 와 was 를 연결하는 방법에는 mod_jk, mod_proxy, mod_proxy_ajp 이렇게 3가지가 있지만 여기에서는 mod_jk를 사용하도록 한다.
- 컴파일이 정상적으로 되면 /etc/httpd/modules 경로에 mod_jk.so 파일이 생성된다. 
~~~ bash
    cd /home/gaia3d/setup
    tar -xvzf tomcat-connectors.tgz
    cd tomcat-connectors-1.2.48-src/native
    ./configure --with-apxs=/usr/bin/apxs
    make && make install
~~~

#### 7.4. mod_jk.conf 파일 생성 
- mod_jk 의 로그 및 worker 파일 위치 및 기타 설정들을 설정한다.
~~~ bash
    vi /etc/httpd/conf.modules.d/mod_jk.conf 
~~~
~~~ text
    <IfModule mod_jk.c>
    # 워커 설정파일 위치     
    JkWorkersFile conf/workers.properties     
    # 공유 메모리파일 위치 반드시 Selinux 보안때문에 run에 위치 필수     
    JkShmFile run/mod_jk.shm     
    # log 위치     
    JkLogFile logs/mod_jk.log     
    # 로그레벨 설정     
    JkLogLevel info     
    # 로그 포맷에 사용할 시간 형식을 지정한다.     
    JkLogStampFormat "[%y %m %d %H:%M:%S]" 
    </IfModule>
~~~

#### 7.5. workers.properties 파일 생성 
- apache 에서 로드 밸런싱 해줄 톰캣에 대한 설정 정보 파일이다. **port는 http port 가 아닌 ajp port 를 사용한다.**
- lbfactor 가중치에 따라 로드 밸런싱 된다.
~~~ bash
    vi /etc/httpd/conf/workers.properties
~~~
~~~ text
    worker.list=admin,user
    
    worker.admin.type=lb
    worker.admin.balance_workers=admin1,admin2
    
    worker.admin1.type=ajp13
    worker.admin1.host=172.17.0.4
    worker.admin1.port=8049
    worker.admin1.lbfactor=1
    
    worker.admin2.type=ajp13
    worker.admin2.host=172.17.0.5
    worker.admin2.port=8049
    worker.admin2.lbfactor=1
    
    worker.user.type=lb
    worker.user.balance_workers=user1,user2
    
    worker.user1.type=ajp13
    worker.user1.host=172.17.0.4
    worker.user1.port=8059
    worker.user1.lbfactor=1
    
    worker.user2.type=ajp13
    worker.user2.host=172.17.0.5
    worker.user2.port=8059
    worker.user2.lbfactor=1
~~~

#### 7.6. httpd.conf 설정
~~~ bash
    vi /etc/httpd/conf/httpd.conf
~~~
~~~ bash
    Listen 9090
    LoadModule jk_module modules/mod_jk.so
~~~
<img src="/static/img/web-load-balancing/visudo.png">
~~~ bash
    <VirtualHost *:80>
    ServerName mago3d-user
    JkMount /* user
    JkUnMount  /images/* user
    JkUnMount  /js/* user
    JkUnMount  /css/* user
    jkUnMount  /externlib/* user
    DocumentRoot "/var/www/mago3d-user"
    </VirtualHost>
    <VirtualHost *:9090>
    ServerName mago3d-admin
    JkMount /* admin
    JkUnMount  /images/* admin
    JkUnMount  /js/* admin
    JkUnMount  /css/* admin
    jkUnMount  /externlib/* admin
    DocumentRoot "/var/www/mago3d-admin"
    </VirtualHost>
~~~

#### 7.7. static resource 복사 
- static 파일들을 apache 에서 처리하도록 httpd.conf 파일에 설정한 폴더를 생성하고 파일들을 복사해준다. 
~~~ bash
    mkdir /var/www/mago3d-user && mkdir /var/www/mago3d-admin
~~~


### 8. haproxy 설정 

### 9. nginx 설정 
