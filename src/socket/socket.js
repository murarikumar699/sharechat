let dotenv = require('dotenv').config()
const express = require("express");
const ChatConnection = require("../models/chatConnection");
const ChatHistory = require("../models/chatHistory");
const app = express();
var server = require('http').Server(app)
  .listen(dotenv.parsed.SOCKETPORT, function() {
    console.log("WebSocket listening on port %d", dotenv.parsed.SOCKETPORT);
  });
    

var socketIO = require('socket.io')(server);

socketIO.on("connection", async (socket) => {
    
        let senderId = socket.handshake.headers.senderid;

        let connection = await ChatConnection.find({member:{$in:senderId}}).select("socketId");
        if(connection){
            connection.forEach(project => socket.join(project.socketId.toString()));
        }


        socket.on("message",async (message) => {
            let obj = {
                member: [message.senderId,message.receiverId],
                type:message.type,
                lastMessage:message.message,
                groupName:"",
            }
            if(!message.socketId && message.type == 'single'){
                const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                const socketId = [...Array(5)].map(_ => c[~~(Math.random()*c.length)]).join('')
                obj.socketId = socketId;
                console.log("obj ====>",obj)
                await ChatConnection.create(obj);
                socket.join(obj.socketId.toString());
                socket.to(obj.socketId).emit(message);
            }else if(message.socketId){
                await ChatConnection.updateOne({socketId:message.socketId},{lastMessage:obj.lastMessage});
                socket.to(message.socketId.toString()).emit("message",message);
            }else{
                socket.join(message.socketId);
                socket.to(message.socketId.toString()).emit(message);
            }
        })
});

