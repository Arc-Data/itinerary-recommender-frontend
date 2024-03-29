import { useState } from "react"

const useRecommendationsManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const access = String(authTokens.access)

    const [ recommendations, setRecommendations ] = useState([])
    const [ foodRecommendations, setFoodRecommendations ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ status, setStatus ] = useState("")

    const applyRecommendation = async (id, day_id) => {
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/recommendations/${id}/apply/`, {
                'method' : 'POST',
                'headers': {
                    "Content-Type" : "application/json",
                },
                'body': JSON.stringify({
                    'day_id': day_id
                })
            })

            const data = await response.json();
            return data

        }
        catch(error) {
            console.log("An error occured: ", error)
        }
        finally {
            setLoading(false)
            setStatus("")
        }
    }

    const getRecommendedFoodPlaces = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/recommendations/foodplace/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setRecommendations(data)
        }
        catch (error) {
            console.log("an error occured while fetching recommended food places: ", error)
        } 
    }

    const fetchNearbyRecommendations = async (dayId) => {
        setStatus("Loading Recommendations")
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/recommendations/${dayId}/nearby/spot/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
            })
            const data = await response.json()
            setRecommendations(data)
        }
        catch (error) {
            console.log("An error occured: ", error)
        }
        finally {
            setLoading(false)
        }
    }

    const fetchPreferenceRecommendations = async () => {
        setStatus("Loading Recommendation")
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/recommendations/homepage/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setRecommendations(data.recommendations)
        }
        catch (error) {
            console.log("An error occured while fetching recommendations based on preferences: ", error)
        }   
        finally {
            setLoading(false)
        }
    }

    const fetchNearbyFoodRecommendations = async (dayId) => {
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/recommendations/${dayId}/nearby/foodplace/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
            })  

            const data = await response.json()
            setRecommendations(data)
        }
        catch(error) {
            console.log("An error occured while fetching foodplace data: ", error)
        }
        finally {
            setLoading(false)
        }
    }

    const fetchRecommendations = async (budget) => {
        setStatus("Loading Recommendations")
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/recommendations/content/`, {
                'method' : 'POST',
                'headers': {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${access}`, 
                },
                'body': JSON.stringify(budget)
            })

            const data = await response.json()
            setRecommendations(data.recommendations)
        }
        catch(error) {
            console.log("An error occured")
        }
        finally {
            setLoading(false)
            setStatus("")
        }
    }

    
    return {
        loading,
        status,
        recommendations,
        foodRecommendations,
        applyRecommendation,
        fetchRecommendations,
        fetchPreferenceRecommendations,
        getRecommendedFoodPlaces,
        fetchNearbyRecommendations,
        fetchNearbyFoodRecommendations,
    }
}

export default useRecommendationsManager