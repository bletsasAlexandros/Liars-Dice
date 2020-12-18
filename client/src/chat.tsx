import React, {useState, useRef, useEffect, FunctionComponent} from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export const Chat: React.FC = () =>{
    interface MyMessage {
        avatar: string,
        message:string
    }

    const [messages,setMessages] = useState<Array<MyMessage>>([]);
   
    useEffect(()=>{
        console.log("rendered")
        socket.on('chat',({message,user}:{message:string, user:string})=>{
            setMessages([...messages,
                {
                avatar:user,
                message: message
            }])
            console.log(message)
        })
    },[])

    return(
        <div>
            {messages.map(messageUp=>{
                <div>
                    <a>{messageUp.avatar}: {messageUp.message}</a>
                    <br />
                </div>
            })}
        </div>
    )
}
