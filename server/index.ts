const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
const PORT = 4000;

interface Data {
    message?: string,
    avatar?: string
  };

const usersInRoom = <Array<String>>[]

//Socket Setup
io.on('connection', (socket:any)=>{
    console.log('Made Socket Connection',socket.id);

    socket.on('join-room',(roomData:{roomName:string, user:string})=>{
        socket.join(roomData.roomName);
        console.log("User "+roomData.user+" joined the room "+roomData.roomName);
        usersInRoom.push(roomData.user);
        socket.to(roomData.roomName).emit(JSON.stringify(usersInRoom));

        socket.on('chat',(data:Data)=>{
            socket.to(roomData.roomName).emit('chat',data);
            console.log(data.message);
        })
    })
})

http.listen(PORT,()=>{
    console.log("Listening on port 4000");
})

