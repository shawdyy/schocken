import { ReactChild } from "react";
import "./Controls.sass";

interface Props {
    children: ReactChild
}

const Controls:React.FC<Props> = ({children}) => {
    return(
        <div className="component_Controls">
            {children}
        </div>
    )
}

export default Controls;