import { useContext, useState, useEffect } from 'react'
import image from '/image.png'
import AuthContext from '../context/AuthContext'
import useLocationManager from '../hooks/useLocationManager'
import { useNavigate } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function AddLocation() {
    const { authTokens } = useContext(AuthContext)
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const { createLocation } = useLocationManager(authTokens)
    
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
            'description': '',
            'contact': '',
            'email': '',
            'website': '',
        }
    )

    const formatTimeToString = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (locationData.opening_time) {
            const [hours, minutes, seconds] = locationData.opening_time.split(":");
            const openingTime = new Date();
            openingTime.setHours(hours, minutes, seconds);
            setLocationData(prev => ({ ...prev, opening_time: openingTime }));
        }
    
        if (locationData.closing_time) {
            const [hours, minutes, seconds] = locationData.closing_time.split(":");
            const closingTime = new Date();
            closingTime.setHours(hours, minutes, seconds);
            setLocationData(prev => ({ ...prev, closing_time: closingTime }));
        }
    }, []);
   

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

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'opening_time' || name === 'closing_time') {
            const timeString = value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLocationData((prev) => ({
                ...prev,
                [name]: timeString,
            }));
        } else {
            setLocationData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (locationData.type === "1" && locationData.min_fee > locationData.max_fee) {
            alert("Min fee couldn't be greater than the maximum fee");
            return;
        }
    
        if (validateForm() && checkImageUploaded()) {
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
                console.log("wait what");
                await createLocation(formData);
                alert("Successfully Added");
                navigate(`/admin/locations`);
            } catch (error) {
                console.error(error);
            }
        }
    };
    
    console.log(locationData)

    const checkImageUploaded = () => {
        if (!image) {
            alert("Please upload an image before submitting.");
            return false;
        }
        return true;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImage(file)
    }

    const handleUploadClick = (e) => {
        e.stopPropagation()
    }

    return (
        <>
            <h1 className="heading">Add Location</h1>
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
                            placeholder='Business Name'
                            onChange={handleChange}
                            name="name"
                            value={locationData.name}
                            className="styled-input" 
                        />
                    </div>
                    
                    <div className="input admin--container">
                        <label htmlFor="address">Location Address</label>
                        <input
                            type="text"
                            placeholder='Location Address'
                            onChange={handleChange}
                            name="address"
                            value={locationData.address}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="contact">Phone number</label>
                        <input
                            type="text"
                            placeholder='Phone Number'
                            onChange={handleChange}
                            name="contact"
                            value={locationData.contact}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="email">Email address</label>
                        <input
                            placeholder='Email'
                            type="email"
                            onChange={handleChange}
                            name="email"
                            value={locationData.email}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="website">Website</label>
                        <input
                            type="website"
                            placeholder='Link of the Website'
                            onChange={handleChange}
                            name="website"
                            value={locationData.website}
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
                    <div>
                        <p className="visibility--coordinates">
                            To improve your business's visibility on the site, we require your
                            coordinates. Please click on the{" "}
                            <a
                                href="https://support.google.com/maps/answer/18539?hl=en&co=GENIE.Platform%3DDesktop#:~:text=Get%20the%20coordinates%20of%20a%20place&text=Right%2Dclick%20the%20place%20or,decimal%20format%20at%20the%20top."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                How to Obtain My Coordinates
                            </a>{" "}
                            link to access instructions.
                        </p>
                    </div>
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
                                className="styled-input"
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
                                className="styled-input"
                            />
                        </div>
                    </div>
                    
                    }
                    <div className="input admin--container">
                        <label htmlFor="description">Description</label>
                        <textarea
                            placeholder='Write at least 250 - 350 words '
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
                <div>
                    {image && (
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Selected Image"
                        style={{ marginRight: '10px', maxWidth: '100px' }}
                    />
                    <p style={{ marginRight: '10px' }}>{image.name}</p>
                        <button onClick={() => setImage(null)}><FontAwesomeIcon className="delete--upload-img" icon={faCircleXmark} /></button>
                    </div>
                    )}
                    <div className="upload-btn" onClick={handleUploadClick}>
                        <FontAwesomeIcon className='upload-icon btn-icons' icon={faUpload} />
                        <label htmlFor="imgFile" className="choose-file">
                            Upload image
                        </label>
                        <input
                            type="file"
                            id="imgFile"
                            name="filename"
                            accept="image/*"
                            style={{ "display": 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
            </form>
        </>

    )
}

export default AddLocation