import { Link } from "react-router-dom"
import useBusinessManager from "../hooks/useBusinessManager"
import { useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import dayjs from "dayjs"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	FaEdit,
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
                <img 
                src={`${backendUrl}${owned.primary_image}`} 
                className="business--image" 
                alt="Location" 
                />
                <div>
                    <p className="business--name heading4">{owned.name}</p>
                    <h1 className="owner--address">{owned.address}</h1>
                    <div className="owner--container">
                        <Link to={`/location/${owned.id}`} >
                            <div className="d-flexCenter margin">
                                <img src={eye}/>
                                <p className="view--manage">View</p>
                            </div>
                        </Link>
                        <Link to={`/profile/business/manage/${owned.id}`} >
                            <div className="d-flexCenter margin">
                                <img src={settings}/>
                                <p className="view--manage">Manage</p>
                            </div> 
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
                    <button disabled className="request--status">
                        For Approval
                    </button>
                </td>
                <td>
                    <div className="view--manage1">
                        <div className="mr5px"><FaEdit/></div>
                        <p className="view--manage">View</p>
                    </div>
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
            <div className="business--body d-flexCenter flexWrap">
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
                <table className='business--app-table'>
                    <thead>
                        <th>Business name</th>
                        <th>Type</th>
                        <th>Date filed</th>
                        <th>Status</th>
                        <th>Action</th>
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