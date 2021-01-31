import Game from "../types/GameState";
import { Player } from "../types/Player";
import { TurnWinner } from "../types/TurnWinner";
import evaluation from "./evaluations";
import helper from "./helper";

export interface Moves {
    endTurn:() => void,
    rollDice:() => void,
    transformDice:() => void,
    holdDice:(index:number | null) => void,
    confirmRoundEnd:(G:Game, ctx:any) => void,
}
// Using this interface for testing
// the framework provides every move with G and ctx - i need to mock them for testing
export interface TestMoves {
    endTurn:(G:Game, ctx:any) => void,
    rollDice:(G:Game, ctx:any) => void,
    transformDice:(G:Game, ctx:any) => void,
    holdDice:(G:Game, ctx:any, index:number) => void,
    confirmRoundEnd:(G:Game, ctx:any) => void,
}

// Ends turn
const endTurn = (G:Game, ctx:any) => {
    // Transfer all dice to the player state
    G.players[Number(ctx.currentPlayer)].currentScore.currentThrow = Array.from(G.dice).concat(G.diceHold);
    // Transfer the number of used throws for the score
    G.players[Number(ctx.currentPlayer)].currentScore.usedThrows = G.totalRolls;
    // Reset the number of total Rolls and the number of dice to roll for the next Player
    G.diceToRoll = 3;
    G.diceHold = [];
    G.dice = [];
    if(ctx.currentPlayer === ctx.playOrder[0]){
        G.rollsThisTurn = G.totalRolls;
    }     
    G.totalRolls = 0;
    if(ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length-1]){
        const turnWinnerObject:TurnWinner = evaluation.evaluateTurnWinner(G.players.filter((player:Player,index:number) => ctx.playOrder.indexOf(index.toString()) > -1), G.ruleSet);
        G.roundHistory.unshift(turnWinnerObject);
        for(let i:number = 0; i < G.players.length; i++){
            G.players[i].currentScore.currentThrow = [...G.players[i].currentScore.hiddenDice, ...G.players[i].currentScore.currentThrow];
            G.players[i].currentScore.hiddenDice = [];
        }
        G.rollsThisTurn = 3;
        ctx.events.endPhase();
    }
    else{
        ctx.events.endTurn();
    }
}

// Rolls all dice which are not held
const rollDice = (G:Game, ctx:any) => {
    if(G.totalRolls < G.rollsThisTurn-1){
        G.dice = (new Array(G.diceToRoll).fill(0)).map((el:number) => ctx.random.D6());
        G.players[Number(ctx.currentPlayer)].currentScore.hiddenDice = [];
    }
    else{
        G.players[Number(ctx.currentPlayer)].currentScore.hiddenDice = (new Array(G.diceToRoll).fill(0)).map((el:number) => ctx.random.D6());
        G.dice = [];
    }
    G.totalRolls++;
    // Don't allow more than 3 rolls per turn
    if(G.totalRolls >= G.rollsThisTurn){
        endTurn(G, ctx);
    }
}

const rollDiceDebug = (G:Game, ctx:any, input:number[]) => {
    if(G.totalRolls < G.rollsThisTurn-1){
        G.dice = input;
        G.players[Number(ctx.currentPlayer)].currentScore.hiddenDice = [];
    }
    else{
        G.players[Number(ctx.currentPlayer)].currentScore.hiddenDice = (new Array(G.diceToRoll).fill(0)).map((el:number) => ctx.random.D6());
        G.dice = [];
    }
    G.totalRolls++;
    // Don't allow more than 3 rolls per turn
    if(G.totalRolls >= G.rollsThisTurn){
        endTurn(G, ctx);
    }
}

// If ruleSet allows this you can transform 2x six to 1x one AND 3x six to 2x 1
const transformDice = (G:Game, ctx:any) => {
    const twoSix:number = helper.isTransformationPossible(G.dice, G.ruleSet);
    const ruleSetAllowsTranform = G.ruleSet.twoSixToOne;
    const notLastThrow = G.totalRolls < 3;
    if((twoSix > 0) && ruleSetAllowsTranform && notLastThrow){
        let diceCopy = [];
        if(evaluation.isGeneral(G.dice, G.diceHold, G.ruleSet)){
            G.diceHold.push(1);
            G.diceToRoll -= 1;
        }
        else{
            for(let i = 0, d = 0; i < G.dice.length; i++){
                if(G.dice[i] !== 6 || d >=2) diceCopy.push(G.dice[i]);
                else d++;
            }
        }
        G.dice = diceCopy;
        G.diceHold.push(1);
        G.diceToRoll -= 1;
    }
}

// Holds a dice which will not be rerolled on the next throw
const holdDice = (G:Game, ctx:any, index:number) =>{
    if(G.totalRolls < 3){
        if(helper.whichDiceCanBeHeld(G.dice, G.ruleSet)[index]){
            let diceCopy = [];
            for(let i:number = 0; i < G.dice.length; i++){
                if(i !== index){
                    diceCopy.push(G.dice[i]);
                }
            }
            G.diceHold.push(G.dice[index]);
            G.dice = diceCopy;
            G.diceToRoll -= 1;
        }
    }
}

const confirmRoundEnd = (G:Game, ctx:any) => {
    if(ctx.phase === "evaluation"){
        G.confirmedRoundEnd = true;
    }
}

const moves = {rollDice, rollDiceDebug, holdDice, endTurn, transformDice, confirmRoundEnd};

export default moves;