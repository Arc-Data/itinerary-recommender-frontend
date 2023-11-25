import { useEffect } from "react"
import useMarkerManager from "../hooks/useMarkerManager"
import ShareMap from "./ShareMap"

const ShareDetails = ({onClose, day}) => {
    const { markers, getDayMarkersData } = useMarkerManager()

    useEffect(() => {
        getDayMarkersData(day)
    }, [])

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="share--details">
                <div>Content</div>
                <ShareMap markers={markers} />
            </div>
        </>
    )
}

export default ShareDetails