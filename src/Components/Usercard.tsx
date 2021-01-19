import { Player } from "../types/Player";
import Dice from "./Dice";
import "./Usercard.sass";

interface Props {
    player:Player,
    index:number
    currentlyActive?:boolean
}

const Usercard:React.FC<Props> = ({player, index, currentlyActive}) => {

    let additionalStyle = {border: "5px solid green"};
    return(
        <div className="component_Usercard" style={(currentlyActive ? additionalStyle : {})}>
            <div className="row">
                <div className="col small">
                    <div className="imgPlaceholder">
                        <span>{player.name}</span>
                    </div>
                </div>
                <div className="col big">
                    <div className="smallDiceWrapper">
                        {player.currentScore.currentThrow.length < 1 && 
                            <>
                                <Dice scale={0.4}/>
                                <Dice scale={0.4}/>
                                <Dice scale={0.4}/>
                            </>
                        }
                        {player.currentScore.currentThrow.length > 0 && 
                            <>
                            {player.currentScore.currentThrow.map((digit:number, index:number) =>{
                                return(
                                    <Dice scale={0.4} digit={digit} key={index} />
                                )
                            })}
                            {Array(3 - player.currentScore.currentThrow.length).fill(0).map((digit:number, index:number) => {
                                return(
                                    <Dice scale={0.4} key={index}/>
                                )
                            })}
                            </>
                        }
                    </div> 
                </div>
                <div className="col small" >
                    <div style={{backgroundColor: "white", border: "none"}} className="imgPlaceholder">
                        <span>{player.currentScore.penalties}</span>
                    </div>
                </div>
            </div>
            { player.finalPenalty > 0 &&
                <div className="finalPenaltyMarker"></div>
            }
        </div>
    )
}

export default Usercard;