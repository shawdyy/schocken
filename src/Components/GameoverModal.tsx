import React from "react";
import Modal from "./Modal";
import { MouseEvent } from "react";
import { Bgio } from "../types/Bgio";

interface Props {
    bgioProps: Bgio
    resetGame: (evt:MouseEvent) => void;
}

const GameoverModal = ({bgioProps, resetGame}:Props) => {
    const innerText = bgioProps.G.players[Number(bgioProps.G.roundHistory[0].loserIndex)].name + " lost!";

    return(
        <Modal>
            <div className="modal_content">
                <h2>{innerText}</h2>
            </div>
        </Modal>
    )
}

export default GameoverModal;