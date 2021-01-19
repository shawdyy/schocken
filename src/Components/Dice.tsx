import "./Dice.sass";

interface Props{
    scale:number
    digit?:number
    hoverActive?:boolean
    selectedDice?: (boolean | null)
    setSelectedDice?: () => void
}
interface ContainerStyle {
    width:number
    height:number
    borderRadius:number
    boxShadow?:string
    border?:string
    background?:string
}

const Dice:React.FC<Props> = ({ scale=1, digit, hoverActive=false, selectedDice, setSelectedDice}) => {
    let containerStyle:ContainerStyle = {width: 100*scale, height: 100*scale, borderRadius: 10*scale};
    let className:string = "component_Dice"
    if(hoverActive) className+= " hoverActive";
    if(digit) containerStyle.border = "1px solid black";
    else containerStyle.background = "lightgrey"
    if(selectedDice) containerStyle.boxShadow = "0px 0px 1px 3px orange";
            
    const scaleFontStyle = {fontSize: 60*scale}
    return(
        <div onClick={setSelectedDice} style={containerStyle} className={className}>
            {digit && 
                <div className="digitWrapper">
                    <span style={scaleFontStyle} >{digit}</span>
                </div>
            }
        </div>
    )
}

export default Dice;