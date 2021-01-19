import helper from "../Utils/helper";

describe("Component > Game", () => {

    test("createInitialPlayerState", () => {
        expect(helper.createInitialPlayerState()).toEqual({
            penalties: 0,
            currentThrow:[],
            hiddenDice: [],
            usedThrows: 0
        });
    });

    test("createPlayer", () =>{
        expect(helper.createPlayer("testID", "testName")).toEqual({
            playerID: "testID",
            name: "testName",
            currentScore: {
                penalties: 0,
                currentThrow:[],
                hiddenDice: [],
                usedThrows: 0
            },
            finalPenalty: 0
        });
    });

})