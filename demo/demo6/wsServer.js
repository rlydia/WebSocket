var app = require('http').createServer()  // 创建一个http的server
var io = require('socket.io')(app)   // 将http包装为io类型


var PORT = 3000
 
// 因有不止一个客户端来进行连接，需给每一个客户端分配名字；
// 客户端计数器
var clientCount = 0

app.listen(PORT)
io.on('connection', function(socket) {
  clientCount++
  socket.nickname = 'user' + clientCount
  // io.emit => 进行广播
  // 若是socket.emit是向socket所在的客户端发送消息；
  io.emit('enter', socket.nickname + ' comes in')

  socket.on('message', function(str) {
    io.emit('message', socket.nickname + ' says: ' + str)
  })

  // 客户端断开时:
  socket.on('disconnect', function() {
    io.emit('leave', socket.nickname + ' left')
  })
})


console.log("websocket server listening on port" + PORT)

