import { useContext, useEffect } from "react"
import { useParams } from "react-router"
import useBusinessManager from "../hooks/useBusinessManager"
import AuthContext from "../context/AuthContext"

const BusinessOverview = () => {
    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { location, loading, error, getBusinessDetail } = useBusinessManager(authTokens)

    useEffect(() => {
        getBusinessDetail(id)
    }, [])

    if (loading) {
        return (
            <div>Loading..</div>
        )
    }

    return (
        <div>
            <p>{location.name}</p>
            <p>{location.address}</p>
        </div>
    )
}

export default BusinessOverview