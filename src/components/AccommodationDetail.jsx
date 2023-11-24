import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { useParams } from 'react-router-dom'

const AccommodationDetail = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

	const { authTokens } = useContext(AuthContext)
	const [services, setServices] = useState([])
	const { id } = useParams()

	const displayServices = services && services.map(service => {
		return (
			<div className='food--item' key={service.id}>
				<div>
					<img src="" alt="" />
					<span></span>
				</div>
			</div>
		)
	})
	
	const getServices = async () => {
		// description : "Experience the serene twilight ambiance by the seaside in our 21 sqm room. The room features one single bed, an anti-bacterial inverter air conditioner, full HD cable TV, telephone, hair dryer, personal fridge, and complimentary coffee/tea service."
		// id : 1
		// image: "/media/location_service/OCHSingle.jpg"
		// item: "Deluxe Single"
		// price: 1700
		try {
			const response = await fetch(`${backendUrl}/api/service/${id}/`, {
				"method": "GET",
				"headers": {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${authTokens.access}`
				}
			})
			const data = await response.json()
			setServices(data)
		}
		catch (error) {
			console.log("Error occured while fetching services")
		}
	}

	useEffect(() => {
		getServices()
	}, [])
	
	return (
		<div className='food-place--container'>
			<div className='food-place--header'>
				<p className="heading2">Services</p>
			</div>
			<div className='food-items'>
				{displayServices}
			</div>
		</div>
	)
}

export default AccommodationDetail