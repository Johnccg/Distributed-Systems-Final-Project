const { pub } = require("./redis")
const Message = require("./models/message")

async function handleMessage(raw) {
    let message

    try {
        message = JSON.parse(raw.toString())
    } catch {
        return;
    }

    await Message.create(message);
    pub.publish("chat", JSON.stringify(message));
}

async function handleConnection(ws, wss) {
    const history = await Message.find({ room: "general" })
        .sort({ timestamp: 1 })
        .limit(20);

    history.forEach(msg => {
        ws.send(JSON.stringify(msg));
    });

    ws.on("message", msg => handleMessage(msg));

    ws.on("message", msg => handleMessage(msg, wss));
}

function handleBroadcast(wss, message) {
    wss.clients.forEach(c => {
        if (c.readyState === 1) c.send(message);
    });
}

module.exports = { handleMessage, handleConnection, handleBroadcast };