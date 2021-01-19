interface GameOver {
	winner: number;
}

interface Random {
	D6: () => number;
}

interface Events {
    endTurn: () => void;
}
export default interface GameContext {
	numPlayers: number;
	turn: number;
	currentPlayer: number;
	playOrder:string[],
	playOrderPos:number,
	phase?: number,
	gameover?: GameOver;
	random: Random;
	events: Events;
} 