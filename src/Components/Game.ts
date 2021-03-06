import { Ctx, Game } from "boardgame.io";
import GameState from "../types/GameState";
import {Player} from "../types/Player";
import { RuleSet, defaultRuleSet } from "../types/Ruleset";
import { TurnWinner } from "../types/TurnWinner";
import helper from "../Utils/helper";
import moves from "../Utils/moves";

const createGame = (numberOfPlayers: number, _ruleSet: any):Game =>{
    return {
        name: "Schocken",
        setup: (ctx: Ctx):GameState => {
            const diceToRoll:number = 3;
            const dice:number[] = [];
            const diceHold:number[] = [];
            const totalRolls:number = 0;
            const rollsThisTurn:number = 3;
            const players:Player[] = [];
            const roundHistory:TurnWinner[] = [];
            const confirmedRoundEnd:boolean = false;
            const ruleSet:RuleSet = {...defaultRuleSet, ..._ruleSet};
            const penaltiesLeft = ruleSet.totalPenaltiesPerRound
            const finalPenaltiesLeft = 2;
            const lastPhase = "play_penaltiesLeft";

            for(let i:number = 0; i < numberOfPlayers; i++){
                players.push(helper.createPlayer(i.toString(), "Player" + (i+1)));
            }
            return {
                diceToRoll,
                players,
                dice,
                diceHold,
                totalRolls,
                rollsThisTurn,
                penaltiesLeft,
                finalPenaltiesLeft,
                roundHistory,
                confirmedRoundEnd,
                ruleSet,
                lastPhase
            }
        },
        moves: {
            rollDice: moves.rollDice,
            rollDiceDebug: moves.rollDiceDebug,
            holdDice: moves.holdDice,
            transformDice: moves.transformDice,
            endTurn: moves.endTurn,
            confirmRoundEnd: moves.confirmRoundEnd
        },
        phases: {
            play_penaltiesLeft: {
                start: true,
                onEnd: (G:GameState, ctx:Ctx):void => {
                    G.lastPhase = ctx.phase;
                },
                endIf: (G:GameState, ctx:Ctx):boolean => {
                    return G.penaltiesLeft === 0;
                },
                next: "evaluation",
                turn: {
                    order: {
                        first: (G:GameState, ctx:Ctx) => {
                            return 0;
                        },
                        next: (G:GameState, ctx:Ctx) => {
                            return (ctx.playOrderPos + 1) % ctx.numPlayers;
                        },
                        playOrder: (G, ctx) => {
                            // play Order must only be changed if there was min one round played
                            if(G.roundHistory.length > 0){
                                let loserIndex:number = ctx.playOrder.indexOf(G.roundHistory[0].loserIndex);
                                const newPlayOrder:string[] = [];
                                // The final
                                if(G.finalPenaltiesLeft === 0){
                                    if(G.lastPhase !== "play_penaltiesLeft"){
                                        // The first round gets started by the player who got the first finalPenalty and not the loser of the last round
                                        // After that the loser of the last round starts as normal
                                        for(let i = 0; i < G.players.length; i++){
                                            if(G.players[i].finalPenalty > 0 && i !== loserIndex){
                                                loserIndex =  ctx.playOrder.indexOf(i.toString());
                                                break;
                                            }
                                        }
                                    }
                                    for(let i:number = loserIndex, firstRound:boolean = true; i !== loserIndex || firstRound; i = (i+1) % G.players.length){
                                        if(firstRound){
                                            firstRound = false;
                                        }
                                        if(G.players[i].finalPenalty > 0){
                                            newPlayOrder.push(i.toString());
                                        }
                                    }
                                    return newPlayOrder;
                                }
                                // everthing else
                                else if(G.lastPhase === "play_penaltiesLeft"){
                                    return [...ctx.playOrder.slice(loserIndex, ctx.playOrder.length), ...ctx.playOrder.slice(0, loserIndex)];
                                }
                                else if(G.lastPhase === "play_onlyWithPenalties"){
                                    for(let i:number = Number(loserIndex), firstRound:boolean = true; i !== loserIndex || firstRound; i = (i+1) % G.players.length){
                                        if(firstRound){
                                            firstRound = false;
                                        }
                                        newPlayOrder.push(i.toString());
                                    }
                                    return newPlayOrder;
                                }
                            }
                            // default case: first round in Game
                            return ctx.playOrder;
                        }
                    }
                }
            },
            evaluation: {
                onEnd: (G:GameState, ctx:Ctx) => {
                    // Zu händelnde Situationen:
                        // normale Runde, normaler Wurf, genug Steine vorhanden
                        // normale Runde, schock aus
                        // normale Runde, alle Steine liegen bei einer Person
                    if(G.lastPhase === "play_penaltiesLeft"){
                        const maxPenaltiesThisRound = (G.penaltiesLeft - G.roundHistory[0].penalties > 0) ? G.roundHistory[0].penalties : G.penaltiesLeft;

                        // Kein schock aus
                        if(G.roundHistory[0].penalties !== Infinity &&
                            G.players[Number(G.roundHistory[0].loserIndex)].currentScore.penalties + maxPenaltiesThisRound < G.ruleSet.totalPenaltiesPerRound
                        ){
                            G.players[Number(G.roundHistory[0].loserIndex)].currentScore.penalties += maxPenaltiesThisRound;
                            G.penaltiesLeft -= maxPenaltiesThisRound;
                        }
                        // Schock aus
                        else{
                            G.players = helper.resetPlayerState(G, {penalties: 0, currentThrow: [], hiddenDice: [], usedThrows:0});
                            G.players[Number(G.roundHistory[0].loserIndex)].finalPenalty +=1;
                            G.finalPenaltiesLeft -= 1;
                            G.penaltiesLeft = G.ruleSet.totalPenaltiesPerRound;
                        }
                    }
                    // Zu händelnde Situationen:
                        // alle Steine vergeben, normaler Wurf
                        // alle Steine vergeben Schock aus
                        // alle Steine vergeben, alle Steine liegen bei einer Person
                    else if(G.lastPhase === "play_onlyWithPenalties"){
                        const maxPenaltiesThisRound = (G.players[Number(G.roundHistory[0].winnerIndex)].currentScore.penalties - G.roundHistory[0].penalties > 0) ? G.roundHistory[0].penalties : G.players[Number(G.roundHistory[0].winnerIndex)].currentScore.penalties;

                        // Kein Schock aus
                        if(G.roundHistory[0].penalties !== Infinity &&
                        G.players[Number(G.roundHistory[0].loserIndex)].currentScore.penalties + maxPenaltiesThisRound < G.ruleSet.totalPenaltiesPerRound
                        ){
                            G.players[Number(G.roundHistory[0].loserIndex)].currentScore.penalties += maxPenaltiesThisRound;
                            G.players[Number(G.roundHistory[0].winnerIndex)].currentScore.penalties -= maxPenaltiesThisRound;
                        }
                        // Schock aus
                        else{
                            G.players = helper.resetPlayerState(G, {penalties: 0});
                            G.players[Number(G.roundHistory[0].loserIndex)].finalPenalty +=1;
                            G.finalPenaltiesLeft -= 1;
                            G.penaltiesLeft = G.ruleSet.totalPenaltiesPerRound;
                        }
                    }
                    G.diceToRoll = 3;
                    G.diceHold = [];
                    G.dice = [];
                    G.confirmedRoundEnd = false;
                    G.players = helper.resetPlayerState(G, {currentThrow: [],hiddenDice: [], usedThrows: 0});
                },
                moves: {
                    confirmRoundEnd: moves.confirmRoundEnd
                },
                turn: {
                    order: {
                        first: (G, ctx) => {
                            return 0;
                        },
                        next: (G, ctx) => {
                            return (ctx.playOrderPos + 1) % ctx.numPlayers;
                        },
                        playOrder: (G, ctx) => {
                            return ctx.playOrder;
                        },
                    }
                },
                endIf: (G:GameState, ctx:Ctx) => {
                    if(G.confirmedRoundEnd){
                    // schock aus - should set final penalty and return to "play_penaltiesLeft" - only if not GameOver
                        if(G.roundHistory[0].penalties === Infinity){
                            return {next: "play_penaltiesLeft"};
                        }
                        // We are currently in the "play_onlyWithPenalties" Phase - only stay if there is no player who has all the penalties
                        else if(G.penaltiesLeft === 0){
                            // One Player has all penalties - return to "play_penaltiesLeft"
                            if(helper.hasOnePlayerAllPenalties(G, G.players, G.roundHistory[0])){
                                return {next: "play_penaltiesLeft"};
                            }
                            return {next: "play_onlyWithPenalties"};
                        }
                        // We are entering the "play_onlyWithPenalties" Phase
                        else if(G.penaltiesLeft - G.roundHistory[0].penalties <= 0){
                            return {next: "play_onlyWithPenalties"};
                        }
                        else{
                            return {next: "play_penaltiesLeft"};
                        }
                    }
                    return false;
                }
            },
            play_onlyWithPenalties: {
                onEnd: (G:GameState, ctx:Ctx):void => {
                    G.lastPhase = ctx.phase;
                },
                endIf: (G:GameState, ctx:Ctx) => {
                    for(let i:number = 0; i < G.players.length; i++){
                        if(G.players[i].currentScore.penalties === G.ruleSet.totalPenaltiesPerRound){
                            return {next: "play_penaltiesLeft"};
                        }
                    }
                    return false;
                },
                next: "evaluation",
                turn: {
                    order: {
                        first: (G, ctx) => {
                            return 0;
                        },
                        next: (G, ctx) => {
                            return (ctx.playOrderPos + 1) % ctx.numPlayers;
                        },
                        playOrder: (G, ctx) => {
                            const loserIndex = Number(G.roundHistory[0].loserIndex);
                            const newPlayOrder = [];
                            // the final
                            if(G.finalPenaltiesLeft === 0){
                                for(let i:number = loserIndex, firstRound:boolean = true; i !== loserIndex || firstRound; i = (i+1) % G.players.length){
                                    if(firstRound){
                                        firstRound = false;
                                    }
                                    if(G.players[i].finalPenalty > 0){
                                        newPlayOrder.push(i.toString());
                                    }
                                }
                                return newPlayOrder;
                            }
                            // everything else
                            else{
                                for(let i:number = loserIndex, firstRound:boolean = true; i !== loserIndex || firstRound; i = (i+1) % G.players.length){
                                    if(firstRound){
                                        firstRound = false;
                                    }
                                    if(G.players[i].currentScore.penalties > 0){
                                        newPlayOrder.push(i.toString());
                                    }
                                }
                                return newPlayOrder;
                            }
                        },
                    }
                }
            }
        },
        endIf: (G:GameState, ctx:Ctx) => {
            if(helper.hasOnePlayerAllFinalPenalties(G,G.players)){
                return true;
            }
        }
    }
}

export {createGame};