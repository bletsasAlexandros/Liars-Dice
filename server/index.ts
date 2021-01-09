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

interface Players{
  socket_id: string
  state:boolean,
  user:string,
  dices:number
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
var personPrevData:string = ''
var nextRoundPlayer:number = 0

//Socket Setup
io.on('connection', (socket:any)=>{

   console.log('Made Socket Connection',socket.id);

    //User Joined Room
    socket.on('join-room',(roomData:{roomName:string, user:string})=>{
      var users = <Array<String>>[]

      //Update everyone - who is online
      clientsOnRoom.push({socket_id: socket.id, state:false, user:roomData.user, dices:5})
      users = clientsOnRoom.map(x=>x.user)
      socket.emit('join-room',users)

      socket.join(roomData.roomName);
      console.log("User "+roomData.user+" joined the room "+roomData.roomName);        

      socket.to(roomData.roomName).emit('join-room',users);


      //Game Ready
      socket.on('ready',(data:Ready)=>{
        const index = clientsOnRoom.findIndex(client=>client.user==data.user);
        clientsOnRoom[index].state=true;
        if (clientsOnRoom.every(client=> client.state == true) && clientsOnRoom.length>=2){
          clientsOnRoom.map(client=>{
            let startingDices = initialize.initialize(client.dices)
            io.to(client.socket_id).emit('dices',startingDices)
          })
          io.in(roomData.roomName).emit('turn',true)
        }
      })

      //Ending-round Statring New-Round
      socket.on('next-round',(player:string)=>{
        const currentIndex = clientsOnRoom.findIndex(client=>client.user==player)
        clientsOnRoom[currentIndex].state=true
        if (clientsOnRoom.every(client=>client.state == true)){
          //Next round var defaults
          clientsOnRoom.map(client=>{
            console.log(client.user)
            io.to(client.socket_id).emit('next-round-ready',{clientDices:client.dices,nextPlayer:nextRoundPlayer})
          })
        }
      })


      //Next Player
      socket.on('next',(choise?:{choise:number, player:string})=>{
        socket.broadcast.to(roomData.roomName).emit('nextPlay',choise)
      })
      
      //When someone call bluff
      socket.on('bluff',(bluff:{choise:number , numberDice:string })=>{
        io.to(roomData.roomName).emit('bluff',"hello")
        prevData[bluff.numberDice] = bluff.choise
        let result = clientsOnRoom.filter(obj => {
          return obj.socket_id===socket.id
        })
        let bluffedIndex = clientsOnRoom.indexOf(result[0])-1
        if (bluffedIndex<0){
          bluffedIndex=clientsOnRoom.length-1
        }
        personPrevData = clientsOnRoom[bluffedIndex].user
      })


        //Handle Bluff - What to do when someone called bluff
        socket.on('handleBluff',(data:string[])=>{
          console.log("hello")
          //Store all dices
          data.map(x=>{
            dataOnBluff.push(x)          
          })
          if (clientsOnRoom.length===(Math.floor(dataOnBluff.length/5))){
            let counts:any = {};
            dataOnBluff.forEach(el => counts[el] = 1  + (counts[el] || 0))
            let valueForCheck = Object.keys(prevData)[0]
            let addSix:number = 0
            if (valueForCheck!=='Six'){
              addSix = counts['Six']
            }
            console.log(personPrevData)
            let result = clientsOnRoom.filter(obj => {
              return obj.user===personPrevData
            })
            let playerIndex = clientsOnRoom.indexOf(result[0])
            console.log('Player index is '+playerIndex)
            if (prevData[valueForCheck]<=(counts[valueForCheck]+addSix)){
              for (var i=0; i<clientsOnRoom.length;i++){
                if (i!==playerIndex){
                  io.to(clientsOnRoom[i].socket_id).emit('lost',playerIndex)
                  clientsOnRoom[i].dices --
                }else{
                  io.to(clientsOnRoom[i].socket_id).emit('won',playerIndex)
                }
              }
              nextRoundPlayer = playerIndex
              console.log(personPrevData+' is correct')
              
              dataOnBluff = []
              prevData = {}
              personPrevData = ''
              //For next
              clientsOnRoom.every(client=>{client.state=false})
            }else{
              for (var i=0; i<clientsOnRoom.length; i++){
                if (i!==playerIndex){
                  io.to(clientsOnRoom[i].socket_id).emit('won',playerIndex)
                }else{
                  let lost = prevData[valueForCheck]+addSix-counts[valueForCheck]
                  io.to(clientsOnRoom[i].socket_id).emit('lost',playerIndex)
                  clientsOnRoom[i].dices = clientsOnRoom[i].dices - lost
                }
              }
              if (playerIndex < clientsOnRoom.length-1){
                nextRoundPlayer = playerIndex + 1
              }else{
                nextRoundPlayer = 0
              }
              console.log(personPrevData+' is lost')
              
                dataOnBluff = []
                prevData = {}
                personPrevData = ''
              //For next
              clientsOnRoom.every(client=>{client.state=false})
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

