const http = require('http')
const { initWebSocket } = require("./websocket");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000

mongoose.connect("mongodb://localhost:27017/chat");

const server = http.createServer()
initWebSocket(server)

server.listen(port, () => {
    console.log("running server in port " + port)
})
