import { useEffect, useRef, useState } from "react"
import * as maptilersdk from '@maptiler/sdk'
import "@maptiler/sdk/dist/maptiler-sdk.css"

const ShareMap = ({markers, center=false}) => {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY
    const mapContainer = useRef(null)
    const map = useRef(null)
    const cebu = { lng: 123.8854, lat: 10.3157 }
    const [zoom] = useState(11)
    const markerRefs = useRef([])
    
    maptilersdk.config.apiKey = apiKey

    const addMarkersToMap = () => {
        if (!map.current || !markers) return;
    
        const bounds = new maptilersdk.LngLatBounds();
        
        markerRefs.current.forEach(marker => marker.remove());
        markerRefs.current = [];
    
        markers.forEach(marker => {
            const newMarker = new maptilersdk.Marker({ color: marker.color })
                .setLngLat(marker)
                .addTo(map.current);

            const popup = new maptilersdk.Popup({ offset: [0, -30] }) // Adjust offset as needed
                .setHTML(`<p>${marker.order}</p>`)
                .addTo(map.current); 

            newMarker.setPopup(popup);
            markerRefs.current.push(newMarker);
        
            bounds.extend(newMarker.getLngLat())
        });

        setTimeout(() => {
            console.log("Fitting bounds")
            map.current.fitBounds(bounds, { padding: 60})
        }, 200)
    
    };

    useEffect(() => {
        if(map.current) return;

        if (center && markers) {
            console.log(markers)

            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS,
                center: [cebu.lng, cebu.lat],
                zoom: zoom
            })    
        } else {
            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS,
                center: [cebu.lng, cebu.lat],
                zoom: zoom
            })
        }


    }, [cebu.lng, cebu.lat, zoom])

    useEffect(() => {
        addMarkersToMap()
    }, [markers])


    return (
        <div className="create--map-wrap" id="nice">
            <div ref={mapContainer} className="create--map"></div>
        </div>
    )
}

export default ShareMap