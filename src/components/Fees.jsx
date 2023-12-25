import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"
import EditFee from "../modals/EditFee"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Fees = () => {
    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { location, items, error, loading, getBusinessDetail, createFeeType, getFeeTypes, editFeeType} = useBusinessManager(authTokens)
    const [selectedItem, setSelectedItem] = useState()
    const [openEditModal, setOpenEditModal] = useState(false)
    const [addModal, setAddModal] = useState(false)

    const [formFields, setFormFields] = useState([
        {
            'fee_name': '',
            'audience_type' : '',
            'amount' : '',
            'is_required': false,
        }
    ])

    const handleInputChange = (event, index) => {
        const { name, value, type, checked } = event.target
        let data = [...formFields]
        data[index][name] = type === 'checkbox' ? checked : value
        setFormFields(data)

        console.log(data)
    }

    const handleSubmit = () => {
        event.preventDefault();
        console.log(formFields)
    }

    const addFields = () => {
        let newField = {
            'fee_name': '',
            'audience_type' : '',
            'amount' : '',
            'is_required': false,
        }

        setFormFields([...formFields, newField])
    }

    const deleteField = (indexToDelete) => {
        const updatedFields = formFields.filter((_, index) => index !== indexToDelete)
        setFormFields(updatedFields)
    }
    
    
    useEffect(() => {
        getBusinessDetail(id)
    }, [id])

    useEffect(() => {
        getFeeTypes(id)
    }, [])
    

    return (
        <div>
                <p className="heading">Add Services</p>
                <div>
                    <div className="form-column-group fees-input-group">
                        <h2 className="fees-label">Fee Name</h2>
                        <h2 className="fees-label">Audience Type</h2>
                        <h2 className="fees-label">Amount</h2>
                        <h2 className="fees-label">Required</h2>
                        <h2 className="fees-label"></h2>
                    </div>

                    <form onSubmit={(event) => handleSubmit(event)}>
                    {formFields.map((form, index) => {
                        return (
                            <div className="form-column-group fees-input-group" key={index}>
                                <input
                                    type="text"
                                    name="fee_name"
                                    placeholder="ex. Entrance Fee"
                                    value={form.fee_name}
                                    onChange={(event) => handleInputChange(event, index)}
                                    className="business-input fees-input" 
                                />
                                <select
                                    name="audience_type"
                                    value={form.audience_type}
                                    onChange={(event) => handleInputChange(event, index)}
                                    className="business-type fees-input"
                                >
                                    <option value="" disabled>-- Audience Type --</option>
                                    <option value="General">General</option>
                                    <option value="Regular">Regular</option>
                                    <option value="Students">Students</option>
                                    <option value="PWD">PWD</option>
                                    <option value="Seniors">Senior Citizen</option>
                                    <option value="Children">Children</option>
                                    <option value="Adult">Adult</option>
                                    <option value="Locals">Local Guests</option>
                                    <option value="Foreigners">Foreigners</option>
                                </select>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={form.amount}
                                    onChange={(event) => handleInputChange(event, index)}
                                    className="business-input fees-input"
                                />
                                <input
                                    type="checkbox"
                                    name="is_required"
                                    checked={form.is_required}
                                    onChange={(event) => handleInputChange(event, index)}
                                    className="required-fees-checkbox"
                                />
                                <button 
                                    className="delete-fee-btn" 
                                    onClick={() => deleteField(index)}>
                                    <FontAwesomeIcon className="delete-fees-icon" icon={faTrashCan} />
                                </button>
                            </div>
                        )
                    })}
                    </form>
                </div> 

                <div>
                    <button className="add--business add--fields" onClick={addFields}>Add</button>
                    <button className="add--business" type="submit" onClick={handleSubmit}>Submit</button>
                </div>                
        </div>
    )
}

export default Fees