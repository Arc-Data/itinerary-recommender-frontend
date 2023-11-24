import { useParams } from "react-router-dom"
import Modal from "./Modal"

const CompletionModal = ({onClose, dayId, markCompletionAndReset}) => {
    const { id } = useParams()
    
    const handleSubmit = () => {
        markCompletionAndReset(dayId, id)
    }
    
    return (
        <Modal onClose={onClose}>
            <div className="confirm-delete">
                <p className="confirm-delete--title">Mark day as visited?</p>
                <p 
                className="confirm-delete--subtext">
                Press "Proceed" if you have already visited the day's locations
                </p>
                <p 
                className="confirm-delete--subtext">
                You will no longer be able to edit the location details for this day
                </p>
                <div className="modal-btn--options">
                    <button 
                        className="modal-btn modal--cancel" 
                        onClick={onClose}>
                            Cancel
                    </button>
                    <button 
                        className="modal-btn modal--proceed" 
                        onClick={handleSubmit}>
                            Proceed
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default CompletionModal