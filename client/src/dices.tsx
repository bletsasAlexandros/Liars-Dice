import React, {useState,useEffect} from 'react'

interface DiceProps{
    dices:string[]
}

export const Dices:React.FC<DiceProps> = (props:DiceProps) =>{
    return(<div>
        {props.dices ? props.dices.map((dice,index)=>{
            return(<a key={`Key_${index}`}>Dice {dice} <br/></a>)
        }) : null }
    </div>)
}