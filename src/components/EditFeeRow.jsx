import { useState } from "react"

const EditFeeRow = ({fee, editFeeType}) => {
    console.log(fee.id)
    const [data, setData] = useState({
        'name': fee.name || '',
        'price': fee.price || '',
        'description': fee.description || '',
    })
    const [editMode, setEditMode] = useState(true)
    
    const toggleEdit = async () => {
        const prevMode = editMode
        setEditMode(prev => !prev)
    
        if (!prevMode) {
            if(!data.name || data.price < 0 ) {
                alert("Invalid request. Name cannot be empty and price cannot be negative")
                return 
            }
            
            await editFeeType(fee.id, data)
        }
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
            {editMode ? 
            <>
            <td>
                <input 
                    type="text" 
                    name="name"
                    value={data.name}
                    onChange={handleInputChange}/>
            </td>
            <td>
                <input 
                    type="number"
                    name="price" 
                    value={data.price}
                    onChange={handleInputChange}/>
            </td>
            <td>
                <input 
                    type="text" 
                    name="description"
                    value={data.description}
                    onChange={handleInputChange}/>
            </td>
            <td><button onClick={toggleEdit}>Submit</button></td>
            <td><button>Delete</button></td>
            </>
            :
            <>
            <td>{fee.name}</td>
            <td>{fee.price}</td>
            <td>{fee.description}</td>
            <td><button onClick={toggleEdit}>Edit</button></td>
            <td><button>Delete</button></td>
            </>
            }
        </tr>
    )
}

export default EditFeeRow