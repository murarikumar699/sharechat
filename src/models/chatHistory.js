const mongoose = require("mongoose");

const ChatHistorySchema = new mongoose.Schema({
    chatConnectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"chatConnection"
    },
    socketId: {
        type: String,
        required: true,
    },  
    lastMessage: {
        type: String,
        required: true,
    },
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
});

const  ChatHistory = mongoose.model("chatHistory", ChatHistorySchema);

module.exports = ChatHistory;