const mongoose = require("mongoose");
module.exports = mongoose.model(
    "Message",
    new mongoose.Schema({
        id: String,
        room: String,
        sender: String,
        content: String,
        timestamp: Number
    })
);