import { useState } from "react"

const useBusinessManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const access = String(authTokens.access)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [location, setLocation] = useState()
    const [locations, setLocations] = useState([])
    const [requests, setRequests] = useState([])
    const [ownedLocations, setOwnedLocations] = useState([])
    
    const getOwnedBusinesses = async () => {
        setLoading(true) 

        try {
            const response = await fetch(`${backendUrl}/api/user/business/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setOwnedLocations(data)
        } 
        catch(error) {
            console.log("An error occured while getting owned businesses")
        }
        finally {
            setLoading(false)
        }
    }

    const getApprovalRequests = async () => {
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/location/requests`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setRequests(data)
        }
        catch (error) {
            setError("An error occured while retrieving approval requests")
        } 
        finally {
            setLoading(false)
        }
    }

    const getAllApprovalRequests = async () => {
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/requests/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setRequests(data)
        }
        catch (error) {
            setError("An error occured while retrieving approval requests")
        } 
        finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        location,
        locations,
        requests, 
        ownedLocations,
        getApprovalRequests,
        getAllApprovalRequests,
        getOwnedBusinesses,
    }
}

export default useBusinessManager