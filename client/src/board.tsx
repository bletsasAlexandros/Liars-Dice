import React, {useState, useRef, useEffect, FunctionComponent} from 'react';
import { socket } from './App';
import {Choices} from './choice'
import './board.css'

interface BoardProps {
    users: String[],
    avatar: string
}

export const Board: React.FC<BoardProps> = (props:BoardProps)=>{
    const [ready,setReady] = useState<boolean>(false)

    const readyGame = (avatar:string) =>{
        setReady(true);
        socket.emit('ready',{state:true,user:avatar});
    }

    useEffect(()=>{
        socket.on('ready',(data:boolean)=>{
            console.log("Everyone is ready!")
        })
    },[])

    return(
    <div className='board'>
        {props.users.map((user,index)=>{
            return(
                <div key={`Key_${index}`} className='board-player'>
                    <a>{user}</a>
                    <br />
                    {(!ready && props.avatar==user) ? <button onClick={()=>readyGame(props.avatar)}>Ready</button> : props.avatar==user ? <Choices user={props.avatar}/> : null}
                </div>
            )
        })}
    </div>)
}