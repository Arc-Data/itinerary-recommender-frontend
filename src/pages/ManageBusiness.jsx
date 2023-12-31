import React, { useContext, useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext";
import ManageFood from "../components/ManageFood"
import ManageSpot from "../components/ManageSpot"
import ManageAccommodation from "../components/ManageAccommodation"
import useBusinessManager from "../hooks/useBusinessManager";

const ManageBusiness = () => {
	const { id } = useParams();
	const { authTokens } = useContext(AuthContext);
	const { location, loading, error, getBusinessDetail, editBusiness } = useBusinessManager(authTokens)

	useEffect(() => {
		getBusinessDetail(id)
	}, [id]);

	if (loading) {
		return <div>Loading...</div>; 
	}

	if (error) {
		return <div>An error occured: {error}</div>
	}

	return location.location_type === "1" ?
		<ManageSpot location={location} editBusiness={editBusiness}/> : location.location_type === "2" ? 
		<ManageFood location={location} editBusiness={editBusiness}/> : <ManageAccommodation location={location} editBusiness={editBusiness}/>
};

export default ManageBusiness;
