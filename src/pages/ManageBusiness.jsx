import React, { useContext, useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext";
import Modal from "react-modal";
import ManageFood from "../components/ManageFood"
import ManageSpot from "../components/ManageSpot"
import ManageAccommodation from "../components/ManageAccommodation"

Modal.setAppElement("#root");

const ManageBusiness = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

	const { id } = useParams();
	const { authTokens } = useContext(AuthContext);
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [businessData, setBusinessData] = useState();

	useEffect(() => {
		const fetchData = async (id) => {
			setLoading
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

			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		};

		fetchData(id);
	}, [id, authTokens.access]);

	if (loading) {
		return <div>Loading...</div>; 
	}

	if (error) {
		return <div>An error occured: {error}</div>
	}

	return businessData.location_type === "1" ?
		<ManageSpot /> : businessData.location_type === "2" ? 
		<ManageFood /> : <ManageAccommodation />
};

export default ManageBusiness;
