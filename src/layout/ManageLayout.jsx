import { useContext, useEffect } from "react"
import { Outlet, useParams } from "react-router"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"

const ManageLayout = () => {
    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { location, loading, error, getBusinessDetail } = useBusinessManager(authTokens) 

    useEffect(() => {
        getBusinessDetail(id)
    }, [id])

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
            <div className="business--nav">
                <Link to="">Overview</Link>
                <Link to="edit">Edit</Link>
                {location.location_type === "1" && 
                <Link to="fees">Fee</Link>
                }
                {location.location_type === "2" && 
                <Link to="menu">Menu</Link>
                }
                {location.location_type === "3" && 
                <Link to="services">Services</Link>
                }
            </div>
            <Outlet/>
        </div>
    )
}

export default ManageLayout