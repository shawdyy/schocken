import { Bgio } from "../types/Bgio";
import Dice from "./Dice";
import "./Mainwindow.sass";

interface Props {
    bgioProps: Bgio,
    selectedDice: (number | null);
    setSelectedDice: React.Dispatch<number | null>
}

const Mainwindow:React.FC<Props> = ({bgioProps, selectedDice, setSelectedDice}) => {
    return(
        <div className="component_Mainwindow">
            <div className="row top">
                <div className="currentlyPlayingWrapper">
                    <div>
                        <span>Derzeit am Zug</span>
                    </div>
                    <div>
                        <h3>{bgioProps.G.players[bgioProps.ctx.playOrderPos].name}</h3>
                    </div>
                </div>
            </div>
            <div className="row middle">
                <div className="diceWrapper">
                    {bgioProps.G.dice.map((digit:number,i:number) =>{
                        return(
                            <Dice
                                digit={digit}
                                scale={2}
                                hoverActive={true}
                                selectedDice={selectedDice === i}
                                setSelectedDice={() => setSelectedDice(i)}
                                key={i}
                            />
                        )
                    })}
                    {(new Array(3-bgioProps.G.dice.length)).fill(0).map((digit:number, i:number) =>{
                        return(
                            <Dice scale={2} key={i} />
                        )
                    })}
                </div>
            </div>
            <div className="row bottom">
                <div className="diceWrapper">
                    {bgioProps.G.diceHold.map((digit:number,i:number) =>{
                        return(
                            <Dice
                                digit={digit}
                                scale={1.5}
                                key={i}
                            />
                        )})
                    }
                </div>
            </div>
        </div>
    )
}

export default Mainwindow