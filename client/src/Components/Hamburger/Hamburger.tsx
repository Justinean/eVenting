import './Hamburger.css';

interface HamburgerProps {
    headerHidden: boolean;
    setHeaderHidden: React.Dispatch<React.SetStateAction<boolean>>;
    tooSmall: boolean;
    transition?: string;
}

const Hamburger = ({headerHidden, setHeaderHidden, tooSmall}: HamburgerProps) => {
    // const [display, setDisplay] = useState("none");
    // useEffect(() => {
    //     tooSmall ? setDisplay("block") : setDisplay("none");
    // }, [tooSmall])
    return tooSmall ? (
        <div className="Hamburger" style={{visibility: "visible", top: headerHidden ? "35vw" : ""}}>
            <button className="hamburgerButton" onClick={() => {setHeaderHidden(!headerHidden)}}>
                <div className="hamburgerLine"></div>
                <div className="hamburgerLine"></div>
                <div className="hamburgerLine"></div>
            </button>
        </div>
    ) : (
        <div className="Hamburger" style={{visibility: 'collapse'}}>
            <button className="hamburgerButton" onClick={() => {setHeaderHidden(!headerHidden)}}>
                <div className="hamburgerLine"></div>
                <div className="hamburgerLine"></div>
                <div className="hamburgerLine"></div>
            </button>
        </div>
    )
}

export default Hamburger;