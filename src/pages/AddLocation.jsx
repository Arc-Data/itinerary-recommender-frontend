import { useContext, useState } from 'react'
import image from '/image.png'
import AuthContext from '../context/AuthContext'
import useLocationManager from '../hooks/useLocationManager'
import { useNavigate } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'
function AddLocation() {
    const { authTokens } = useContext(AuthContext)
    const [locationData, setLocationData] = useState(
        {
            'type': "",
            'name': "",
            'address': "",
            'latitude': "",
            'longitude': "",
            'min_fee': "",
            'max_fee': "",
            'opening_time': new Date().setTime(0, 0, 0),
            'closing_time': new Date().setTime(0, 0, 0),
            'description': ""
        }
    )
    const navigate = useNavigate()
    const { createLocation } = useLocationManager(authTokens)

    const handleSubmit = async () => {
        console.log("Hello?")
        if (locationData.type === "1" && locationData.min_fee > locationData.max_fee) {
            alert("Min fee couldnt be greater than maximum fee")
            return 
        }
 
        if (validateForm()) {
            const formattedData = {
                ...locationData,
                opening_time: formatTimeToString(new Date(locationData.opening_time)),
                closing_time: formatTimeToString(new Date(locationData.closing_time)),
            };

            const formData = new FormData();
    
            Object.entries(formattedData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const imageFileInput = document.getElementById('imgFile');
            if (imageFileInput.files.length > 0) {
                formData.append('image', imageFileInput.files[0]);
            }

            try {
                console.log("wait what")
                await createLocation(formData)
                navigate(`/admin/location`)

            } catch (error) {
                console.error(error);
            }
        }
    };

    const formatTimeToString = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const validateForm = () => {
        return (
            locationData.type.trim() !== '' &&
            locationData.name.trim() !== '' &&
            locationData.address.trim() !== '' &&
            locationData.latitude.trim() !== '' &&
            locationData.longitude.trim() !== '' &&
            locationData.description.trim() !== ''
        );
    };

    const handleChange = (event) =>  {
        const { name, value } = event.target
        
        if (name === 'opening_time' || name === 'closing_time') {
            const timeString = value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLocationData(prev => ({
                ...prev,
                [name]: timeString,
            }));
        } else {
            setLocationData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    return (
        <>
            <h1>Add Location</h1>
            <form className="admin--container">
                <div className="input--form">
                    <select
                        value={locationData.type}
                        onChange={handleChange}
                        name="type"
                        className="styled-input" 
                    >
                        <option value="">-- Location Type --</option>
                        <option value="1">Spot</option>
                        <option value="2">Food</option>
                        <option value="3">Accommodation</option>
                    </select>

                    <div className="input admin--container">
                        <label htmlFor="name">Location Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="name"
                            value={locationData.name}
                            className="styled-input" 
                        />
                    </div>
                    
                    <div className="input admin--container">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="address"
                            value={locationData.address}
                            className="styled-input" 
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                onChange={handleChange}
                                name="latitude"
                                value={locationData.latitude}
                                className="styled-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="postalCode">Longitude</label>
                            <input
                                number="text"
                                step="0.000001"
                                onChange={handleChange}
                                name="longitude"
                                value={locationData.longitude}
                                className="styled-input" 
                            />
                        </div>
                    </div>
                        {locationData.type === "1" && 
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="min_fee">Minimum Fee</label>
                            <input
                                type="number"
                                name="min_fee"
                                onChange={handleChange}
                                value={locationData.min_fee}
                                className="styled-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="max_fee">Maximum Fee</label>
                            <input
                                type="number"
                                name="max_fee"
                                onChange={handleChange}
                                value={locationData.max_fee}
                                className="styled-input" 
                                />
                        </div>
                     </div>
                    }
                    {locationData.type === "1" && 
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="opening">Opening Time</label>
                            <ReactDatePicker
                                selected={locationData.opening_time}
                                onChange={(date) => setLocationData({ ...locationData, opening_time: date })}                            
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="closing">Closing Time</label>
                            <ReactDatePicker
                                selected={locationData.closing_time}
                                onChange={(date) => setLocationData({ ...locationData, closing_time: date })}                            
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                />
                        </div>
                    </div>
                    
                    }
                    <div className="input admin--container">
                        <label htmlFor="description">Description</label>
                        <textarea
                            onChange={handleChange}
                            name="description"
                            value={locationData.description}
                            
                        />
                    </div>
                    <button
                        type="button"
                        className="btn done"
                        onClick={handleSubmit}
                    >
                        Upload
                    </button>
                </div>
                <div className="image--border center admin--container">
                    <img src={image} />
                    <label htmlFor="imgFile"> <a className='choose--file'>Choose file</a> to upload</label>
                    <input
                        type="file"
                        id="imgFile"
                        name="filename"
                        accept="image/*"
                        style={{ display: 'none' }} // Hide the default file input
                    />
                </div>
            </form>
        </>

    )
}

export default AddLocation
