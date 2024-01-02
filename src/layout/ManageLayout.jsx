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
                <NavLink to="">
                    {({ isActive }) => (
						<p className={`tabs--link ${isActive ? 'active-link' : ''}`}>
							Overview
						</p>
					)}
                </NavLink>
                <NavLink to="edit">
                    {({ isActive }) => (
						<p className={`tabs--link ${isActive ? 'active-link' : ''}`}>
							Edit
						</p>
					)}
                </NavLink>
                {location.location_type === "1" && 
                    <NavLink to="fees">
                        {({ isActive }) => (
                            <p className={`tabs--link ${isActive ? 'active-link' : ''}`}>
                                Fees
                            </p>
                        )}
                    </NavLink>
                }
                {location.location_type === "2" && 
                    <NavLink to="menu">
                        {({ isActive }) => (
                            <p className={`tabs--link ${isActive ? 'active-link' : ''}`}>
                                Menu
                            </p>
                        )}
                    </NavLink>
                }
                {location.location_type === "3" && 
                    <NavLink to="services">
                        {({ isActive }) => (
                            <p className={`tabs--link ${isActive ? 'active-link' : ''}`}>
                                Services
                            </p>
                        )}
                    </NavLink>
                }
            </div>
            <Outlet/>
        </div>
    )
}

export default ManageLayout