import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const RecommendationList = ({ recommendations, onAddRecommendation} ) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    return (
        <div className='add-location-recommendations'>
            {recommendations && recommendations.map(recommendation => {
            return (
            <div key={recommendation.id} className="nearby-recommendation-item">
                <img src={`${backendUrl}${recommendation.primary_image}`} alt="" />
                    <div className='recommendation-details'>
                        <p className="name">{recommendation.name}</p>
                        {recommendation.distance && 
                        <p>{Math.floor(recommendation.distance)}m</p>
                        }
                        <p className="rating">Rating: {recommendation.ratings.average_rating}</p>
                    </div>
                    <button onClick={() => onAddRecommendation(recommendation.id)} className='add-location-modal--add-btn'><FontAwesomeIcon icon={faPlus} /></button>
            </div> ) 
            })}
        </div>
    )
}

export default RecommendationList