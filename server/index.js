const http = require('http')
const { initWebSocket } = require("./websocket");
const port = 3000

const server = http.createServer()
initWebSocket(server)

server.listen(port, () => {
    console.log("running server in port " + port)
})
