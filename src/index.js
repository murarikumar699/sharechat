let dotenv = require('dotenv').config()
const express = require("express");
const app = express();
require("./config/db");
const ChatConnection = require("./models/chatConnection");
const {getUserIdByToken}  = require("./middleware/authCheck")
var server = require('http').Server(app)
app.set('view engine', 'ejs');
app.use(express.static('public'))
const chatRoute =  require("./routes/chatRoute");
var bodyParser = require('body-parser')
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:5000','http://localhost:3000']
}));

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/json' }))

app.use(chatRoute)
app.get('/*', async function (req, res) {
    console.log("resres",req.ip);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// require("./socket/socket")
var socketIO = require('socket.io')(server,{
    cors:{
        origin: ['http://localhost:5000','http://localhost:3000']
    }
});

socketIO.on("connection", async (socket) => {
        console.log("socket.id",socket.id)
        let userId = getUserIdByToken(socket.handshake.auth.Authorization)
        console.log("userIduserId",userId)

        // let senderId = socket.handshake.headers.senderid;
        let senderId = userId;
        console.log("senderIdsenderIdsenderId",senderId)

        let connection = await ChatConnection.find({member:{$in:senderId}});
        if(connection){
            connection.forEach(project => {
                socket.join(project.socketId.toString())
            });
        }
        socket.join(senderId);
        


        socket.on("message",async (message) => {
            console.log("message",message)
            let senderId = getUserIdByToken(message.senderId)
            let chatConnection = await ChatConnection.find({member:{$all:[senderId,message.receiverId]}});
            console.log("senderIdsenderId--------->",senderId);
            let obj = {
                member: [senderId,message.receiverId],
                type:message.type,
                lastMessage:message.lastMessage,
                groupName:"",
            }
            if(!message.socketId && message.type == 'single'){
                console.log("connectionconnectionconnection====>",chatConnection)
                if(chatConnection.length > 0){
                    socket.join(message.receiverId);
                    console.log("socket.roomssocket.rooms=========>",socket.rooms)
                    socket.to(message.receiverId).emit("receiveMessage",message);
                }else{
                    const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                    const socketId = [...Array(5)].map(_ => c[~~(Math.random()*c.length)]).join('')
                    obj.socketId = socketId;
                    console.log("obj ====>",obj)
                    await ChatConnection.create(obj);
                    // socket.join(obj.socketId.toString());
                    // socket.to(obj.socketId).emit(message);
                    socket.join(message.receiverId);
                     console.log("socket.roomssocket.rooms=========>",socket.rooms)
                    socket.to(message.receiverId).emit("receiveMessage",message);
                }
                
            }else if(message.socketId){
                    //  if(!socket.rooms.has(message.receiverId.toString())){
                        socket.join(message.socketId.toString());
                        // socket.join(message.receiverId.toString());
                    //  }
                 
                 console.log("message",message)
                await ChatConnection.updateOne({socketId:message.socketId},{lastMessage:message.lastMessage});
                socket.to(message.socketId.toString()).emit("receiveMessage",message);
            }else{
                socket.join(message.socketId);
                socket.to(message.socketId.toString()).emit(message);
            }
        })
});



server.listen(dotenv.parsed.PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", dotenv.parsed.PORT);
})


