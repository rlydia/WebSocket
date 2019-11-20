var ws = require("nodejs-websocket")

var PORT = 3000
 
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {  // 当客户端连接过来时回调该函数；参数conn代表该连接
  console.log("New connection")
  // 接收到客户端的信息，再直接发回去...
  conn.on("text", function (str) { // 当客户端有消息发过来时 回调该函数；
    console.log("Received "+str)
    conn.sendText(str)  // 再把消息发出去
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
  conn.on("error", function(err) {
    console.log("handle err")
    console.log(err)
  })
}).listen(PORT)

console.log("websocket server listening on port" + PORT)