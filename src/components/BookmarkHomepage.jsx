import React from "react";
import { Link } from 'react-router-dom';

export default function BookmarkHomepage (props) {
    return (
        <div>
             <Link to={`/location/${props.id}`}>
                <div className="bookmarks--container">
                        <img 
                        src={`http://127.0.0.1:8000${props.primary_image}`} 
                        className="bookmark--image" alt="Location" 
                        />
                    <span className='bookmark--name font-weight-500'>{props.name}</span>
                </div> 
            </Link>    
        </div>
    );
}
