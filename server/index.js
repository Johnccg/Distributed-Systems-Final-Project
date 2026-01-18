const http = require('http')
const port = 3000

const server = http.createServer()
server.listen(port, init())

function init(){
    console.log("running server in port " + port)
}
