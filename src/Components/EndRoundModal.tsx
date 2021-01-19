import { MouseEvent } from "react";
import Modal from "./Modal";
import Usercard from "./Usercard";
import Button from "./Button";
import { BgioProps } from "../types/Bgio";
import { Player } from "../types/Player";

import "./EndRoundModal.sass";

const EndRoundModal = ({bgioProps}:BgioProps) => {
    const confirmRoundEndOnClickHandler = (event:MouseEvent) => {
        bgioProps.moves.confirmRoundEnd(bgioProps.G, bgioProps.ctx);
    }
    return(
        <Modal>
            <div className="modal_content">
                <div className="modal_winnerWrapper">
                    <span style={{fontWeight: 700}}>{bgioProps.G.players[Number(bgioProps.G.roundHistory[0].winnerIndex)].name}</span>
                    <span> gewinnt!</span>
                </div>
                <div className="modal_usercardWrapper">
                    {bgioProps.G.players.map((player:Player,index:number) => {
                        return(
                            <div className="cardWrapper" key={index}>
                                <Usercard 
                                    player={player}
                                    index={index} 
                                />
                                <div className="penaltyWrapper">
                                    { Number(bgioProps.G.roundHistory[0].loserIndex) === index && 
                                        <span className="loser">+{bgioProps.G.roundHistory[0].penalties}</span>
                                    }
                                    { (bgioProps.G.lastPhase === "play_onlyWithPenalties" && Number(bgioProps.G.roundHistory[0].winnerIndex) === index ) && 
                                        <span className="winner">-{bgioProps.G.roundHistory[0].penalties}</span>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="modal_buttonWrapper">
                    <Button
                        innerText={"OK"} 
                        onClick={confirmRoundEndOnClickHandler}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default EndRoundModal;