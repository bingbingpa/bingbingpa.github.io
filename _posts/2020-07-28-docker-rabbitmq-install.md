---
layout : post
title : docker rabbitMQ 설정 하기
date : 2020-07-28
excerpt : "centos 이미지 컨테이너에 rabbitMQ 설치 및 설정 하기                  "
tags: [docker, centos, rabbitMQ]
categories: [DevOps]
comments: true
changefreq : daily
---

### 1. 필요 패키지 다운로드 
~~~ bash
    wget https://packages.erlang-solutions.com/erlang/rpm/centos/8/x86_64/esl-erlang_23.0.2-2~centos~8_amd64.rpm
    wget https://dl.bintray.com/rabbitmq/all/rabbitmq-server/3.8.5/rabbitmq-server-3.8.5-1.el7.noarch.rpm
~~~

### 2. Erlang, rabbitMQ 설치 
~~~ bash
    dnf -y install esl-erlang_23.0.2-2~centos~8_amd64.rpm
    dnf -y install rabbitmq-server-3.8.5-1.el7.noarch.rpm
~~~

### 3. 자동 재시작 등록 
~~~ bash
    systemctl enable rabbitmq-server
    systemctl daemon-reload
~~~

### 4. rabbitMQ 관리자 플러그인 enable 설정 
~~~ bash
    ./usr/sbin/rabbitmq-plugins enable rabbitmq_management
~~~

### 5. 설정파일 작성 
- advanced.config 파일 작성 
~~~ bash
    vim /etc/rabbitmq/advanced.config 
~~~
~~~ json
    [
       {rabbit, [
    				{loopback_users, []}
    			 ]},
       {rabbitmq_management, [
                               {load_definitions, "/etc/rabbitmq/definitions.json"}
    	]}
     ].
~~~

- definitions.json 작성 : 여기에 실제로 사용할 유저 및 queue 와 exchange 설정을 한다. 
~~~ bash
    vim /etc/rabbitmq/definitions.json
~~~
~~~ json
    {
    	 "rabbit_version": "3.8.5",
    		  "users": [
    			    {
    					   "name": "lhdt",
    					   "password_hash": "XSBSynnbW/DxugD+NGvuN7mFfXMdxaA3NaIOjML7QHkajUxW",
    					   "hashing_algorithm": "rabbit_password_hashing_sha256",
    					   "tags": "administrator"
    				}
    	  ],
    	   "vhosts": [
    		     {
    				    "name": "/"
    						  }
    	   ],
    	    "permissions": [
    			  {
    				     "user": "lhdt",
    					 "vhost": "/",
    					 "configure": ".*",
    					 "write": ".*",
    					 "read": ".*"
    			}
    	    ],
    		 "parameters": [],
    		  "policies": [],
    		   "queues": [
    			   {
    			         "name": "f4d.converter.queue",
    					 "vhost": "/",
    					 "durable": true,
    					 "auto_delete": false,
    					 "arguments": {}
    			  }
    		   ],
    		    "exchanges": [
    				{
    				      "name": "f4d.converter",
    					  "vhost": "/",
    					  "type": "topic",
    					  "durable": true,
    					  "auto_delete": false,
    					  "internal": false,
    					  "arguments": {}
    			      }
    			],
    			 "bindings": []
    }
~~~

- 패스워드 암호화에는 다음의 파이썬 스크립트를 사용
~~~ python
    #!/usr/bin/env python
    # details on rabbitMQ password hashing 
    # https://www.rabbitmq.com/passwords.html#computing-password-hash
    
    from __future__ import print_function
    import base64
    import os
    import hashlib
    import struct
    import getpass
    
    # This is the password we wish to encode
    password1 = getpass.getpass("password: ")
    password2 = getpass.getpass("again: ")
    
    if password1 != password2:
      print("passwords do not match")
      exit(1)
    
    # 1.Generate a random 32 bit salt:
    # This will generate 32 bits of random data:
    salt = os.urandom(4)
    
    # 2.Concatenate that with the UTF-8 representation of the password
    tmp0 = salt + password1.encode('utf-8')
    
    # 3. Take the SHA256 hash and get the bytes back
    tmp1 = hashlib.sha256(tmp0).digest()
    
    # 4. Concatenate the salt again:
    salted_hash = salt + tmp1
    
    # 5. convert to base64 encoding:
    pass_hash = base64.b64encode(salted_hash)
    
    print(pass_hash)
~~~ 

- 참고
    - 로그 파일 위치 : /var/log/rabbitmq 
    - 설정 파일 위치 : /etc/rabbitmq
    - 실행 파일 위치 : /usr/sbin/rabbitmq-server
 


