import { useState } from "react"

const useMarkerManager = () => {
    const [ markers, setMarkers] = useState([])
    
    const addMarker = (latitude, longitude, color, name, events) => {
		const mapMarkers = [...markers]

        mapMarkers.push({
			lng: longitude,
			lat: latitude,
			color: color,
            location: name,
		})

        if (events) {
            events.forEach(event => {
                mapMarkers.push({
                    lng: event.longitude,
                    lat: event.latitude, 
                    color: "#d9ed92",
                    location: event.name,
                })
            })
        }

		setMarkers(mapMarkers)
	}

    const deleteMarker = (latitude, longitude, events) => {
		let mapMarkers = markers.filter(i => i.lng !== longitude && i.lat !== latitude)
		
        if (events) {
            events.forEach(event => {
                console.log(event)
                mapMarkers = mapMarkers.filter(i => i.lng !== event.longitude && i.lat !== event.latitude)
            })
        }
        
        setMarkers(mapMarkers)
	}

    const getDayMarkersData = (locations) => {
        const mapMarkers = []
        locations.forEach((i, idx) => {
            mapMarkers.push({
                lng: i.details.longitude,
                lat: i.details.latitude,
                color: i.color,
                order: idx + 1,
            })
        })

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

                    location.details.event.forEach(event => {
                        mapMarkers.push({
                            lng: event.longitude,
                            lat: event.latitude,
                            location: event.name,
                            color: "#d9ed92"
                        })
                    })
                })

                
            })
        }

        setMarkers(mapMarkers)

        return locations
    }
    
    const customAddMarker = (latitude, longitude, color, name) => {
        const mapMarkers = [...markers]
        mapMarkers.push({
            lng: longitude,
            lat: latitude,
            color: color, 
            order: name
        })

        setMarkers(mapMarkers)
    }

    return {
        markers,
        addMarker,
        customAddMarker,
        deleteMarker,
        getMarkersData,
        getDayMarkersData,
    }
}

export default useMarkerManager