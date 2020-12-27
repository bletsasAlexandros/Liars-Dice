import React, {useState} from 'react';
import {socket} from './App'

interface ChoiseProps{
    user: string,
    nextTurn: Function
}

export const Choices: React.FC<ChoiseProps> = (props:ChoiseProps) =>{
    const [choise,setChoise] = useState<string>('');
    const [selection,setSelection] = useState<boolean>(false);

    const handleSubmit = () =>{
        setSelection(true)
        socket.emit('next',{choise:choise})
        props.nextTurn();
    }

    return(<div>
        {(!selection) ? (
        <div>
                <select id="select" name="option" placeholder="Select" onChange={e=>{setChoise(e.target.value)}}>
                    <option value="one">One</option>
                    <option value="two">Two</option>
                    <option value="three">Three</option>
                    <option value="four">Four</option>
                    <option value="five">Five</option>
                    <option value="six">Six</option>
                </select>
                <button onClick={handleSubmit}>Submit</button>
        </div>)
        : null}
        </div>
    )
}