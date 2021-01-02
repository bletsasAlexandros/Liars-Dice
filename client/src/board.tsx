import React, {useState, useEffect} from 'react';
import { socket } from './App';
import {Choices} from './choice'
import {Dices} from './dices'
import './board.css'

interface BoardProps {
    users: string[],
    avatar: string
}

interface PreviousChoise{
    choise: number,
    numberDice: string
}

export const Board: React.FC<BoardProps> = (props:BoardProps)=>{
    const [ready,setReady] = useState<boolean>(false)
    const [indexTurn,setIndexTurn] = useState<number>(-1)
    const [currentPlayer,setCurrentPlayer] = useState<string>()
    const [choise,setChoise] = useState<PreviousChoise>()
    const [dices,setDices] = useState<Array<string>>([])
    const [status,setStatus] = useState<string>('')
    const [round,setRound] = useState<boolean>(false)

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
            setIndexTurn(indexTurn + 1)
        })
        socket.on('nextPlay',(choisePlayer:{choise:PreviousChoise,player:string})=>{
            setChoise(choisePlayer.choise)
            setCurrentPlayer(choisePlayer.player)
            if (indexTurn<props.users.length-1){
                setIndexTurn(indexTurn + 1)
            }else if(indexTurn==props.users.length-1){
                setIndexTurn(0)
            }
        })
        
    },[indexTurn])

    useEffect(()=>{
        socket.on('dices',(dices:string[])=>{
            setDices(dices)
            console.log(dices)
            socket.on('bluff',()=>{
                //bluff
                console.log('bluff')
                socket.emit('handleBluff',dices)
            })
        })
        socket.on('won',(bravo:string)=>{
            console.log("won")
            setStatus('won')
            setTimeout(()=>{
                setStatus('')
            },4000)
        })
        socket.on('lost',(lostDices:number)=>{
            console.log("lost")
            setStatus('lost')
            setTimeout(()=>{
                setStatus('')
            },4000)
        })
    },[])

    return(
    <div className='board'>
        {props.users.map((user,index)=>{
            return(
                <div key={`Key_${index}`} className='board-player'>
                    <a>{user}</a>
                    <br />
                    {(currentPlayer==user) ? (<div><a> Choise {choise?.choise}</a> <br /> <a>Dice {choise?.numberDice}</a></div>): null}
                    <br />
                    {(!ready && props.avatar==user && status==='') ? 
                    <button onClick={()=>readyGame(props.avatar)}>Ready</button> : 
                    (props.users[indexTurn]==props.avatar && props.users[indexTurn]==user && status==='') ? 
                    <div>
                    <Choices user={props.avatar} nextTurn={nextTurn} prevChoise={choise}/>
                    </div> : 
                    null}
                    {(ready && props.avatar==user) ? 
                    <Dices dices={dices}/> : ready ? <a>Five Dices</a> : null}
                    {(status!=='' && props.avatar==user) ? <a>You {status}</a> : null}
                </div>
            )
        })}
    </div>)
}