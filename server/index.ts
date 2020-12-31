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

const initialize = require('./serverGameLogic')

interface Data {
    message?: string,
    avatar?: string
  };

interface Game{
  user: string,
  dices?:number
  diceNumber?: number,
  bluff: boolean
}

interface Players{
  socket_id: string
  state:boolean,
  user:string
}

interface Ready{
  state:boolean,
  user:string
}

interface Move{
  choise:string,
  user: string
}

const clientsOnRoom = <Array<Players>>[]
var dataOnBluff:string[] = [] 
var prevData:any = {}

//Socket Setup
io.on('connection', (socket:any)=>{

   console.log('Made Socket Connection',socket.id);
    //User Joined Room
    socket.on('join-room',(roomData:{roomName:string, user:string})=>{
      var users = <Array<String>>[]

      //Update everyone - who is online
      clientsOnRoom.push({socket_id: socket.id, state:false, user:roomData.user})
      users = clientsOnRoom.map(x=>x.user)
      socket.emit('join-room',users)

      socket.join(roomData.roomName);
      console.log("User "+roomData.user+" joined the room "+roomData.roomName);        

      socket.to(roomData.roomName).emit('join-room',users);

      //Game Ready Vars
      var endGame:boolean = false

      //Game Ready
      socket.on('ready',(data:Ready)=>{
        const index = clientsOnRoom.findIndex(client=>client.user==data.user);
        clientsOnRoom[index].state=true;
        if (clientsOnRoom.every(client=> client.state == true) && clientsOnRoom.length>=2){
          clientsOnRoom.map(client=>{
            let startingDices = initialize.initialize()
            io.to(client.socket_id).emit('dices',startingDices)
          })
          io.in(roomData.roomName).emit('turn',true)
        }
      })

      socket.on('next',(choise:{choise:number, player:string})=>{
        socket.broadcast.to(roomData.roomName).emit('nextPlay',choise)
      })
      
      socket.on('bluff',(bluff:{choise:number , numberDice:string })=>{
        io.to(roomData.roomName).emit('bluff',"hello")
        prevData[bluff.numberDice] = bluff.choise
      })

        socket.on('handleBluff',(data:string[])=>{
          data.map(x=>{
            dataOnBluff.push(x)          })
          if (clientsOnRoom.length==(Math.floor(dataOnBluff.length/5))){
            let counts:any = {};
            dataOnBluff.forEach(el => counts[el] = 1  + (counts[el] || 0))
            console.log(counts)
            let valueForCheck = Object.keys(prevData)[0]
            if (prevData[valueForCheck]<=counts[valueForCheck]){
              console.log('He is correct')
            }else{
              console.log('he is lost')
            }
          }
          
        })
      
      //Chat between room users
      socket.on('chat',(data:Data)=>{
        socket.to(roomData.roomName).emit('chat',data);
        console.log(data.message);
      })
      //Update on disconnect
      socket.on('disconnect',()=>{
        const index = clientsOnRoom.findIndex(obj => obj.socket_id==socket.id);
        console.log(index)
        if (index > -1) {
          clientsOnRoom.splice(index, 1);
        }
        users = clientsOnRoom.map(x=>x.user)
        socket.to(roomData.roomName).emit('join-room', users);
      })
    })
})

http.listen(PORT,()=>{
    console.log("Listening on port 4000");
})

