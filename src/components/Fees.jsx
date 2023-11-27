import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"
import EditFee from "../modals/EditFee"

const Fees = () => {
    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { location, items, error, loading, getBusinessDetail, createFeeType, getFeeTypes, editFeeType} = useBusinessManager(authTokens)
    const [selectedItem, setSelectedItem] = useState()
    const [openEditModal, setOpenEditModal] = useState(false)
    const [addModal, setAddModal] = useState(false)

    const [data, setData] = useState({
        'name': '',
        'is_required': false,
    })

    const toggleEditModal = (item) => {
        setSelectedItem(item)
        setOpenEditModal(prev => !prev)
    }

    const toggleAddModal = () => {

    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const checkInvalid = () => {
        return !data.name
    }


    const displayFees = items && items.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.is_required ? "Required" : "Optional"}</td>
                <td>
                    <ul>
                        {item.audience_types.map(audienceType => (
                            <li key={audienceType.id}>
                                {audienceType.name} - Price: {audienceType.price}
                                <div onClick={() => toggleModal(audienceType)}>Edit</div>
                            </li>
                            
                        ))}
                    </ul>
                </td>
            </tr>
        )
    })

    const handleSubmit = (e) => {   
        e.preventDefault()

        if (checkInvalid()) {
            alert("Please supply in the missing fields")
            return
        }

        createFeeType(id, data)
    }

    useEffect(() => {
        getBusinessDetail(id)
    }, [id])

    useEffect(() => {
        getFeeTypes(id)
    }, [])
    
    return (
        <div>
            <div>
                <p>Add Services</p>
                <form onSubmit={handleSubmit}>
                    <div className="input admin--container">
                        <label>Fee Type (ex: Entrance Fee, Environmental Fee, Tent Rental, etc.)</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Entrance Fee"
                            value={data.item}
                            onChange={handleInputChange}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label>Is Required</label>
                        <input
                        type="checkbox"
                        name="is_required"
                        checked={data.is_required}
                        onChange={handleInputChange}
                        className="styled-input"
                        />
                    </div>
                    <button className="add--business font14" type="submit" >Submit</button>
                </form>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Fee Type</th>
                        <th>Required</th>
                        <th>Audience Type - Price</th>
                        <th><button>Add</button></th>
                    </tr>
                </thead>
                <tbody>
                    {displayFees}
                </tbody>
            </table>
            {openEditModal &&
            <EditFee />
            }    
        </div>
    )
}

export default Fees