import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login-Register.css';

export default function Register () {

    const navigate = useNavigate();

    // *** States
    const [registerFirstName, setRegisterFirstName] = useState('');
    const [registerLastName, setRegisterLastName] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterComfirmPassword] = useState('');
    const [errorMessasge, setErrorMessage] = useState(null);
    

    // *** General Functions
    const handleClearInputs = () => {
        setRegisterFirstName('');
        setRegisterLastName('');
        setRegisterUsername('');
        setRegisterPassword('');
        setRegisterComfirmPassword('');
    }

    const checkPasswordsEqual = () => {
        if (registerPassword === registerConfirmPassword) {
            return true
        } else {return false}
    }

    const checkDataValid = () => {
        let isDataValid = true;
        if (!checkPasswordsEqual()) {
            return false;
        }
        else {
            setErrorMessage(null);
        }
        
        if (
            registerFirstName === '' ||
            registerLastName === '' ||
            registerUsername === '' ||
            registerPassword === ''
        ) {
            isDataValid = false
        }
        return isDataValid;
    }

    // *** Handlers
    const handleChangeRegisterFirstName = e => {
        setRegisterFirstName(e.target.value);
    }
    const handleChangeRegisterLastName = e => {
        setRegisterLastName(e.target.value);
    }
    const handleChangeRegisterUsername = e => {
        setRegisterUsername(e.target.value);
    }
    const handleChangeRegisterPassword = e => {
        setRegisterPassword(e.target.value);
    }
    const handleChangeRegisterConfirmPassword = e => {
        setRegisterComfirmPassword(e.target.value);
    }
    const handleClickCreateAccount = () => {
        if (checkDataValid()) {
            let options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    first_name: registerFirstName,
                    last_name: registerLastName,
                    username: registerUsername,
                    password: registerPassword
                })
            }

            fetch('http://localhost:8080/api/registerAccount/', options)
            .then(response => response.json())
            .then(response => {
                console.log("Server Message: "+response.message);
                if (response.message === 'Username already exists.') {
                    handleClearInputs();
                    setErrorMessage('Username already exists.');
                } else {
                    handleClearInputs();
                    setErrorMessage(null);
                    navigate('/login');
                }
            })
        } else {
            if (!checkPasswordsEqual()) {
                setErrorMessage('Passwords do not match.');
            } else {
                setErrorMessage('Entries are not valid. Please adjust and try again.');
            }
        }
    }
    const handleEnterKeyDown = e => {
        if (e.key === 'Enter') {
            handleClickCreateAccount()
        }
    }

    return (
        <div className="loginTotalContainer">
            <div className="loginTitle">
                Register
            </div>
            <div className="loginSubContainer">
                <div>
                    <div className="loginLabel">
                        First Name:
                    </div>
                    <input className="loginEntryField"
                        value={registerFirstName}
                        type="text"
                        name="input_register_firstName"
                        id = 'input_register_firstName'
                        onChange={((e)=>{handleChangeRegisterFirstName(e)})}
                        onKeyDown={(e)=>handleEnterKeyDown(e)}
                        placeholder="First Name">
                    </input>
                </div>
                <div>
                    <div className="loginLabel">
                        Last Name:
                    </div>
                    <input className="loginEntryField"
                        value={registerLastName}
                        type="text"
                        name="input_register_lastName"
                        id = 'input_register_lastName'
                        onChange={((e)=>{handleChangeRegisterLastName(e)})}
                        onKeyDown={(e)=>handleEnterKeyDown(e)}
                        placeholder="Last Name">
                    </input>
                </div>
                <div>
                    <div className="loginLabel">
                        Username:
                    </div>
                    <input className="loginEntryField"
                        value={registerUsername}
                        type="text"
                        name="input_register_username"
                        id = 'input_register_username'
                        onChange={((e)=>{handleChangeRegisterUsername(e)})}
                        onKeyDown={(e)=>handleEnterKeyDown(e)}
                        placeholder="username">
                    </input>
                </div>
                <div>
                    <div className="loginLabel">
                        Password:
                    </div>
                    <input className="loginEntryField"
                        value={registerPassword}
                        type="password"
                        name="input_register_password"
                        id = 'input_register_password'
                        onChange={((e)=>{handleChangeRegisterPassword(e)})}
                        onKeyDown={(e)=>handleEnterKeyDown(e)}
                        placeholder="password">
                    </input>
                </div>
                <div>
                    <div className="loginLabel">
                        Confirm Password:
                    </div>
                    <input className="loginEntryField"
                        value={registerConfirmPassword}
                        type="password"
                        name="input_register_confirmPassword"
                        id = 'input_register_confirmPassword'
                        onChange={((e)=>{handleChangeRegisterConfirmPassword(e)})}
                        onKeyDown={(e)=>handleEnterKeyDown(e)}
                        placeholder="confirm password">
                    </input>
                </div>
                <div className="buttonContainer">
                    <button onClick={()=>{handleClickCreateAccount()}} className="loginButton">Create Account</button>
                </div>
                <div className="errorMessage">
                    {errorMessasge}
                </div>
            </div>
        </div>
    )
}