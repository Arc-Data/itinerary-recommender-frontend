import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"
import { Link, NavLink } from "react-router-dom"

const FeeRow = ({ fee, deleteFeeType }) => {
    const { authTokens } = useContext(AuthContext)
    const { editFeeType } = useBusinessManager(authTokens)
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
        await editFeeType(fee.id, data)     
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
                    onChange={handleInputChange}
                    className="business-input"
                /> 
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
                    onChange={handleInputChange}
                    />
                : 
                fee.is_required ? "Required" : "Not Required"
                }
            </td>
            <td>
                <ul className="audience-type-list">
                {fee.audience_types.map(type => {
                    return(
                        <li className="audience-type-item" key={type.id}>{type.name} - PHP {type.price}</li>   
                    )
                })}
                </ul>
                <NavLink to={`${fee.id}/edit`} className="edit-audience-type-btn">
                    Edit
                </NavLink>
            </td>
            {editState ? 
            <td>
                <button onClick={toggleEditState} className="fees-cancel-btn">Cancel</button>
                <button onClick={handleSaveFee} className="fees-save-btn">Save</button>
            </td>
            :
            <td>
                <button onClick={toggleEditState} className="table-action-btn edit-fee-btn">
                    <FontAwesomeIcon icon={faPencil} />
                </button>
                <button onClick={() => deleteFeeType(fee.id)} className="table-action-btn delete-fee-btn">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
            }
        </tr>
    )
}

export default FeeRow