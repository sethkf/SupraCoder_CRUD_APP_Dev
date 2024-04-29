import { useState, useEffect } from "react"
import ItemListCard from "../Modulars/ItemListCard";
import './ViewAllListings.css';

export default function ViewAllListings () {
    
    const [allListingsData, setAllListingsData] = useState([]);

    const handleLoadIn = () => {
        fetch(`http://localhost:8080/api/requestAllListings`)
        .then(
            response => {
                return response.json();
            }
        ).then (
            result => {
                setAllListingsData(result);
            }
        )
        .catch(error=>console.log(error));
    }

    useEffect(() => {
        handleLoadIn();
    },[])
    
    return (
        <div className="viewAllListingsContainer">
            <div className="viewAllListingsTitle">
                    <h1>View All Listings</h1>
                </div>
            <div>
            {
                allListingsData.map(data => {
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