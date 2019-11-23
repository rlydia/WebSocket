var app = require('http').createServer();
var io = require('socket.io')(app)

var PORT = 3000;

// 客户端计数
var clientCount = 0;

// 用来存储客户端socket
var socketMap = {}

app.listen(PORT)

var bindListener = function(socket, event) {
  socket.on(event, function(data) {
    if (socket.clientNum % 2 == 0) {
      if (socketMap[socket.clientNum - 1]) {
        socketMap[socket.clientNum - 1].emit(event, data);
      }
    } else {
      if (socketMap[socket.clientNum + 1]) {
        socketMap[socket.clientNum + 1].emit(event, data);
      }
    }
  });
}

io.on('connection', function(socket) {
  // 当socket连接上来后：
  clientCount = clientCount + 1;
  socket.clientNum = clientCount;
  socketMap[clientCount] = socket;

  // 若clientCount是奇数，其就需要等待第二个客户端进来进行配对
  if (clientCount % 2 == 1) {
    socket.emit('waiting', 'waiting for another person');
  } else {  
    if (socketMap[(clientCount - 1)]) {
      socket.emit('start');
      socketMap[(clientCount - 1)].emit('start');  // 给配对的socket发送一个start消息；
    } else {
      socket.emit('leave')
    }
  }

  bindListener(socket, 'init');
  bindListener(socket, 'next');
  bindListener(socket, 'rotate');
  bindListener(socket, 'right');
  bindListener(socket, 'down');
  bindListener(socket, 'left');
  bindListener(socket, 'fixed');
  bindListener(socket, 'line');
  bindListener(socket, 'time');   // 在server端进行转发
  bindListener(socket, 'lose');
  bindListener(socket, 'bottomLines');  // 转发
  bindListener(socket, 'addTailLines');


  // 服务器收到init消息后，转发给另一个socket客户端；
  // 这两段的代码冗余度是很高的：  => 抽出成bindListener函数(见上);
  // socket.on('init', function(data) {
  //   if (socket.clientNum % 2 == 0) {
  //     socketMap[socket.clientNum - 1].emit('init', data);
  //   } else {
  //     socketMap[socket.clientNum + 1].emit('init', data);
  //   }
  // });
  // socket.on('next', function(data) {
  //   if (socket.clientNum % 2 == 0) {
  //     socketMap[socket.clientNum - 1].emit('next', data);
  //   } else {
  //     socketMap[socket.clientNum + 1].emit('next', data);
  //   }
  // });

  socket.on('disconnect', function() {
    if (socket.clientNum % 2 == 0) {
      if (socketMap[socket.clientNum - 1]) {
        // 若socketMap[socket.clientNum - 1]这个值 不是undefined，我们才去emit;
        socketMap[socket.clientNum - 1].emit('leave');
      }
    } else {
      if (socketMap[socket.clientNum + 1]) {
        socketMap[socket.clientNum + 1].emit('leave');
      }
    }
    delete(socketMap[socket.clientNum])
  });
});

console.log('websocket listening on port ' + PORT)