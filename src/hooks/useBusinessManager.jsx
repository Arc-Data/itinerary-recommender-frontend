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
    const [items, setItems] = useState([])
    
    const approveRequest = async (id) => {
        try {   
            const response = await fetch(`${backendUrl}/api/request/${id}/approve/`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

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
        console.log("In here")

        try {
            const response = await fetch(`${backendUrl}/api/location/requests`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            console.log(response)

            const data = await response.json()
            
            console.log(data)
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

    const deleteService = async (locationId, id) => {
        try {
            const response = await fetch(`${backendUrl}/api/service/${locationId}/delete/${id}/`, {
                "method": "DELETE",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
            })

            if (response.ok) {
                const newItems = items.filter(item => item.id !== id)
                setItems(newItems)
            }
        }
        catch (error) {
            console.log("An error occured while deleting service")
        }
    }

    const createService = async (id, formData) => {
        try {
            const response = await fetch(`${backendUrl}/api/service/${id}/create/`, {
                "method": "POST",
                "headers": {
                    "Authorization": `Bearer ${access}`
                },
                "body": formData,
            })

            const data = await response.json()
            const newItems = [...items, data]
            setItems(newItems)
        } 
        catch (error) {
            console.log("An error occured while creating service: ", error)    
        }
    }

    const getServices = async (id) => {
        setLoading(true)
        try {
            const response = await fetch(`${backendUrl}/api/service/${id}/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setItems(data)
        }
        catch (error) {
            setError(error)
        }
        finally {
            setLoading(false)
        }
    }

    const getFoodItems = async (id) => {
        setLoading(true)
        try {
            const response = await fetch(`${backendUrl}/api/food/${id}/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setItems(data)
        }
        catch (error) {
            setError(error)
        }
        finally {
            setLoading(false)
        }
    }

    const getAllApprovalRequests = async () => {
        setLoading(true)
        console.log("GET requests")

        try {
            const response = await fetch(`${backendUrl}/api/requests/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            console.log(response)
            const data = await response.json()
            console.log(data)
            setRequests(data)
        }
        catch (error) {
            setError("An error occured while retrieving approval requests")
        } 
        finally {
            setLoading(false)
        }
    }

    const createFood = async (id, formData) => {
        try {
            const response = await fetch(`${backendUrl}/api/food/${id}/create/`, {
                "method": "POST",
                "headers": {
                    "Authorization":`Bearer ${access}`
                },
                "body": formData
            })
            const data = await response.json()
            
            const newItems = [...items, data]
            setItems(newItems)
        }   
        catch (error) {
            console.log(error)
        }
    }

    const deleteFood = async (locationId, id) => {
        try {
            const response = await fetch(`${backendUrl}/api/food/${locationId}/delete/${id}/`, {
                "method": "DELETE",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            if (response.ok) {
                const newItems = items.filter(item => item.id !== id)
                setItems(newItems)
            }
        } catch (error) {
            console.log("An error occured while deleting food item: ", error)
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

    const getFeeTypes = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/location/${id}/fees/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })
            const data = await response.json()
            setItems(data)
        }
        catch(error) {
            console.log(error)
        }
    }

    const editFee = async (id, data) => {
        try {
            const response = await fetch(`${backendUrl}/api/fee/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify(data)
            })

            console.log(response)
        }
        catch(error) {
            console.log("An error occured while editing fee: ", error)
        }
    }

    const editFeeType = async (feeId, formData) => {
        console.log(feeId, formData)
        try {
            const response = await fetch(`${backendUrl}/api/fee/${feeId}/edit/`, {
                "method": "PATCH",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                "body": JSON.stringify(formData)
            })

            console.log(response)
            const data = await response.json()

        }
        catch (error) {
            console.log(error)
        }
    }

    const getFeeDetails = async (feeId) => {
        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/api/fee/${feeId}/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            const data = await response.json()
            setItems(data)
        } 
        catch (error) {
            console.log("An error occured while fetching fee types ", error)
        }
        finally {
            setLoading(false)
        }
    }

    const createFeeType = async (id, formData) => {
        try {
            const response = await fetch(`${backendUrl}/api/location/${id}/fee/create/`, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                "body": JSON.stringify(formData)
            })

            const data = await response.json()
            const newItems = [...items, data]
            setItems(newItems)
        }
        catch (error) {
            console.log(error)
        }
    }

    return {
        items,
        loading,
        error,
        location,
        locations,
        requests, 
        createFood,
        ownedLocations,
        approveRequest,
        getApprovalRequests,
        getAllApprovalRequests,
        editBusiness,
        getBusinessDetail,
        getOwnedBusinesses,
        getFoodItems,
        deleteFood,
        createService,
        deleteService,
        getServices,
        getFeeTypes,
        editFeeType,
        getFeeDetails,
        editFee,
        createFeeType,
    }
}

export default useBusinessManager