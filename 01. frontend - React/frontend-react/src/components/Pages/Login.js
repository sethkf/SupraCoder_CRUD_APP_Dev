import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../../contexts/AccountContext";
import './Login-Register.css';

export default function Login () {

    const navigate = useNavigate();

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const {accountDetails, setAccountDetails} = useContext(AccountContext);

    const handleChangeUsername = e => {
        setLoginUsername(e.target.value);
    }
    const handleChangePassword = e => {
        setLoginPassword(e.target.value);
    }
    

    const handleClickLogin = () => {
        if (accountDetails.loggedIn) {
            setAccountDetails({username:'', loggedIn:!accountDetails.loggedIn});
            return;
        }

        let options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username : loginUsername,
                password : loginPassword
            })
        }

        fetch('http://localhost:8080/api/checkLoginInfo/', options)
        .then(response => response.json())
        .then(response => {
            console.log("Server Message: "+response.message);
            if (response.content.loginSuccess) {
                setAccountDetails({
                    username: loginUsername, 
                    account_id: response.content.account_id,
                    loggedIn: response.content.loginSuccess
                });
                setErrorMessage(null);
                navigate('/view_my_listings');
;            } else {
                setAccountDetails({...accountDetails, loggedIn:response.content.loginSuccess});
                setErrorMessage('Invalid username or password.');
            }
        });
        
    }
    const handleEnterKeyDown = e => {
        if (e.key === 'Enter') {
            handleClickLogin()
        }
    }
    
    return (
        <div className="loginTotalContainer">
            <div className="loginTitle">
                Log In
            </div>
            <div className="loginSubContainer">
                <div className="loginEntry">
                    <div className="loginLabel">
                        Username:
                    </div>
                    <input className="loginEntryField"
                        value={loginUsername}
                        type="text"
                        name="input_login_username"
                        id = 'input_login_username'
                        onChange={((e)=>{handleChangeUsername(e)})}
                        placeholder="username">
                    </input>
                </div>
                <div className="loginEntry">
                    <div className="loginLabel">
                        Password:
                    </div>
                    <input className="loginEntryField"
                        value={loginPassword}
                        type="password"
                        name="input_login_password"
                        id = 'input_login_password'
                        onChange={((e)=>{handleChangePassword(e)})}
                        onKeyDown={(e)=>handleEnterKeyDown(e)}
                        placeholder = "password">
                    </input>
                </div>
                <div className="buttonContainer">
                    <button id="button_login"
                        className="loginButton"
                        onClick={(()=>handleClickLogin())}>
                        Log In
                    </button>
                </div>
                <div className="errorMessage">
                    {errorMessage}
                </div>
            </div>
            
        </div>
    )
}