import { useEffect } from "react"
import useMarkerManager from "../hooks/useMarkerManager"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { faLocationDot, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ShareMap from "../components/ShareMap"
import getFeeDetails from "../utils/getFeeDetails";


const ShareDetails = ({onClose, day, costEstimate, name, locations}) => {
    const { markers, getDayMarkersData } = useMarkerManager()

    const exportPDF = () => {
        const input = document.querySelector("#day-trips")
        const container = document.querySelector(".share--details-container");
        
        container.style.overflow = "visible"

        html2canvas(input, {logging: true, letterRendering: 1, useCORS: true})
            .then(canvas => {
                container.style.overflow = "auto";

                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF()
                pdf.addImage(imgData, 'JPEG', 0, 0)
                pdf.save('download.pdf')
            })
    }

    const displayItems = locations.map((item, index) => {
        const fee = getFeeDetails(item.details.min_cost, item.details.max_cost)

        return (
            <div key={item.id}>
                <div>
                    <div className="span-items share--location-item">
                        <p className="share--location-name">
                            <FontAwesomeIcon className="btn-icons" icon={faLocationDot} />
                            {item.details.name}
                        </p>
                        <p className="share--location-costs font-weight-500">
                            {fee === "Free" ? "Free" : `Costs around ${fee}`}
                        </p>
                    </div>
                    <div className={`share--expenses-breakdown ${index !== locations.length - 1 ? "timeline" : ""}`}>
                        { item.details.location_type == "1" &&  
                        <div>
                            {item.expense_details.required_expenses.length !== 0 &&
                            <div>
                                <p>Required Expenses</p>
                                <div className="share--expenses-container">
                                    {item.expense_details.required_expenses.map(expense => {
                                        return expense.audience_types.map(audience => {
                                            return (
                                                <div className="share--expense-detail" key={audience.id}>
                                                    <p>{expense.name} ({audience.name})</p>
                                                    <p>{audience.price}</p>    
                                                </div>
                                            )
                                        })
                                    })}
                                </div>
                                {item.expense_details.optional_expenses.length !== 0 &&
                                <div>
                                    <p>Optional Expenses</p>
                                    <div className="share--expenses-container">
                                    {item.expense_details.optional_expenses.map(expense => {
                                        return expense.audience_types.map(audience => {
                                            return (
                                                <div className="share--expense-detail" key={audience.id}>
                                                    <p>{expense.name} ({audience.name})</p>
                                                    <p>{audience.price}</p>    
                                                </div>
                                            )
                                        })
                                    })}
                                    </div>
                                </div>
                                }
                            </div>
                            }

                        </div>
                        }
                    </div>
                </div>
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