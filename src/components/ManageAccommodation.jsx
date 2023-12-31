import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import SAMPLEIMAGE from "/images/osmenapeak.jpg";

const ManageAccommodation = ({ location, editBusiness }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
	const navigate = useNavigate()

    const [formData, setFormData] = useState({
		'name': location.name,
		'address': location.address,
		'latitude': location.latitude,
		'longitude': location.longitude,
		'description': location.description,
        'location_type': location.location_type
	})

    const handleChangeInput = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
 	}

    const handleSubmit = (e) => {
		e.preventDefault() 
        editBusiness(location.id, formData)
        navigate(-1)
	}

	const toggleAddProduct = () => {
		setAddProductModalOpen(prev => !prev)
	}

    return (
        <div className="profile--main-container">
            <form onSubmit={handleSubmit}>
                <div className="admin-wrapper admin--container">
                    <div className="input--form">
                    <p>Accommodation</p>
                    <div className="input admin--container">
                        <label htmlFor="name">Location Name</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChangeInput}
                        className="styled-input"
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="address">Address</label>
                        <input
                        type="text"
                        name="address"
                        onChange={handleChangeInput}
                        value={formData.address}
                        className="styled-input"
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                        <label htmlFor="latitude">Latitude</label>
                        <input

                            type="number"
                            onChange={handleChangeInput}
                            step="0.000001"
                            name="latitude"
                            value={formData.latitude}
                            className="styled-input"
                        />
                        </div>
                        <div className="input admin--container">
                        <label htmlFor="postalCode">Longitude</label>
                        <input
                            number="text"
                            onChange={handleChangeInput}
                            step="0.000001"
                            name="longitude"
                            value={formData.longitude}
                            className="styled-input"
                        />
                        </div>
                    </div>
                    {location.location_type === "1" && 
                    <div className="admin--container">
                        <div className="input admin--container">
                        <label htmlFor="opening">Opening Time</label>
                        <input
                            type="text"
                            onChange={handleChangeInput}
                            name="opening_time"
                            value={formData.opening_time}
                            className="styled-input"
                            />
                        </div>
                        <div className="input admin--container">
                        <label htmlFor="closing">Closing Time</label>
                        <input
                            type="text"
                            onChange={handleChangeInput}
                            name="closing_time"
                            value={formData.closing_time}
                            className="styled-input"
                            />
                        </div>
                    </div>
                    }
                    <div className="input admin--container">
                        <label htmlFor="description">Description</label>
                        <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChangeInput}
                        />
                    </div>
                    </div>
                    <div className="image--border center admin--container">
                    <img className="edit--images" src={`${backendUrl}${location?.image}`}  />
                    <label htmlFor="imgFile">
                        {" "}
                        <a className="choose--file">Choose file</a> to upload
                    </label>
                    <input
                        type="file"
                        id="imgFile"
                        name="filename"
                        accept="image/*"
                        style={{ display: "none" }} 
                    />
                    </div>
                </div>    
                <button className="add--business font14" >Submit</button>
            </form>
        </div>
    )
}

export default ManageAccommodation