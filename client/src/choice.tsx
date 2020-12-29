import React, {useEffect, useState} from 'react';
import {socket} from './App'
import {gameLogic} from './gameLogic'

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
            const availableChoises = gameLogic(props.prevChoise?.choise,props.prevChoise?.numberDice)
            let rtn = []
            let bound:any = 0
            let boundSix:any = 0
            let disable = false
            if (typeof props.prevChoise!=='undefined'){
                bound = availableChoises.bound
                boundSix = availableChoises.boundSix
            }
            for (var i=1; i<=20; i++){
                disable = false
                if (i<bound && i!=boundSix){
                    disable = true
                }
                if (numberDice===props.prevChoise?.numberDice){
                    boundSix ++
                    bound ++
                }
                rtn.push(<option value={i} key={`Key_${i}`} disabled={disable}>{i}</option>)
            }
            return rtn
        }
        )
        setOptionsDiceNumber(
            selectValues.map((value,index)=>{
                if (typeof props.prevChoise!=='undefined'){
                    if (props.prevChoise?.choise==choise){
                        var availableOpt = selectValues.indexOf(props.prevChoise.numberDice)
                    }
                }
                return(<option value={value} key={`Key_${index}`}>{value}</option>)
            })
        )
    },[setChoise,setNumberDice])

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