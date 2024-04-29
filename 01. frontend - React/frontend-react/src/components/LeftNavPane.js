import { useState, useContext, useEffect } from 'react';
import './LeftNavPane.css';
import { AccountContext } from "../contexts/AccountContext";
import { useNavigate } from 'react-router-dom';

export default function LeftNavPane () {
    const {accountDetails, setAccountDetails} = useContext(AccountContext);
    
    const navigate = useNavigate();

    const [serverStatus, setServerStatus] = useState('Inactive');

    const handleAPICallTest = (account_id) => {
        fetch(`http://localhost:8080/api/getcommcheck`)
        .then(response => {return response.json()}).
        then(result => {setServerStatus(result.message)})
        .catch(error => {setServerStatus('Inactive')})
    }

    const handleLogOut = () => {
        setAccountDetails({
            loggedIn: false,
            username: '',
            account_id: -1
        });
        navigate('/view_all_listings');
    }
    // *** Use Effect for First Render
    useEffect(() => {
        handleAPICallTest()
    },[])

    // *** Return for a logged in Inventory Manager
    if (accountDetails.loggedIn) {
        return (
            <div className="navBarContainer">
                <div className="websiteTitle">FINLEY'S CRUD APP</div>
                <div className="debug">Server Status: {serverStatus}</div>
                <div className="debug">Logged In Variable: {accountDetails.loggedIn.toString()}</div>
                <div className="debug">Username Variable: {accountDetails.username.toString()}</div>
                <div className="debug">Account ID Variable: {accountDetails.account_id.toString()}</div>
                <div className="debug">Logged In Menu: Logged In</div>
                <div className="navButtonContainer">
                    <button id="navButton_viewMyListings"
                        className="navButton"
                        onClick={(()=>navigate('/view_my_listings'))}>
                        View My Listings
                    </button>
                </div>
                <div className="navButtonContainer">
                    <button id="navButton_viewAllListings"
                            className="navButton"
                            onClick={(()=>navigate('/view_all_listings'))}>
                        View All Listings
                    </button>
                </div>
                <div className="navButtonContainer">
                    <button id="navButton_addNewListing"
                            className="navButton"
                            onClick={(()=>navigate('/add_new_listing'))}>
                        Add New Listing
                    </button>
                </div>
                <div className="containerLogOut">
                    <button id="navButton_addNewListing"
                            className="navButton"
                            onClick={(()=>{handleLogOut()})}>
                        Log Out
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="navBarContainer">
                <div className="websiteTitle">FINLEY'S CRUD APP</div>
                <div className="debug">Server Status: {serverStatus}</div>
                <div className="debug">Logged In Variable: {accountDetails.loggedIn.toString()}</div>
                <div className="debug">Logged In Menu: Logged Out</div>
                <div className="navButtonContainer">
                    <button id="navButton_viewAllListings"
                            className="navButton"
                            onClick={(()=>navigate('/view_all_listings'))}>
                        View All Listings
                    </button>
                </div>
                <div className="navButtonContainer">
                    <button id="navButton_logIn"
                            className="navButton"
                            onClick={(()=>navigate('/login'))}>
                        Log In
                    </button>
                </div>
                <div className="navButtonContainer">
                    <button id="navButton_register"
                            className="navButton"
                            onClick={(()=>navigate('/register'))}>
                        Register
                    </button>
                </div>
            </div>
        )
    }

}