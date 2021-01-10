import React, {useState, useEffect} from 'react';
import { socket } from './App';
import {Choices} from './choice'
import {Dices} from './dices'
import {initialiazeDices} from './initializeRandomDice'
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
    const [ready,setReady] = useState<boolean>(false) //Ready is true when everyone is ready to start the game
    const [indexTurn,setIndexTurn] = useState<number>(-1) //Shows who is nect in line
    const [currentPlayer,setCurrentPlayer] = useState<string>() //Whos turn is it
    const [choise,setChoise] = useState<PreviousChoise>() //The choise the previous player have made
    const [dices,setDices] = useState<Array<string>>([]) //Dices
    const [status,setStatus] = useState<string>('') //Won or lost
    const [round,setRound] = useState<boolean>(false) //End of the round is set to true and then at the beggining to false

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

    const disactivateUser()


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
        if (dices.length==0){
            //disactivate
        }
    },[indexTurn])

    useEffect(()=>{
        socket.on('dices',(dices:string[])=>{
            setDices(dices)
            socket.on('bluff',()=>{
                socket.emit('handleBluff',dices)
            })
        })
        socket.on('won',(nxt:number)=>{
            setStatus('won')
            setRound(true)
            setTimeout(()=>{
                setStatus('')
                socket.emit('next-round',props.avatar)
            },4000)
            
        })
        socket.on('lost',(nxt:number)=>{
            setStatus('lost')
            setRound(true)
            setTimeout(()=>{
                setStatus('')
                socket.emit('next-round',props.avatar)
            },4000)
        })
        socket.on('next-round-ready',(data:{clientDices:number,nextPlayer:number})=>{
            var dic = initialiazeDices(data.clientDices)
            setDices(dic)
            setIndexTurn(data.nextPlayer)
            setRound(false)
        })
    },[])

    return(
    <div className='board'>
        {props.users.map((user,index)=>{
            return(
                <div key={`Key_${index}`} className='board-player'>
                    <a>{user}</a>
                    <br />

                    {(currentPlayer==user && !round) ? (<div><a> Choise {choise?.choise}</a> <br /> <a>Dice {choise?.numberDice}</a></div>): null}

                    <br />
                    {(!ready && props.avatar==user && status==='') ? 
                    <button onClick={()=>readyGame(props.avatar)}>Ready</button> : 
                    (props.users[indexTurn]==props.avatar && props.users[indexTurn]==user && status==='') ? 
                    <div>
                        <Choices user={props.avatar} nextTurn={nextTurn} prevChoise={choise}/>
                    </div> : 
                    null}

                    {(status!=='' && props.avatar==user) ? <a>You {status}</a> : 
                    (ready && props.avatar==user && !round ) ? 
                    <Dices dices={dices}/> : (ready && !round) ? <a>Five Dices</a> : null}
                    
                </div>
            )
        })}
    </div>)
}