import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"

const Services = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { items, location, loading, error, getServices, getBusinessDetail} = useBusinessManager(authTokens)
    const [ imageFile, setImageFile ] = useState() 

    useEffect(() => {
        getBusinessDetail(id)
    }, [])

    useEffect(() => {
        getServices(id)
    }, [location])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImageFile(file);
    }

    const displayServices = items && items.map(item => {
        return (
            <tr key={item.id}>
                <td>Temp data</td>
            </tr>
        )
    })

    

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <div>An error occured: {error}</div>
        )
    }

    return (
        <div>
            <p>Services</p>
        </div>
    )
}

export default Services