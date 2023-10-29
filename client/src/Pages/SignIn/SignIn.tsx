import { useContext, useEffect, useRef, useState } from 'react';
import './SignIn.css';
import { ColorsContext } from '../../Contexts';
import AUTH from '../../utils/auth';

const SmallStyle = {
    width: "60vw"
}

interface SignInProps {
    tooSmall: boolean;
}

const SignIn = ({tooSmall}: SignInProps) => {
    const errorMessageRef = useRef<HTMLParagraphElement | null>(null)
    const Colors = useContext(ColorsContext);
    const [usernameText, setUsernameText] = useState<string>("");
    const [passwordText, setPasswordText] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("A");
    useEffect(() => {
        document.title = "Sign In - eVenting"
        errorMessageRef.current?.classList.add("hiddenClass")
    }, [])
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

    const setError = (message: string) => {
        setErrorMessage(message);
        errorMessageRef.current?.classList.remove("hiddenClass");
    }

    const signIn = async () => {
        setTimeout(() => {
            errorMessageRef.current?.classList.add("hiddenClass");
        }, 2500)
        if (usernameText === "" || passwordText === "") return setError("Please fill out all fields");
        
        const body = {username: usernameText, password: passwordText};

        try {
            setErrorMessage("");
            const response = await fetch("/api/auth/signin", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.errorMessage) return setErrorMessage(data.errorMessage);
            AUTH.login(data.accessToken, data.refreshToken);
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
                <label>Email or Username</label>
                <input id="username" type="text" value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <label>Password</label>
                <input id="password" type="password" value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.assign("/signup")}>Sign Up Instead</p>
                <p ref={errorMessageRef} className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signIn}>Sign In</button><br />
            </div>
        </div>
    ): (
        <div className="SignIn">
            <h1>Sign In</h1>
            <div className="signInForm">
                <label>Email or Username</label>
                <input id="username" type="text"value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <label>Password</label>
                <input id="password" type="password" value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.assign("/signup")}>Sign Up Instead</p>
                <p ref={errorMessageRef} className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signIn}>Sign In</button><br />
            </div>
        </div>
    )
}

export default SignIn;