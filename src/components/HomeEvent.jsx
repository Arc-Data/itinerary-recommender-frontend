import { useContext, useEffect } from "react"
import useEventManager from "../hooks/useEventManager"
import AuthContext from "../context/AuthContext"

const HomeEvent = () => {
    const { authTokens } = useContext(AuthContext)
    const { events, getUpcomingEvents } = useEventManager(authTokens)

    console.log(events)

    useEffect(() => {
        getUpcomingEvents()
    }, [])

    return (
        <div>HomeEvent</div>
    )
}

export default HomeEvent