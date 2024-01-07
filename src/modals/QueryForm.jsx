import { useContext, useState } from "react"
import Modal from "../components/Modal"
import useQueryManager from "../hooks/useQueryManager"
import AuthContext from "../context/AuthContext"

const QueryForm = ({ onClose }) => {
    const { authTokens } = useContext(AuthContext)
    const { createQuery } = useQueryManager(authTokens)
    const [ description, setDescription ] = useState("")
    
    const handleInputChange = (e) => {
        setDescription(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (description.length === 0) {
            alert("Can't leave the form empty!");
            return;
        }
    
        createQuery(description);
        alert("Query submitted successfully!"); 
        onClose(); 
    }

    return (
        <Modal onClose={onClose} >
            <form method="POST" onSubmit={handleSubmit}>
                <div className="modal--query">
                    <label htmlFor="description">How can we assist you with your upcoming trip?</label>
                    <textarea
                        name="description"
                        id="description"
                        value={description}
                        onChange={handleInputChange}
                        className="business-input description query"
                    />
                </div>
                <button className="add--business">Submit</button>
            </form>
        </Modal>
    )
}

export default QueryForm