HTML, CSS, JS, NodeJS; WebSocket

# 基础



Websocket

是伴随着HTML5出现的一门新技术；

web端的socket连接,**** 其允许 server和client可以互相发送消息；若浏览器端或服务器端不断开的话，该socket连接便不会断开。

本质上是TCP连接。

-------------

demo1 > index.html



-----------

domo2: 搭建自己的websocket server 以实现echo功能；

domo2 > index.html （同demo1中一样）

> [ nodejs-websocket ]( https://www.npmjs.com/package/nodejs-websocket )
>
> ` npm install nodejs-websocket `
>
> 新建文件： domo2 > weServer.js
>
> 运行该server: `node wsServer.js`

修改domo2 > index.html 中端口号: 

```js
var websocket = new WebSocket("ws://localhost:8001/");
```

-------------------

demo3 实现简单的聊天功能；(基于demo2做修改)



这个简陋的demo存在两个问题：  

- 聊天的消息 与 进入/离开 混在了一起；
- 不知道聊天的消息是谁发出来的；



-----------------

demo4 简单聊天功能的优化



------------------

demo5: `socket.io入门`

socket.io来实现webSocket通信； https://socket.io/ ；

socket.io需在客户端与服务器同时引入；

```
npm install socket.io
touch wsServer.js
touch index.html
```

socket.io带来的优势：

- 发送数据时 可直接发送对象; 而不用像之前一样 先将对象转为字符串，在将字符串转为对象；
- `socket.on('my other event', function() {})` 可自定义事件；这样就可不在数据中设置type字段；

----------------------

demo6:  `socket.io改造聊天功能`

```
ls
$ cp demo4/index.html demo6/index.html
$ cp demo4/wsServer.js demo6/wsServer.js
```

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

当一次性消了两行，给对方从底部增加干扰；



