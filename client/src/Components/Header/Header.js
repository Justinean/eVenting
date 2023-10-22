import react from 'react';
import './Header.css';
import Hamburger from '../Hamburger/Hamburger';

const Header = ({ headerHidden, setHeaderHidden, tooSmall }) => {
    return tooSmall ? (
        <div className="Header" style={{ left: headerHidden ? "-20vw" : "0vw" }} >
            <Hamburger headerHidden={headerHidden} setHeaderHidden={setHeaderHidden} tooSmall={tooSmall} />
            <h3>eVenting</h3>
            <button className="signInButton">Sign In</button>
        </div>
    ) : (
        <div className="Header" style={{display:"flex"}}>
            <Hamburger tooSmall={tooSmall} />
            <h3>eVenting</h3>
            <button className="signInButton">Sign In</button>
        </div>
    )
}

export default Header;