# 即时通信技术

> 相关文章:
>
> [轮询、长轮询、长连接、websocket](https://www.cnblogs.com/huchong/p/8595644.html)
>
> [WebSocket 是什么原理？为什么可以实现持久连接？-知乎]( https://www.zhihu.com/question/20215561 )
>
> [SSE(服务器推送事件)的介绍、问题及解决]( https://www.jianshu.com/p/100b82730e15 )
>
> [为什么不直接使用socket ,还要定义一个新的websocket 的呢？ ](https://github.com/onlyliuxin/coding2017/issues/497)
>
> 四种Web即时通信技术对比：
>
> - 从兼容性角度考虑，短轮询>长轮询(comet)>长连接(SSE)>WebSocket；
>- 从性能方面考虑，WebSocket>长连接SSE>长轮询>短轮询。
> 
> 在HTTP基础上实现：短轮询,长轮询,长连接SSE（Sever-Sent Event） 服务器推送事件;
>
> 





## (ajax)轮询, 长轮询

短轮询与长轮询两者都是 **基于HTTP的“被动型服务器”** : 服务器不会主动推送信息，而是在客户端发送ajax请求后进行返回的响应。

**短轮询**： 浏览器每隔一段时间向浏览器发送http请求，服务器端在收到请求后，不论是否有数据更新，都直接进行响应。 

**长轮询**：浏览器向浏览器发送http请求，服务器端在收到请求后，服务器不会直接进行响应，而是先将这个请求挂起 判断服务器端数据是否有更新。如果有更新，则进行响应，如果一直没有数据，则**到达一定的时间限制**(服务器端设置)才返回。 客户端JavaScript响应处理函数会在处理完服务器返回的信息后，再次发出请求，重新建立连接。

> 目前微信登录二维码扫描还是用的长轮询 (为兼容老浏览器)；

轮询由于需要不断的建立http连接，严重浪费了服务器端和客户端的资源。而长轮询和短轮询比起来，明显减少了很多不必要的http请求次数，相比之下节约了资源。长轮询的缺点在于，连接挂起也会导致资源的浪费。 







## 长连接(SSE)与WebSocket协议

服务器对浏览器推送消息的方法：SSE与WebSocket;

**长连接(SSE)**：

[SSE(服务器推送事件)的介绍、问题及解决]( https://www.jianshu.com/p/100b82730e15 )

HTML5新增功能基于http协议,  不需要客户端发送请求，可以实现只要服务器端数据有更新，就可以马上发送到客户端；且SSE实现简单，不需要依赖其他插件。

 

**WebSocket协议**:

(WebSocket也是一种长连接的模式)

WebSocket是Html5定义的一个新协议，可以实现服务器与客户端之间全双工通信。 其是一个**持久化**的协议，相对于HTTP这种**非持久**的协议来说；可理解为WebSocket是HTTP的优化。

>  `websocket`的协议是在TCP/IP协议簇的应用层，和`http`在同一层。 

WebSocket协议基于TCP协议；客户端先发送一个HTTP请求给服务端，该请求要求服务器 将该HTTP连接升级为WS连接，在服务器端响应ok后 它们之间便不再走HTTP报文了; 之后该连接上走websocket协议，并且不会断开，信息在两端交换 (websocket协议是以消息为单位--有点像UDP，但websocket是可靠 并且有序的)；

- UDP是任意两个端口之间可以随意的发送，websocket则是只能在建立连接的两端交换消息(**交换的是消息，而不是字节流**)；

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

优点是实现了双向通信，缺点是服务器端的逻辑非常复杂 。



# WebSocket与Socket

> [1小时教你理解HTTP，TCP，UDP，Socket，WebSocket]( https://www.jianshu.com/p/42260a2575f8 )
>
> [Socket连接与HTTP连接](https://www.cnblogs.com/devinzhang/archive/2012/01/13/2321826.html)

五层模型: 应用层， 传输层， 网络层， 数据链路层， 物理层；

HTTP，WebSocket, TCP, UDP, IP 都是协议； 

- HTTP，WebSocket 属于应用层，都是基于TCP协议；WebSocket可理解为HTTP的优化 

  --- HTTP连接(短连接)

- TCP, UDP 属于传输层 

  --- TCP连接(长连接)

- IP 协议属于传输层

TCP/IP协议族 是不同协议的组合；

Socket套接字，本质是API 而不是协议，是对TCP/IP协议栈的封装 以建立Socket连接；

-  创建Socket连接可以指定不同的传输层协议 -- 所以当采用TCP建立连接时，该Socket连接就视为一个TCP连接。而采用UDP则是无连接的。 

![image-20191124134211674](D:\Lydia\github\WebSocket\mdImage\image-20191124134211674.png)



# WebSocket协议建立连接的过程

## 怎样使用websocket

- 服务器需先支持 升级websocket的请求，而node自带的http服务器是没有这个功能的-> 会返回404； => 则在npm上 找第三方的包 [ws包: a Node.js WebSocket library](https://www.npmjs.com/package/ws) (其需要 对HTTP协议/服务器 本身做一个接管，该接管在node中有相应的事件--这个包监听了 )

  普通的请求触发的是request事件, 而一个升级请求触发的是upgrade事件 [node http.server]( https://nodejs.org/dist/latest-v12.x/docs/api/http.html )

  ![image-20191124151848181](D:\Lydia\github\WebSocket\mdImage\image-20191124151848181.png)



怎样使用ws包？

- 将一个http.server对象传给它，其在该对象上监听upgrade事件；



## WebSocket协议建立连接的过程

在浏览器端，websocket协议是从http升级来的(在连接协商阶段依然是一个http请求)；并且**websocket协议 不限制跨域**，除非有CSP(Content Security Policy)内容安全策略  限制页面中的JS连接/加载东西，  => 于是可在任何网站给我服务器 发送websocket连接；



让websocket服务器与HTTP服务器集成在一个server上：

![image-20191124160524915](D:\Lydia\github\WebSocket\mdImage\image-20191124160524915.png)

ws-example文件夹下的`ws-server.js`文件：

![image-20191124162127269](D:\Lydia\github\WebSocket\mdImage\image-20191124162127269.png)

- 若网页是通过https加载的，那么也只能用wss; wss为走在TLS(安全传输层协议)上的ws, 如:

  ```
  ws = new WebSocket('wss://expressjs.com/foo/')
  ```

第一次发送出去的HTTP请求头：（客户端希望这个连接能够被升级upgrade 为websocket协议）

![image-20191124162716641](D:\Lydia\github\WebSocket\mdImage\image-20191124162716641.png)

若服务器能支持将协议升级的话，便会响应：

![image-20191124163022787](D:\Lydia\github\WebSocket\mdImage\image-20191124163022787.png)

-------------

(发送的数据还可是二进制数据Buffer) WebSocket不能直接发送对象，需是字符串

![image-20191124164703126](D:\Lydia\github\WebSocket\mdImage\image-20191124164703126.png)

![image-20191124164841334](D:\Lydia\github\WebSocket\mdImage\image-20191124164841334.png)

WebSocket(交换的是消息)建立连接后，TCP连接便不会断了，并且之间发送数据为二进制；(TCP协议为纯粹的字节流)

为什么WebSocket可以实现持久连接？

- 因其底层的TCP连接根本就没有断；

既然有TCP协议为啥还要有WebSocket呢？

- TCP连接一个包只能发1500个字节，对于大一点的包会进行分包，分包后发送收到的数据次序可能有改变；而用WebSocket发送则不会有这个问题 --- 大量数据 分包后收到数据次序并不会改变；



## WebSocket聊天室

> 代码：[ws-example > ws-server文件夹]()

WebSocket中不能直接发送对象--- 服务端`JSON.stringify(mes)`， 客户端`JSON.parse(e.data)`

WebSocket的send方法目前只能发送三类数据，包含UTF-8的string类型（而UTF-16指的是JavaScript中String的编码存储方式），ArrayBuffer和Blob。

[WebSocket系列之JavaScript字符串如何与二进制数据间进行互相转换]( https://juejin.im/post/5abdc38ef265da2375070008#heading-6 )

基于WebSocket更进一步的封装，提供了广播事件的机制(远程事件)； => socketio (比原始的WebSocket好用很多)



# Socket.IO (对WebSocket的封装)

> [WebSocket 与 Socket.IO](https://zhuanlan.zhihu.com/p/23467317)
>
> [socket.io]( https://socket.io/ ) 是一个封装了 Websocket、基于 Node 的 JavaScript 框架，包含 client 的 JavaScript 和 server 的 Node。其 其屏蔽了所有底层细节，让顶层调用非常简单。 

因并不是所有浏览器都支持WebSocket，该库支持了一系列的降级功能；以通过这些功能选择来与浏览器保持类似长连接的功能。

- Websocket
- Adobe® Flash® Socket
- AJAX long polling
- AJAX multipart streaming
- Forever Iframe
- JSONP Polling



## Socket.IO聊天室

> 代码：[ws-example > socket.io-wsServer文件夹]()

socket.io带来的优势：

- 发送数据时 可直接发送对象; 而不用像之前一样 先将对象转为字符串，在将字符串转为对象；
- `socket.on('my other event', function() {})` 可自定义事件；这样就可不在数据中设置type字段；









