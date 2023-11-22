import React from "react";
import { Link } from 'react-router-dom';

export default function BookmarkHomepage (props) {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    return (
        <div>
             <Link to={`/location/${props.details.id}`}>
                <div className="bookmarks--container">
                        <img 
                        src={`${backendUrl}${props.details.primary_image}`} 
                        className="bookmark--image" alt="Location" 
                        />
                    <span className="font10">{props.details.name}</span>
                </div> 
            </Link>    
        </div>
    );
}
