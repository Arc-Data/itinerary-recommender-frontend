import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useBusinessManager from "../hooks/useBusinessManager";

const ManageSpot = ({ location, editBusiness }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
	const navigate = useNavigate()
    const spotTags = ['Art', 'Activities', 'Culture', 'Entertainment', 'Historical', 'Nature', 'Religious']
    const { authTokens } = useContext(AuthContext)
    const { getOrCreateSpotActivity, removeSpotActivity } = useBusinessManager(authTokens.access)

    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
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
        'tags': location.tags,
    })

    const [ activities, setActivities ] = useState(location.activities)
    const [ selectedImage, setSelectedImage ] = useState(`${backendUrl}${location.image}?timestamp=${Date.now()}`)
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addActivity(query)
        }
    }

    const removeActivity = async (e, name) => {
        e.preventDefault()
        searchTags('')
        await removeSpotActivity(location.id, name)
        setActivities(activities.filter(activity => activity !== name))
    }

    const addActivity = async (tagName) => {
        if (!activities.includes(tagName)) {
            setActivities(prevTags => [...prevTags, tagName])
            await getOrCreateSpotActivity(location.id, tagName)
        }
        setQuery('')
    }

    const formatTimeToString = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    const addedActivityItem = activities.map((activity, index) => (
        <div className="tag-item" key={index}>
            {activity}
            <button className="delete-tag-button" onClick={(e) => removeActivity(e, activity)}>
                <FontAwesomeIcon icon={faCircleXmark} />
            </button>
        </div>
    ))

    useEffect(() => {
        if (location.schedule.opening) {
            const [hours, minutes, seconds] = location.schedule.opening.split(":");
            const openingTime = new Date();
            openingTime.setHours(hours, minutes, seconds);
            setFormData(prev => ({ ...prev, opening_time: openingTime }));
        }
    
        if (location.schedule.closing) {
            const [hours, minutes, seconds] = location.schedule.closing.split(":");
            const closingTime = new Date();
            closingTime.setHours(hours, minutes, seconds);
            setFormData(prev => ({ ...prev, closing_time: closingTime }));
        }
    }, []);
    

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            searchTags(query)
        }, 1000)
    }, [query])

    const searchTags = async (query) => {
        try {
            const response = await fetch(`${backendUrl}/api/activity/search/?query=${query}`, {
                "method": "GET",
                "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authTokens.access}`
                }
            })
            let data = await response.json()
            const filteredActivities = data.filter((activity) => !activities.includes(activity.name));
            setSearchResults(filteredActivities)
        } catch (error) {
            console.error('Error searching tags:', error);
        }
    }

    const handleTagInputChange = (e) => {
        const { value } = e.target
        setQuery(value)
    }

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

    const tagSearchResults = (query !== '' || query !== null) && (
        <div className="tag-results-container">
            {searchResults.map((activity, index) => (
                <div key={index} className="tag-result-box" onClick={() => addActivity(activity.name)}>
                    {activity.name}
                </div>
            ))}
        </div>
    )

	const handleSubmit = async (e) => {
		e.preventDefault() 

        if (formData.min_fee > formData.max_fee) {
            alert("Min fee couldnt be greater than maximum fee")
            return;
        }
        
        const data = {
            ...formData,
            "opening_time": formatTimeToString(formData.opening_time),
            "closing_time": formatTimeToString(formData.closing_time)
        }

        const isImageChanged = e.target.elements.imgFile.files.length > 0

        if (isImageChanged) {
            await editBusiness(location.id, data, e.target.elements.imgFile.files[0])
        } else {
            await editBusiness(location.id, data)
        }

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
                        <div className="form-group">
                            <h1 className="heading business-details">Activities</h1>
                            <label htmlFor="activities">Press enter to add</label>
                            <div className="tags-input-container business-input">
                                {addedActivityItem}
                                <input 
                                    type="text"
                                    value={query} 
                                    onChange={handleTagInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add or search activities (e.g., Sightseeing, Swimming)"
                                    className="tags-input"
                                />
                            </div>
                            {tagSearchResults}
                        </div>
                        <div>
                            <h1 className="heading business-details">Tags</h1>
                            {spotTags.map((tag, index) => (
                            <div key={index} className="tags-checkbox-container">
                                <input
                                type="checkbox"
                                id={`tag-${index}`}
                                name={`tag-${index}`}
                                checked={formData.tags.includes(tag)}
                                onChange={(e) => handleSpotTagChange(e, tag)}
                                className="tags-checkbox"
                                />
                                <label className="tags-checkbox-label" htmlFor={`tag-${index}`}>{tag}</label>
                            </div>
                            ))}
                        </div>
                        <button className="add--business font14" >Submit</button>
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
            </form>
        </div>
    )
}

export default ManageSpot