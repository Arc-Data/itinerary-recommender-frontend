import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import back from "/images/lets-icons_back-light.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AddBusiness = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { authTokens } = useContext(AuthContext)
    const navigate = useNavigate()
    const [locationData, setLocationData] = useState({
        'name': '',
        'address': '',
        'contact': '',
        'email': '',
        'website': '',
        'longitude': 0,
        'latitude': 0,
        'type': '',
    })
    const [image, setImage] = useState(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setLocationData(prev => ({
            ...prev,
            [name]: value,
        }))

    }

    const checkInvalid = () => {
        const value = !locationData.name ||
            !locationData.address ||
            locationData.longitude == 0 ||
            locationData.latitude == 0 ||
            locationData.type === ''
    
            if (value) {
                alert("Missing inputs")
            }

            return value
        }

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Submits")

        if (!checkInvalid() && checkImageUploaded()) {
            try {
                const formData = new FormData();

                Object.entries(locationData).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                const imageInput = document.getElementById("imgFile");
                if (imageInput.files.length > 0) {
                    formData.append("image", imageInput.files[0]);
                }

                const response = await fetch(`${backendUrl}/api/location/request/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${String(authTokens.access)}`
                    },
                    body: formData
                });

                if(response.ok) {
                    navigate('/profile/business')
                }
                
            }
            catch(error) {
                console.log("An error occured while creating request: ", error)
            }
        } else {
            console.log("Invalid Inputs")
        }
    }
    
    return (
        <div className="profile--main-container">
            <form action="POST" onSubmit={handleSubmit}>
                <div className="business--form-container">
                    <div className="business--form-section">
                        <Link to="/profile/business">
                            <button className="back--button d-flexCenter">
                                <FontAwesomeIcon className='btn-icons' icon={faArrowLeft} />
                                Back
                            </button>
                        </Link>
                        <div className="business--form-content">
                            <div>
                                <div className="heading">General Information</div>
                                <div className="form-group">
                                    <label htmlFor="type">Location Type</label>
                                    <select 
                                        name="type" 
                                        id="type" 
                                        value={locationData.type}
                                        onChange={handleInputChange} 
                                        className="business-type">
                                        <option value="" disabled>-- Location Type --</option>
                                        <option value="1">Tourist Spot</option>
                                        <option value="2">Restaurant/Food Establishment</option>
                                        <option value="3">Accommodation</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Location Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        id="name"
                                        value={locationData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Location Name" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Location Address</label>
                                    <input 
                                        type="text" 
                                        name="address" 
                                        id="address" 
                                        value={locationData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter Location Address" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Phone Number (optional)</label>
                                    <input 
                                        type="text" 
                                        name="contact" 
                                        id="contact" 
                                        value={locationData.contact}
                                        onChange={handleInputChange}
                                        placeholder="Enter Contact Number" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Email Address (optional)</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        value={locationData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter Email Address" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Website (optional)</label>
                                    <input 
                                        type="text" 
                                        name="website" 
                                        id="website" 
                                        value={locationData.website}
                                        onChange={handleInputChange}
                                        placeholder="Enter Website" 
                                        className="business-input"/>
                                </div>

                                <div className="form-column-group">
                                    <div className="form-group">
                                        <label htmlFor="address">Latitude</label>
                                        <input 
                                            type="number" 
                                            name="latitude" 
                                            id="latitude" 
                                            value={locationData.latitude}
                                            onChange={handleInputChange}
                                            className="business-input"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Longitude</label>
                                        <input 
                                            type="number" 
                                            name="longitude" 
                                            id="longitude" 
                                            value={locationData.longitude}
                                            onChange={handleInputChange}
                                            className="business-input"/>
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
                        
                                <div className="flex jc-end mt-20px">
                                    
                                    <button className="add--business font14" >Submit</button>  
                                </div>
                            </div>
                            <div>
                                {image && (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Selected Image"
                                    style={{ marginTop: '10px', maxWidth: '100%' }}
                                />
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
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddBusiness