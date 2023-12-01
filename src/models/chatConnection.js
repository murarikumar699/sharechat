const mongoose = require("mongoose"),Schema = mongoose.Schema;

const ChatConnectionSchema = new mongoose.Schema({
  member: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"users"
  }],
  type: {
    type: String,
    enum:["single","group"]
  },
  groupName: {
    type: String,
  },
  lastMessage: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
});

const  ChatConnection = mongoose.model("chatConnection", ChatConnectionSchema);

module.exports =  ChatConnection ;