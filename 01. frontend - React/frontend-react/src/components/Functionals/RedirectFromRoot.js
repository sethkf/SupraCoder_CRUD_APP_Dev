import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectFromRoot () {
    const navigate = useNavigate();
    
    useEffect(()=>{
        navigate('/view_all_listings');
    },[]);

    return(null);    
}