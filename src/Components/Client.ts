import { Client } from  "boardgame.io/react";
import { createGame } from "./Game";
import SchockenBoard from "./Board";

const createClient = (numPlayers:number=3) => {
    return Client({
        game: createGame(numPlayers, {}),
        numPlayers: numPlayers,
        board: SchockenBoard,
        debug: false
    });
}

export default createClient;