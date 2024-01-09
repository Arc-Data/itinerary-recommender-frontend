import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const ManageAccommodation = ({ location, editBusiness }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
	const navigate = useNavigate()
    const [ selectedImage, setSelectedImage ] = useState(`${backendUrl}${location.image}?timestamp=${Date.now()}`)

    const [formData, setFormData] = useState({
		'name': location.name,
		'address': location.address,
		'latitude': location.latitude,
		'longitude': location.longitude,
		'description': location.description,
        'location_type': location.location_type,
        'email': location.email,
	})

    const handleChangeInput = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
 	}

    const handleSubmit = async (e) => {
		e.preventDefault() 
        
        const isImageChanged = e.target.elements.imgFile.files.length > 0

        if (isImageChanged) {
            await editBusiness(location.id, formData, e.target.elements.imgFile.files[0])
        } else {
            await editBusiness(location.id, formData)
        }

        navigate(-1)
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
                    <div className="input admin--container">
                        <label htmlFor="email">Email (Optional)</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChangeInput}
                            value={formData.email}
                            className="business-input"
                        />
                    </div>
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
                    <img className="edit--images" src={selectedImage}  />
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
                        onChange={(e) => setSelectedImage(URL.createObjectURL(e.target.files[0]))}
                    />
                    </div>
                </div>    
                <button className="add--business font14" >Submit</button>
            </form>
        </div>
    )
}

export default ManageAccommodation