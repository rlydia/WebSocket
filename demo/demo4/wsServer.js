var ws = require("nodejs-websocket")

var PORT = 3000
 
// 因有不止一个客户端来进行连接，需给每一个客户端分配名字；
// 客户端计数器
var clientCount = 0

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {  // 当客户端连接过来时回调该函数；参数conn代表该连接
  console.log("New connection")
  clientCount++  // 每一次连接--clientCount自增；
  conn.nickname = "user" + clientCount
  var mes = {}
  mes.type = "enter"
  mes.data = conn.nickname + 'comes in'
  broadcast(JSON.stringify(mes))

  broadcast(conn.nickname + "comes in")

  // 接收到客户端的信息，再直接发回去...
  conn.on("text", function (str) { // 当客户端有消息发过来时 回调该函数；
    console.log("Received "+str)
    // conn.sendText(str)  // 再把消息发出去
    // 当收到消息时 也发送一个广播
    
    var mes = {}
    mes.type = "message"
    mes.data = conn.nickname + ' says: ' + str
    broadcast(JSON.stringify(mes))
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed")
    var mes = {}
    mes.type = "leave"
    mes.data = conn.nickname + " left"
    broadcast(JSON.stringify(mes))
  })
  conn.on("error", function(err) {
    console.log("handle err")
    console.log(err)
  })
}).listen(PORT)

console.log("websocket server listening on port" + PORT)

// 广播
function broadcast(str) {   // 对每个客户端进行广播
  // server.connections变量中保存有server下的所有连接；
  server.connections.forEach(function(connection) {
    connection.sendText(str)
  })
}