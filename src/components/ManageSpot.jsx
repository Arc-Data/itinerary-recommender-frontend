import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import AuthContext from "../context/AuthContext";

const ManageSpot = ({ location, editBusiness }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
	const navigate = useNavigate()
    const [ spotTags, setSpotTags ] = useState([])
    const { authTokens } = useContext(AuthContext)

    const [formData, setFormData] = useState({
		'name': location.name,
		'address': location.address,
        'contact': location.contact,
        'email': location.email,
        'website': location.website,
		'latitude': location.latitude,
		'longitude': location.longitude,
		'description': location.description,
        'location_type': location.location_type,
        'opening_time': new Date().setTime(0, 0, 0),
        'closing_time': new Date().setTime(0, 0, 0),
        'tags': location.tags || []
    })

    console.log('Location Data: ', location)

    const formatTimeToString = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    const getSpotTags = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/tags/get/`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${String(authTokens.access)}`
            }
            });
            const data = await response.json();
            setSpotTags(data)
        } catch (error) {
            console.error("Error fetching spot tags:", error);
        }
    };

    useEffect(() => {
        if (location.schedule.opening) {
            const [hours, minutes, seconds] = location.schedule.opening.split(":");
            const openingTime = new Date();
            openingTime.setHours(hours, minutes, seconds);
            setFormData(prev => ({ ...prev, opening_time: openingTime }));
       
            console.log("Doing this")
        }
    
        if (location.schedule.closing) {
            const [hours, minutes, seconds] = location.schedule.closing.split(":");
            const closingTime = new Date();
            closingTime.setHours(hours, minutes, seconds);
            setFormData(prev => ({ ...prev, closing_time: closingTime }));
        }

        getSpotTags()            
    }, []);
    
	const handleChangeInput = (e) => {
		const { name, value } = e.target
		
        if (name === 'opening_time' || name === 'closing_time') {
            const timeString = value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setFormData(prev => ({
                ...prev,
                [name]: timeString,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
 	}

    const handleSpotTagChange = (e, tagName) => {
        const isChecked = e.target.checked;
        console.log(isChecked)
        console.log("I am here")

        setFormData((prevData) => {
            if (isChecked) {
                return {
                    ...prevData,
                    tags: [...prevData.tags, tagName],
                };
            } else {
                return {
                    ...prevData,
                    tags: prevData.tags.filter((tag) => tag !== tagName),
                };
            }
        });
    };

	const handleSubmit = async (e) => {
		e.preventDefault() 

        if (formData.min_fee > formData.max_fee) {
            alert("Min fee couldnt be greater than maximum fee")
            return;
        }
        
        console.log(formData.opening_time)
        const data = {
            ...formData,
            "opening_time": formatTimeToString(formData.opening_time),
            "closing_time": formatTimeToString(formData.closing_time)
        };

        console.log(data)

        await editBusiness(location.id, data)
        navigate(-1)
	}

    return (
        <div className="profile--main-container">
            <form onSubmit={handleSubmit}>
                <div className="admin-wrapper admin--container">
                    <div className="input--form">
                        <p className="heading no-margin">General Information</p>
                        <div className="input admin--container">
                            <label htmlFor="name">Name</label>
                            <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChangeInput}
                            className="business-input"
                        />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="address">Address</label>
                            <input
                            type="text"
                            name="address"
                            onChange={handleChangeInput}
                            value={formData.address}
                            className="business-input"
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="contact">Phone number (Optional)</label>
                            <input
                            type="number"
                            name="contact"
                            onChange={handleChangeInput}
                            value={formData.contact}
                            className="business-input"
                            />
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
                            <label htmlFor="website">Website (Optional)</label>
                            <input
                            type="text"
                            name="website"
                            onChange={handleChangeInput}
                            value={formData.website}
                            className="business-input"
                            />
                        </div>
                        <p className="heading business-info-label">Business Information</p>
                        <div className="input admin--container">
                            <label htmlFor="description">Description</label>
                            <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChangeInput}
                            className="business-input description"
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
                                    className="business-input"
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
                                    className="business-input"
                                />
                            </div>
                        </div>
                        <div className="admin--container">
                            <div className="input admin--container">
                                <label htmlFor="opening">Opening Time</label>
                                <ReactDatePicker
                                    selected={formData.opening_time}
                                    onChange={(date) => setFormData({ ...formData, opening_time: date })}                            showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    className="business-input"
                                />
                            </div>
                            <div className="input admin--container">
                                <label htmlFor="closing">Closing Time</label>
                                <ReactDatePicker
                                    selected={formData.closing_time}
                                    onChange={(date) => setFormData({ ...formData, closing_time: date })}                            showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    className="business-input"
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="heading business-details">Tags</h1>
                            {spotTags.map((tag, index) => (
                            <div key={index} className="tags-checkbox-container">
                                <input
                                type="checkbox"
                                id={`tag-${index}`}
                                name={`tag-${index}`}
                                checked={formData.tags.includes(tag.name)}
                                onChange={(e) => handleSpotTagChange(e, tag.name)}
                                className="tags-checkbox"
                                />
                                <label className="tags-checkbox-label" htmlFor={`tag-${index}`}>{tag.name}</label>
                            </div>
                            ))}
                        </div>
                        <button className="add--business font14" >Submit</button>
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
            </form>
        </div>
    )
}

export default ManageSpot