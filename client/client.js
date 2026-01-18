const senderInput = document.getElementById("sender");
const roomInput = document.getElementById("room");
const serverInput = document.getElementById("server");
const messageInput = document.getElementById("message");
const chat = document.getElementById("chat");
const sendBtn = document.getElementById("send");

const port = serverInput.value || 3000;

function createWS(port) {
    const ws = new WebSocket(`ws://localhost:${port}`);

    ws.onopen = () => {
        chat.textContent += `[connected ${port}]\n`
    };

    ws.onmessage = event => {
        try {
            const msg = JSON.parse(event.data);
            chat.textContent += `${msg.sender}@${msg.room}: ${msg.content}\n`
        } catch {
            chat.textContent += event.data + "\n"
        }
    };

    ws.onclose = () => {
        chat.textContent += "[disconnected]\n"
    };

    sendBtn.onclick = () => {
        const payload = {
            sender: senderInput.value || "anon",
            room: "general",
            // room: roomInput.value || "general",
            content: messageInput.value
        };
        ws.send(JSON.stringify(payload));
        messageInput.value = "";
    };

    return ws;
}

let ws = createWS(port);

serverInput.onchange = () => {
    ws.close();
    const newPort = serverInput.value || 3000;
    ws = createWS(newPort);
}
