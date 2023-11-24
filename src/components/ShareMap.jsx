import { useEffect, useRef } from "react"


const ShareMap = ({day}) => {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY
    const mapContainer = useRef(null)
    const map = useRef(null)
    const cebu = { lng: 123.8854, lat: 10.3157 }
    const [zoom] = useState(11)
    const markerRefs = useRef([])
    
    maptilersdk.config.apiKey = apiKey

    const addMarkersToMap = () => {

    }

    useEffect(() => {
        if(map.current)
    })

    useEffect(() => {

    }, [])

    return (
        <div>ShareMap</div>
    )
}

export default ShareMap