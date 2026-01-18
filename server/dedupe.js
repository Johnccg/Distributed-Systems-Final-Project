const { createClient } = require("redis");

const redis = createClient();

redis.connect();

async function seen(id) {
    const isNew = await redis.set(`msg:${id}`, "1", { NX: true, EX: 60 });
    return !isNew;
}

module.exports = { seen };