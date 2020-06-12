---
layout : post
title : Load Balancing, Session Clustering
date : 2020-06-10
excerpt : "Centos8 에서 haproxy, apache, tomcat 으로 Load Balancing, Session Clustering 환경 구축 하기"
tags: [apache, tomcat, Load Balancing, Session Clustering]
categories: [Server]
comments: true
changefreq : daily
---

### 1. 테스트 환경 및 버전  
- 모든 테스트는 docker 에서 진행 
- centos : CentOS Linux release 8.1.1911(centos 버전 확인은 cat /etc/centos-release)
- haproxy : 2.1.5
- apache : 2.4
- tomcat-conectors(mod_jk) : 1.2.48
- tomcat : 9.0.35
- db container : gaia3d/mago3d-postgresql(postgresql-12.3) docker image
- application : mago3d-CMS([mago3d 브런치](https://github.com/Gaia3D/mago3d-CMS/tree/mago3d)) 

### 2. 네트워크 구성도
<img src="/static/img/web-load-balancing/network.png">
- 설정 순서 
    - 사용자 설정
    - tomcat 서비스 설정 
    - session clustering
    - apache 설치 및 mod_jk 컴파일 및 설정 
    - haproxy  

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
- 로드 밸런스 테스트를 위한 haproxy container 
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
- tomcat 과 관련된 다음의 모든 과정은 생성한 apache-tomcat1 컨테이너에 연결해서 수행한다. 
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
    rm -rf /home/gaia3d/tools/mago3d-tomcat/webapps/* 
~~~

#### 5.2. 자바 경로 및 메모리 설정
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

#### 5.3. application 경로 설정 
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
    
        <!--<Connector port="8019" protocol="AJP/1.3" redirectPort="8446" address="0.0.0.0" secretRequired="false"/>-->
    
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
    
        <!--<Connector port="8029" protocol="AJP/1.3" redirectPort="8447" address="0.0.0.0" secretRequired="false"/>-->
    
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

#### 5.4. application 배치
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

#### 5.5. log 설정 
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

     
#### 5.6. service 등록 
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
- session 에 담기는 모든 객체는 **java.io.Serializable** 을 상속 해야 한다. [참고](https://woowabros.github.io/experience/2017/10/17/java-serialize.html) 
- tomcat 에서 제공하는 session clustering 은 node 가 4대 이상일 경우 속도가 매우 떨어지므로 4대 이상의 노드를 연결할 경우에는 redis 와 같은 별도의 세션 관리 방법이 필요하다. 
- Manager : 세션을 어떻게 복제할지를 책임지는 객체
    - DeltaManager : 모든 노드에 동일한 세션을 복제한다. 정보가 변경될 때 마다 복제하기 때문에 노드 개수가 많을 수록 네트워크 트래픽이 높아지고 메모리 소모가 심해진다.
    - BackupManager : Primary Node 와 Backup Node 로 분리 되어 모든 노드에 복제하지 않고 Backup Node 에만 복제한다.
    - PersistentManager : DB 나 파일 시스템을 이용하여 세션을 저장하는데, IO 문제가 생기기 때문에 실시간성이 떨어진다. 
- Channel
    - Membership : Cluster 안의 노드들을 동적으로 분별하는데 Multicast IP/PORT 를 통해 frequency 에 설정된 간격으로 각 노드들이 UDP packet 을 날려 상태를 확인한다.
    - Receiver : Cluster 로부터 메시지를 수신하는 역활을 하며 blocking 방식 **org.apache.catalina.tribes.transport.bio.BioReceiver**와 non-blocking방식인
     **org.apache.catalina.tribes.transport.nio.NioReceiver**을 지원합니다.
- channelSendOptions : 기본값은 8 이며, 8은 비동기 6은 동기 방식이다.
- 앞서 설정한 server.xml 에 각 서비스별로 다음의 내용을 추가한다. 각 서비스별로 Membership 의 address 와 Receiver 의 port는 달라야 한다. 
~~~ text
    <Cluster className="org.apache.catalina.ha.tcp.SimpleTcpCluster" channelSendOptions="8">
    
        <Manager className="org.apache.catalina.ha.session.DeltaManager" expireSessionsOnShutdown="false" notifyListenersOnReplication="true" />
    
        <Channel className="org.apache.catalina.tribes.group.GroupChannel">
            <Membership className="org.apache.catalina.tribes.membership.McastService" address="228.0.0.4" port="45564" frequency="500" dropTime="3000" />
    
            <Receiver className="org.apache.catalina.tribes.transport.nio.NioReceiver" address="auto" port="4000" autoBind="100" selectorTimeout="5000" maxThreads="6" />
    
            <Sender className="org.apache.catalina.tribes.transport.ReplicationTransmitter">
                <Transport className="org.apache.catalina.tribes.transport.nio.PooledParallelSender" />
            </Sender>
    
            <Interceptor className="org.apache.catalina.tribes.group.interceptors.TcpFailureDetector" />
            <Interceptor className="org.apache.catalina.tribes.group.interceptors.MessageDispatchInterceptor" />
        </Channel>
    
        <Valve className="org.apache.catalina.ha.tcp.ReplicationValve" filter="" />
        <Valve className="org.apache.catalina.ha.session.JvmRouteBinderValve" />
    
        <Deployer className="org.apache.catalina.ha.deploy.FarmWarDeployer" tempDir="/tmp/war-temp/" deployDir="/tmp/war-deploy/" watchDir="/tmp/war-listen/" watchEnabled="false" />
    
        <ClusterListener className="org.apache.catalina.ha.session.ClusterSessionListener" />
    </Cluster>
~~~

- web.xml 설정 : **\<distributable/>** 을 web.xml 에 추가한다. 톰캣이 아닌 어플리케이션의 web.xml 에 설정해야 한다. 별도의 web.xml 이 없다면 생성해서 저 내용을 추가해야지 정상동작한다. 

- 지금까지 설정한 컨테이너를 이미지로 만들어 동일한 컨테이너를 만든다. 
~~~ cmd
    cmd> docker container commit apache-tomcat1 temp
    cmd> docker container run --privileged --net mynetwork --ip 172.18.0.13  -d -p 20080:80 -p 28081:8081 -p 29090:9090 --name "temp" temp /sbin/init
~~~
- apache-tomcat1, temp container 의 톰캣을 재시작 한다. 
<img src="/static/img/web-load-balancing/socket-bind.png">
- apache-tomcat1 에서 mago3d-CMS 시스템에 로그인 하고 temp 의 index 페이지에 접근하여 세션이 공유 되어 로그인이 된 상태인지 확인한다.
- admin 사이트에서 로그인 한 세션이 user 사이트로 로그인 되지 않는지 확인한다. admin / user 는 각기 다른 세션을 사용해야 한다.
    - admin / user 서비스가 같은 클러스터 채널을 사용한다면 Serializable 에러가 발생한다.   

### 7. apache 설정
#### 7.1. apache 및 compile 관련 패키지 설치
- apache 설정과 관련된 부분은 root 계정으로 진행한다.
~~~ bash
    dnf install -y gcc gcc-c++ httpd-devel redhat-rpm-config
~~~ 
- httpd 자동 재시작 설정
~~~ bash
    systemctl enable httpd && systemctl daemon-reload
~~~

#### 7.2. 압축해제 및 컴파일
- apache 와 was 를 연결하는 방법에는 mod_jk, mod_proxy, mod_proxy_ajp 이렇게 3가지가 있지만 여기에서는 mod_jk를 사용하도록 한다.
- 컴파일이 정상적으로 되면 /etc/httpd/modules 경로에 mod_jk.so 파일이 생성된다. 
~~~ bash
    cd /home/gaia3d/setup
    tar -xvzf tomcat-connectors.tgz
    cd tomcat-connectors-1.2.48-src/native
    ./configure --with-apxs=/usr/bin/apxs
    make && make install
~~~

#### 7.3. mod_jk.conf 파일 생성 
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

#### 7.4. workers.properties 파일 생성 
- apache 에서 로드 밸런싱 해줄 톰캣에 대한 설정 정보 파일이다. **port는 http port 가 아닌 ajp port 를 사용한다.**
- lbfactor : 가중치에 따라 로드 밸런싱 된다.
- sticky_session : 기존의 세션 아이디 뒤에 jvmroutid 를 붙여 어느 서버로 갈지 결정 한다.
~~~ bash
    vi /etc/httpd/conf/workers.properties
~~~
~~~ text
    worker.list=admin,user
    
    worker.admin.type=lb
    worker.admin.balance_workers=admin1,admin2
    worker.admin.sticky_session=true
    
    worker.admin1.type=ajp13
    worker.admin1.host=172.18.0.12
    worker.admin1.port=8019
    worker.admin1.lbfactor=1
    
    worker.admin2.type=ajp13
    worker.admin2.host=172.18.0.13
    worker.admin2.port=8019
    worker.admin2.lbfactor=1
    
    worker.user.type=lb
    worker.user.balance_workers=user1,user2
    worker.user.sticky_session=true
    
    worker.user1.type=ajp13
    worker.user1.host=172.18.0.12
    worker.user1.port=8029
    worker.user1.lbfactor=1
    
    worker.user2.type=ajp13
    worker.user2.host=172.18.0.13
    worker.user2.port=8029
    worker.user2.lbfactor=1
~~~

#### 7.5. httpd.conf 설정
~~~ bash
    vi /etc/httpd/conf/httpd.conf
~~~
~~~ text
    Listen 9090
    
    LoadModule jk_module modules/mod_jk.so
    <VirtualHost *:80>
    ServerName mago3d-user
    JkMount /* user
    JkUnMount  /images/* user
    JkUnMount  /js/* user
    JkUnMount  /css/* user
    jkUnMount  /externlib/* user
    jkUnMount  /sample/* user
    DocumentRoot "/var/www/mago3d-user"
    </VirtualHost>

    <VirtualHost *:9090>
    ServerName mago3d-admin
    JkMount /* admin
    JkUnMount  /images/* admin
    JkUnMount  /js/* admin
    JkUnMount  /css/* admin
    jkUnMount  /externlib/* admin
    jkUnMount  /sample/* admin
    DocumentRoot "/var/www/mago3d-admin"
    </VirtualHost>
~~~
<img src="/static/img/web-load-balancing/httpd-conf.png">

#### 7.6. static resource 복사 
- static 파일들을 apache 에서 처리하도록 httpd.conf 파일에 설정한 폴더를 생성하고 파일들을 복사해준다. 
~~~ bash
    mkdir /var/www/mago3d-user && mkdir /var/www/mago3d-admin
    cp -R /home/gaia3d/tools/mago3d-tomcat/source/mago3d-admin/WEB-INF/classes/static/* /var/www/mago3d-admin/
    cp -R /home/gaia3d/tools/mago3d-tomcat/source/mago3d-user/WEB-INF/classes/static/* /var/www/mago3d-user/
~~~

#### 7.7. tomcat ajp 포트 설정
- session clustering 테스르를 위해 http port 로 실행한 톰캣의 port 를 ajp port 로 변경 한다.(기존의 http port 를 주석 하고 ajp port 를 주석 해제 한다.)
- **tomcat 버전에 따라 secretRequired 값을 설정 하지 않으면 톰캣이 시작 되지 않을 수 있다.**
~~~ bash
    su gaia3d
    vi /home/gaia3d/tools/mago3d-tomcat/conf/server.xml
~~~
<img src="/static/img/web-load-balancing/ajp-port.png">
- 설정 변경 후 톰캣 - apache 순으로 재시작한다.  
~~~ bash
    sudo systemctl restart mago3d-tomcat
    sudo systemctl restart httpd
~~~

#### 7.8. container 생성
- 테스트를 위해 생성한 temp container 를 삭제하고 지금까지 설정한 내용을 기반으로 container 를 생성한다.
~~~ cmd
    cmd> docker container stop temp
    cmd> docker container rm temp
    cmd> docker container commit apache-tomcat1 apache-tomcat2
    cmd> docker container run --privileged --net mynetwork --ip 172.18.0.13  -d -p 20080:80 -p 28081:8081 -p 29090:9090 --name "apache-tomcat2" apache-tomcat2 /sbin/init
~~~  
- 생성한 container 에서 tomcat 의 jvmRoute 값을 각각 admin2, user2 로 변경한다. 

#### 7.9. 테스트 
- apache-tomcat1 의 port 로 사용자 또는 관리자 사이트에 접속해서 개발자 도구의 네트워크 탭에서 세션을 확인 한다. 
- apache-tomcat1 container 를 stop 했을 때 기존의 세션값이 그대로 넘어 가고 jvmroutid 가 변경 됐는지 확인 한다.  
<img src="/static/img/web-load-balancing/session-test.png">

### 8. haproxy 설정 
- haproxy container 연결 
~~~ cmd
    cmd> docker exec -it haproxy bash 
~~~

- haproxy.cfg 파일에서 frontend, backend 부분 수정  
~~~
    vi /etc/haproxy/haproxy.cfg 
~~~ 
~~~ text
    #---------------------------------------------------------------------
    # main frontend which proxys to the backends
    #---------------------------------------------------------------------
    frontend mago3d-user-front
        bind *:80
        stats uri /haproxy?stats
    
        default_backend    mago3d-user
    
    #---------------------------------------------------------------------
    # round robin balancing between the various backends
    #---------------------------------------------------------------------
    backend mago3d-user
        balance     roundrobin
        server  user-server-1-host   172.18.0.12:80  check fall 3 rise 2
        server  user-server-2-host   172.18.0.13:80  check fall 3 rise 2
    
    
    
    #---------------------------------------------------------------------
    # main frontend which proxys to the backends
    #---------------------------------------------------------------------
    frontend mago3d-admin-front
        bind *:9090
        stats uri /haproxy?stats
    
        default_backend    mago3d-admin
    
    #---------------------------------------------------------------------
    # round robin balancing between the various backends
    #---------------------------------------------------------------------
    backend mago3d-admin
        balance     roundrobin
        server  admin-server-1-host   172.18.0.12:9090  check fall 3 rise 2
        server  admin-server-2-host   172.18.0.13:9090  check fall 3 rise 2
~~~

- 파일 유효성 확인 후 재시작 
~~~ bash
    haproxy -f haproxy.cfg -c
    systemctl restart haproxy
~~~
- haproxy container 의 바인딩 포트인 80 / 9090 으로 확인 한다. 
