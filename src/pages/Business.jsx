import { Link } from "react-router-dom"
import useBusinessManager from "../hooks/useBusinessManager"
import { useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import dayjs from "dayjs"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	FaEdit
	} from "react-icons/fa";
import eye from "/images/eye.svg";
import settings from "/images/fluent_settings-20-regular.svg";
import { faPlus } from "@fortawesome/free-solid-svg-icons"


const Business = () => {
    const { authTokens } = useContext(AuthContext)
    const { requests, loading, error, getApprovalRequests, getOwnedBusinesses, ownedLocations} = useBusinessManager(authTokens)
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    
    const displayBusiness = ownedLocations && ownedLocations.map(owned => {
        return (
            <div className="business--owned" key={owned.id}>
                <div className="info">
                    <p className="title">{owned.name}</p>
                    <p className="address">{owned.address}</p>
                    <div className="buttons">
                        <Link to={`/location/${owned.id}`} >
                            <p className="view--manage">View</p>
                        </Link>
                        <Link to={`/profile/business/${owned.id}`} >
                            <p className="view--manage">Manage</p>
                        </Link>
                    </div>
                </div>
            </div>
        )   
    })


    const displayRequests = requests && requests.map(request => {
        return (
            <tr key={request.id}>
                <td>
                    {request.details.name}
                </td>
                <td>
                    {request.details.location_type === '1' ? 
                    "Tourist Spot"
                    :
                    request.details.location_type === '2' ?
                    "Food Place"
                    :
                    "Accomodation"
                    }
                </td>
                <td>{dayjs(request.timestamp).format("MMMM D YYYY")}</td>
                <td>
                    {
                    request.status === "1" ? 
                    <button disabled className="request--status pending">For Approval</button>
                    :
                    request.status === "2" ? 
                    <button disabled className="request--status approval">Approved</button>
                    :
                    <button disabled className="request--status reject">Rejected</button>
                    }
                </td>
            </tr>
        )   
    })

    useEffect(() => {
        const fetchData = async () => {
            await getApprovalRequests()
            await getOwnedBusinesses()
        }
        fetchData()
    }, [])

    return (
        <div className="profile--main-content">
            <div className="business--header">
                <p className="business--title heading">Business</p>
            </div>
            <div className="business--body">
                {displayBusiness}
            </div>
            <div className="requests--table">  
                <div className="flex-between">
                    <p className="requests--title heading2">Application Requests</p>
                    <Link to="add">
                        <button className="business--btn">
                        <FontAwesomeIcon className='btn-icons' icon={faPlus} />
                            <p>Add Business</p>
                        </button>
                    </Link>
                </div>
                <table className='business-requests-table'>
                    <thead>
                        <tr>
                            <th>Business name</th>
                            <th>Type</th>
                            <th>Date filed</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRequests}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Business