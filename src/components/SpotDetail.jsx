import { useContext, useEffect } from "react";
import useLocationManager from "../hooks/useLocationManager";
import DetailCard from "./DetailCard"
import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
	faMoneyBills,
	faTags
} from '@fortawesome/free-solid-svg-icons';

const SpotDetail = ({location}) => {
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

	const displayActivities = location && location.details.activities.map((activity, index) => {
		return (
			<div key={index} className="detailPage--tag">{activity}</div>
		)
	})

	
	const displayRequiredFees = location && location.details.required_fee.map((fee, index) => {
		return (
			<div key={index} className="detailPage--fee span-items">
				<p className="font-weight-600">{fee.fee_type}({fee.audience_type})</p>
				<p>{fee.price}</p>
			</div>
		)
	}) 

	const displayOptionalFees = location && location.details.optional_fee.map((fee, index) => {
		return (
			<div key={index} className="detailPage--fee span-items">
				<p className="font-weight-600">{fee.fee_type}({fee.audience_type})</p>
				<p>{fee.price}</p>
			</div>
		)
	}) 

	useEffect(() => {
		getRecommendedLocations(id)
	}, [])

	if (loading) {
		return (
			<div>Loading</div>
		)
	}

    return (
		<>
		<div className="detailPage--additional-details">
			<div className="detailPage--activities">
				<p className="heading2"><FontAwesomeIcon className="btn-icons" icon={faTags} />Activities</p>
				<div className="detailPage--tags">
					{displayActivities}
				</div>
			</div>
			<div className="detailPage--required-fees">
				<p className="heading2"><FontAwesomeIcon className="btn-icons" icon={faMoneyBills} />Required fees</p>
				<div className="detailPage--fees-details">
					{displayRequiredFees}
				</div>
			</div>
			<div className="detailPage--optional-fees">
				<p className="heading2"><FontAwesomeIcon className="btn-icons" icon={faMoneyBills} />Optional fees</p>
				<div className="detailPage--fees-details">
					{displayOptionalFees}
				</div>
			</div>
		</div>
        <div className="detailPage--popular">
			<h2 className='heading'>Also popular with travelers</h2>
			<div className="detailPage--cards no-margin-top">
				{recommendedCards}
			</div>
		</div>
		</>
    )
}

export default SpotDetail