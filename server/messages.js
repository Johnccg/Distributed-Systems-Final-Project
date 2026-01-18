const { pub, sub } = require("./redis")
const Message = require("./models/message")

const roomSubscriptions = new Set();

// Recieves the raw message from websocket, arses it, saves it to mongodb, and publishes it to redis
async function handleMessage(raw, wss) {
    let message

    try {
        message = JSON.parse(raw.toString())
    } catch {
        return;
    }

    if (message.room) {
        handleSubscription(message.room, wss);
    }

    await Message.create(message);

    const channel = `room:${message.room}`;
    pub.publish(channel, JSON.stringify(message));
}

// Handles a new websocket connection, first sending the last 20 messages in the "general" room, then setting up the message handler
async function handleConnection(ws, wss) {
    let currentRoom = null;

    ws.on("message", async (raw) => {
        let msg;

        try {
            msg = JSON.parse(raw.toString());
        } catch {
            return;
        }

        // First message defines the room
        if (!currentRoom && msg.room) {
            currentRoom = msg.room;

            const history = await Message.find({ room: currentRoom })
                .sort({ timestamp: 1 })
                .limit(20);

            history.forEach(m => {
                ws.send(JSON.stringify(m));
            });
        }

        handleMessage(raw, wss);
    })
}

function handleBroadcast(wss, message) {
    wss.clients.forEach(c => {
        if (c.readyState === 1) c.send(message);
    });
}

// Subscribes to a room channel in redis, if not already subscribed
function handleSubscription(room, wss) {
    const channel = `room:${room}`;

    if (roomSubscriptions.has(channel)) return;

    roomSubscriptions.add(channel);

    sub.subscribe(channel, message => {
        handleBroadcast(wss, message);
    });
}

module.exports = { handleMessage, handleConnection, handleBroadcast, handleSubscription };