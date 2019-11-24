HTML, CSS, JS, NodeJS; WebSocket

# 基础

## Websocket

WebSocket是伴随着HTML5出现的一门新技术；

web端的socket连接, 其允许 server和client可以互相发送消息；若浏览器端或服务器端不断开的话，该socket连接便不会断开。

本质上是TCP连接。



搭建自己的websocket server 以实现echo功能；

[ws-example > ws-server文件夹]()

> ```
>echo {} > package.json
> npm install ws 
>node ws-server.js
> ```



简单聊天功能的优化

- 将聊天的消息 与 进入/离开 分开；
- 标识 聊天的消息是谁发出来的；



## socket.io

[socket.io]( https://socket.io/ )来实现webSocket通信；

socket.io需在客户端与服务器同时引入；

```
echo {} > package.json
npm install socket.io
touch wsServer.js
touch index.html
```

socket.io带来的优势：

- 发送数据时 可直接发送对象; 而不用像之前一样 先将对象转为字符串，在将字符串转为对象；
- `socket.on('my other event', function() {})` 可自定义事件；这样就可不在数据中设置type字段；



-------------

小结：

- 允许浏览器和服务器建立持久连接 

- HTML5的websocket API（服务器也可向浏览器 发送消息）

- 服务器端使用nodejs-websocket实现websocket server

- 使用socket.io实现websocket

  socket.io带来的优势：

  - 发送数据时 可直接发送对象; 而不用像之前一样 先将对象转为字符串，在将字符串转为对象；
  - `socket.on('my other event', function() {})` 可自定义事件；这样就可不在数据中设置type字段；



# 单机版

此处还不会涉及到websocket通信的知识；

俄罗斯方块实现原理：  (对应的是二维数组)

![image-20191120144215633](D:\Lydia\github\WebSocket\mdImage\image-20191120144215633.png)

```
视图view     二维数组-模型model    控制器control

MVC模式：
MVC模式（Model–view–controller）是软件工程中的一种软件架构模式，把软件系统分为三个基本部分：模型（Model）、视图（View）和控制器（Controller）。
```



---------------

single文件夹：

俄罗斯方块结构图:

![image-20191120154532451](D:\Lydia\github\WebSocket\mdImage\image-20191120154532451.png)

模块化--面向对象；squareFactory.js (工厂类--用来生成方块)

----------------

给游戏增加干扰：

当一次性消了两行，给对方从底部增加一行干扰； 若一次性消了三行，给对方从底部增加两行干扰；

-- 每十秒钟 生成一行干扰；



------------

对方操作示意：

对方游戏中数据驱动的原理 => 通过webSocket发送类似指令的命令，来调用相应按钮后的函数；

----------

总结：

界面与数据分离的思想；game.js中的逻辑操作都是去操作数据；并通过`refreshDiv`将数据反映到界面上 -- 使逻辑简化。

使用面向对象的思想；



# 升级版

增加 服务端逻辑，webSocket通信机制； --- 使用socketIO来实现webSocket通信；

---------------

```
$ node wsServer.js
```

init, 与next消息传递的流程！！ 要整理一下呀~

--------------

障碍：我在游戏中消了两行，对方游戏中增加一行；



总结回顾：

- websocket在俄罗斯方块中的应用； --> 消息的转发；
- 