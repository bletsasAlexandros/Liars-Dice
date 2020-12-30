export const gameLogic:Function = (a:number,b:string,c:string) =>{
    //a is number of dices prev choise
    //b is the number of dice prev choise
    //c is the number of dice now choise
    let bound: number = 0

    //Options for Dice
    const selectValues=['One','Two','Three','Four','Five','Six']

    if (b!=='Six' && c!=="Six"){
        if (b===c || selectValues.indexOf(c)<selectValues.indexOf(b)){
            bound = a + 1
        } else {
            bound = 0
        }
    }else if (b==='Six' && c!=='Six'){
        bound = a*2
    }else if (b!=='Six' && c==='Six'){
        bound = Math.floor(a/2) + 1
    }else if (b==='Six' && c==='Six'){
        bound = a + 1
    }

    return bound
}

export const selectAvailability:Function = (a:number, b:number,c:string,d:string) => {
    //a is number of dices of prev state
    //b is the number of dices now
    //c is the number of dice of previous State
    //d is the current dice number

    //Options for Dice
    const selectValues=['One','Two','Three','Four','Five','Six']

    if (b>a){
        //all are available
        if (c==='Six'){
            if (d=='Six'){
                return true
            }else if (b>=2*a){
                return true
            }else{
                return false
            }
        }else{
            return true
        }
    }else if (b==a/2 || b==Math.floor(a/2)+1){
        //only six available
        if (d==='Six' && c!=='Six'){
            return true
        }else{
            return false
        }
    }else if (a==b){
        if (selectValues.indexOf(d)>selectValues.indexOf(c)){
            return true
        }else{
            return false
        }
    }
    else {
        //not available
        return false
    }

}