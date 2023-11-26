import React, { useContext, useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import SAMPLEIMAGE from "/images/osmenapeak.jpg";
import Modal from "react-modal";
import ProductModal from "../modals/ProductModal";

Modal.setAppElement("#root");

const ManageBusiness = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

	const { id } = useParams();
	const { authTokens } = useContext(AuthContext);
	const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
	const [businessData, setBusinessData] = useState();
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate()

	const [formData, setFormData] = useState({
		'name': '',
		'address': '',
		'latitude': '',
		'longitude': '',
		'min_fee': 0,
		'max_fee': 0,
		'opening_time': '',
		'closing_time': '',
		'description': ''
	})

	useEffect(() => {
		const fetchData = async (id) => {
		try {
			const response = await fetch(`${backendUrl}/api/user/business/${id}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${authTokens.access}`,
			},
			});

			if (response.status === 404) {
			throw new Error("Error fetching data");
			}
			
			const data = await response.json();
			setBusinessData(data.business);

			setFormData({
			'name': data.business.name,
			'description': data.business.description,
			'latitude': data.business.latitude,
			'longitude': data.business.longitude,
			})
			setLoading(false); 
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false); 
		}
		};

		fetchData(id);
	}, [id, authTokens.access]);

	if (loading) {
		return <div>Loading...</div>; 
	}

	if (!businessData) {
		return <div>Error loading data</div>; 
	}

	const toggleAddProduct = () => {
		setAddProductModalOpen(prev => !prev)
	}

	return (
		<div className="profile--main-container">
		<form>
			<div className="admin-wrapper admin--container">
				<div className="input--form">
				<p>{
				businessData.location_type === "1" ? 
					"Spot" : businessData.location_type === "2" ? 
					"Food Place" : "Accommodation"  
				}</p>
				<div className="input admin--container">
					<label htmlFor="name">Location Name</label>
					<input
					type="text"
					name="name"
					value={businessData?.name}
					className="styled-input"
					/>
				</div>
				<div className="input admin--container">
					<label htmlFor="address">Address</label>
					<input
					type="text"
					name="address"
					value={businessData?.address}
					className="styled-input"
					/>
				</div>
				<div className="admin--container">
					<div className="input admin--container">
					<label htmlFor="latitude">Latitude</label>
					<input
						type="number"
						step="0.000001"
						name="latitude"
						value={businessData?.latitude}
						className="styled-input"
					/>
					</div>
					<div className="input admin--container">
					<label htmlFor="postalCode">Longitude</label>
					<input
						number="text"
						step="0.000001"
						name="longitude"
						value={businessData?.longitude}
						className="styled-input"
					/>
					</div>
				</div>
				{location.location_type === "1" && 
				<div className="admin--container">
					<div className="input admin--container">
					<label htmlFor="min_fee">Minimum Fee</label>
					<input
						type="text"
						name="min_fee"
						value={location?.min_fee}
						className="styled-input"
					/>
					</div>
					<div className="input admin--container">
					<label htmlFor="max_fee">Maximum Fee</label>
					<input
						number="text"
						name="max_fee"
						value={location?.max_fee}
						className="styled-input"
					/>
					</div>
				</div>
				}
				{location.location_type === "1" && 
				<div className="admin--container">
					<div className="input admin--container">
					<label htmlFor="opening">Opening Time</label>
					<input
						type="text"
						name="opening_time"
						value={location?.opening_time}
						className="styled-input"
						/>
					</div>
					<div className="input admin--container">
					<label htmlFor="closing">Closing Time</label>
					<input
						type="text"
						name="closing_time"
						value={location?.closing_time}
						className="styled-input"
						/>
					</div>
				</div>
				}
				<div className="input admin--container">
					<label htmlFor="description">Description</label>
					<textarea
					name="description"
					// value={location?.description}
					/>
				</div>
				</div>
				<div className="image--border center admin--container">
				<img className="edit--images" src={`${backendUrl}${businessData?.image}`}  />
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
			<button>Submit</button>
		</form>

		<div className="requests--table">
			<div className="flex-between">
			<p className="requests--title bold2">Product & Services</p>
			<button className="business--btn" onClick={toggleAddProduct}>
				<img src="/plus.svg" />
				<p>Add</p>
			</button>
			</div>
			<table>
			<thead className="table--th">
				<td></td>
				<td>Name</td>
				<td>Price</td>
				<td>Description</td>
				<td>Action</td>
			</thead>
			<tbody>
				<tr>
				<td>
					<img
					src={SAMPLEIMAGE}
					className="product--services-images"
					alt="SAMPLE"
					/>
				</td>
				<td></td>
				<td>150</td>
				<td>Sobrang Sarap</td>
				<td>
					<div className="d-flexCenter">
						<button className="business--edit mr10px btn--icon">
						<FaPencilAlt />
						</button>
					<button className="business--delete btn--icon">
						<FaTrash />
					</button>
					</div>
				</td>
				</tr>
			</tbody>
			</table>
		</div>
		{isAddProductModalOpen && 
		<ProductModal 
			isAddProductModalOpen={isAddProductModalOpen}
			toggleAddProduct={toggleAddProduct}/>
		}

		</div>
	);
};

export default ManageBusiness;
