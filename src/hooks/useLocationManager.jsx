import { useState } from "react"

const useLocationManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const access = String(authTokens.access)
    const [location, setLocation] = useState()
    const [result, setResult] = useState()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [recommendations, setRecommendations] = useState([])

    const createLocation = async (location) => {
        try {
            const response = await fetch(`${backendUrl}/api/location/create/`, {
                "method": "POST",
                "headers": {
                    "Authorization": `Bearer ${access}`,
                },
                "body": location
            })

            console.log(response)
            
            const data = await response.json()
            return data.id
        }
        catch (error) {
            console.log(error)
        }

    }

    const getRecommendedLocations = async (id) => {
        setLoading(true)
        try {
            const response = await fetch(
                `${backendUrl}/api/recommendations/location/${id}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                }
                );
        
                if (!response.ok) {
                    throw new Error("Error fetching recommended locations data");
                }
        
                const data = await response.json();
                setRecommendations(data.recommendations)
        }
        catch(error) {
            console.log("An error occured while fetching locations")
        }
        finally {
            setLoading(false)
        }
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setLocation(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const editLocationDetails = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/location/${id}/edit/`, {
                "method": "PATCH",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                "body": JSON.stringify(location)
            })
        }
        catch (error) {
            console.log("An error occured while editing location details")
        }
    }

    const getLocations = async (page, query="", type="") => {
        setLoading(true)
        try {
            const response = await fetch(`${backendUrl}/api/location/paginated/?query=${query}&page=${page}&type=${type}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const data = await response.json()
            setResult(data)
        }   
        catch(error) {
            setError("Something has occured")
        } finally {
            setLoading(false)
        }
        
    }

    const getLocation = async (id) => {
        setLoading(true)
        try {
            const response = await fetch(`${backendUrl}/api/location/${id}/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`
                },
            })

            if(response.status===404) {
                setError(404)
            } else if(response.status===403) {
                setError(403)
            }     

            const data = await response.json()
            setLocation(data)
            return data
        }
        catch (error) {
            console.log("An error occured")
        } finally {
            setLoading(false)
        }
    }

    const deleteLocation = async (id) => {
        try {
            await fetch(`${backendUrl}/api/location/${id}/delete/`, {
                "method": "DELETE",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                },
            })
        }
        catch (error) {
            console.log("Encountered error while deleting location : ", error)
        }
    }
    
    return {
        location,
        recommendations,
        result,
        error,
        loading,
        getLocation,
        getLocations,
        createLocation,
        handleChangeInput,
        editLocationDetails,
        deleteLocation,
        getRecommendedLocations,
    }
}

export default useLocationManager