import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../../contexts/AccountContext";
import './AddNewListing.css';

export default function AddNewListing () {

    const navigate = useNavigate();

    const {accountDetails, setAccountDetails} = useContext(AccountContext);

    // *** States
    const [item_name, setItem_name] = useState("");
    const [item_description, setItem_description] = useState("");
    const [quantity, setQuantity] = useState("");
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);

    // *** Handlers
    const handleEnterKeyDown = e => {
        if (e.key === 'Enter') {
            handleClickAddListing();
        }
    }
    const handleChangeName = e => {
        setItem_name(e.target.value);
    }
    const handleChangeDescription = e => {
        setItem_description(e.target.value);
        setDescriptionLength(String(e.target.value).length);
    }
    const handleChangeQuantity = e => {
        setQuantity(e.target.value);
    }
    const handleClearFields = () => {
        setItem_name('');
        setItem_description('');
        setQuantity('');
        setDescriptionLength(0);
    }

    const handleClickAddListing = () => {
        // check that all fields are acceptable
        if (
            item_name === '' ||
            item_description === '' ||
            quantity === '' ||
            isNaN(parseInt(quantity))
        )   {
            setErrorMessage('Error: Incomplete listing data, please try again.');
            return;
        } else if (parseInt(quantity) <= 0) {
            setErrorMessage('Error: Cannot have a quantity of less than 1.');
            return;
        }

        // if that is good, clear error and continue
        setErrorMessage(null);

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                account_id: accountDetails.account_id,
                item_name: item_name,
                item_description: item_description,
                quantity: quantity
            })
        }
        console.log(item_description);
        
        fetch('http://localhost:8080/api/addListing/',requestOptions)
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
        .then(()=>{
            handleClearFields();
            navigate('/view_my_listings');
        });
    }

    if (!accountDetails.loggedIn) {
        return (
            <div className="notLoggedInPage">
                <div className="pageTitleLabel">
                    <h1>Add a Listing</h1>
                </div>
                <div>
                    <p>You must be logged in to access this functionality.</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="addListingTotalContainer">
                <div className="pageTitle">
                    Add New Listing
                </div>
                <div className="addListingSubContainer">
                    <div className="entryArea">
                        <div className="entryLabel">
                            Item Name:
                        </div>
                        <input value={item_name}
                            className="entryField"
                            placeholder="Item name" 
                            name="input_item_name"
                            type="text"
                            onChange={(e)=>handleChangeName(e)}
                            onKeyDown={(e)=>handleEnterKeyDown(e)}>
                        </input>
                    </div>
                    <div className="entryArea">
                        <div className="entryLabel">
                            Item Description:
                        </div>
                        <textarea
                        id="input_item_description"
                        name="input_item_description"
                        onChange={((e)=>handleChangeDescription(e))}
                        rows={12}
                        placeholder={'Enter the description for the item/listing.'}
                        value={item_description}
                        maxLength={4096}
                        className="entryField"
                        />
                        <div className="charRemaining">
                            Characters remaining: {4096 - descriptionLength}
                        </div>
                    </div>
                    <div className="entryArea">
                        <div className="entryLabel">
                            Item Name:
                        </div>
                        <input value={quantity}
                            className="entryField"
                            placeholder="Qty" 
                            name="input_quantity"
                            type="text"
                            onChange={(e)=>handleChangeQuantity(e)}
                            onKeyDown={(e)=>handleEnterKeyDown(e)}>
                        </input>
                    </div>
                    <div className="buttonContainer">
                        <button id="button_SubmitNewListing"
                            className="submitButton"
                            onClick={(()=>handleClickAddListing())}>
                            Add New Listing
                        </button>
                    </div>
                    <div className="errorMessage">
                        {errorMessage}
                    </div>
                </div>
            </div>
        )
    }
    
}