import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import dayjs from "dayjs"
import getFeeDetails from "../utils/getFeeDetails"
import getTimeDetails from "../utils/getTimeDetails"
import useDayManager from "../hooks/useDayManager"
import StarDefault from "../components/StarDefault"

const RateDay = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { day, loading, error, getDayRating, markDayAsComplete, updateDayRating } = useDayManager(authTokens)
    const [ rating, setRating ] = useState(0)
    const navigate = useNavigate()

    const handleMarkComplete = async (e) => {
        e.stopPropagation()
        markDayAsComplete(id)
    }

    useEffect(() => {
        getDayRating(id)
    }, [id])

    const handleBack = () => {
        navigate(-1)
    }

    const displayLocations = day && day.locations.map(location => {
        const fee = getFeeDetails(location.min_cost, location.max_cost)
        const opening_time = location.opening ? getTimeDetails(location.opening) : `Open 24/7`
        const closing_time = location.closing ? getTimeDetails(location.closing) : `Open 24/7`

        return (
            <div key={location.id} location={location} className="add-location-modal--search-item">
                <img src={`${backendUrl}${location.primary_image}`} width={120} height={80}/>
                <div>
                    <Link to={`/location/${location.id}`}>
                    <p className="add-location-modal--title">{location.name}</p>
                    </Link>
                    <p className="add-location-modal--subtext">{location.address}</p>
                    <p className="add-location-modal--subtext"><span>Opens {opening_time} - {closing_time} </span>•<span> Entrance Fee: {fee} </span></p>
                </div>
            </div>
        )
    })

    const handleRating = (rating) => {
        setRating(rating)
    }

    const handleSubmitDayRating = async () => {
        updateDayRating(id, rating)
    }


    if (error) {
        return (
            <div>{error}</div>
        )
    }

    return (
        <div className="profile--main-content">
            <div className="back" onClick={handleBack}>
                <img src="/back.svg" alt="Back" />
                <span>Back</span>
            </div>
            {loading ? 
                <div>Loading...</div>
                :
                <>
                <div className="profile--rating-header">
                    <div className="header-title">
                        <p className="heading">{day.name}</p>
                        <div className="day-number-badge">{day.day_number}</div>
                    </div>
                    <div className="header-subtitle">
                        <img src="/calendar.svg" alt="" />
                        <span>{dayjs(day.date).format("MMM D, YYYY")}</span>
                    </div>
                </div>
                <div className="profile--rate-locations">
                    <div className="profile--rate-locations-container">
                        {displayLocations}
                    </div>
                    <div>
                        {!day.completed ? 
                        <div className="profile--rate-modal">
                            <p className="heading3">Finished this trip? Mark it as completed.</p>
                            <button className="profile--rate-btn" onClick={handleMarkComplete}>
                                <img src="/check.svg" alt="" />
                                <p>Mark as complete</p>
                            </button>
                        </div>
                        :
                        <div className="profile--rate-modal">
                            {!day.rating ? 
                            <>
                            <p>How did your overall trip went?</p>
                            <div className="profile--star-container">
                            {Array.from({length: 5}).map((_, idx) => (
                                <StarDefault 
                                    key={idx}
                                    onClick={() => handleRating(idx + 1)}
                                    color={`${idx + 1 <= rating ? "#F2C44F" : "#CCC"}`} />
                            ))}
                            </div>
                            <div className="profile--star-btns">
                                <button className="profile--star-cancel-btn">Undo</button>
                                <button className="profile--star-submit-btn" onClick={handleSubmitDayRating}>Submit</button>
                            </div>
                            </>
                            :
                            <>
                            <p className="heading4">You rated this place {day.rating} star!</p>
                            </>
                            }
                            
                        </div>
                        
                        }
                    </div>
                </div>
                </>
                }
        </div>
    )
}

export default RateDay