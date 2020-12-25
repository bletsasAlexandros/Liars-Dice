import React, {useState, useRef, useEffect, FunctionComponent} from 'react';
import {socket} from './App';
import './chat.css';

interface ChatProps {
    avatarUser: string ;
}


export const Chat: React.FC<ChatProps> = (props:ChatProps) =>{
    interface MyMessage {
        avatar: string,
        message:string
    }

    const [messages,setMessages] = useState<Array<MyMessage>>([]);
    const [message,setMessage] = useState('');
    const avatar = props.avatarUser;

    const sendMessage = () =>{
      socket.emit('chat',{avatar:avatar,message:message});
      setMessage("");
      setMessages(prevState=>[...prevState,
        {
            avatar: avatar,
            message: message
        }])
    }
   
    useEffect(()=>{
        socket.on('chat',(data:MyMessage)=>{
            setMessages(prevState=>[...prevState,
            {
                avatar: data.avatar,
                message: data.message
            }])
        })
    },[])

    return(
        <div className="main-chat">
            <h6>Chat:</h6>
            <input type="text" placeholder="Write Something" value={message} onChange={e=>setMessage(e.target.value)}></input>
            <button onClick={sendMessage}>Send</button>
            {messages.map((messageUp,index)=>{
                return(
                <div key={`Key_${index}`}>
                    <a>{messageUp.avatar}: {messageUp.message}</a>
                    <br />
                </div>
                )
            })}
        </div>
    )
}
