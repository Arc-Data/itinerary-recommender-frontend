import { useContext, useState } from 'react'
import image from '/image.png'
import AuthContext from '../context/AuthContext'
import useLocationManager from '../hooks/useLocationManager'
import { useNavigate } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'
import useEventManager from '../hooks/useEventManager'

function AddEvent() {
    const { authTokens } = useContext(AuthContext)
    const { createEvent } = useEventManager(authTokens)
    const [formData, setFormData] = useState({
        'name': '',
        'start_date': '',
        'end_date': '',
        'description': '',
        'latitude': 10,
        'longitude': 123,
    })
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validateForm()) {
            await createEvent(formData)
            navigate(-1)
        } else {
            alert("Invalid fields detected")
        }
    }

    const validateForm = () => {
        let errors = {};

        // Validate name
        if (formData.name.length < 3 || formData.name.length > 50) {
            errors.name = 'Name must be between 3 and 50 characters';
        }

        // Validate start_date and end_date
        if (!formData.start_date || !formData.end_date) {
            errors.date = 'Start and End dates are required';
        } else if (new Date(formData.end_date) < new Date(formData.start_date)) {
            errors.date = 'End date must not be earlier than the start date';
        }

        // Validate latitude and longitude
        if (formData.latitude < -90 || formData.latitude > 90) {
            errors.latitude = 'Latitude must be between -90 and 90';
        }
        if (formData.longitude < -180 || formData.longitude > 180) {
            errors.longitude = 'Longitude must be between -180 and 180';
        }

        return Object.keys(errors).length === 0; // Returns true if there are no errors
    };


    return (
        <div>
            <h1 className="heading">Add event</h1>
            <form onSubmit={handleSubmit} action="" className="admin--container">
                <div className="input--form">
                    <div className="input admin--container">
                        <label htmlFor="name">Event name</label>
                        <input
                            type="text"
                            name="name"
                            className="business-input"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="start_date">Start date</label>
                            <input
                                type="date"
                                name="start_date"
                                className="business-input"
                                value={formData.start_date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="end_date">End date</label>
                            <input
                                type="date"
                                name="end_date"
                                className="business-input"
                                value={formData.end_date}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            name="description"
                            className="business-input description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                name="latitude"
                                className="business-input"
                                value={formData.latitude}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="longitude">Longitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                name="longitude"
                                className="business-input"
                                value={formData.longitude}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn done"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {/* <form action="" className="admin--container">
                <div className="input--form"> */}
                
                    

                    {/* <div className="input admin--container">
                        <label htmlFor="name">Event name</label>
                        <input
                            type="text"
                            name="eventName"
                            className="business-input" 
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="startDate">Start date</label>
                            <input
                                type="date"
                                name="startDate"
                                className="business-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="endDate">End date</label>
                            <input
                                type="date"
                                name="endDate"
                                className="business-input" 
                            />
                        </div>
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            name="description"
                            className="business-input" 
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                name="latitude"
                                className="business-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="longitude">Longitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                name="longitude"
                                className="business-input" 
                            />
                        </div>
                    </div> */}
                    {/* <button
                        type="button"
                        className="btn done"
                    >
                        Submit
                    </button>
                </div>
            </form> */}
        </div>
    )
}

export default AddEvent;