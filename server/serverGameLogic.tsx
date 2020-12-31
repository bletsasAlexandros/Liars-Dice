module.exports = {
    initialize: () =>{
        const diceValues = ['One','Two','Three','Four','Five','Six']
        let dices = []

        for (var i=0; i<5; i++){
            let value = Math.floor(Math.random()*6)
            dices[i] = diceValues[value]
        }
        return dices
    }
}
