import './App.css';
import React, {useState, useRef, useEffect, FunctionComponent} from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [room,setRoom] = useState('Room');
  const [avatar, setAvatar] = useState('Alex');
  const [message,setMessage] = useState('');

  const sendMessage = () =>{
    socket.emit('chat',{handle:avatar,message:message});
    setMessage("");
  }

  const joinRoom = () =>{
    socket.emit('join-room',{roomName:room, user:avatar});
    setRoom("")
  }

  useEffect(()=>{

  },[])

  return (
    <div className="App">
      <a>Select a Username</a>
      <input type="text" placeholder="Username" value={avatar} onChange={e=>setAvatar(e.target.value)}></input>
      <input type="text" placeholder="Room" value={room} onChange={e=>setRoom(e.target.value)}></input>
      <button onClick={joinRoom}>Join Room</button>
      <input type="text" placeholder="Write Something" value={message} onChange={e=>setMessage(e.target.value)}></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
