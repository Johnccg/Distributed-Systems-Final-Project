const { createClient } = require("redis");
// const pub = createClient();
// const sub = createClient();

const redisUrl = "redis://redis:6379";

// Publisher client
const pub = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
    }
});

// Subscriber client
const sub = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
    }
});

pub.on('error', err => console.log('Redis pub error:', err));
sub.on('error', err => console.log('Redis sub error:', err));

pub.connect().catch(err => console.error("Redis pub connect failed:", err));
sub.connect().catch(err => console.error("Redis sub connect failed:", err));

module.exports = { pub, sub }