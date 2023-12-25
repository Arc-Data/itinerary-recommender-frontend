import { useState } from "react"

const useItineraryManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const [itineraries, setItineraries] = useState([])
    const [itinerary, setItinerary] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [editedName, setEditedName] = useState("")
    const [editedExpenses, setEditedExpenses] = useState({
        'number_of_people': 1,
        'budget': '',             
    })
    const access = String(authTokens.access)

    const getLeftOverBudget = (days, day, budget) => {
        let filteredDays = days.filter(i => i.id != day.id)
        const nice = filteredDays.reduce((day, leftover) => {
            day_cost = day.itinerary_items.reduce((item, sum) => sum + item.details.max_cost, 0)
            return leftover - day_cost
        }, budget)

        // console.log(nice)
        return nice
    }

    const getItineraryById = async (id) => {
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/itinerary/${id}/`, {
                'method' : 'GET',
                'headers': {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${access}`, 
                }
            })

            if (response.status === 403) {
                setError(403)

            } else if (response.status === 404) {
                setError(404)
            
            } else if (!response.ok) {
                throw new Error("Something wrong happened")
            
            } else {
                const data = await response.json();

                setLoading(false)
                setItinerary(data)
                setEditedName(data.name)
                setEditedExpenses({
                    'number_of_people': data.number_of_people,
                    'budget': data.budget,
                })
                return data.id
            }
        }
        catch (e){
            setError("Something went wrong")
        }
        finally {
            setLoading(false)
        }
    }

    const submitEditedItineraryExpenses = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/itinerary/${id}/edit/`, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                "body": JSON.stringify(editedExpenses)
            })

            if(response.ok) {
                setItinerary(prev => ({
                    ...prev,
                    'number_of_people': editedExpenses.number_of_people,
                    'budget': editedExpenses.budget,
                }))
            }
        }
        catch(error) {
            console.log("An error occured")
        }
    }

    const getItineraries = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${backendUrl}/api/itinerary/list/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`,
                }
            })
    
            if(!response.ok) {
                throw new Error('Error retrieving itinerary information')
            }
    
            const data = await response.json()
            setItineraries(data)
        } 
        catch (error) {
            setError("An error occured while retrieving itineraries")
        } 
        finally {
            setLoading(false)
        }
    }

    const handleEditItinerary = (e) => {
        const { name, value } = e.target
        setEditedExpenses(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const deleteItinerary = async (id) => {
        await fetch(`${backendUrl}/api/itinerary/${id}/delete/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            }
        })

        const updatedItineraries = itineraries.filter(itinerary => itinerary.id !== id)
        setItineraries(updatedItineraries)
    }

    const editItineraryName = async (id) => {
        if (editedName === itinerary.name) return 

        try {
            fetch(`${backendUrl}/api/itinerary/${id}/edit/name/`, {
                method: "PATCH",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access}`,
                },
                body: JSON.stringify({
                    name: editedName
                })
            })

            const editedItinerary = {
                ...itinerary,
                "name": editedName
            }

            setItinerary(editedItinerary)
        }
        catch (error) {
            console.log("An error occured while editing name")
        }
    }

    const cancelEditName = () => {
        setEditedName(itinerary.name)
    }

    return {
        error,
        loading,
        itinerary,
        editedExpenses,
        itineraries,
        editedName,
        setEditedName,
        getItineraries,
        getItineraryById,
        handleEditItinerary,
        editItineraryName,
        deleteItinerary,
        cancelEditName,
        getLeftOverBudget,
        submitEditedItineraryExpenses,
    }
}

export default useItineraryManager