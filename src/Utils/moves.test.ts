import moves from "./moves";
import GameState from "../types/GameState";
import { Player, PlayerState} from "../types/Player";
import { defaultRuleSet } from "../types/Ruleset";
import helper from "../Utils/helper";
import { TurnWinner } from "../types/TurnWinner";

const mockPlayer = (currentScore:Partial<PlayerState>, index:number):Player =>{
    const player = helper.createPlayer(index.toString(), "test" + index);
    player.currentScore = {...player.currentScore, ...currentScore};
    return player;
}

export const mockGame = (diceToRoll:number=1, totalRolls:number=3, rollsThisTurn=3, diceHold:number[]=[1,1], dice:number[]=[2], ruleSet:object={}, currentPlayerScore:Partial<PlayerState>[]=[{},{},{}], roundHistory:TurnWinner[]=[]):GameState =>{
    return {
        players: Array(3).fill({}).map((el,i) => mockPlayer(currentPlayerScore[i], i)),
        penaltiesLeft: 13,
        finalPenaltiesLeft: 2,
        diceToRoll: diceToRoll,
        totalRolls: totalRolls,
        rollsThisTurn: rollsThisTurn,
        diceHold: diceHold,
        dice: dice,
        roundHistory: roundHistory,
        confirmedRoundEnd: false,
        ruleSet: {...defaultRuleSet, ...ruleSet},
        lastPhase: "play_penaltiesLeft"
    }
}
export const mockContext = (playOrderPos:number, numPlayers:number=3, phase:string = "play") => {
    const playOrder = Array(3).fill(0).map((el,i) => i.toString());
    return {
        playOrderPos: playOrderPos,
        playOrder: playOrder,
        currentPlayer: playOrder[playOrderPos],
        numPlayers: numPlayers,
        random: {
            D6: jest.fn()
        },
        events: {
            endTurn: jest.fn(),
            endPhase: jest.fn(),
            setPhase: jest.fn()
        },
        phase: phase 
    }
}

// TODO: 
// Wrap every function in own describe function
describe("moves", () => {
    test("moves.endturn", () => {
        const G = mockGame(3,1,3);
        const ctx = mockContext(0);
        moves.endTurn(G as unknown as GameState, ctx);
        expect(ctx.events.endTurn.mock.calls.length).toBe(1);
        expect(G.players[0].currentScore.currentThrow).toEqual([2,1,1]);
        expect(G.players[0].currentScore.usedThrows).toBe(1);
        expect(G.diceHold.length).toBe(0);
        expect(G.diceToRoll).toBe(3);
        expect(G.totalRolls).toBe(0);
        expect(G.rollsThisTurn).toBe(1);
    });
    test("moves.rolldice", () => {
        const G = mockGame(3,0,3,[],[],{});
        const ctx = mockContext(0);
        moves.rollDice(G as unknown as GameState, ctx);
        expect(ctx.random.D6.mock.calls.length).toBe(3);
        expect(G.totalRolls).toBe(1)
        expect(G.dice.length).toBe(3);
        expect(G.diceHold.length).toBe(0);
        expect(ctx.events.endTurn.mock.calls.length).toBe(0);
        expect(ctx.events.endPhase.mock.calls.length).toBe(0);
    });
    test("moves.rolldice - last throw", () => {
        const G = mockGame(3,2,3,[],[],{});
        const ctx = mockContext(2);
        moves.rollDice(G as unknown as GameState, ctx);
        expect(ctx.random.D6.mock.calls.length).toBe(3);
        expect(G.totalRolls).toBe(0)
        expect(G.dice.length).toBe(0);
        expect(G.diceHold.length).toBe(0);
        expect(ctx.events.endTurn.mock.calls.length).toBe(0);
        expect(ctx.events.endPhase.mock.calls.length).toBe(1);
    });
    test("moves.transformDice - allowed", () => {
        const G = mockGame(3,1,3,[],[6,6,2],{});
        const ctx = mockContext(0);
        moves.transformDice(G as unknown as GameState, ctx);
        expect(G.diceHold).toEqual([1]);
        expect(G.dice).toEqual([2]);
        expect(G.diceToRoll).toBe(2);
    });
    test("moves.transformDice - disallowed", () => {
        const G = mockGame(3,1,3,[],[6,6,2],{twoSixToOne: false});
        const ctx = mockContext(0);
        moves.transformDice(G as unknown as GameState, ctx);
        expect(G.diceHold).toEqual([]);
        expect(G.diceToRoll).toBe(3);
    });
    test("moves.holdDice - allowed (defaultRuleSet)", () => {
        const G = mockGame(3,2,3,[],[1,2,5],{});
        const ctx = mockContext(0);
        moves.holdDice(G as unknown as GameState, ctx, 0);
        expect(G.diceHold).toEqual([1]);
        expect(G.diceToRoll).toBe(2);
    });
    test("moves.holdDice - disallowed (defaultRuleSet)", () => {
        const G = mockGame(3,2,3,[],[4,2,5],{});
        const ctx = mockContext(0);
        moves.holdDice(G as unknown as GameState, ctx, 0);
        expect(G.diceHold).toEqual([]);
        expect(G.diceToRoll).toBe(3);
    });
    test("moves.confirmRoundEnd", () => {
        const G = mockGame(3,2,3,[],[4,2,5],{});
        const ctx = mockContext(0,3,"evaluation");
        moves.confirmRoundEnd(G, ctx);
        expect(G.confirmedRoundEnd).toBe(true);
    });
});