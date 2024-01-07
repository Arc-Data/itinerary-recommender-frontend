import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import SAMPLEIMAGE from "/images/osmenapeak.jpg";
import Modal from "react-modal";
import ProductModal from "../modals/ProductModal";
import AuthContext from "../context/AuthContext";

Modal.setAppElement("#root");

const ManageBusiness = ({ location, editBusiness }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

	const { authTokens } = useContext(AuthContext)
	const navigate = useNavigate()

    const [formData, setFormData] = useState({
		'name': location.name,
		'address': location.address,
		'latitude': location.latitude,
		'longitude': location.longitude,
		'description': location.description,
        'location_type': location.location_type,
	})

	console.log(location)

	const [ tags, setTags ] = useState(location.tags)

	const handleChangeInput = (e) => {
		const { name, value } = e.target

		console.log(name, value)
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
 	}

	const removeTag = async (e, removedTag) => {
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
			console.log(response)
			const data = await response.json()
			console.log(data)

		}
		catch (error) {
			console.log("Error occured while removing tags", error)
			return 
		}

		const updatedTags = tags.filter(tag => tag != removedTag)
		setTags(updatedTags)
	}

	const displayTags = tags && tags.map((tag, idx) => {
		console.log(tag)
		return (
			<div key={idx}>
				<div>{tag}</div>
				<button onClick={(e) => removeTag(e, tag)}>X</button>
			</div>

		)
	})

	const handleSubmit = (e) => {
		e.preventDefault() 
		editBusiness(location.id, formData)
		navigate(-1)
	}


	return (
		<div className="profile--main-container">
		<form onSubmit={handleSubmit}>
			<div className="admin-wrapper admin--container">
				<div className="input--form">
				<p className="heading no-margin">Food Place</p>
				<div className="input admin--container">
					<label htmlFor="name">Location Name</label>
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
				{location.location_type === "1" && 
				<div className="admin--container">
					<div className="input admin--container">
					<label htmlFor="opening">Opening Time</label>
					<input
						type="text"
						onChange={handleChangeInput}
						name="opening_time"
						value={formData.opening_time}
						className="business-input"
						/>
					</div>
					<div className="input admin--container">
					<label htmlFor="closing">Closing Time</label>
					<input
						type="text"
						onChange={handleChangeInput}
						name="closing_time"
						value={formData.closing_time}
						className="business-input"
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
						className="business-input description"
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
		<div>
		{displayTags}
		</div>

		</div>
	);
};

export default ManageBusiness;
