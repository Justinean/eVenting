import react, { useContext, useState } from 'react';
import './Header.css';
import Hamburger from '../Hamburger/Hamburger';
import exportColors from '../../Contexts/ColorsContext';

const Header = ({ headerHidden, setHeaderHidden, tooSmall, headerWidth}) => {
    const Colors = useContext(exportColors.ColorsContext);
    console.log(Colors);
    return tooSmall ? (
        <div className="Header" style={{ left: headerHidden ? "-25vw" : "0", backgroundColor: Colors.Blue}} >
            <Hamburger headerHidden={headerHidden} setHeaderHidden={setHeaderHidden} tooSmall={tooSmall}/>
            <h3>eVenting</h3>
            <h3 className="HeaderHome HoverPointer" onClick={() => window.location.href = "/"}>Home</h3>
            <h3 className="signInButton HoverPointer" onClick={() => window.location.href = "/SignIn"}>Sign In</h3>
        </div>
    ) : (
        <div className="Header" style={{display:"flex", width: headerWidth, backgroundColor: Colors.Green}}>
            <Hamburger tooSmall={tooSmall} headerWidth={headerWidth}/>
            <h3>eVenting</h3>
            <h3 className="HeaderHome HoverPointer" onClick={() => window.location.href = "/"}>Home</h3>
            <h3 className="signInButton HoverPointer" onClick={() => window.location.href = "/SignIn"}>Sign In</h3>
        </div>
    )
}

export default Header;