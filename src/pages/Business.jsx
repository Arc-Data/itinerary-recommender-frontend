import { Link } from "react-router-dom"
import useBusinessManager from "../hooks/useBusinessManager"
import { useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import dayjs from "dayjs"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	FaTrash,
	FaPencilAlt,
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
            <div className="business--owned ">
                <img 
                src={`${backendUrl}${owned.primary_image}`} 
                className="business--image" 
                alt="Location" 
                />
                <div className="business--title-address">
                    <p className="business--name bold2">{owned.name}</p>
                    <p>{owned.address}</p>
                    <div className="mt-20px d-flexCenter flexWrap">
                        <Link to={`/location/${owned.id}`} >
                            <div className="d-flexCenter mr10px">
                                <img src={eye}  
                                alt="View"/>
                                <p className="view--manage">View</p>
                            </div>
                        </Link>
                        <Link to="manage" > {/* NEED DIN NG ID */}
                            <div className="d-flexCenter">
                                <img src={settings}  
                                alt="Manage"/>
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
                <td>{request.details.name}</td>
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
                <td><button disabled className="request--status">For Approval</button></td>
                <td>
                    <div className="d-flexCenter">
                        <Link to="edit"> {/*NAKA LINK LANG TO SA WALANG KWENTANG PAGE KASI WALA PA FUNCTIONALITY*/}
                            <button 
                                className="business--edit mr10px btn--icon"> {/*FUNCTIONALITY HERE (EDIT) */}
                                <FaPencilAlt />
                            </button>
                        </Link>
                        <button 
                            className="business--delete btn--icon"> {/*FUNCTIONALITY HERE (DELETE) */}
                            <faTrash />
                        </button>
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
                <p className="business--title bold2">Business</p>
            </div>
            <div className="business--body d-flexCenter flexWrap">
                {displayBusiness}
            </div>
            <div className="requests--table">  
                <div className="flex-between">
                    <p className="requests--title bold2">Application Requests</p>
                    <Link to="add">
                        <button className="business--btn">
                        <FontAwesomeIcon className='btn-icons' icon={faPlus} />
                            <p>Add Business</p>
                        </button>
                    </Link>
                </div>
                <table>
                    <thead className="table--th">
                        <td>Name</td>
                        <td>Location Type</td>
                        <td>Date Filled</td>
                        <td>Status</td>
                        <td>Action</td>
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