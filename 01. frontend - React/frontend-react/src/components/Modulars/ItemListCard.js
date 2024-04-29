import { useNavigate } from "react-router-dom";
import './ItemListCard.css';

export default function ItemListCard ({ item_name, item_description, quantity, listing_id })      {

    const navigate = useNavigate();

    let item_description_shortened = item_description;
    if (item_description !== null) {
        if (item_description.length > 100) {
            item_description_shortened = item_description.substring(0,100)+'...';
        }
    }

    const handleClickCard = () => {
        console.log(item_name+ ' card clicked with listing_id of '+listing_id);
        navigate(`/view_listing/${listing_id}`);
    }

    return (
        <div onClick={()=>handleClickCard()}
            className="itemListCard">
            <div className="itemListCard_itemName">
                {item_name}
            </div>
            <div className="itemListCard_itemDescription">
                {item_description_shortened}
            </div>
            <div className="itemListCard_quantity">
                Qty: {quantity}
            </div>
        </div>
    )
}