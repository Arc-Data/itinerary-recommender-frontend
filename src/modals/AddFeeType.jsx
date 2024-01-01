import { useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import { useState } from 'react'

const AddFeeType = ({ onClose, addFeeType }) => {
    const { id } = useParams()
    const [ data, setData ] = useState({
        'name': '',
        'is_required': false
    })

    const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        addFeeType(id, data)
    }

    return (
        <Modal onClose={onClose}> 
            <form method='POST' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        name="name"
                        id="name"
                        value={data.name}
                        onChange={handleInputChange}/>
                </div>
                <div>
                    <label htmlFor="name">Is Required</label>
                    <input 
                        type="checkbox" 
                        name="is_required"
                        id="is_required"
                        checked={data.is_required}
                        onChange={handleInputChange}/>
                </div>
                <button type='submit'>Submit</button>
            </form>
        </Modal>
    )
}

export default AddFeeType