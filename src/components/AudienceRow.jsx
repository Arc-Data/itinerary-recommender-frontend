import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import useBusinessManager from "../hooks/useBusinessManager"
import AuthContext from "../context/AuthContext"
import { useParams } from "react-router-dom"


const AudienceRow = ({ type, deleteAudienceType }) => {
    const [ editState, setEditState ] = useState(false)
    const { authTokens } = useContext(AuthContext)
    const { editAudienceType } = useBusinessManager(authTokens)
    const [ data, setData ] = useState({
        'name': type.name,
        'price': type.price
    })

    const toggleEditState = () => {
        setEditState(prev => !prev)
    }

    const handleSaveAudienceType = () => {
        editAudienceType(type.id, data)
        toggleEditState()
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target 
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <tr>
            <td>
                {
                editState ? 
                <input 
                    type="text" 
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={handleInputChange}/> 
                :
                type.name
                }</td>
            <td>
                {editState ?
                <input 
                    type="number" 
                    name="price" 
                    id="price" 
                    value={data.price}
                    onChange={handleInputChange}/>
                :
                `PHP ${type.price}`
                }
            </td>
            {editState ? 
            <td>
                <button onClick={toggleEditState} className="fees-cancel-btn">Cancel</button>
                <button onClick={handleSaveAudienceType} className="fees-save-btn">Save</button>
            </td>
            :
            <td>
                <button onClick={toggleEditState} className="table-action-btn edit-fee-btn">
                    <FontAwesomeIcon icon={faPencil} />
                </button>
                <button onClick={() => deleteAudienceType(type.id)} className="table-action-btn delete-fee-btn">
                    <FontAwesomeIcon icon={faTrash} /> 
                </button>
            </td>
            }
        </tr>
    )
}

export default AudienceRow