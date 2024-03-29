const useItemLocationManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const access = String(authTokens.access)


    const addItem = async (itemId, dayId, order) => {
        try {
            const requestBody = {
                'location': itemId,
                'day': dayId,
                'order': order
            }

            const response = await fetch(`${backendUrl}/api/day-item/`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                return
            }

            const item = await response.json()
            return item
        }
        catch (error) {
            console.log("Error. " + error)
        }
    }

    const deleteItem = async (id) => {

        try {
            await fetch(`${backendUrl}/api/day-item/${id}/delete/`, {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access}`,
                }
            })
        } 
        catch (error) {
            console.log("Error while deleting itinerary item: ", error)
        }
    }

    const updateItemOrdering = async (locations, dayId) => {
        try {
            const response = await fetch(`${backendUrl}/api/update-ordering/${dayId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify({ items:locations }),
            })
    
            const data = await response.json()
            return data
        }
        catch (error) {
            console.log(error)
        }
    }
    
    return {
        addItem,
        deleteItem,
        updateItemOrdering,
    }
}

export default useItemLocationManager