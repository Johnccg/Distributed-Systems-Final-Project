const senderInput = document.getElementById("sender");
const roomInput = document.getElementById("room");
const messageInput = document.getElementById("message");
const chat = document.getElementById("chat");
const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
    chat.textContent += "[connected]\n"
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

send.onclick = () => {
    const payload = {
        sender: senderInput.value || "anon",
        room: roomInput.value || "general",
        content: messageInput.value
    };
    ws.send(JSON.stringify(payload));
    messageInput.value = "";
};