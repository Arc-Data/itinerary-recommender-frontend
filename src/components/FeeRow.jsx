import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"

const FeeRow = ({ fee, deleteFeeType }) => {
    const { authTokens } = useContext(AuthContext)
    const { editFee } = useBusinessManager(authTokens)
    const [ editState, setEditState ] = useState(false)
    const [ data, setData ] = useState({
        'name': fee.name,
        'is_required': fee.is_required
    })

    const toggleEditState = () => {
        setEditState(prev => !prev)
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSaveFee = async () => {
        await editFee(fee.id, data)     
        fee.name = data.name
        fee.is_required = data.is_required    
        toggleEditState()
    }

    return (
        <tr>
            <td>
                {editState ? 
                <input 
                    type="text" 
                    name="name" 
                    value={data.name}
                    onChange={handleInputChange}/> 
                :
                fee.name
                }    
                
            </td>
            <td>
                {editState ? 
                <input 
                    type="checkbox" 
                    name="is_required" 
                    id="is_required" 
                    checked={data.is_required}
                    onChange={handleInputChange}/>
                : 
                fee.is_required ? "Required" : "Not Required"
                }
            </td>
            <td>
                <ul>
                {fee.audience_types.map(type => {
                    return(
                        <li key={type.id}>{type.name} - PHP {type.price}</li>   
                    )
                })}
                </ul>
                <div>Edit Audience Types</div>
            </td>
            {editState ? 
            <td>
                <button onClick={toggleEditState}>Cancel</button>
                <button onClick={handleSaveFee}>Save</button>
            </td>
            :
            <td>
                <button onClick={toggleEditState}>
                    Edit <FontAwesomeIcon icon={faPencil} />
                </button>
                <button onClick={() => deleteFeeType(fee.id)}>
                    Delete <FontAwesomeIcon icon={faTrash} /> 
                </button>
            </td>
            }
        </tr>
    )
}

export default FeeRow