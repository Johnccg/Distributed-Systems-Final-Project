function handleMessage(raw, wss) {
    wss.clients.forEach(c => {
        if (c.readyState === 1) c.send(raw.toString());
    });
}

function handleConnection(ws, wss) {
    ws.on("message", msg => handleMessage(msg, wss));
}

module.exports = { handleMessage, handleConnection };