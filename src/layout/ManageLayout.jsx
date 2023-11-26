import { Outlet, useParams } from "react-router"
import { Link } from "react-router-dom"

const ManageLayout = () => {
    const { id } = useParams() 

    return (
        <div>
            <div>
                <Link to="">Overview</Link>
                <Link to="edit">Edit</Link>
                <Link to="services">Services</Link>
            </div>
            <Outlet/>
        </div>
    )
}

export default ManageLayout