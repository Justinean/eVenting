import { useContext, useState } from 'react';
import './SignIn.css';
import exportColors from '../../Contexts/ColorsContext';
import AUTH from '../../utils/auth';

const SmallStyle = {
    width: "60vw"
}

interface SignInProps {
    tooSmall: boolean;
}


const SignIn = ({tooSmall}: SignInProps) => {
    const Colors = useContext(exportColors.ColorsContext);
    const [usernameText, setUsernameText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const errorStyle = {
        color: Colors.Pink,
    }

    const changeTextBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.id === "username"){
            setUsernameText(e.target.value);
        } else if(e.target.id === "password"){
            setPasswordText(e.target.value);
        }
    }

    const signIn = async () => {
        setTimeout(() => {
            setErrorMessage("");
        }, 3000)
        if (usernameText === "" || passwordText === "") return setErrorMessage("Please fill out all fields");
        
        const body = {username: usernameText, password: passwordText};

        try {
            setErrorMessage("");
            const response = await fetch("/api/users/signin", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.errorMessage) return setErrorMessage(data.errorMessage);
            AUTH.login(data.accessToken);
        } catch {
            setErrorMessage("An unknown error has occured");
        }
    }

    document.addEventListener("keydown", (e => {
        if (e.key === "Enter") {
            signIn();
        }
    }))
    
    return tooSmall ? (
        <div className="SignIn" >
            <h1>Sign In</h1>
            <div className="signInForm" style={{...SmallStyle}}>
                <input id="username" type="text" placeholder='email or username' value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <input id="password" type="password" placeholder='password' value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.assign("/signup")}>Sign Up Instead</p>
                <p className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signIn}>Sign In</button><br />
            </div>
        </div>
    ): (
        <div className="SignIn">
            <h1>Sign In</h1>
            <div className="signInForm">
                <input id="username" type="text" placeholder='email or username' value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <input id="password" type="password" placeholder='password' value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.assign("/signup")}>Sign Up Instead</p>
                <p className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signIn}>Sign In</button><br />
            </div>
        </div>
    )
}

export default SignIn;