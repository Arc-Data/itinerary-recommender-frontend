import React from 'react'

const RecommendationList = ({ recommendations, onAddRecommendation} ) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    return (
        <div className='add-location-recommendations'>
            {recommendations && recommendations.map(recommendation => {
            return (
            <div key={recommendation.id} className="nearby-recommendation-item">
                <img src={`${backendUrl}${recommendation.primary_image}`} alt="" />
                <div>
                    <p>{recommendation.name}</p>
                    {recommendation.distance && 
                    <p>{Math.floor(recommendation.distance)}m</p>
                    }
                    <p>Rating: {recommendation.ratings.average_rating}</p>
                    <button onClick={() => onAddRecommendation(recommendation.id)}>Add</button>
                </div>
            </div> ) 
            })}
        </div>
    )
}

export default RecommendationList