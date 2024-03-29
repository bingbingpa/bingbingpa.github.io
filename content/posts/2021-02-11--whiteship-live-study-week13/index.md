---
title : 자바 I/O
category: "whiteship-live-study"
author: bingbingpa
---

## whiteship/live-study 13주차 정리
- 목표
    - [자바의 Input 과 Output 에 대해 학습하세요.](https://github.com/whiteship/live-study/issues/13)
- 학습할 것 (필수)
    - 스트림 (Stream) / 버퍼 (Buffer) / 채널 (Channel) 기반의 I/O
    - InputStream 과 OutputStream
    - Byte 와 Character 스트림
    - 표준 스트림 (System.in, System.out, System.err)
    - 파일 읽고 쓰기

<br>

### 1. 스트림 (Stream) / 버퍼 (Buffer) / 채널 (Channel) 기반의 I/O
- 스트림
    - FIFO(First In First Out)
    - 단방향 이기 때문에 입력 스트림과 출력 스트림을 별도로 사용해야
    - 연속된 데이터의 흐름으로 입출력 진행시 다른 작업을 할 수 없는 블로킹(Blocking) 상태가 된다.
    - 입출력 대상을 변경하기 편하며 동일한 프로그램 구조를 유지할 수 있다.
- 자바 NIO(New I/O)
    - 자바 1.4 버전부터 추가된 API 로 넌블로킹(Non-blocking) 처리가 가능하며, 스트림이 아닌 채널(Channel)을 사용한다.
- 버퍼
    - byte, char, int 등 기본 데이터 타입을 저장할 수 있는 저장소로서, 배열과 마찬가지로 제한된 크기(capacity) 에 순서대로 데이터를 저장한다.
    - 버퍼는 데이터를 저장하기 위한 것이지만, 실제로 버퍼가 사용되는 것는 채널을 통해서 데이터를 주고 받을 때 쓰인다.
    - **채널을 통해서 소켓, 파일 등에 데이터를 전송할 때나 읽어올 때 버퍼를 사용하게 됨으로써 가비지량을 최소화 시킬 수 있게 되며, 이는 가바지 콜렉션 회수를 줄임으로써 서버의 전체 처리량을 증가시켜준다.**
- 채널
    - 데이터가 통과하는 쌍방향 통로이며, 채널에서 데이터를 주고 받을 때 사용 되는 것이 버퍼이다.
    - 채널에는 소켓과 연결된 SocketChannel, 파일과 연결된 FileChannel, 파이프와 연결된 Pipe.SinkChannel 과 Pipe.SourceChannel 등이 존재하며, 서버소켓과 연결된 ServerSocketChannel 도 존재한다.
- IO vs NIO
    - IO 의 방식으로 각각의 스트림에서 read() 와 write() 가 호출이 되면 데이터가 입력 되고, 데이터가 출력되기전까지, 스레드는 블로킹(멈춤) 상태가 된다. 이렇게 되면 작업이 끝날때까지 기다려야 하며,
    그 이전에는 해당 IO 스레드는 사용할 수 없게 되고, 인터럽트도 할 수 없다. 블로킹을 빠져나오려면 스트림을 닫는 방법 밖에 없다.
    - NIO 의 블로킹 상태에서는 Interrupt 를 이용하여 빠져나올 수 있다.

    - |구분|IO|NIO|
    |:--|:--|:--|
    |입출력 방식|스트림|채널|
    |버퍼 방식|Non-Buffer|Buffer|
    |비동기 방식 지원|X|O|
    |Blocking/Non-Blocking 방식|Blocking Only|Both|
    |사용 케이스|연결 클라이언트가 적고, IO 가 큰 경우(대용량)|연결 클라이언트가 많고, IO 처리가 작은 경우(저용량)|

<br>

### 2. InputStream 과 OutputStream
- InputStream
    - 바이트 기반 입력 스트림의 최상위 추상 클래스
    - 모든 바이트 기반 입력 스트림은 이 클래스를 상속 받아서 만들어 진다.
    - 버퍼, 파일, 네트워크 단에서 입력되는 데이터를 읽어오는 기능을 수행한다.

    - |메서드|설명|
    |:--|:--|
    |read()|입력 스트림으로부터 1바이트를 읽어서 바이트를 리턴|
    |read(byte[] b)|입력 스트림으로부터 읽은 바이트들을 매개값으로 주어진 바이트 배열 b 에 저장하고 실제로 읽은 바이트 수를 리턴|
    |read(byte[] b, int off, int len)|입력 스트림으로부터 len 개의 바이트만큼 읽고 매개값으로 주어진 바이트 배열 b[off] 부터 len 개까지 저장. 그리고 실제로 읽은 바이트 수인 len 개를 리턴. 만약 len 개를 모두 읽지 못하면 실제로 읽은 바이트 수를 리턴|
    |close()|사용한 시스템 자원을 반납하고 입력 스트림 닫기|
- OutputStream
    - 바이트 기반 출력 스트림의 최상위 추상 클래스
    - 모든 바이트 기반 출력 스트림은 이 클래스를 상속 받아서 만들어 진다.
    - 버퍼, 파일, 네트워크 단으로 데이터를 내보내는 기능을 수행한다.

    - |메서드|설명|
    |:--|:--|
    |write(int b)|출력 스트림으로부터 1바이트를 보낸다.(b 의 끝 1바이트|
    |write(byte[] b)|출력 스트림으로부터 주어진 바이트 배열 b의 모든 바이트를 보낸다.|
    |write(byte[ ] b, int off, int len)|출력 스트림으로 주어진 바이트 배열 b[off] 부터 len 개까지의 바이트를 보낸다.|
    |flush()|버퍼에 잔류하는 모든 바이트를 출력한다.|
    |close()|사용한 시스템 자원을 반납하고 입력 스트림 닫기|

<br>

### 3. Byte 와 Character 스트림
- Byte Stream
    - binary 데이터를 입출력하는 스트림
    - 데이터는 1바이트 단위로 처리
    - 이미지, 동영상 등을 송수신 할 때 주로 사용
    ![byte-stream](./byte-stream.png)
- Character Stream
    - text 데이터를 입출력하는 스트림
    - 데이터는 2바이트 단위로 처리
    - 일반적인 텍스트 및 JSON, HTML 등을 송수신할 때 주로 사용
    ![character-stream](./character-stream.png)
- 보조 스트림
    - FilterInputStream 과 FilterOutputStream 을 상속받는 클래스들로 기본 스트림과 결합하여 특정 상황에서 보다 편리하게 사용할 수 있다.
    - BufferedInputStream/BufferedOutputStream: 버퍼를 사용해 입출력 효율과 편의를 위해 사용
    - BufferedReader/BufferedWriter: 라인단위의 입출력이 편리함
    - InputStreamReader/OutputStreamReader: 바이트 스트림을 문자 스트림처럼 쓸 수 있도록하며 문자 인코딩 변환을 지원
    - DataInputStream/DataOutputStream: 자바 원시자료형 데이터 처리에 적합

<br>

### 4. 표준 스트림 (System.in, System.out, System.err)
- **표준 입출력 스트림의 종류는 java.lang 패키지의 System 클래스 내부에 static 으로 선언되어 있으며 다음과 같다.**
  ~~~ java
  public final class System {
      public static final InputStream in;
      public static final PrintStream out;
      public static final PrintStream err;
      ....
  }
  ~~~
- System.out 은 콘솔 화면에 문자열을 출력하기 위한 용도로 사용되는 출력 스트림이다.
- System.in 은 키보드의 입력을 받아들이기 위해서 사용되는 입력 스트림이다.
- System.out 과 System.err
    - 둘다 출력 스트림이다.
    - err 은 버퍼링을 지원하지 않는다. 이것은 err 이 보다 정확하고 빠르게 출력되어야 하기 때문이라고 한다. 버퍼링을 하던 도중 프로그램이 멈추면 버퍼링된 내용은 출력되지 않기 때문이다.

<br>

### 5. 파일 읽고 쓰기
- **텍스트 파일인 경우 문자 스트림 클래스들을 사용하면 되고, 바이너리 파일인 경우 바이트 스트림을 기본적으로 사용한다.**
- 입출력 효율을 위해 Buffered 계열의 보조 스트림을 함께 사용하는 것이 좋다.
- 텍스트 파일인 경우
  ~~~ java
  BufferedReader br = new BufferedReader(new FileReader("a.txt"));
  BufferedWriter bw = new BufferedWriter(new FileWriter("b.txt"));
  String s;
  while ((s = br.readLine()) != null) {
      bw.write(s + "\n");
  }
    ~~~
- 이진 파일인 경우
  ~~~ java
  BufferedInputStream is = new BufferedInputStream(new FileInputStream("a.jpg"));
  BufferedOutputStream os = new BufferedOutputStream(new FileOutputStream("b.jpg"));
  byte[] buffer = new byte[16384];
  while (is.read(buffer) != -1) {
      os.write(buffer);
  }
  ~~~

<br>

#### 참조 링크
- [채널과 버퍼 설명](https://javacan.tistory.com/entry/73)
- [IO vs NIO](https://ohjongsung.io/2019/09/07/java-nio-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B0)
- [InputStream, OutputStream](https://coding-factory.tistory.com/281)
- [Byte Stream, Character Stream](https://dinfree.com/lecture/language/112_java_7.html#m1)
- [표준 스트림](https://m.blog.naver.com/PostView.nhn?blogId=force44&logNo=130096406237&proxyReferer=https:%2F%2Fwww.google.com%2F)
