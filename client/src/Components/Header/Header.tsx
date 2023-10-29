import { useContext } from 'react';
import './Header.css';
import Hamburger from '../Hamburger/Hamburger';
import { ColorsContext } from '../../Contexts';
import AUTH from '../../utils/auth';

const SmallStyle = {
    width: "75vw",
    height: "15vh",
    padding: 0,
    paddingRight: "20vw",
    paddingLeft: "85px",
    flexDirection: "row" as const,
    justifyContent: 'space-between',
    alignItems: 'center',
}

const extraStyle = {transition: ""};

interface HeaderProps {
    headerHidden: boolean;
    setHeaderHidden: React.Dispatch<React.SetStateAction<boolean>>;
    tooSmall: boolean;
    headerWidth: number;
    transition: string;
}

const Header = ({ headerHidden, setHeaderHidden, tooSmall, headerWidth, transition}: HeaderProps) => {
    const Colors = useContext(ColorsContext);
    const HeaderSmallStyle = {
        top: headerHidden ? "-35vw" : "0", backgroundColor: Colors.Green, ...SmallStyle, ...extraStyle, transition
    }
    setTimeout(() => {
        extraStyle.transition = "all 0.4s ease-in-out";
    }, 100)

    const logout = async () => {
        AUTH.logout();
        const response = await fetch("/api/users/logout", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({refreshToken: AUTH.getRefreshToken()})
        });
        const data = await response.json();
        if (data.errorMessage) return window.alert(data.errorMessage);
        window.location.assign("/");
    }
    return tooSmall ? (
        <div className="Header" style={HeaderSmallStyle} >
            <Hamburger headerHidden={headerHidden} setHeaderHidden={setHeaderHidden} tooSmall={tooSmall}/>
            <h3>eVenting</h3>
            <h3 className="HeaderHome HoverPointer" onClick={() => window.location.assign("/")}>Home</h3>
            {AUTH.loggedIn() ? (
                <>
                    <h3 className="signInButton HoverPointer" onClick={() => window.location.assign("/users/me")}>Profile</h3>
                    <h3 className="signInButton HoverPointer" onClick={logout}>Logout</h3>
                </>
            ) : (
                <h3 className="signInButton HoverPointer" onClick={() => window.location.assign("/signin")}>Sign In</h3>
            )}
        </div>
    ) : (
        <div className="Header" style={{display:"flex", width: headerWidth, backgroundColor: Colors.Green, ...extraStyle, transition}}>
            <Hamburger tooSmall={tooSmall} headerHidden={headerHidden} setHeaderHidden={setHeaderHidden}/>
            <h3>eVenting</h3>
            <h3 className="HeaderHome HoverPointer" onClick={() => window.location.assign("/")}>Home</h3>
            {AUTH.loggedIn() ? (
                <>
                    <h3 className="signInButton HoverPointer" onClick={() => window.location.assign("/user/me")}>Profile</h3>
                    <h3 className="signInButton HoverPointer" onClick={logout}>Logout</h3>
                </>
            ) : (
                <h3 className="signInButton HoverPointer" onClick={() => window.location.assign("/signin")}>Sign In</h3>
            )}
        </div>
    )
}

export default Header;