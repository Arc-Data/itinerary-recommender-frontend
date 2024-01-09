import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import ReactDatePicker from "react-datepicker";

const ManageBusiness = ({ location, editBusiness }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

	const { authTokens } = useContext(AuthContext)
	const navigate = useNavigate()
	
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
	})

    const [ selectedImage, setSelectedImage ] = useState(`${backendUrl}${location.image}?timestamp=${Date.now()}`)
	const [searchResults, setSearchResults] = useState([])
	const [query, setQuery] = useState('')
	const [tags, setTags] = useState(location.tags)

	const handleChangeInput = (e) => {
		const { name, value } = e.target

		console.log(name, value)
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
 	}
	
	 const handleTagInputChange = (e) => {
        const { value } = e.target
        setQuery(value)
        searchTags(value)
    }

	 const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (e.target.classList.contains('tags-input')) {
				addTag(query);
			} 
		}
	};

	const addTag = async (tagName) => {
        try {
			if (!tags.includes(tagName)) {
				setTags(prevTags => [...prevTags, tagName])
				await createTag(tagName)
			}
            setQuery('')
        } catch (error) {
            console.error('Error adding tag:', error)
        }
    }

	const createTag = async (tagName) => {
		try {
			const response = await fetch(`${backendUrl}/api/user/business/${location.id}/edit/add_foodtags/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${String(authTokens.access)}`
				},
				body: JSON.stringify({'tag': tagName})
			})
			console.log(response)
			const data = await response.json()
			console.log(data)
			const tag = data.data.name
			const updatedTags = [...tags, tag]
			setTags(updatedTags)
		}
		catch (error) {
			console.log("error while adding tags: ", tags)
		}
	}

	const searchTags = async (query) => {
        try {
			const response = await fetch(`${backendUrl}/api/foodtag/search/?query=${query}`, {
					"method": "GET",
					"headers": {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${authTokens.access}`
					}
			})
			let data = await response.json()
			const filteredTags = data.filter((tag) => !tags.includes(tag.name));
			setSearchResults(filteredTags)
        } catch (error) {
	        console.error('Error searching tags:', error);
        }
    }

	const removeTag = async (e, removedTag) => {
		console.log("Wait why")
		e.preventDefault()
		try {
			const response = await fetch(`${backendUrl}/api/user/business/${location.id}/edit/remove_foodtags/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${String(authTokens.access)}`
				},
				body: JSON.stringify({'tag': removedTag}),
			})
			const data = await response.json()

		}
		catch (error) {
			console.log("Error occured while removing tags", error)
			return 
		}

		const updatedTags = tags.filter(tag => tag != removedTag)
		setTags(updatedTags)
	}

	const displayTags = tags && tags.map((tag, idx) => {
		return (
			<div className="tag-item" key={idx}>
				{tag}
				<button className="delete-tag-button" onClick={(e) => removeTag(e, tag)}>
					<FontAwesomeIcon icon={faCircleXmark} />
				</button>
			</div>

		)
	})

	const tagSearchResults = (query !== '' || query !== null) && (
        <div className="tag-results-container">
            {searchResults.map((tag, index) => (
                <div key={index} className="tag-result-box" onClick={() => addTag(tag.name)}>
                    {tag.name}
                </div>
            ))}
        </div>
    )

	const formatTimeToString = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

	const handleSubmit = async (e) => {
		e.preventDefault() 

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
					<h1 className="heading business-details">Tags</h1>
					<label htmlFor="tags">Tags</label>
					<div className="tags-input-container business-input">
						{displayTags}
						<input 
							type="text" 
							value={query} 
							onChange={handleTagInputChange}
							onKeyDown={handleKeyDown}
							placeholder= "Add or search tags (e.g. Filipino, Fastfood)"
							className="tags-input"
						/>
					</div>
					{tagSearchResults}
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
			
			
			<button className="add--business font14">Submit</button>
		</form>

		</div>
	);
};

export default ManageBusiness;
