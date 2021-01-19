import "./DicePlaceholder.sass";

interface Props {
    scale:number
}

const DicePlaceholder:React.FC<Props> = ({scale}) => {
    return(
        <div className="dicePlaceholder"></div>
    )
}

export default DicePlaceholder;