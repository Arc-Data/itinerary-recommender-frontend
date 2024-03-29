import { useState } from "react"

const useDayManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const access = String(authTokens.access)
    const [ day, setDay ] = useState() 
    const [ days, setDays ] = useState([])
    const [ error, setError ] = useState(false) 
    const [ loading, setLoading ] = useState(true) 
    const [ minCost, setMinCost ] = useState(0)
    const [ maxCost, setMaxCost ] = useState(0)

    const getDays = async (itinerary_id) => {
        setLoading(true)
        try {
            const response = await fetch(`${backendUrl}/api/itinerary/${itinerary_id}/days/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setDays(data)
        }
        catch (error){
            setError(error)
        } 
        finally {
            setLoading(false)
        }
    }

    const updateDayColor = async (id, color) => {
        try {
            const response = await fetch(`${backendUrl}/api/day/${id}/color/`, {
                "method": "POST",
                "headers": {
                    'Content-Type': "application/json",
                },
                "body": JSON.stringify({
                    "color": color
                })
            })

            const data = await response.json()
            return data
        }
        catch (error) {
            console.log("Error while updating color data :", error)
        }
     }

    const updateCalendarDays = (days) => {
        setDays(days)
    }

    const deleteDay = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/day/${id}/delete/`, {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access}`,
                }
            })
        }
        catch (error) {
            console.log("Error while deleting day: ", error)
        } 
    }

	const removeDay = (dayId) => {
		const currentDays = days.filter(day => dayId !== day.id)
		setDays(currentDays)
	} 

    const updateDays = (dayId, replacement) => {
        const currentDays = days.map(day => {
			if (day.id === dayId) {
				return replacement
			}

			return day
		})

		setDays(currentDays)
	}

    const markDayAsComplete = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/day/${id}/complete/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
            })

            const data = await response.json();
            setDay(data)
        }
        catch (error) {
            console.log("An error occured while marking day as complete: ", error)
        }
    }

    const getDayRating = async (id) => {
        setLoading(true)
        
        try {
            const response = await fetch(`${backendUrl}/api/day/${id}/detail/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setDay(data)
        }
        catch(error) {
            setError("An error occured while fetching Day data: ", error)
        }
        finally {
            setLoading(false)
        }
    }

    const getActiveTrips = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user/active/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setDays(data)

        }   
        catch(error) {
            console.log("An error occured while fetching active trips")
        }
    }

    const markCompletionAndReset = async (id, itineraryId) => {
        try {
            const response = await fetch(`${backendUrl}/api/day/${id}/complete/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${String(authTokens.access)}`
                },
            })

            await getDays(itineraryId)
        }
        catch(error) {
            console.log("Error while marking day completion")
        }

    }

    const getRecentDays = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/days/completed/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setDays(data)
            setLoading(false)
        }
        catch(error) {
            setError("An error has occured while retrieving completed days data")
        }
    }

    const updateDayRating = async (id, rating) => {
        try {
            const response = await fetch(`${backendUrl}/api/day/${id}/rate/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify(rating)
            })

            const data = await response.json()
            setDay(data)
        }        
        catch (error) {
            console.log("An error occured while rating the day itinerary: ", error)
        }
    }

    const markDaysAsCompleted = async (dayIds) => {
        try {
            const response = await fetch(`${backendUrl}/api/days/complete/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify({
                    "ids": dayIds
                })
            })

            getActiveTrips()            
        }
        catch(error) {
            console.log("An error occured while marking days as completed: ", error)
        }
    }

    const updateEstimatedCost = (min, max) => {
        setMinCost(min)
        setMaxCost(max)
    }

    const increaseEstimatedCost = (min, max) => {
        setMinCost(prev => prev + min)
        setMaxCost(prev => prev + max)
    }

    const decreaseEstimatedCost = (min, max) => {
        setMinCost(prev => prev - min)
        setMaxCost(prev => prev - max)
    }
    
    return {
        day,
        days,
        error,
        loading,
        getDays,
        deleteDay,
        removeDay,
        updateDays,
        getDayRating,
        markDayAsComplete,
        markDaysAsCompleted,
        markCompletionAndReset,
        updateDayColor,
        updateCalendarDays,
        updateDayRating,
        getActiveTrips,
        getRecentDays,
        minCost,
        maxCost,
        updateEstimatedCost,
        increaseEstimatedCost,
        decreaseEstimatedCost
    }
}

export default useDayManager