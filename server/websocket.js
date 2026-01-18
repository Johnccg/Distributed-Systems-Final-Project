const WebSocket = require("ws");
const { handleConnection, handleBroadcast } = require("./messages");
const { sub } = require("./redis");

function initWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    sub.subscribe("chat", msg => handleBroadcast(wss, msg));
    wss.on("connection", ws => handleConnection(ws, wss));
}


module.exports = { initWebSocket };