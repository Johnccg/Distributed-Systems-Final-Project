const WebSocket = require("ws");
const { handleConnection } = require("./messages");

// Initializes the websocket server, setting up connection
function initWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", ws => handleConnection(ws));
}


module.exports = { initWebSocket };