import { Player } from "./Player";
import { RuleSet } from "./Ruleset";
import { TurnWinner } from "./TurnWinner";

export default interface Game {
    // How many dice are in the game
    diceToRoll:number,
    // How many players are playing
    players:Player[],
    // The dice which were thrown last
    dice:number[],
    // The dice which get held in this turn
    diceHold:number[],
    // the number of rolls which happend during the current turn
    totalRolls:number,
    // the number of rolls which are allowed this round (according to totalRolls from player[0])
    rollsThisTurn:number,
    // penalties left before the turn evalutation
    penaltiesLeft:number,
    // finalpenalties left 
    finalPenaltiesLeft:number,
    // results auf the last rounds played
    roundHistory: TurnWinner[],
    // is the round end confirmed
    confirmedRoundEnd: boolean,
    // the rulseset this game is based on
    ruleSet:RuleSet
    // last Phase
    lastPhase:string
}