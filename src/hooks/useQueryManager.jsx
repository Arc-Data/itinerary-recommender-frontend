import { useState } from "react"

const useQueryManager = (authTokens) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const access = String(authTokens.access)
    const [ contactForm, setContactForm ] = useState()
    const [ contactForms, setContactForms ] = useState([])
    const [ status, setStatus ] = useState("Loading")

    const getContactForms = async () => {
        setStatus("Loading")
        try {
            const response = await fetch(`${backendUrl}/api/contact/list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            console.log(response)
            const data = await response.json()
            console.log(data)
            setContactForms(data)
            setStatus("Done")
        }
        catch (error) {
            console.log("An error occured while retrieving queries: ", error)
            setStatus("Error")
        }
        
    }

    const toggleAdminResponded = async (id) => {
        console.log(id)
        try {
            const response = await fetch(`${backendUrl}/api/contact/${id}/toggle-response/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })

            console.log(response)
            if (response.ok) {
                const updatedForms = contactForms.map(form => {
                    if (form.id === id) {
                        return { ...form, admin_responded: !form.admin_responded}
                    }
                    return form
                })

                setContactForms(updatedForms)
            }
        }
        catch (error) {
            console.log("An error occured while toggling admin respond", error)
        }
    }
    
    return {
        contactForm,
        contactForms,
        status,
        getContactForms,
        toggleAdminResponded,
    }
}

export default useQueryManager