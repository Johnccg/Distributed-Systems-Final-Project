const WebSocket = require("ws");
const { handleConnection } = require("./messages");

function initWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    wss.on("connection", ws => handleConnection(ws, wss));
}

module.exports = { initWebSocket };