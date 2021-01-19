import { MouseEvent } from "react";
import "./Button.sass";

interface Props {
    innerText: string,
    onClick: (event:MouseEvent) => void
    disabled?: boolean
}

const Button:React.FC<Props> = ({innerText, onClick, disabled=false}) => {
    return(
        <div className={"component_Button" + ((disabled) ? " disabled" : "")}>
            <button onClick={onClick} disabled={disabled}>{innerText}</button>
        </div>
    )
}

export default Button;