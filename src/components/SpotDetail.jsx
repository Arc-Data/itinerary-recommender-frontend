import DetailCard from "./DetailCard"

const SpotDetail = ({recommendations}) => {

    const recommendedCards = recommendations.map((location) => (
		<DetailCard key={location.id} {...location} />
	));

    return (
        <div className="detailPage--popular">
			<h2>Also Popular with travelers</h2>
			<div className="detailPage--cards">
				{recommendedCards}
			</div>
		</div>
    )
}

export default SpotDetail