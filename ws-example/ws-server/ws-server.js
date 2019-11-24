const WebSocket = require('ws')

const http = require('http')

const server = http.createServer()

PORT = 3008

const wsServer = new WebSocket.Server({
  server: server
})

let clientCount = 0

wsServer.on('connection', function(conn) {
  console.log("Someone connected...")
  clientCount++
  conn.nickname = "user " + clientCount
  let mes = {}
  mes.type = "enter"
  mes.data = conn.nickname + " comes in"
  broadcast(JSON.stringify(mes))


  conn.on('message', msg => {
    console.log("msg:" + msg)
    let mes = {}
    mes.type = "message"
    mes.data = conn.nickname + " says: " + msg
    // WebSock不能传输对象；
    broadcast(JSON.stringify(mes))
  })

  conn.on("close", () => {
    console.log("Connection closed")
    let mes = {}
    mes.type = "leave"
    mes.data = conn.nickname + " left"
    broadcast(JSON.stringify(mes))
  })

  conn.on("error", () => {})
})


server.listen(PORT, () => console.log('listen to ' + PORT))

// 广播 (包括自己)
function broadcast(str) {
  wsServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(str)
    }
  })
}


