import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"


const Services = () => {
    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { items:foods, loading, error, getFoodItems } = useBusinessManager(authTokens) 

    useEffect(() => {
        getFoodItems(id)
    }, [])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <div>{error}</div>
        )
    }

    console.log(foods)

    return (
        <div>Services</div>
    )
}

export default Services