import { useContext } from "react"
import Modal from "../components/Modal"
import useDayManager from "../hooks/useDayManager"
import AuthContext from "../context/AuthContext"

const RequestModal = ({onClose, request, approveRequest}) => {
    const { authTokens } = useContext(AuthContext)

    const handleApprove = async () => {
        approveRequest(request.id)
        onClose()
    }

    return (
        <Modal onClose={onClose}>
            <button onClick={handleApprove}>Approve</button>
            <button>Reject</button>
            <button>Cancel</button>
        </Modal>
    )
}

export default RequestModal