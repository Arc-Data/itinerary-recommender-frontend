import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faLocationDot, faTrash, faMoneyBills, faCalendarDay,  } from "@fortawesome/free-solid-svg-icons"
import getTimeDetails from "../utils/getTimeDetails";
import getFeeDetails from "../utils/getFeeDetails";
import { useState } from "react";

const LocationItem = ({location}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const string = `${backendUrl}${location.details.primary_image.replace(/'/g, "\\'")}` 
    const [openEvents, setOpenEvents] = useState(false)

    const toggleEvents = () => {
        setOpenEvents(prev => !prev)
    }

    const locationImage = {
        backgroundImage: `url(${string})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }

    const displayEvents = location.details.event && location.details.event.map(location => {
        console.log(location)
        return (
            <div key={location.id} className="events">{location.name}</div>
        )
    })

    const fee = location.details.min_cost && location.details.max_cost 
        ? getFeeDetails(location.details.min_cost, location.details.max_cost) : 0
    const opening = location.details.opening ? getTimeDetails(location.details.opening) : 0
    const closing = location.details.closing ? getTimeDetails(location.details.closing) : 0

    return (
        <div>
            <div className="plan--itinerary-item">
                <div className="plan--item">
                    <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
                    <div className="plan--location-details">
                        <p className="plan--location-name">{location.details.name}</p>
                        <div className="plan--location-info">
                            {location.details.location_type === "1" &&
                                <p>
                                    <FontAwesomeIcon className='plan--icon-clock' icon={faClock} /> {opening} - {closing}
                                </p>
                            }
                            
                            {location.details.location_type === "1" &&
                            <p>
                                <FontAwesomeIcon className='plan--icon-clock' icon={faMoneyBills} /> Expenses Range: {fee}
                            </p>
                            }
                            {location.details.location_type === "2" &&
                            <p>
                                <span className="plan--location-detail">Expenses Range:</span> {fee}
                            </p>
                            }
                        </div>
                        {
                            location.details.event.length >= 1 && 
                            <div className="plan--events-btn font-weight-500" onClick={toggleEvents}>
                                <p><FontAwesomeIcon className="btn-icons" icon={faCalendarDay} />Events (
                                    {location.details.event.length === 1 ? '1' : `${location.details.event.length}`}
                                )</p>
                            </div>
                        }
                        
                    </div>
                </div>
                <div style={locationImage}></div>
            </div>
            {openEvents && 
            <div className="plan--events-container">
                {displayEvents}
            </div>
            }
        </div>
    )
}

export default LocationItem