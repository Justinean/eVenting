import react, { useState } from 'react';
import './Header.css';
import Hamburger from '../Hamburger/Hamburger';

const Header = ({ headerHidden, setHeaderHidden, tooSmall, headerWidth}) => {
    return tooSmall ? (
        <div className="Header" style={{ left: headerHidden ? "-25vw" : "0"}} >
            <Hamburger headerHidden={headerHidden} setHeaderHidden={setHeaderHidden} tooSmall={tooSmall}/>
            <h3>eVenting</h3>
            <button className="signInButton">Sign In</button>
        </div>
    ) : (
        <div className="Header" style={{display:"flex", width: headerWidth}}>
            <Hamburger tooSmall={tooSmall} headerWidth={headerWidth}/>
            <h3>eVenting</h3>
            <button className="signInButton" >Sign In</button>
        </div>
    )
}

export default Header;