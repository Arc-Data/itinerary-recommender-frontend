import { useState } from "react"

const useRecommendationsManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const access = String(authTokens.access)

    const [ recommendations, setRecommendations ] = useState()
    const [ loading, setLoading ] = useState(true)
    const [ status, setStatus ] = useState("")

    const applyRecommendation = async (id, day_id) => {
        setStatus("Applying Recommendations...")
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

    const fetchRecommendations = async () => {
        setStatus("Loading Recommendations")
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/recommendations/content/`, {
                'method' : 'GET',
                'headers': {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${access}`, 
                }
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
        applyRecommendation,
        fetchRecommendations,
    }
}

export default useRecommendationsManager