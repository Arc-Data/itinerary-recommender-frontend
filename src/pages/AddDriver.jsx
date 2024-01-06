import { useContext, useState, useEffect } from 'react'
import image from '/image.png'
import AuthContext from '../context/AuthContext'
import useDriverManager from '../hooks/useDriverManager'
import { useNavigate } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function AddDriver() {
    const { authTokens } = useContext(AuthContext)
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const { createDriver } = useDriverManager(authTokens)
    
    const [driverData, setDriverData] = useState(
        {
            'first_name': "",
            'last_name': "",
            'email': "",
            'contact': "",
            'facebook': "",
            'info': "",
            'car': "",
            'type': "",
            'capacity': "",
            'plate': '',
        }
    ) 

    const validateForm = () => {
        return (
            driverData.first_name.trim() !== '' &&
            driverData.last_name.trim() !== '' &&
            driverData.email.trim() !== '' &&
            driverData.contact.trim() !== '' &&
            driverData.facebook.trim() !== '' &&
            driverData.info.trim() !== '' &&
            driverData.car.trim() !== '' &&
            driverData.type.trim() !== ''&&
            driverData.capacity.trim() !== ''&&
            driverData.plate.trim() !== ''
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDriverData((prev) => ({
            ...prev,
            [name]: value,
        }));
     
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(driverData)
        if (validateForm() && checkImageUploaded()) {
            const formattedData = {
                ...driverData,
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
                await createDriver(formData);
                alert("Successfully Added");
                navigate(`/admin/drivers`);
            } catch (error) {
                console.error(error);
            }
        }
    };
    
    console.log(driverData)

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
            <h1 className="heading">Add Driver</h1>
            <h1 className='mt-20px'>Personal Information </h1>
            <br></br>  
            <form className="admin--container">
                <div className="input--form">
                    <div className="input admin--container">
                        <label htmlFor="first_name">First name</label>
                        <input
                            type="text"
                            placeholder='First name'
                            onChange={handleChange}
                            name="first_name"
                            value={driverData.first_name}
                            className="styled-input" 
                        />
                    </div>
                    
                    <div className="input admin--container">
                        <label htmlFor="last_name">Last name</label>
                        <input
                            type="text"
                            placeholder='Last name'
                            onChange={handleChange}
                            name="last_name"
                            value={driverData.last_name}
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
                            value={driverData.contact}
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
                            value={driverData.email}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="facebook">Facebook</label>
                        <input
                            type="text"
                            placeholder='Facebook account'
                            onChange={handleChange}
                            name="facebook"
                            value={driverData.facebook}
                            className="styled-input" 
                        />
                    </div>                  
                    
                    <div className="input admin--container">
                        <label htmlFor="info">Additional Information</label>
                        <textarea
                            placeholder='Write at least 250 - 350 words '
                            onChange={handleChange}
                            name="info"
                            value={driverData.info}
                            
                        />
                    </div>

                    <h1 className='mt-20px'>Car Information </h1>
                    
                    <div className="input admin--container">
                        <select
                            value={driverData.type}
                            onChange={handleChange}
                            name="type"
                            className="styled-input" 
                        >
                            <option value="">-- Car Type --</option>
                            <option value="1">Sedan</option>
                            <option value="2">Van</option>
                            <option value="3">SUV</option>
                        </select>
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="car">Car</label>
                        <input
                            type="text"
                            placeholder='Car'
                            onChange={handleChange}
                            name="car"
                            value={driverData.car}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="capacity">Max capacity</label>
                        <input
                            type="number"
                            placeholder='Max capacity'
                            onChange={handleChange}
                            name="capacity"
                            value={driverData.capacity}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="plate">Plate Number</label>
                        <input
                            type="text"
                            placeholder='Plate Number'
                            onChange={handleChange}
                            name="plate"
                            value={driverData.plate}
                            className="styled-input" 
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

export default AddDriver