import { MouseEvent, useState } from "react";
import Button from "./Button";
import Controls from "./Controls";
import Mainwindow from "./Mainwindow";
import EndRoundModal from "./EndRoundModal";
import Sidebar from "./Sidebar";
import helper from "../Utils/helper";
import "./Board.sass";
import GameoverModal from "./GameoverModal";


const SchockenBoard = (bgioProps:any) => {

    const [selectedDice, setSelectedDice] = useState<number | null>(null);

    const rollDiceOnClickHandler = (evt:MouseEvent):void => {
        setSelectedDice(null);
        bgioProps.moves.rollDice();
    }
    const holdDiceOnClickHandler = (evt:MouseEvent):void => {
        bgioProps.moves.holdDice(selectedDice);
    }
    const endTurnOnClickHandler = (evt:MouseEvent):void => {
        bgioProps.moves.endTurn();
    }
    const transformDiceOnClickHandler = (evt:MouseEvent):void => {
        bgioProps.moves.transformDice();
    }
    const resetGame = (evt:MouseEvent):void => {
        bgioProps.reset();
    }
    return(
        <div id="component_SchockenBoard">
            {bgioProps.ctx.gameover && 
            <GameoverModal
                bgioProps = {bgioProps}
                resetGame = {resetGame}
            />
            }
            {bgioProps.ctx.phase === "evaluation" && 
                <EndRoundModal
                    bgioProps={bgioProps}
                />
            }
            <Sidebar bgioProps={bgioProps}/>
            <Mainwindow bgioProps={bgioProps} selectedDice={selectedDice} setSelectedDice={setSelectedDice}/>
            <Controls>
                <>
                    <div className="row">
                        <Button 
                            innerText={"Würfeln"}
                            onClick={rollDiceOnClickHandler}
                        />
                    </div>
                    <div className="row">
                        <Button 
                            innerText={"Würfel rauslegen"}
                            onClick={holdDiceOnClickHandler}
                        />
                    </div>
                    <div className="row">
                        <Button 
                            innerText={"Würfel umwandeln"}
                            onClick={transformDiceOnClickHandler}
                            disabled={helper.isTransformationPossible(bgioProps.G.dice, bgioProps.G.ruleSet) < 1}
                        />
                    </div>
                    <div className="row">
                        <Button 
                            innerText={"Zug beenden"}
                            onClick={endTurnOnClickHandler}
                        />
                    </div>
                </>
            </Controls>
        </div>
    )
}

export default SchockenBoard;