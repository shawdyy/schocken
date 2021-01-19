import { ReactChild } from "react"
import "./Modal.sass";

interface Props {
    children?: ReactChild
}

const Modal:React.FC<Props> = ({children}) => {
    return(
        <div className="component_Modal">
            <div className="modalCard">
                {children}
            </div>
        </div>
    )
}

export default Modal;