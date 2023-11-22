import { useContext, useEffect } from "react";
import useLocationManager from "../hooks/useLocationManager";
import DetailCard from "./DetailCard"
import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";

const SpotDetail = () => {
	const { authTokens } = useContext(AuthContext)
	const { id } = useParams()
	const { 
		recommendations,
		loading,
		error,
		getRecommendedLocations,
	} = useLocationManager(authTokens)

    const recommendedCards = recommendations.map((location) => (
		<DetailCard key={location.id} {...location} />
	));

	useEffect(() => {
		getRecommendedLocations(id)
	}, [])

	if (loading) {
		return (
			<div>Loading</div>
		)
	}

    return (
        <div className="detailPage--popular">
			<h2 className='heading'>Also Popular with travelers</h2>
			<div className="detailPage--cards no-margin-top">
				{recommendedCards}
			</div>
		</div>
    )
}

export default SpotDetail