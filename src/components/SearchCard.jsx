import React from "react"
import { Link } from 'react-router-dom';
import star from "/images/star.png";

export default function SearchCard (props) {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL


    return (
        <div className="searchPage--details">  
            <div className="searchPage--picture"> 
            <Link to={`/location/${props.id}`}> <img className="searchPage--pic" src={`${backendUrl}${props.primary_image}`}  /></Link>
            </div>
            
            <div className="searchPage--info">
                <h2 className="searchPage--info-title">{props.name}</h2>
                <span className="searchPage--info-address">{props.address}</span>
                <div className="searchPage--star">
                    {[...Array(5)].map((i, index) => (
                        <img key={index} src={star} alt="Star" className="star" />
                    ))}
                    <span className="rating"> • 4.0 {props.rating}</span>
                </div>
            </div>
        </div>
      
    )
}