import Game from "../types/GameState";
import { LogEntry, State } from "boardgame.io";
import { Moves } from "../Utils/moves";

export interface Bgio extends State {
    G:Game,
    credentials:unknown,
    debug:boolean,
    events?: {
        endGame?: boolean;
        endPhase?: boolean;
        endTurn?: boolean;
        setPhase?: boolean;
        endStage?: boolean;
        setStage?: boolean;
        pass?: boolean;
        setActivePlayers?: boolean;
    };
    isActive:boolean,
    isConnected:boolean,
    isMultiplayer:boolean,
    log?:LogEntry[],
    matchData:unknown,
    matchID:unknown,
    moves:Moves,
    playerID:unknown,
    reset():void,
}
export interface BgioProps {
    bgioProps: Bgio
}