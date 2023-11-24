import { useParams } from "react-router-dom"
import Modal from "./Modal"

const CompletionModal = ({onClose, dayId, markCompletionAndReset}) => {
    const { id } = useParams()
    
    const handleSubmit = () => {
        markCompletionAndReset(dayId, id)
    }
    
    return (
        <Modal onClose={onClose}>
            <div>
                <p>Mark day as visited?</p>
                <p>Press "Proceed" if you have already visited the day's locations</p>
                <p>You will no longer be able to edit the location details for this day</p>
                <div>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit}>Proceed</button>
                </div>
            </div>
        </Modal>
    )
}

export default CompletionModal