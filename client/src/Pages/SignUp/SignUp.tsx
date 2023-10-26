import { useContext, useEffect, useRef, useState } from 'react';
import './SignUp.css';
import exportColors from '../../Contexts/ColorsContext';
import AUTH from '../../utils/auth';

const SmallStyle = {
    width: "60vw"
}

interface SignUpProps {
    tooSmall: boolean;
}

const SignUp = ({tooSmall}: SignUpProps) => {
    const errorMessageRef = useRef<HTMLParagraphElement | null>(null)
    const Colors = useContext<typeof exportColors.Colors>(exportColors.ColorsContext);
    const [usernameText, setUsernameText] = useState<string>("");
    const [passwordText, setPasswordText] = useState<string>("");
    const [emailText, setEmailText] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("A");
    const errorStyle = {
        color: Colors.Pink,
    }

    useEffect(() => {
        errorMessageRef.current?.classList.add("hiddenClass")
    }, [])

    const changeTextBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.id === "username"){
            setUsernameText(e.target.value);
        } else if(e.target.id === "password"){
            setPasswordText(e.target.value);
        } else if (e.target.id === "email"){
            setEmailText(e.target.value);
        }
    }

    const setError = (message: string) => {
        setErrorMessage(message);
        errorMessageRef.current?.classList.remove("hiddenClass");
    }

    const signUp = async () => {
        setTimeout(() => {
            errorMessageRef.current?.classList.add("hiddenClass");
        }, 2500)
        if (usernameText === "" || passwordText === "" || emailText === "") return setError("Please fill out all fields");
        if (usernameText.length < 3) return setError("Username must be at least 3 characters long");
        if (passwordText.length < 6) return setError("Password must be at least 6 characters long");
        if (!passwordText.match(/^[A-Z0-9!@#$%^&*():;]+$/i)) return setError("Password is not valid");
        if (!emailText.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) return setError("Please enter a valid email address");
        
        const body = {username: usernameText, password: passwordText, email: emailText};

        try {
            setErrorMessage("");
            const response = await fetch("/api/users/signup", 
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
            signUp();
        }
    }))

    return tooSmall ? (
        <div className="SignIn" >
            <h1>Sign Up</h1>
            <div className="signInForm signUpForm" style={{...SmallStyle}}>
                <label>Username</label>
                <input id="username" type="text" value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <label>Email</label>
                <input id="email" type="text" value={emailText} onChange={e => changeTextBox(e)}></input><br />
                <label>Password</label>
                <input id="password" type="password"  value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.assign("/signin")}>Sign In Instead</p>
                <p ref={errorMessageRef} className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signUp}>Sign In</button><br />
            </div>
        </div>
    ): (
        <div className="SignIn">
            <h1>Sign Up</h1>
            <div className="signInForm signUpForm">
                <label>Username</label>
                <input id="username" type="text" value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <label>Email</label>
                <input id="email" type="text" value={emailText} onChange={e => changeTextBox(e)}></input><br />
                <label>Password</label>
                <input id="password" type="password" value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.assign("/signin")}>Sign In Instead</p>
                <p ref={errorMessageRef} className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signUp}>Sign Up</button><br />
            </div>
        </div>
    )
}

export default SignUp;