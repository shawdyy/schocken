import { RuleSet } from "../types/Ruleset";
import { Player } from "../types/Player";
import { TurnWinner } from "../types/TurnWinner";
import helper from "./helper";

interface ValueTable {
    [index:string]:number
    street: number
    general: number
    jule: number
    siebener: number
    achter: number
}
export class EvaluatedScore {
    name: string;
    dice: number[]
    value: number;
    constructor(currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet){
        this.name = getThrowType(currentThrow, hiddenDice, ruleSet);
        this.dice = [...currentThrow, ...hiddenDice];
        this.value = evaluateValue(currentThrow, hiddenDice, ruleSet);
    }
}
const throwTogetherConditional = (currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet):boolean => {
    if(ruleSet.throwTogether){
        return true;
    }
    else{
        return (currentThrow.length === 3 || hiddenDice.length ===3);
    }
}
// evaluates if throw is a street
const isStreet = (currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet):boolean => {
    if(throwTogetherConditional(currentThrow, hiddenDice, ruleSet)){
        const dice = [...currentThrow, ...hiddenDice];
        switch(dice.sort().join()){
            case "1,2,3":
            case "2,3,4":
            case "3,4,5":
            case "4,5,6":
                return true;
            default:
                return false;
        }
    }
    return false;
}
// evaluates if throw is a general
const isGeneral = (currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet):boolean => {
    if(throwTogetherConditional(currentThrow, hiddenDice, ruleSet)){
        const dice = [...currentThrow, ...hiddenDice];
        switch(dice.sort().join()){
            case "2,2,2":
            case "3,3,3":
            case "4,4,4":
            case "5,5,5":
            case "6,6,6":
                return true;
            default:
                return false;
        }
    }
    return false;
}
// evaluates if throw is a schock
const isSchock = (currentThrow:number[], hiddenDice:number[]):boolean => {
    const dice = [...currentThrow, ...hiddenDice];
    switch(dice.sort().join()){
        case "1,1,1":
        case "1,1,2":
        case "1,1,3":
        case "1,1,4":
        case "1,1,5":
        case "1,1,6":
            return true;
        default:
            return false;
    }
}
// evaluates if throw is a jule
const isJule = (currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet):boolean => {
    if(throwTogetherConditional(currentThrow, hiddenDice, ruleSet)){
        const dice = [...currentThrow, ...hiddenDice];
        return (dice.sort().join() === "1,2,4")
    }
    return false;
}
// evaluates if throw is a siebener
const isSiebener = (currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet):boolean => {
    if(throwTogetherConditional(currentThrow, hiddenDice, ruleSet)){
        const dice = [...currentThrow, ...hiddenDice];
        return (dice.sort().join() === "1,2,2")
    }
    return false;
}
// evaluates if throw is a achter
const isAchter = (currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet):boolean => {
    if(throwTogetherConditional(currentThrow, hiddenDice, ruleSet)){
        const dice = [...currentThrow, ...hiddenDice];
        return (dice.sort().join() === "1,3,3")
    }
    return false;
}
// evaluates the type of schock
const getSchockValue = (currentThrow:number[], hiddenDice:number[]):number => {
    if(isSchock(currentThrow, hiddenDice)){
        const dice = [...currentThrow, ...hiddenDice];
        if(dice.sort()[2] === 1) return Infinity;
        return dice.sort()[2];
    }
    else return 0;
}
const getThrowType = (currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet):string => {
    switch(true){
        case isStreet(currentThrow, hiddenDice, ruleSet):
            return "street";
        case isGeneral(currentThrow, hiddenDice, ruleSet):
            return "general";
        case isSchock(currentThrow, hiddenDice):
            return "schock";
        case isJule(currentThrow, hiddenDice, ruleSet):
            if(ruleSet.jule === 1) return "default";
            return "jule";
        case isSiebener(currentThrow, hiddenDice, ruleSet):
            if(ruleSet.siebener === 1) return "default";
            return "siebener";
        case isAchter(currentThrow, hiddenDice, ruleSet):
            if(ruleSet.achter === 1) return "default";
            return "achter";
        default:
            return "default";
    }
}
const evaluateValue = (currentThrow:number[], hiddenDice:number[], ruleSet:RuleSet):number => {
    const valueTable:ValueTable = {
        default: 1,
        street: 2,
        general: 3,
        jule: 1,
        siebener: 1,
        achter: 1,
    };
    if (ruleSet.jule > 1) valueTable.jule = ruleSet.jule;
    if (ruleSet.siebener > 1) valueTable.siebener = ruleSet.siebener;
    if (ruleSet.achter > 1) valueTable.achter = ruleSet.achter;
    
    if(getThrowType(currentThrow, hiddenDice,ruleSet) === "schock") return getSchockValue(currentThrow, hiddenDice);
    return valueTable[getThrowType(currentThrow, hiddenDice, ruleSet)];
}
// TODO: Soll ich hier wirklich players als arg geben? 
// würde nicht Scores[] reichen?
const evaluateTurnWinner = (players:Player[], ruleSet:RuleSet):TurnWinner => {
    // theoreticaly everthing can be sorted descending from the values of the evaluateValue function.
    // There are only two exceptions:
    // 1. Schock2 beats street and general, altough only value 2
    // 2. Schock3 beats general, altough only value 3
    const sortingCallback = (a:Player, b:Player):number => {
        const aScore:EvaluatedScore = new EvaluatedScore(a.currentScore.currentThrow, a.currentScore.hiddenDice, ruleSet);
        const bScore:EvaluatedScore = new EvaluatedScore(b.currentScore.currentThrow, b.currentScore.hiddenDice, ruleSet);
        if(aScore.name === "schock" && bScore.name === "street"){
            return -1;
        }
        if(aScore.name === "schock" && bScore.name === "general"){
            return -1;
        }
        if(aScore.name === "street" && bScore.name === "schock"){
            return 1;
        }
        if(aScore.name === "general" && bScore.name === "schock"){
            return 1;
        }
        if(aScore.value < bScore.value){
            return 1;
        }
        if(aScore.value > bScore.value){
            return -1;
        }
        if(helper.concatDice(aScore.dice) < helper.concatDice(bScore.dice)){
            return 1;
        }
        if(helper.concatDice(aScore.dice) > helper.concatDice(bScore.dice)){
            return -1;
        }
        return 1;
    }

    let sortedPlayers = [...players].sort(sortingCallback);
    return {
        winnerIndex: sortedPlayers[0].playerID,
        loserIndex: sortedPlayers[sortedPlayers.length-1].playerID,
        penalties: evaluateValue(sortedPlayers[0].currentScore.currentThrow, sortedPlayers[0].currentScore.hiddenDice, ruleSet)
    }
}

const exp = {isStreet, isGeneral, isSchock, isJule, isSiebener, isAchter, getSchockValue, getThrowType, evaluateValue, evaluateTurnWinner};

export default exp;