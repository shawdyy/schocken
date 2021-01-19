export interface RuleSet {
    // twoSixToOne
    // you can change 2x six to 1x one
    twoSixToOne:boolean, 
    // throwTogether
    // you can throw a general or street "together" (Pflücken)
    throwTogether:boolean, 
    // generalGreaterSchockTwo
    // general has a greater value than schock 2, because it has a punishment value of 3
    generalGreaterSchockTwo:boolean,     
    // whichNumberCanBeHeld
    //[0] "onlyOne", // 1
    //[1] "oneSix", // 1,6
    //[2] "all" // 1,2,3,4,5,6
    whichNumbersCanBeHeld:number,
    // streetValue
    //[0] "descending" for example 3,4,5 is has a higher value than 1,2,3
    //[1] "throwOrder"  if player one has a street and player two has a street after him, the former has a higher value
    //[2] "neededRolls" if player two needs one roll for a street and player one needs two, player two has a higher value
    streetValue:number,
    // jule
    // 4,2,1 means a punishment of value 7
    jule:number, 
    // siebener - punishment value of the throw [2,2,1]
    // possible: 1,9,7
    siebener:number,
    // achter - punishment value of the throw [3,3,1]
    // possible: 1,8,10
    achter:number,
    // the number of penalties per round
    totalPenaltiesPerRound: number
}

export const defaultRuleSet:RuleSet = {
    twoSixToOne: true,
    throwTogether: false,
    generalGreaterSchockTwo: false,
    whichNumbersCanBeHeld: 1,
    streetValue: 0,
    jule: 1,
    siebener: 1,
    achter: 1,
    totalPenaltiesPerRound: 13
}