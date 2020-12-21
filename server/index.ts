import { Socket } from "dgram";

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

const clientsOnRoom = <Array<String>>[]

//Socket Setup
io.on('connection', (socket:any)=>{
    console.log('Made Socket Connection',socket.id);

    socket.on('join-room',(roomData:{roomName:string, user:string})=>{
      clientsOnRoom.push(roomData.user)
      socket.emit('join-room',clientsOnRoom)

      socket.join(roomData.roomName);
      console.log("User "+roomData.user+" joined the room "+roomData.roomName);        

      socket.to(roomData.roomName).emit('join-room',clientsOnRoom);

      socket.on('chat',(data:Data)=>{
        socket.to(roomData.roomName).emit('chat',data);
        console.log(data.message);
      })
    })
})

http.listen(PORT,()=>{
    console.log("Listening on port 4000");
})

