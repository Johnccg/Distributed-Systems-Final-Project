const mongoose = require("mongoose");
module.exports = mongoose.model(
    "Message",
    new mongoose.Schema({
        room: String,
        sender: String,
        content: String
    })
);