import { PlayerID } from "boardgame.io";

export interface PlayerState {
    penalties:number,
    currentThrow:number[],
    hiddenDice: number[],
    usedThrows:number
}

export interface Player {
    playerID: PlayerID,
    name: string,
    currentScore: PlayerState,
    finalPenalty: number,
}