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
    const [item, setItem] = useState()
    
    const approveRequest = async (id, status) => {
        try {   
            const response = await fetch(`${backendUrl}/api/request/${id}/approve/`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify(status)
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
            console.log("An error occured while getting owned businesses", error)
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

    const editBusiness = async (id, data, image) => {
        const formData = new FormData()

        if (image && image instanceof File) {
            formData.append('image', image)
        } 

        formData.append('data', JSON.stringify(data))

        try {
            const response = await fetch(`${backendUrl}/api/user/business/${id}/edit/`, {
                "method": "POST",
                "headers": {
                    "Authorization": `Bearer ${access}`
                },
                "body": formData
            })
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

    const addFeeType = async (id, formData) => {
        try {
            const response = await fetch(`${backendUrl}/api/location/${id}/fee/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            const newData = [...items, data]
            setItems(newData)
        }
        catch(error) {
            console.log("Error adding fee type: ", error)
        }
    } 

    const editFeeType = async (feeId, formData) => {
        try {
            const response = await fetch(`${backendUrl}/api/fee/${feeId}/edit/`, {
                "method": "PATCH",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                "body": JSON.stringify(formData)
            })

            const data = await response.json()

        }
        catch (error) {
            console.log(error)
        }
    }

    const deleteFeeType = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/fee/${id}/delete/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            if (response.ok) {
                const updatedItems = items.filter(i => id !== i.id)
                setItems(updatedItems)
            }
        }
        catch(error) {
            console.log("An error occured while deleting fee type: ", error)
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
            setItem(data)
            setItems(data.audience_types)
        } 
        catch (error) {
            console.log("An error occured while fetching fee types ", error)
            setError(error)
        }
        finally {
            setLoading(false)
        }
    }

    const editAudienceType = async (id, formData) => {
        try {
            const response = await fetch(`${backendUrl}/api/audience/${id}/edit/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify(formData)
            })
        }
        catch (error) {
            console.log("Error while editing audience fee type :", error)
        }
    }

    const deleteAudienceType = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/audience/${id}/delete/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            if (response.ok) {
                const updatedItems = items.filter(i => i.id != id)
                setItems(updatedItems)
            }
        }
        catch(error) {
            console.log("An error occured while deleting audience type: ", error)
        }
    }

    const addAudienceType = async (id, formData) => {
        try {   
            const response = await fetch(`${backendUrl}/api/fee/${id}/audience/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify(formData)
            })
            
            if (response.ok) {
                const data = await response.json()
                const updatedItems = [...items, data]
                setItems(updatedItems)
            }
        }
        catch (error) {
            console.log("An error occureed while adding audience type: ", error)
        }
    }

    const getTag = () => {

    }

    const removeSpotActivity = async (location_id, activity) => {
        try {
            const response = await fetch(`${backendUrl}/api/business/${location_id}/activity/remove/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({'activity': activity})
            })
        }
        catch (error) {
            console.log("An error occured while removing activity : ", activity)
        }   
    }

    const getOrCreateSpotActivity = async (location_id, activity) => {
        try {
            const response = await fetch(`${backendUrl}/api/business/${location_id}/activity/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({'activity': activity})
            })
        }
        catch (error) {
            console.log("An error occured while creating activity", error)
        }
    }

    return {
        item,
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
        addFeeType,
        editFeeType,
        deleteFeeType,
        getFeeTypes,
        getFeeDetails,
        addAudienceType,
        editAudienceType,
        deleteAudienceType,
        getOrCreateSpotActivity,
        removeSpotActivity,
    }
}

export default useBusinessManager