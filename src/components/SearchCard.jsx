import React from "react"
import { Link } from 'react-router-dom';
import {
	FaStar,
	} from "react-icons/fa";

export default function SearchCard (props) {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL


    return (
        <div className="searchPage--details">  
            <div className="searchPage--picture"> 
            <Link to={`/location/${props.id}`}> <img className="searchPage--pic" src={`${backendUrl}${props.primary_image}`}  /></Link>
            </div>
            
            <div className="searchPage--info">
                <h2 className="heading4">{props.name}</h2>
                <p>{props.address}</p>
                <div className="searchPage--star">
                    <p className="ratings mr5px"> {props.ratings.average_rating} </p>
                    {[...Array(5)].map((star, i) => (
                        <FaStar
                            key={i}
                            className="star"
                            color={
                            i + 1 < props.ratings.average_rating ? "#ffc107" : "#e4e5e9"
                            }
                        />
                    ))}
                    <p className="ratings ml5px"> {props.ratings.total_reviews} reviews </p>
                </div>
            </div>
        </div>
      
    )
}