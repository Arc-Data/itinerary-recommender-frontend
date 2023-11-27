import { useState } from "react"

const useEventManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const access = String(authTokens.access)
    const [event, setEvent] = useState()
    const [events, setEvents] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    const getAllEvents = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${backendUrl}/api/event/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setEvents(data)
        }
        catch(error) {
            setError(error)
        }
        finally {
            setLoading(false)
        }
    }
    
    const getEvent = async (id) => {
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/event/${id}/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setEvent(data)
        } 
        catch (error) {
            setError(error)
        }
        finally {
            setLoading(false)
        }

    }   

    const deleteEvent = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/event/${id}/delete/`, {
                "method": "DELETE",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })
            
            if (response.ok) {
                const newEvents = events.filter(event => event.id !== id)
                setEvents(newEvents)
            }
        } 
        catch (error) {
            console.log("an error occured")
        }
    }
    
    return {
        event,
        events,
        loading,
        error,
        getAllEvents,
        getEvent,
        deleteEvent,
    }
}

export default useEventManager