import { createSocket } from "dgram";

const express = require('express');
const app = express();
var socket = require('socket.io');
const PORT = 4000;

interface Data {
    message?: string,
    handle?: string
  };

var server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

// app.use(express.static('public'));

//Socket Setup
var io = socket(server);
io.on('connection', (socket:any)=>{
    console.log('Made Socket Connection',socket.id);

    socket.on('join-room',(roomData:{roomName:string, user?:string})=>{
        socket.join(roomData.roomName);
        console.log('Room '+roomData.roomName+' created');

        socket.on('chat',(data:Data)=>{
            socket.to(roomData.roomName).emit('chat',data);
            console.log(data.message);
        })
    })
})

