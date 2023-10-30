import { useContext, useEffect, useRef, useState } from 'react';
import './SignUp.css';
import { ColorsContext } from '../../Contexts';
import AUTH from '../../utils/auth';

const SmallStyle = {
    width: "60vw"
}

interface SignUpProps {
    tooSmall: boolean;
}

const SignUp = ({tooSmall}: SignUpProps) => {
    const errorMessageRef = useRef<HTMLParagraphElement | null>(null)
    const Colors = useContext(ColorsContext);
    const [usernameText, setUsernameText] = useState<string>("");
    const [passwordText, setPasswordText] = useState<string>("");
    const [emailText, setEmailText] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("A");
    const errorStyle = {
        color: Colors.Pink,
    }

    useEffect(() => {
        document.title = "Sign Up - eVenting"
        errorMessageRef.current?.classList.add("hiddenClass")
        if (AUTH.loggedIn()) window.location.assign("/");
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

    const signUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTimeout(() => {
            errorMessageRef.current?.classList.add("hiddenClass");
        }, 2500)
        if (usernameText === "" || passwordText === "" || emailText === "") return setError("Please fill out all fields");
        if (usernameText.length < 3) return setError("Username must be at least 3 characters long");
        if (passwordText.length < 6) return setError("Password must be at least 6 characters long");
        if (!usernameText.match(/^[A-Z0-9]+$/i)) return setError("Username must be alphanumeric (a-z, 0-9)");
        if (!passwordText.match(/^[A-Z0-9!@#$%^&*():;]+$/i)) return setError("Password is not valid");
        if (!emailText.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) return setError("Please enter a valid email address");
        
        const body = {username: usernameText, password: passwordText, email: emailText};

        try {
            setErrorMessage("");
            const response = await fetch("/api/auth/signup", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.errorMessage) return setErrorMessage(data.errorMessage);
            AUTH.login(data.accessToken, data.refreshToken);
            window.location.assign("/");
        } catch {
            setErrorMessage("An unknown error has occured");
        }
    }

    return tooSmall ? (
        <div className="SignIn" >
            <h1>Sign Up</h1>
            <form className="signInForm signUpForm" style={{...SmallStyle}} onSubmit={signUp}>
                <label>Username</label>
                <input id="username" type="text" value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <label>Email</label>
                <input id="email" type="text" value={emailText} onChange={e => changeTextBox(e)}></input><br />
                <label>Password</label>
                <input id="password" type="password"  value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.assign("/signin")}>Sign In Instead</p>
                <p ref={errorMessageRef} className="errorMessage" style={{...errorStyle, whiteSpace: "initial"}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signUp}>Sign Up</button><br />
            </form>
        </div>
    ): (
        <div className="SignIn">
            <h1>Sign Up</h1>
            <form className="signInForm signUpForm" onSubmit={signUp}>
                <label>Username</label>
                <input id="username" type="text" value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <label>Email</label>
                <input id="email" type="text" value={emailText} onChange={e => changeTextBox(e)}></input><br />
                <label>Password</label>
                <input id="password" type="password" value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.assign("/signin")}>Sign In Instead</p>
                <p ref={errorMessageRef} className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signUp}>Sign Up</button><br />
            </form>
        </div>
    )
}

export default SignUp;