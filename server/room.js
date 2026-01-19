const { sub } = require("./redis");

const roomMembers = new Map();

// Joins a websocket to a room, subscribing to its messages
function joinRoom(ws, room) {
    if (ws.currentRoom) leaveRoom(ws);

    ws.currentRoom = room;

    if (!roomMembers.has(room)) {
        roomMembers.set(room, new Set());

        sub.subscribe(`room:${room}`, msg => {
            for (const client of roomMembers.get(room)) {
                if (client.readyState === 1) {
                    client.send(msg);
                }
            }
        });
    }

    roomMembers.get(room).add(ws);
}

// Leaves a websocket from its current room, unsubscribing if empty
function leaveRoom(ws) {
    const room = ws.currentRoom;
    if (!room) return;

    const members = roomMembers.get(room);
    if (!members) return;

    members.delete(ws);

    if (members.size === 0) {
        sub.unsubscribe(`room:${room}`);
        roomMembers.delete(room);
    }

    ws.currentRoom = null;
}

module.exports = { joinRoom, leaveRoom };
