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
                <td>
                    {
                    request.status === "1" ? 
                    <button disabled className="request--status pending" >For Approval</button>
                    :
                    request.status === "2" ? 
                    <button disabled className="request--status approval">Approved</button>
                    :
                    <button disabled className="request--status reject">Rejected</button>
                    }
                </td>
                <td className="admin--table-action">
                    <button className="view" onClick={() => toggleDetails(request)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                </td>
            </tr>
        )   
    })

    useEffect(() => {
        getAllApprovalRequests()
    }, [])

    return (
        <div>
            <h1 className="heading">Requests</h1>
            <div>
                <table className="business-table admin-requests">
                    <thead>
                        <tr>
                            <th className="font">Name</th>
                            <th className="font">Location Type</th>
                            <th className="font">Owner</th>
                            <th className="font">Date Filled</th>
                            <th className="font">Status</th>
                            <th className="font">Action</th>
                        </tr>
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