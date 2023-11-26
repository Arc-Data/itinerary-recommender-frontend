import { useState } from "react"
import { useParams } from "react-router-dom"

const useBusinessManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const access = String(authTokens.access)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [location, setLocation] = useState()
    const [locations, setLocations] = useState([])
    const [requests, setRequests] = useState([])
    const [ownedLocations, setOwnedLocations] = useState([])
    
    const approveRequest = async (id) => {
        try {   
            const response = await fetch(`${backendUrl}/api/request/${id}/approve/`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            console.log(response)

            if (response.ok) {
                const new_requests = requests.filter(request => request.id !== id)
                setRequests(new_requests)
            }
        }
        catch (error){
            console.log("An error occured")
        }
    }

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

    const getBusinessDetail = async (id) => {
        setLoading(true) 
        
        try {
            const response = await fetch(`${backendUrl}/api/user/business/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`,
                },
            });

            if (response.status === 404) {
                throw new Error("Error fetching data");
            }
            
            const data = await response.json();
            setLocation(data.business)
        }
        catch (error) {
            console.log("Error while fetching business data : ", error)
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

    const editBusiness = async (id, data) => {
        try {
            const response = await fetch(`${backendUrl}/api/user/business/${id}/edit/`, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                "body": JSON.stringify(data)
            })

            console.log(response)
        }
        catch(error) {
            console.log("An error occured while editing business")
        }
    }

    return {
        loading,
        error,
        location,
        locations,
        requests, 
        ownedLocations,
        approveRequest,
        getApprovalRequests,
        getAllApprovalRequests,
        editBusiness,
        getBusinessDetail,
        getOwnedBusinesses,
    }
}

export default useBusinessManager