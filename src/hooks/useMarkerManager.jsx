import { useState } from "react"

const useMarkerManager = () => {
    const [ markers, setMarkers] = useState([])
    
    const addMarker = (latitude, longitude, color, location="") => {
		const mapMarkers = [...markers]
		mapMarkers.push({
			lng: longitude,
			lat: latitude,
			color: color,
            location: location,
		})

		setMarkers(mapMarkers)
	}

    const deleteMarker = (latitude, longitude) => {
		const mapMarkers = markers.filter(i => i.lng !== longitude && i.lat !== latitude)
		setMarkers(mapMarkers)
	}

    const getDayMarkersData = (day) => {
        const mapMarkers = []
        const items = day.itinerary_items

        if(items) {
            console.log(items)
            items.forEach((i, idx) => {
                mapMarkers.push({
                    lng: i.details.longitude,
                    lat: i.details.latitude,
                    color: i.color,
                    order: idx + 1,
                })
            })
        }

        setMarkers(mapMarkers)
    }

    const getMarkersData = (days) => {
        const locations = []
        const mapMarkers = []

        if(days) {
            days.forEach(day => {
                day.itinerary_items.forEach(location => {
                    locations.push(location)
                    mapMarkers.push({
                        lng: location.details.longitude,
                        lat: location.details.latitude,
                        color: day.color,
                        location: location.details.name
                    })
                })
            })
        }

        setMarkers(mapMarkers)

        return locations
    }

    return {
        markers,
        addMarker,
        deleteMarker,
        getMarkersData,
        getDayMarkersData,
    }
}

export default useMarkerManager