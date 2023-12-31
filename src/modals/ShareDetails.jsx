import { useEffect } from "react"
import useMarkerManager from "../hooks/useMarkerManager"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { faLocationDot, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ShareMap from "../components/ShareMap"


const ShareDetails = ({onClose, day, costEstimate, name, locations}) => {
    const { markers, getDayMarkersData } = useMarkerManager()

    const exportPDF = () => {
        const input = document.querySelector("#day-trips")
        html2canvas(input, {logging: true, letterRendering: 1, useCORS: true})
            .then(canvas => {
                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF()
                pdf.addImage(imgData, 'JPEG', 0, 0)
                pdf.save('download.pdf')
            })
    }

    const displayItems = locations.map((item, index) => {
        return (
            <div key={item.id}>
                <div className="span-items share--location-item">
                    <p className="share--location-name">
                        <FontAwesomeIcon className="btn-icons" icon={faLocationDot} />
                        {item.details.name}
                    </p>
                    {item.details.min_cost !== 0 && item.details.max_cost !== 0 && 
                    <p className="share--location-costs font-weight-500">Costs {item.details.min_cost} - {item.details.max_cost} PHP</p>
                    }
                </div>
                {index !== locations.length - 1 && <div className="location-divider"></div>}
            </div>
        )
    })


    useEffect(() => {
        getDayMarkersData(locations)
    }, [])

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="share--details">
                <div className="share--details-container" id ="day-trips">
                    <div className="span-items">
                        <div className="heading share--cebu-route">CebuRoute</div>
                        <button data-html2canvas-ignore="true" onClick={exportPDF} className="share--details-download-btn"><FontAwesomeIcon className="btn-icons" icon={faFileArrowDown} />Download</button>
                    </div>
                    <div className="share--details-header">
                        <p>Itinerary name: {name}</p>
                        <p>Day number: {day.order}</p>
                        <p>Total estimated cost: {costEstimate}</p>
                    </div>
                    <div className="share--details-content">
                        {displayItems}
                    </div>
                </div>
                <ShareMap markers={markers} />
            </div>
        </>
    )
}

export default ShareDetails