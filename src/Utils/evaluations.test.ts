import evaluations from "./evaluations";
import { Player } from "../types/Player";
import { defaultRuleSet } from "../types/Ruleset";

const mockPlayer = (dice:number[], id:number):Player => {
    const player:Player = {
        playerID: id.toString(),
        name: "Player" + id+1,
        currentScore: {
            penalties: 0,
            currentThrow: dice,
            hiddenDice: [],
            usedThrows: 3
        },
        finalPenalty: 0
    }
    return player;
}
const mockPlayers = (dice:number[][]):Player[] => {
    let players = [];
    for(let i = 0; i < dice.length; i++){
        players.push(mockPlayer(dice[i], i));
    }
    return players;
}

describe("evaluations", () => {
    test("evaluations.isStreet", () => {
        expect(evaluations.isStreet([2,1,3], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isStreet([2,3,4], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isStreet([3,4,5], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isStreet([4,5,6], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isStreet([], [1,2,3], defaultRuleSet)).toBe(true);
        expect(evaluations.isStreet([], [6,5,4], defaultRuleSet)).toBe(true);
        expect(evaluations.isStreet([1,2], [4], defaultRuleSet)).toBe(false);
        expect(evaluations.isStreet([3,4], [5], defaultRuleSet)).toBe(false);
        expect(evaluations.isStreet([3,4], [5], {...defaultRuleSet, throwTogether: true})).toBe(true);
    });
    test("evaluations.isGeneral", () => {
        expect(evaluations.isGeneral([2,2,2], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isGeneral([3,3,3], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isGeneral([4,4,4], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isGeneral([5,5,5], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isGeneral([6,6,6], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isGeneral([], [2,2,2], defaultRuleSet)).toBe(true);
        expect(evaluations.isGeneral([5,5], [5], defaultRuleSet)).toBe(false);
        expect(evaluations.isGeneral([5,5], [5], {...defaultRuleSet, throwTogether: true})).toBe(true);
    });
    test("evaluations.isSchock", () => {
        expect(evaluations.isSchock([2,1,1], [])).toBe(true);
        expect(evaluations.isSchock([1,1,3], [])).toBe(true);
        expect(evaluations.isSchock([1,1,4], [])).toBe(true);
        expect(evaluations.isSchock([1,1,5], [])).toBe(true);
        expect(evaluations.isSchock([1,1,6], [])).toBe(true);
        expect(evaluations.isSchock([1,1,1], [])).toBe(true);
        expect(evaluations.isSchock([1,1], [2])).toBe(true);
        expect(evaluations.isSchock([1], [1,4])).toBe(true);
        expect(evaluations.isSchock([1,2,2], [])).toBe(false);
        expect(evaluations.isSchock([4,5,6], [])).toBe(false);
    });
    test("evaluations.isJule", () => {
        expect(evaluations.isJule([1,2,4], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isJule([1,1,3], [], defaultRuleSet)).toBe(false);
        expect(evaluations.isJule([4,5,6], [], defaultRuleSet)).toBe(false);
    });
    test("evaluations.isSiebener", () => {
        expect(evaluations.isSiebener([1,2,2], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isSiebener([2,1,2], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isSiebener([4,5,6], [], defaultRuleSet)).toBe(false);
        expect(evaluations.isSiebener([1,1,2], [], defaultRuleSet)).toBe(false);
    });
    test("evaluations.isAchter", () => {
        expect(evaluations.isAchter([3,1,3], [], defaultRuleSet)).toBe(true);
        expect(evaluations.isAchter([2,1,2], [], defaultRuleSet)).toBe(false);
        expect(evaluations.isAchter([1,5,6], [], defaultRuleSet)).toBe(false);
        expect(evaluations.isAchter([1,1,2], [], defaultRuleSet)).toBe(false);
    });
    test("evaluations.getSchockValue", () => {
        expect(evaluations.getSchockValue([3,1,3], [])).toBe(0);
        expect(evaluations.getSchockValue([1,1,3], [])).toBe(3);
        expect(evaluations.getSchockValue([1], [1,3])).toBe(3);
        expect(evaluations.getSchockValue([1,1,1], [])).toBe(Infinity);
        expect(evaluations.getSchockValue([2,2,2], [])).toBe(0);
    });
    test("evaluations.getThrowType", () => {
        expect(evaluations.getThrowType([1,1,1], [], defaultRuleSet)).toBe("schock");
        expect(evaluations.getThrowType([1,1], [6], defaultRuleSet)).toBe("schock");
        expect(evaluations.getThrowType([1,2,3], [], defaultRuleSet)).toBe("street");
        expect(evaluations.getThrowType([3,3,3], [], defaultRuleSet)).toBe("general");
        expect(evaluations.getThrowType([], [3,3,3], defaultRuleSet)).toBe("general");
        expect(evaluations.getThrowType([1], [2,3], defaultRuleSet)).toBe("default");
        expect(evaluations.getThrowType([1], [2,3], {...defaultRuleSet, throwTogether: true})).toBe("street");
        expect(evaluations.getThrowType([1,2,4], [], {...defaultRuleSet, jule: 7})).toBe("jule");
        expect(evaluations.getThrowType([1,2,2], [], defaultRuleSet)).toBe("default");
        expect(evaluations.getThrowType([1,2,2], [], {...defaultRuleSet, siebener: 7})).toBe("siebener");
        expect(evaluations.getThrowType([1,3,3], [], defaultRuleSet)).toBe("default");
        expect(evaluations.getThrowType([1,3,3], [], {...defaultRuleSet, achter: 8})).toBe("achter");
    });
    test("evaluations.evaluateValue", () => {
        expect(evaluations.evaluateValue([3,1,3], [], defaultRuleSet)).toBe(1);
        expect(evaluations.evaluateValue([1,1,1], [], defaultRuleSet)).toBe(Infinity);
        expect(evaluations.evaluateValue([4,4,4], [], defaultRuleSet)).toBe(3);
        expect(evaluations.evaluateValue([1], [2,3], defaultRuleSet)).toBe(1);
        expect(evaluations.evaluateValue([1], [2,3], {...defaultRuleSet, throwTogether: true})).toBe(2);
        expect(evaluations.evaluateValue([2,3,4], [], defaultRuleSet)).toBe(2);
        expect(evaluations.evaluateValue([1,6,1], [], defaultRuleSet)).toBe(6);
        expect(evaluations.evaluateValue([1,2,4], [], defaultRuleSet)).toBe(1);
        expect(evaluations.evaluateValue([1,2,4], [], {...defaultRuleSet, jule: 7})).toBe(7);
        expect(evaluations.evaluateValue([1,2,2], [], defaultRuleSet)).toBe(1);
        expect(evaluations.evaluateValue([1,2,2], [], {...defaultRuleSet, siebener: 7})).toBe(7);
        expect(evaluations.evaluateValue([1,3,3], [], defaultRuleSet)).toBe(1);
        expect(evaluations.evaluateValue([1,3,3], [], {...defaultRuleSet, achter: 8})).toBe(8);
    });
    test("evaluations.evaluateTurnWinner", () => {
        expect(evaluations.evaluateTurnWinner(mockPlayers([[3,1,3],[1,1,3],[2,4,5]]), defaultRuleSet)).toEqual({
            winnerIndex: "1",
            loserIndex: "0",
            penalties: 3
        });
        expect(evaluations.evaluateTurnWinner(mockPlayers([[5,4,3],[1,1,2],[2,4,5]]), defaultRuleSet)).toEqual({
            winnerIndex: "1",
            loserIndex: "2",
            penalties: 2
        });
        expect(evaluations.evaluateTurnWinner(mockPlayers([[3,1,3],[1,1,3],[2,4,5]]), {...defaultRuleSet, ...{achter: 8}})).toEqual({
            winnerIndex: "0",
            loserIndex: "2",
            penalties: 8
        });
        expect(evaluations.evaluateTurnWinner(mockPlayers([[1,1,3],[3,3,3],[1,4,5]]), defaultRuleSet)).toEqual({
            winnerIndex: "0",
            loserIndex: "2",
            penalties: 3
        });
        expect(evaluations.evaluateTurnWinner(mockPlayers([[4,1,3],[1,1,1],[1,1,6]]), defaultRuleSet)).toEqual({
            winnerIndex: "1",
            loserIndex: "0",
            penalties: Infinity
        });
    });
})