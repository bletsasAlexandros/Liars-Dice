import React, {useEffect, useState} from 'react';
import {socket} from './App'
import {gameLogic,selectAvailability} from './gameLogic'

interface ChoiseProps{
    user: string,
    nextTurn: Function,
    prevChoise: {choise:number , numberDice:string } | undefined
}

const selectValues=['One','Two','Three','Four','Five','Six']

export const Choices: React.FC<ChoiseProps> = (props:ChoiseProps) =>{
    const [choise,setChoise] = useState<number>(0); //Number of Dices
    const [numberDice,setNumberDice] = useState<string>('') //Dices' Number
    const [selection,setSelection] = useState<boolean>(false);
    const [optionsNumberOfDice,setOptionsNumberOfDice] = useState<object>()
    const [optionsDiceNumber,setOptionsDiceNumber] = useState<object>()

    const handleSubmit = () =>{
        setSelection(true)
        socket.emit('next',{choise:{choise:choise, numberDice:numberDice}, player:props.user})
        props.nextTurn();
    }

    useEffect(()=>{
        setOptionsNumberOfDice(
        ()=>{
            let rtn = []
            let bound:any = 0
            let disable = false

            if (typeof props.prevChoise!=='undefined'){
                if (props.prevChoise.numberDice!=='Six'){
                    bound = Math.floor(props.prevChoise.choise/2) + 1
                } else {
                    bound = props.prevChoise.choise + 1
                }
                
            }
            if (numberDice!==''){
                const availableChoises = gameLogic(props.prevChoise?.choise,props.prevChoise?.numberDice,numberDice)
                if (typeof props.prevChoise!=='undefined'){
                    bound = availableChoises
                }
            }   
            for (var i=1; i<=20; i++){
                disable = false
                if (i<bound){
                    disable = true
                }
                rtn.push(<option value={i} key={`Key_${i}`} disabled={disable}>{i}</option>)
            }
            return rtn
        }
        )
        setOptionsDiceNumber(
            selectValues.map((value,index)=>{
                let available:boolean = true
                if (choise!=0){
                    if (typeof props.prevChoise!=='undefined'){
                        available = selectAvailability(props.prevChoise.choise, choise,props.prevChoise.numberDice,value)
                    }
                }
                return(<option value={value} disabled={!available} key={`Key_${index}`}>{value}</option>)
            })
        )
    },[choise,numberDice])

    return(<div>
        {(!selection) ? (
        <div>
                <select id="select" name="Number of Dices" placeholder="Select" defaultValue="Select" onChange={e=>{setChoise(parseInt(e.target.value))}}>
                    <option style={{display: "none"}}> -- Select Number -- </option>
                    {optionsNumberOfDice}
                </select>
                <br />
                <select id="select" name="Dice Number" placeholder="Select" defaultValue="Select" onChange={e=>{setNumberDice(e.target.value)}}>
                    <option style={{display: "none"}}> -- Select Dice -- </option>
                    {optionsDiceNumber}
                </select>
                <br />
                <button onClick={handleSubmit}>Submit</button>
        </div>)
        : null}
        </div>
    )
}