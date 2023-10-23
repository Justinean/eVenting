import react, { useContext, useState } from 'react';
import './SignUp.css';
import exportColors from '../../Contexts/ColorsContext';

const SmallStyle = {
    width: "60vw"
}



const SignUp = ({tooSmall}) => {
    const Colors = useContext(exportColors.ColorsContext);
    const [usernameText, setUsernameText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [emailText, setEmailText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const errorStyle = {
        color: Colors.Pink,
    }

    const changeTextBox = (e) => {
        if(e.target.id === "username"){
            setUsernameText(e.target.value);
        } else if(e.target.id === "password"){
            setPasswordText(e.target.value);
        } else if (e.target.id === "email"){
            setEmailText(e.target.value);
        }
    }

    const signUp = async () => {
        setTimeout(() => {
            setErrorMessage("");
        }, 3000)
        if (usernameText === "" || passwordText === "" || emailText === "") return setErrorMessage("Please fill out all fields");
        if (usernameText.length < 3) return setErrorMessage("Username must be at least 3 characters long");
        if (passwordText.length < 6) return setErrorMessage("Password must be at least 6 characters long");
        if (!passwordText.match(/^[A-Z0-9!@#$%^&*():;]+$/i)) return setErrorMessage("Password is not valid");
        if (!emailText.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) return setErrorMessage("Please enter a valid email address");
        
        const body = {username: usernameText, password: passwordText, email: emailText};

        try {
            const response = await fetch("/api/users/signup", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.errorMessage) return setErrorMessage(data.errorMessage);
            window.location.href = "/";
        } catch {
            setErrorMessage("An unknown error has occured");
        }

    }

    return tooSmall ? (
        <div className="SignIn" >
            <h1>Sign Up</h1>
            <div className="signInForm" style={{...SmallStyle}}>
                <input id="username" type="text" placeholder='username' value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <input id="email" type="text" placeholder='email' value={emailText} onChange={e => changeTextBox(e)}></input><br />
                <input id="password" type="password" placeholder='password' value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.href = "/signin"}>Sign In Instead</p>
                <p className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signUp}>Sign In</button><br />
            </div>
        </div>
    ): (
        <div className="SignIn">
            <h1>Sign Up</h1>
            <div className="signInForm">
                <input id="username" type="text" placeholder='username' value={usernameText} onChange={e => changeTextBox(e)}></input><br />
                <input id="email" type="text" placeholder='email' value={emailText} onChange={e => changeTextBox(e)}></input><br />
                <input id="password" type="password" placeholder='password' value={passwordText} onChange={e => changeTextBox(e)}></input>
                <p className= "HoverPointer" onClick={() => window.location.href = "/signin"}>Sign In Instead</p>
                <p className="errorMessage" style={{...errorStyle}}>{errorMessage}</p>
                <button style={{backgroundColor: Colors.Blue}} onClick={signUp}>Sign Up</button><br />
            </div>
        </div>
    )
}

export default SignUp;