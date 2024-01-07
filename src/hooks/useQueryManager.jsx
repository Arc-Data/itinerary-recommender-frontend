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
            setStatus("Error")
        }
        
    }
    
    return {
        contactForm,
        contactForms,
        status,
        getContactForms,
    }
}

export default useQueryManager