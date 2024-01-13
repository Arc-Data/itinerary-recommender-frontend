import { faLocationDot, faPersonCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import getTimeDetails from "../utils/getTimeDetails"
import getFeeDetails from "../utils/getFeeDetails"

const Recommendation = ({recommendation, onClick, selected}) => {

    const displayItem = recommendation && recommendation.locations.map(item => {
        return (
            <div key={item.spot.id} className={`assistant--recommendation-item ${item.spot.is_visited ? 'visited' : ''}`}>
                {
                    item.spot.is_visited ? <FontAwesomeIcon icon={faPersonCircleCheck} className="assistant--location-icon visited"/> : <FontAwesomeIcon icon={faLocationDot} className="assistant--location-icon"/>
                }
                <div className="assistant--recommendation-item-content">
                    <p className={`assistant--recommendation-item-title ${item.spot.is_visited ? 'visited' : ''}`}>
                        {item.spot.name}
                    </p>
                    <p>Open {getTimeDetails(item.spot.schedule.opening)} - {getTimeDetails(item.spot.schedule.closing)}</p>
                    <p>Entrance Fee: {getFeeDetails(item.spot.fee.min, item.spot.fee.max)}</p>
                </div>
            </div>
        )
    })

    return (
        <div className={`assistant--recommendation ${selected ? "selected" : ""}` } onClick={onClick}>
            {displayItem}
        </div>
    )
} 

export default Recommendation