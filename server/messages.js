const { pub } = require("./redis")
const { randomUUID } = require("crypto");
const Message = require("./models/message")
const { seen } = require("./dedupe");
const { joinRoom, leaveRoom } = require("./room");

// Loads and sends the last 20 messages from a room to a client
async function sendRoomHistory(ws, room) {
    const history = await Message.find({ room })
        .sort({ timestamp: 1 })
        .limit(20);

    history.forEach(m => {
        ws.send(JSON.stringify(m));
    });
}

// Recieves the raw message from websocket, arses it, saves it to mongodb, and publishes it to redis
async function handleMessage(ws, raw) {
    let message

    try {
        message = JSON.parse(raw.toString())
    } catch {
        return;
    }

    if (message.type === "join") {
        const newRoom = message.room || "general";
        joinRoom(ws, newRoom);
        await sendRoomHistory(ws, newRoom);
        return;
    }

    message.timestamp = Date.now();
    if (!message.id) {
        message.id = randomUUID();
    }

    if (await seen(message.id)) {
        return;
    }

    try {
        await Message.create(message);
    } catch (err) {
        //Duplicate key error, ignore
        if (err.code === 11000) {
            return;
        }
        throw err;
    }

    const channel = `room:${ws.currentRoom}`;
    await pub.publish(channel, JSON.stringify(message));
}

// Handles a new websocket connection, first sending the last 20 messages in the "general" room, then setting up the message handler
async function handleConnection(ws, wss) {
    ws.currentRoom = "general";

    joinRoom(ws, "general");

    await sendRoomHistory(ws, "general");

    ws.on("message", async (raw) => {
        handleMessage(ws, raw);
    })
    ws.on("close", () => {
        leaveRoom(ws)
    })
}

module.exports = { handleMessage, handleConnection };