import Modal from "../components/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const QueryDetails = ({ onClose, form, toggleAdminResponded }) => {
    console.log(form);

    const statusColor = form.admin_responded ? "#00ab41" : "#FFD228";

    const handleDoneClick = () => {
        toggleAdminResponded(form.id);
        onClose(); // Close the modal
    };

    return (
        <Modal onClose={onClose}>
            <div>
                <div className="flex">
                    <h1 className="heading2 mt-15px mr20px">Contact Details</h1>
                    <button className="status" style={{ backgroundColor: statusColor }}>
                        <p>{form.admin_responded ? "Responded" : "Pending"}</p>
                    </button>
                </div>
                <p>{form.user.firstname} {form.user.lastname}</p>
                <div><FontAwesomeIcon icon={faEnvelope} className="mr5px"/><span>{form.user.email}</span></div>
                <div><FontAwesomeIcon icon={faPhone} className="mr5px mt-3px"/><span>{form.user.contact_number}</span></div>
                <div className="query--message mt-20px">
                    <p className="heading3">Question</p>
                    <p className="mb10px">{form.query}</p>
                </div>
                <button className="approve--BTN mt-22px" onClick={handleDoneClick}>
                    <FontAwesomeIcon icon={faCheckCircle}/> Done
                </button>
            </div>
        </Modal>
    );
}

export default QueryDetails;
