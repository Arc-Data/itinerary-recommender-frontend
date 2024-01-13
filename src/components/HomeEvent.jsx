import { useContext, useEffect } from "react"
import useEventManager from "../hooks/useEventManager"
import AuthContext from "../context/AuthContext"
import dayjs from "dayjs"

const HomeEvent = () => {
    const { authTokens } = useContext(AuthContext)
    const { events, loading, getUpcomingEvents } = useEventManager(authTokens)

    useEffect(() => {
        getUpcomingEvents()
    }, [])

    const displayEvents = events && events.map(event => {
        return (
            <div key={event.id} className="home--event-item">
                <div className="date-container">
                    <div className="date start">
                        <span className="month start">{dayjs(event.start_date).format("MMMM").toUpperCase()}</span>
                        <span className="day">{dayjs(event.start_date).format("D")}</span>
                        <span className="day-name">{dayjs(event.start_date).format("ddd")}</span>
                    </div>
                    <div className="date end">
                        <span className="month end">{dayjs(event.end_date).format("MMMM").toUpperCase()}</span>
                        <span className="day">{dayjs(event.end_date).format("D")}</span>
                        <span className="day-name">{dayjs(event.end_date).format("ddd")}</span>
                    </div>
                </div>
                
                <div className="details">
                    <p className="name">{event.name}</p>
                    <p className="description">{event.description}</p>
                </div>
            </div>
        )
    })

    if (loading) {
        return (
            <div>Loading Events Data... </div>
        )
    }

    return (
        <div>
            <p className="heading">Upcoming events</p>
            <div className="events-container">
                {displayEvents} 
            </div>
        </div>
    )
}

export default HomeEvent