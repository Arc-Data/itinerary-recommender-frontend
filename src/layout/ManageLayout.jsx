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
            <div className="add-location-modal--tabs">
                <div>
                    <NavLink to="" exact activeClassName="active">
                        Overview
                    </NavLink>
                </div>
                <div>
                    <NavLink to="edit" activeClassName="active">
                        Edit
                    </NavLink>
                </div>
                {location.location_type === "1" && 
                <div>
                    <NavLink to="fees" activeClassName="active">
                        Fee
                    </NavLink>
                </div>
                }
                {location.location_type === "2" && 
                <div>
                    <NavLink to="menu" activeClassName="active">
                        Menu
                    </NavLink>
                </div>
                }
                {location.location_type === "3" && 
                <div>
                    <NavLink to="services" activeClassName="active">
                        Services
                    </NavLink>
                </div>
                }
            </div>
            <Outlet/>
        </div>
    )
}

export default ManageLayout