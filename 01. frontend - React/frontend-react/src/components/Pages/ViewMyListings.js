import { useState, useEffect, useContext } from "react"
import ItemListCard from "../Modulars/ItemListCard";
import { AccountContext } from "../../contexts/AccountContext";
import './ViewMyListings.css';

export default function ViewMyListings ()  {
    const [myListingsData, setMyListingsData] = useState([]);

    const {accountDetails, setAccountDetails} = useContext(AccountContext);

    const handleLoadIn = () => {
        console.log('Loading info')

        fetch(`http://localhost:8080/api/requestListingsBy/?username=${accountDetails.username}`)
        .then(
            response => {
                return response.json();
            }
        ).then (
            result => {
                setMyListingsData(result);
            }
        )
        .catch(error=>console.log(error));
    }

    useEffect(()=> {
        handleLoadIn();
    }, []);

    if (!accountDetails.loggedIn) {
        return (
            <div>You must be logged in to see these details.</div>
        )
    } else {
        return (
            <div>
                <div className="pageTitleLabel">
                        <h1>View My Listings</h1>
                    </div>
                <div>
                {
                    myListingsData.map(data => {
                        console.log(data);
                        return (
                            <ItemListCard 
                                listing_id={data.listing_id}
                                item_name = {data.item_name}
                                item_description = {data.item_description}
                                quantity={data.quantity}
                                />
                        )
                    })
                }
                </div>
            </div>
        )
    }
}