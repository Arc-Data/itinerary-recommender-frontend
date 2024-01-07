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
        e.preventDefault()

        if (description.length === 0) {
            alert("Cant leave form empty!")
            return
        }

        createQuery(description)
    }

    return (
        <Modal onClose={onClose}>
            <form method="POST" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="description">Query</label>
                    <textarea
                        name="description"
                        id="description"
                        value={description}
                        onChange={handleInputChange}
                    />
                </div>
                <button>Submit</button>
            </form>
        </Modal>
    )
}

export default QueryForm