import React, {useState, useRef, useEffect, FunctionComponent} from 'react';
import { socket } from './App';
import './board.css'

interface BoardProps {
    users: String[],
    avatar: String
}

export const Board: React.FC<BoardProps> = (props:BoardProps)=>{
    const [ready,setReady] = useState<boolean>(false)

    const readyGame = (user:String) =>{
        socket.emit('ready',{state:true,user:user});
        setReady(true)
    }

    useEffect(()=>{
        socket.on('ready',(data:boolean)=>{
            
        })
    },[])

    return(
    <div className='board'>
        
        {props.users.map((user,index)=>{
            return(
                <div key={`Key_${index}`} className='board-player'>
                    <a>{user}</a>
                    <br />
                    {(!ready && props.avatar==user) ? <button onClick={()=>readyGame(props.avatar)}>Ready</button> : null}
                </div>
            )
        })}
    </div>)
}