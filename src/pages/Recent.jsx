import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import StarDefault from "../components/StarDefault"
import useDayManager from "../hooks/useDayManager"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faRoute, faCheck, faPenToSquare, faStar } from '@fortawesome/free-solid-svg-icons';

const Recent = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { authTokens } = useContext(AuthContext)
    const { days, error, loading, getRecentDays, markDayAsComplete } = useDayManager(authTokens)

    const handleMarkAsComplete = (id) => {
        markDayAsComplete(id)
        getRecentDays()
    }

    useEffect(() => {
        getRecentDays()
    }, [])

    const displayDays = days && days.map(day => {
        const locations = day.locations.join(" • ")
        console.log(day)

        return (
            <div key={day.id} className="profile--ratings-item">
                <Link to={`/profile/rate/${day.id}`}>
                    <img src={`${backendUrl}${day.image}`} className="profile--ratings-item-img"/>
                </Link>
                <div className="profile--ratings-content">
                    <div className="profile--ratings-name">
                        <div className="flex-10">
                            <p className="profile--ratings-item-name">{day.name}</p>
                            <div className="day-number-badge">{day.day_number}</div>
                        </div>
                        <div className="flex-10">
                            
                            {day.completed ?
                            <>
                            
                            {day.rating ? 
                                <div className="flex-10">
                                    <div>{day.rating}</div>
                                    <StarDefault color={'#000'} />
                                </div>
                                :
                                <Link to={`${day.id}`} className="profile--rating-btn"><FontAwesomeIcon className="btn-icons" icon={faStar} />Leave a rating!</Link>
                            }
                            </>
                            :
                            <>
                            <Link to={`/plan/${day.itinerary}`}>
                                <button className="profile--mark-btn-edit">
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            </Link>
                            <button className="profile--mark-btn-done" onClick={() => handleMarkAsComplete(day.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                            </>
                            }
                        </div>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <span>{dayjs(day.date).format("MMMM D, YYYY")}</span>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faRoute} />
                        <span>{locations}</span>
                    </div>
                    <p></p>
                </div>
            </div>
        )
    })

    if (error) {
        return (
            <div className="profile--container">
                {error}
            </div>
        )
    }

    return (
        <div className="profile--main-content">
            <p className="header-title heading">Your trips</p>
            <p className="header-subtitle heading5">Recent Activities</p>
            {loading ?
            <div> Loading days data...</div>
            :
            <div className="profile--ratings-container">
                {displayDays}
            </div>
            }
        </div>
    )
}

export default Recent