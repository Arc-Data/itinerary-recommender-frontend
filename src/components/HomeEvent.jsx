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
            <div key={event.id}>
                {dayjs(event.start_date).format("dddd, MMM D")} - {event.name}
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