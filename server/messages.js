const { pub } = require("./redis")

function handleMessage(raw) {
    pub.publish("chat", raw.toString())
}

function handleConnection(ws, wss) {
    ws.on("message", msg => handleMessage(msg, wss));
}

function handleBroadcast(wss, message) {
    wss.clients.forEach(c => {
        if (c.readyState === 1) c.send(message);
    });
}

module.exports = { handleMessage, handleConnection, handleBroadcast };