import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"


const AudienceRow = ({ type }) => {
    const [ editState, setEditState ] = useState(false)
    const [ data, setData ] = useState({
        'name': type.name,
        'price': type.price
    })

    const toggleEditState = () => {
        setEditState(prev => !prev)
    }

    const handleSaveAudienceType = () => {
        toggleEditState()
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
                    value={data.name}/> 
                :
                type.name
                }</td>
            <td>
                {editState ?
                <input 
                    type="number" 
                    name="price" 
                    id="price" 
                    value={data.price}/>
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