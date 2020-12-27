import React, {useState, useEffect} from 'react';
import { socket } from './App';
import {Choices} from './choice'
import './board.css'

interface BoardProps {
    users: string[],
    avatar: string
}

export const Board: React.FC<BoardProps> = (props:BoardProps)=>{
    const [ready,setReady] = useState<boolean>(false)
    const [indexTurn,setIndexTurn] = useState<number>(-1)

    const readyGame = (avatar:string) =>{
        setReady(true);
        socket.emit('ready',{state:true,user:avatar});
    }

    const nextTurn = () =>{
        if (indexTurn<props.users.length-1){
            setIndexTurn(indexTurn + 1)
        }else if (indexTurn==props.users.length-1){
            setIndexTurn(0)
        }
    }

    useEffect(()=>{
        socket.on('turn',(readySteady:boolean)=>{
            console.log("Everyone is Ready")
            setIndexTurn(indexTurn + 1)
        })
        socket.on('next',(choise:string)=>{
            console.log(indexTurn)
            if (indexTurn<props.users.length-1){
                setIndexTurn(indexTurn + 1)
            }else if(indexTurn==props.users.length-1){
                setIndexTurn(0)
            }
            console.log(choise)
        })
    },[indexTurn])

    return(
    <div className='board'>
        {props.users.map((user,index)=>{
            return(
                <div key={`Key_${index}`} className='board-player'>
                    <a>{user}</a>
                    <br />
                    <a>{indexTurn}</a>
                    {(!ready && props.avatar==user) ? 
                    <button onClick={()=>readyGame(props.avatar)}>Ready</button> : 
                    (props.users[indexTurn]==props.avatar && props.users[indexTurn]==user) ? 
                    <Choices user={props.avatar} nextTurn={nextTurn}/> : 
                    null}
                </div>
            )
        })}
    </div>)
}