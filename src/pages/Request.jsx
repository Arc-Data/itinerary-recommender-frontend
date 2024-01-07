import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"
import dayjs from "dayjs"
import RequestModal from "../modals/RequestModal"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faEye, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const Request = () => {
    const { authTokens } = useContext(AuthContext)
    const { requests, error, loading, getAllApprovalRequests, approveRequest } = useBusinessManager(authTokens) 

    const [isOpenDetails, setOpenDetails] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState()

    const toggleDetails = (request) => {
        setSelectedRequest(request)
        setOpenDetails(prev => !prev)
    }

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
                <td>{request.requester.first_name} {request.requester.last_name}</td>
                <td>{dayjs(request.timestamp).format("MMMM D YYYY")}</td>
                <td><button disabled className="request--status">For Approval</button></td>
                <td className="admin--table-action">
                    <button className="view" onClick={() => toggleDetails(request)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                </td>
            </tr>
        )   
    })

    useEffect(() => {
        console.log("Get approval requests")
        getAllApprovalRequests()
    }, [])

    return (
        <div>
            <h1 className="heading">Requests</h1>
            <div>
                <table className="business-table admin-requests">
                    <thead>
                        <td className="font">Name</td>
                        <td className="font">Location Type</td>
                        <td className="font">Owner</td>
                        <td className="font">Date Filled</td>
                        <td className="font">Status</td>
                        <td className="font">Action</td>
                    </thead>
                    <tbody>
                        {displayRequests}
                    </tbody>
                </table>
            </div>
            {isOpenDetails &&
            <RequestModal onClose={toggleDetails} request={selectedRequest} approveRequest={approveRequest}/>
            }
        </div>
    )
}

export default Request