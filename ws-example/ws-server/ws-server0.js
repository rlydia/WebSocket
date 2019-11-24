// 让http服务器支持WebSocket: ws包
const WebSocket = require('ws')

const http = require('http')

const server = http.createServer()

// http.server的upgrade事件可由此监听：
// 其给http服务器绑定了一个upgrade事件并由wsServer来接管，一旦触发upgrade后也会在wsServer上触发一个事件为 onconnection；
const wsServer = new WebSocket.Server({
  server: server
})

// websocket连接抽象出来的形式 不再是字节流ondata, 而是onmessage;（websocket在建立连接的两端交换信息，而不是字节流）
wsServer.on('connection', ws => {
  console.log('someone connected...')

  ws.on('message', msg => {
    console.log("msg:" + msg)
    ws.send(msg.toString().toUpperCase())
  })

  ws.on('error', () => {})
})

// 此处是一个正常的get/post/delete请求:
server.on('request', (req, res) => {
  res.end('hello')
})

server.listen(3007, () => console.log('listen to 3007'))
