import React, {useState, useRef, useEffect, FunctionComponent} from 'react';
import {socket} from './App'

interface ChoiseProps{
    user: string;
}

export const Choices: React.FC<ChoiseProps> = (props:ChoiseProps) =>{
    const [choise,setChoise] = useState('');
    const [selection,setSelection] = useState(false);

    const handleSubmit = () =>{
        socket.emit('game',{choise:choise, user:props.user},()=>{
            setSelection(false)
        })
    }

    useEffect(()=>{
        socket.on('turn',(playerTurn:string)=>{
            if (playerTurn==props.user){
                setSelection(true);
            }
        })
    },[])

    return(<div>
        {(selection) ? (
        <div>
            <form onSubmit={handleSubmit}>
                <select id="select" name="option" placeholder="Select" onChange={e=>{setChoise(e.target.value)}}>
                    <option value="one">One</option>
                    <option value="two">Two</option>
                    <option value="three">Three</option>
                    <option value="four">Four</option>
                    <option value="five">Five</option>
                    <option value="six">Six</option>
                </select>
                <input type='submit' />
            </form>
        </div>)
        : null}
        </div>
    )
}