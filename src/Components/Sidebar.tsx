import { Player } from "../types/Player";
import { BgioProps } from "../types/Bgio";
import Usercard from "./Usercard";
import "./Sidebar.sass";

const Sidebar:React.FC<BgioProps> = ({bgioProps}) => {
    return(
        <div className="component_Sidebar">
            {bgioProps.G.players.map((player:Player,index:number) => {
                return(
                    <Usercard 
                        player={player}
                        index={index} 
                        currentlyActive={Number(bgioProps.ctx.currentPlayer) === index}
                        key={index}
                    />
                )
            })}
        </div>
    )
}

export default Sidebar;