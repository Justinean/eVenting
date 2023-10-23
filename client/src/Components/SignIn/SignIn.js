import react, { useContext, useState } from 'react';
import './SignIn.css';
import exportColors from '../../Contexts/ColorsContext';

const SmallStyle = {
    width: "60vw"
}



const SignIn = ({tooSmall}) => {
    const Colors = useContext(exportColors.ColorsContext);
    const [usernameText, setUsernameText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const errorStyle = {
        color: Colors.Pink,
    }

    const changeTextBox = (e) => {
        if(e.target.id === "username"){
            setUsernameText(e.target.value);
        } else if(e.target.id === "password"){
            setPasswordText(e.target.value);
        }
    }
    return tooSmall ? (
        <div className="SignIn" >
            <h1>Sign In</h1>
            <div className="signInForm" style={{...SmallStyle}}>
                <input id="username" type="text" placeholder='email or username' value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <input id="password" type="password" placeholder='password' value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p onClick={() => window.location.href = "/signup"}>Sign Up Instead</p>
                <p className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}}>Sign In</button><br />
            </div>
        </div>
    ): (
        <div className="SignIn">
            <h1>Sign In</h1>
            <div className="signInForm">
                <input id="username" type="text" placeholder='email or username' value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <input id="password" type="password" placeholder='password' value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p onClick={() => window.location.href = "/signup"}>Sign Up Instead</p>
                <p className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}}>Sign In</button><br />
            </div>
        </div>
    )
}

export default SignIn;