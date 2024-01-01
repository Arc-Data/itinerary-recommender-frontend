import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import useBusinessManager from "../hooks/useBusinessManager"
import AuthContext from "../context/AuthContext"
import { useParams } from "react-router-dom"


const AudienceRow = ({ type }) => {
    const { feeId } = useParams()
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
        type.name = data.name
        type.price = data.price
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
                <button onClick={toggleEditState}>Cancel</button>
                <button onClick={handleSaveAudienceType}>Save</button>
            </td>
            :
            <td>
                <button onClick={toggleEditState}>
                    Edit <FontAwesomeIcon icon={faPencil} />
                </button>
                <button>
                    Delete <FontAwesomeIcon icon={faTrash} /> 
                </button>
            </td>
            }
        </tr>
    )
}

export default AudienceRow