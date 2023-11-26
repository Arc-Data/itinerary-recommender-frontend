import { useEffect } from "react"
import useMarkerManager from "../hooks/useMarkerManager"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import ShareMap from "../components/ShareMap"


const ShareDetails = ({onClose, day, costEstimate}) => {
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

    const displayItems = day.itinerary_items.map(item => {
        return (
            <div key={item.id}>
                <p>{item.details.name}</p>
                {item.details.min_cost !== 0 && item.details.max_cost !== 0 && 
                <p>Costs {item.details.min_cost} - {item.details.max_cost}</p>
                }
            </div>
        )
    })

    useEffect(() => {
        getDayMarkersData(day)
    }, [])

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="share--details" >
                <div className="share--details-container" id ="day-trips">
                    <div>CebuRoute</div>
                    <div>
                        <p>{day.itinerary_name}</p>
                        <p>Day {day.order}</p>
                        <p>Estimated Costs : {costEstimate}</p>
                    </div>
                    <div className="share--details-content">
                        {displayItems}
                    </div>
                    <button data-html2canvas-ignore="true" onClick={exportPDF}>Print</button>
                </div>
                <ShareMap markers={markers} />
            </div>
        </>
    )
}

export default ShareDetails