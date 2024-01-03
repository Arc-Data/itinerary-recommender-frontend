import { useContext, useEffect } from "react"
import { Outlet, useParams } from "react-router"
import { Link } from "react-router-dom"
import { NavLink } from "react-router-dom";
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
            <nav className="business--page-navigation">
                <NavLink to="." end>Overview</NavLink>
                <NavLink to="edit">Edit</NavLink>
                {location.location_type === "1" && 
                    <NavLink to="fees">Fees</NavLink>
                }
                {location.location_type === "2" && 
                    <NavLink to="menu">Menu</NavLink>
                }
                {location.location_type === "3" && 
                    <NavLink to="services">Services</NavLink>
                }
            </nav>
            <Outlet/>
        </div>
    )
}

export default ManageLayout