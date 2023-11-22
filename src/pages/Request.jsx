import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"
import dayjs from "dayjs"
import RequestModal from "../components/RequestModal"
import eye from "/images/lets-icons_view-alt-fill.svg";

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
                <td><button className="view-details" onClick={() => toggleDetails(request)}><img src={eye} /></button></td>
            </tr>
        )   
    })

    useEffect(() => {
        getAllApprovalRequests()
    }, [])

    return (
        <div>
            <h1 className="header-title">Requests</h1>
            <div className="">
                <table>
                    <thead className="table--th">
                        <td>Name</td>
                        <td>Location Type</td>
                        <td>Owner</td>
                        <td>Date Filled</td>
                        <td>Status</td>
                        <td>Action</td>
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