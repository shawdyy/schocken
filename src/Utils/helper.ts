import { RuleSet } from "../types/Ruleset";
import { Player, PlayerState } from "../types/Player";
import GameState from "../types/GameState";
import { PlayerID } from "boardgame.io"
import { TurnWinner } from "../types/TurnWinner";

const whichDiceCanBeHeld = (dice:number[], ruleSet:RuleSet):boolean[] =>{
    let callback;
    // Option1: Only ones can be held
    if(ruleSet.whichNumbersCanBeHeld === 0){
        callback = (el:number):boolean => (el === 1);
    }
    // Option2: Ones and sixes can be held
    else if(ruleSet.whichNumbersCanBeHeld === 1){
        callback = (el:number):boolean => (el === 1 || el === 6);
    }
    // Option2: Every number can be held
    else {
        callback = (el:number):boolean => true;
    }
    return dice.map(callback);
}
const createInitialPlayerState = ():PlayerState => {
    return {
        penalties: 0,
        currentThrow: [],
        hiddenDice: [],
        usedThrows: 0,
    }
}
const createPlayer = (playerID:PlayerID, name: string):Player =>{
    return {
        playerID: playerID,
        name: name,
        currentScore: createInitialPlayerState(),
        finalPenalty: 0
    }
}
const isTransformationPossible = (dice:number[], ruleset:RuleSet):number => {
    if(ruleset.twoSixToOne) return (dice.filter((i:number) => i === 6)).length-1;
    else return 0;
}
const resetPlayerState = (G:GameState, obj:Partial<PlayerState>) => {
    return G.players.map((el:Player, i:number) => {
        return {...el,currentScore: {...el.currentScore, ...obj}};
    });
}
const concatDice = (array:number[]):number => {
    array = array.sort((a,b) => a - b);
    let num = array.reduce((cum:number, curr:number, index:number):number => {
        cum += curr * Math.pow(10, index);
        return cum;
    }, 0);
    return num;
}
const hasOnePlayerAllPenalties = (G:GameState, player:Player[], lastTurnWinner:TurnWinner):boolean =>{
    // This isn't optimal but currently i have no other choice than adding the penalties from this round to the loser in this function manually
    // return G.players.reduce((bool:boolean, player:Player) =>{
    //     if(bool){
    //         return bool;
    //     }
    //     else if(maxPenaltyCheck){
    //         return true;
    //     }
    //     return bool;
    // }, false);
    for(let i:number = 0; i < player.length; i++){
        let maxPenaltyCheck:boolean = player[i].currentScore.penalties + ((player[i].playerID === lastTurnWinner.loserIndex) ? lastTurnWinner.penalties : 0) >= G.ruleSet.totalPenaltiesPerRound;
        if(maxPenaltyCheck){
            return true;
        }
    }
    return false;
}
const hasOnePlayerAllFinalPenalties = (G:GameState, player:Player[]):boolean =>{
    return G.players.reduce((bool:boolean, player:Player) =>{
        return (bool || player.finalPenalty > 1) ? true : false;
    }, false);
}
const helper = {whichDiceCanBeHeld, createInitialPlayerState, createPlayer, isTransformationPossible, concatDice, resetPlayerState, hasOnePlayerAllPenalties, hasOnePlayerAllFinalPenalties};
export default helper;