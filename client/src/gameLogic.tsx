export const gameLogic:Function = (a:number,b:string) =>{
    //a is number of dices
    //b is the number of dice
    let boundSix: number = 0
    let bound: number = 0
    let bounds:object = {}

    if (b!=='Six'){
        boundSix = Math.floor(a/2+1)
        bound = a
    }else {
        boundSix = a + 1
        bound = a*2
    }

    bounds = {boundSix: boundSix, bound: bound}

    return bounds
}

export const selectAvailability:Function = (a:number, b:string) => {
    //a is number of dices 
    //b is the number of dice of previous State

    //Options for Dice
    const selectValues=['One','Two','Three','Four','Five','Six']

}