import { useContext } from "react"
import Modal from "../components/Modal"
import useDayManager from "../hooks/useDayManager"
import AuthContext from "../context/AuthContext"
import approve from "/images/lets-icons_check-ring-light.svg";
import reject from "/images/iconoir_xbox-x.svg";

const RequestModal = ({onClose, request, approveRequest}) => {
    const { authTokens } = useContext(AuthContext)
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const handleApprove = async () => {
        approveRequest(request.id)
        onClose()
    }

    console.log('REQUEST: ', request)

    return (
        <Modal onClose={onClose}>
            <div className="approve--modal">
                <span>ID: {request.details.id}</span>
                <h1 className="business--name heading">{request.details.name}</h1>
                <div className="approve--modal-container">
                    <div className="approve--modal-content">
                        <div className="form-group">
                            <label>Owner Name:</label>
                            <div className="form-group-result">
                                {request.requester.first_name} {request.requester.last_name}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <div className="form-group-result">
                                {request.details.address}
                            </div>
                        </div>
                        <div className="form-column-group">
                            <div className="form-group">
                                <label>Latitude:</label>
                                <div className="form-group-result">
                                    {request.details.latitude}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Longitude:</label>
                                <div className="form-group-result">
                                    {request.details.longitude}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone Number:</label>
                            <div className="form-group-result">
                                {request.details.contact}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <div className="form-group-result">
                                {request.requester.email}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Website:</label>
                            <div className="form-group-result">
                                {request.details.website}
                            </div>
                        </div>
                    </div>
                    <img src={`${backendUrl}${request.image}`} alt="" className="approve--modal-image" height={250}/>
                </div>
            </div>
            <div className="d-flexCenter">
                <button 
                    className="approve--BTN BTN14" 
                    onClick={handleApprove}>
                    <img src={approve}/> 
                    <span>Approve</span>
                </button>
                {/* <button 
                    className="reject--BTN BTN14">
                    <img src={reject}/>  
                    <span>Reject</span>
                </button> */}
            </div>
        </Modal>
    )
}

export default RequestModal