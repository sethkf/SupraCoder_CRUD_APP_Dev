import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import { AccountContext } from "../../contexts/AccountContext";
import './ViewAListing.css';

export default function ViewAListing () {
    
    const { listing_id } = useParams();

    const {accountDetails, setAccountDetails} = useContext(AccountContext);

    const [listingOwnerName, setListingOwnerName] = useState('');
    const [listingOwnerUsername, setListingOwnerUsername] = useState('');

    const [ownerStatus, setOwnerStatus] = useState(false);
    const [listingData, setListingData] = useState({});
    const [editMode, setEditMode] = useState(false);

    const navigate = useNavigate();

    const handleLoadIn = () => {

        fetch(`http://localhost:8080/api/requestListingInfo/?listing_id=${listing_id}`)
        .then(
            response => {
                return response.json();
            }
        ).then(
            result => {
                // assign item details
                let ownerStatusTemp = false; // local var vs component-wide state, both needed due to async nature of state
                setListingData(result.content);
                console.log(result.content);
                if (accountDetails.account_id === result.content.listing_account) {
                    setOwnerStatus(true);
                    ownerStatusTemp = true;
                } else {
                    setOwnerStatus(false);
                    ownerStatusTemp = false;
                }

                // now assign user data to it
                fetch(`http://localhost:8080/api/requestAccountDetails/?account_id=${result.content.listing_account}`)
                .then (
                    response => {
                        return response.json();
                    }
                ).then( subResult => {
                    if (ownerStatusTemp) {
                        setListingOwnerName('You');
                        setListingOwnerUsername('You');
                    } else {
                        let name = subResult.content.first_name + " " + subResult.content.last_name;
                        setListingOwnerName(name);
                        setListingOwnerUsername(subResult.content.username);
                    }

                }).catch(error=>console.log(error));
            }
        ).catch(error=>console.log(error));
    }

    const handleEnterEditMode = () => {
        setEditMode(true);
    }

    const handleSaveChanges = () => {
        // Send new details back to database
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                item_name: listingData.item_name,
                item_description: listingData.item_description,
                quantity: listingData.quantity
            })
        }
        fetch(
            `http://localhost:8080/api/updateListing/?listing_id=${listing_id}`, requestOptions
        ).then(
            ()=>{handleLoadIn()}
        )
        setEditMode(false);
    }

    const handleDeleteListing = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                listing_id: listing_id
            })
        }
        fetch(
            `http://localhost:8080/api/deleteRecord/`, requestOptions
        ).then(response => {return response.json()})
        .then((result)=>{
            console.log(result);
            setEditMode(false);
            navigate('/view_my_listings');
        })
    }

    const handleChangeItemName = e => {
        setListingData({...listingData, item_name: e.target.value})
    }

    const handleChangeItemDescription = e => {
        setListingData({...listingData, item_description: e.target.value})
    }
    const handleChangeQuantity = e => {
        setListingData({...listingData, quantity: e.target.value})
    }

    useEffect(()=>{
        handleLoadIn();
    },[]);

    return (
        <div className="viewListingContainer">
            <div className="listingDetailContainer" id="id_item_name_container">
                <div className="listingDetailLabel" id="id_item_name_label">
                    Item Name:
                </div>
                { editMode ?     
                    <input
                        className="editListingField"
                        value={listingData.item_name}
                        onChange={(e)=>handleChangeItemName(e)}
                    ></input>
                    :
                    <div className="listingDetailData">{listingData.item_name}</div>
                }
            </div>
            <div className="listingDetailContainer">
                <div className="listingDetailLabel">
                    Owner's Username:
                </div>
                <div className="listingDetailData">
                    {listingOwnerUsername}
                </div>
            </div>
            <div className="listingDetailContainer">
                <div className="listingDetailLabel">
                    Owner's Name:
                </div>
                <div className="listingDetailData">
                    {listingOwnerName}
                </div>
            </div>
            <div className="listingDetailContainer">
                <div className="listingDetailLabel">
                    Description:
                </div>
                { editMode ?
                    <textarea
                        id="edit_item_description"
                        onChange={((e)=>handleChangeItemDescription(e))}
                        rows={14}
                        value={listingData.item_description}
                        maxLength={4096}
                        className="editListingField"
                        wrap='soft'
                        />
                    :
                    <div className="listingDetailData">{listingData.item_description}</div>
                }
            </div>
            <div className="listingDetailContainer">
                <div className="listingDetailLabel">
                    Quantity:
                </div>
                { editMode ?
                    <input
                    className="editListingField"
                    value={listingData.quantity}
                    onChange={(e)=>handleChangeQuantity(e)}
                    ></input>
                    :
                    <div className="listingDetailData">{listingData.quantity}</div>
                }
            </div>
            
            
            <div className="buttonsContainer">
                <div>{ editMode  && ownerStatus ?
                    <button onClick={()=>handleSaveChanges()} className="editButton">
                    Save
                    </button>
                    : !editMode && ownerStatus ?
                    <button onClick={()=>handleEnterEditMode()} className="editButton">
                    Edit
                    </button>
                    : null
                }</div>
                
                <div>
                { editMode  && ownerStatus?
                    <button onClick={()=>handleDeleteListing()} className="editButton">
                    Delete
                    </button>
                    :
                    null
                }
                </div>
            </div>
        </div>
    )
}
