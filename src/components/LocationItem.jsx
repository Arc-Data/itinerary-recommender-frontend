import { faClock, faLocationDot, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import getTimeDetails from "../utils/getTimeDetails";
import getFeeDetails from "../utils/getFeeDetails";

const LocationItem = ({location}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    
    const string = `${backendUrl}${location.details.primary_image.replace(/'/g, "\\'")}` 

    const locationImage = {
        backgroundImage: `url(${string})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }

    const fee = location.details.min_cost && location.details.max_cost 
        ? getFeeDetails(location.details.min_cost, location.details.max_cost) : 0
    const opening = location.details.opening ? getTimeDetails(location.details.opening) : 0
    const closing = location.details.closing ? getTimeDetails(location.details.closing) : 0

    return (
        <div className="plan--itinerary-item">
            <div className="plan--item">
                <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
                <div className="plan--location-details">
                    <p className="plan--location-name">{location.details.name}</p>
                    <div>
                        {location.details.location_type === "1" &&
                        <p><FontAwesomeIcon icon={faClock} /> {opening} - {closing}</p>
                        }
                        
                        {location.details.location_type === "1" &&
                        <p>
                            <span className="plan--location-detail">Entrance fee:</span> {fee}
                        </p>
                        }
                        {location.details.location_type === "2" &&
                        <p>
                            <span className="plan--location-detail">Expenses Range:</span> {fee}
                        </p>
                        }
                    </div>
                </div>
            </div>
            <div style={locationImage}></div>
        </div>
    )
}

export default LocationItem