import { useState } from 'react'
import Modal from '../components/Modal'
import { useParams } from 'react-router-dom'

const AddAudienceType = ({ onClose, addAudienceType }) => {
    const { feeId } = useParams()
    const [ data, setData ] = useState({
        'name': '',
        'price': 0,
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev, 
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        addAudienceType(feeId, data)
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
                    <label htmlFor="name">Price</label>
                    <input 
                        type="number" 
                        name="price"
                        id="price"
                        checked={data.price}
                        onChange={handleInputChange}/>
                </div>
                <button type='submit'>Submit</button>
            </form>
        </Modal>
    )
}

export default AddAudienceType