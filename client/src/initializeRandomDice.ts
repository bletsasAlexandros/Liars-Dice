

    export const initialiazeDices = (x:number) =>{
        const diceValues = ['One','Two','Three','Four','Five','Six']
        let dices = []

        for (var i=0; i<x; i++){
            let value = Math.floor(Math.random()*6)
            dices[i] = diceValues[value]
            console.log(value)
        }
        return dices
    }
