const { createClient } = require("redis");

const redis = createClient({
    url: "redis://redis:6379",
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
    }
});
// const redis = createClient();

redis.on('error', err => console.log('Redis dedupe error:', err));
redis.connect().catch(err => console.error("Redis dedupe connect failed:", err));

// Returns true if the message ID has been seen before, false otherwise
async function seen(id) {
    const isNew = await redis.set(`msg:${id}`, "1", { NX: true, EX: 60 });
    return !isNew;
}

module.exports = { seen };