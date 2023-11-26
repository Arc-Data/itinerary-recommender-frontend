import { useContext, useEffect } from "react"
import { Outlet, useParams } from "react-router"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"

const ManageLayout = () => {
    return (
        <div>
            <div className="business--nav">
                <Link to="">Overview</Link>
                <Link to="edit">Edit</Link>
                <Link to="services">Services</Link>
            </div>
            <Outlet/>
        </div>
    )
}

export default ManageLayout