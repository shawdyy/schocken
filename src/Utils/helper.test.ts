import { defaultRuleSet } from "../types/Ruleset";
import GameState from "../types/GameState";
import helper from "./helper";
import { mockGame } from "./moves.test";

describe("helper > whichDiceCanBeHeld", () => {
    test("dice: [1,1,6], defaultRuleSet", () => {
        expect(helper.whichDiceCanBeHeld([1,1,6], defaultRuleSet)).toEqual([true,true,true]);
    });

    test("dice: [2,2,3], defaultRuleSet", () => {
        expect(helper.whichDiceCanBeHeld([2,2,3], defaultRuleSet)).toEqual([false,false,false]);
    });

    test("dice: [1,6,4], onlyOne", () => {
        expect(helper.whichDiceCanBeHeld([1,6,4], {...defaultRuleSet, ...{whichNumbersCanBeHeld: 0}})).toEqual([true,false,false]);
    });

    test("dice: [3,6,4], all", () => {
        expect(helper.whichDiceCanBeHeld([3,6,4], {...defaultRuleSet, ...{whichNumbersCanBeHeld: 2}})).toEqual([true,true,true]);
    });
});

describe("helper > createInitialPlayerState", () => {
    test("function test", () => {
        expect(helper.createInitialPlayerState()).toEqual({
            penalties:0,
            currentThrow:[],
            hiddenDice: [],
            usedThrows: 0
        });
    });
});

describe("helper > createPlayer", () => {
    test("PlayerID:0, name:Player1", () => {
        expect(helper.createPlayer("0", "Player1")).toEqual({
            playerID: "0",
            name: "Player1",
            currentScore: helper.createInitialPlayerState(),
            finalPenalty: 0
        });
    });
    test("PlayerID:7, name:Phil", () => {
        expect(helper.createPlayer("7", "Phil")).toEqual({
            playerID: "7",
            name: "Phil",
            currentScore: helper.createInitialPlayerState(),
            finalPenalty: 0
        });
    });
});

describe("helper > isTransformationPossible", () => {
    test("Dice: [6,6,2], ruleSet:defaultRuleSet", () => {
        expect(helper.isTransformationPossible([6,6,2],{
            ...defaultRuleSet,
        })).toBe(true);
    });
    test("Dice: [6,6,2], ruleSet:twoSixToOne:true", () => {
        expect(helper.isTransformationPossible([6,6,2],{
            ...defaultRuleSet,
            twoSixToOne: true
        })).toBe(true);
    });
    test("Dice: [6,6,2], ruleSet:twoSixToOne:false", () => {
        expect(helper.isTransformationPossible([6,6,2],{
            ...defaultRuleSet,
            twoSixToOne: false
        })).toBe(false);
    });
    test("Dice: [1,6,2], ruleSet:defaultRuleSet", () => {
        expect(helper.isTransformationPossible([1,6,2],defaultRuleSet)).toBe(false);
    });
    test("Dice: [4,4,2], ruleSet:defaultRuleSet", () => {
        expect(helper.isTransformationPossible([4,4,2],defaultRuleSet)).toBe(false);
    });
});

describe("helper > resetPlayerState", () => {
    test("G, {currentThrow:[],usedThrows:0}", () => {
        let G:GameState = mockGame();
        G.players = helper.resetPlayerState(G, {
            currentThrow: [],
            usedThrows: 0
        });
        expect(G.players[0].currentScore.currentThrow).toEqual([]);
        expect(G.players[0].currentScore.usedThrows).toEqual(0);
    });
    test("G, {penalties: 5, currentThrow:[], hiddenDice:[], usedThrows:0}", () => {
        let G:GameState = mockGame(3,1,3,[],[],defaultRuleSet,[{penalties:3},{},{}]);
        G.players = helper.resetPlayerState(G, {
            penalties: 0,
            currentThrow: [],
            hiddenDice: [],
            usedThrows: 0
        });
        expect(G.players[0].currentScore.penalties).toBe(0);
        expect(G.players[0].currentScore.currentThrow).toEqual([]);
        expect(G.players[0].currentScore.hiddenDice).toEqual([]);
        expect(G.players[0].currentScore.usedThrows).toBe(0);
    });
    test("G, {penalties: 0, currentThrow:[], hiddenDice:[], usedThrows:0}", () => {
        let G:GameState = mockGame();
        G.players = helper.resetPlayerState(G, {
            penalties: 3,
            currentThrow: [],
            hiddenDice: [],
            usedThrows: 0
        });
        expect(G.players[0].currentScore.penalties).toBe(3);
        expect(G.players[0].currentScore.currentThrow).toEqual([]);
        expect(G.players[0].currentScore.hiddenDice).toEqual([]);
        expect(G.players[0].currentScore.usedThrows).toBe(0);
    });
    test("G, {}", () => {
        const G:GameState = mockGame();
        helper.resetPlayerState(G, {});
        expect(G.players[0].currentScore.penalties).toBe(0);
        expect(G.players[0].currentScore.currentThrow).toEqual([]);
        expect(G.players[0].currentScore.hiddenDice).toEqual([]);
        expect(G.players[0].currentScore.usedThrows).toBe(0);
    });
});

describe("helper > sum", () => {
    test("array:[4,5,3]", () => {
        expect(helper.concatDice([4,5,3])).toBe(543);
    });
    test("array:[1,2,3]", () => {
        expect(helper.concatDice([1,2,3])).toBe(321);
    });
    test("array:[0,0,0]", () => {
        expect(helper.concatDice([0,0,0])).toBe(0);
    });
});

describe("helper > hasOnePlayerAllPenalties", () => {
    test("One player has all penalties", () => {
        let G:GameState = mockGame(3,1,3,[],[],defaultRuleSet,);
        G.players[0].currentScore.penalties = defaultRuleSet.totalPenaltiesPerRound -3;
        expect(helper.hasOnePlayerAllPenalties(G,G.players,{winnerIndex:"2", loserIndex: "0", penalties: 3})).toBe(true);
    });
    test("No penalties left but distributed", () => {
        let G:GameState = mockGame(3,1,3,[],[],defaultRuleSet);
        G.players[0].currentScore.penalties = 2;
        G.players[1].currentScore.penalties = 5;
        G.players[2].currentScore.penalties = 3;
        expect(helper.hasOnePlayerAllPenalties(G,G.players, {winnerIndex:"2", loserIndex: "0", penalties: 3})).toBe(false);
    });
    test("No player has all penalties", () => {
        let G:GameState = mockGame(3,1,3,[],[],defaultRuleSet);
        expect(helper.hasOnePlayerAllPenalties(G,G.players, {winnerIndex:"2", loserIndex: "0", penalties: 3})).toBe(false);
    });
});