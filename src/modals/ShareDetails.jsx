import { useEffect } from "react"
import useMarkerManager from "../hooks/useMarkerManager"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { faLocationDot, faFileArrowDown, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ShareMap from "../components/ShareMap"
import getFeeDetails from "../utils/getFeeDetails";


const ShareDetails = ({onClose, day, costEstimate, name, locations}) => {
    const { markers, getDayMarkersData } = useMarkerManager()

    const exportPDF = () => {
        const container = document.querySelector(".share--details-container");
        const contentToCapture = document.querySelector("#day-trips");
    
        container.style.overflow = "visible";
    
        html2canvas(contentToCapture, { logging: true, letterRendering: 1, useCORS: true })
            .then(canvas => {
                container.style.overflow = "auto";
    
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
    
                const pdfWidth = pdf.internal.pageSize.width;
                const pdfHeight = pdf.internal.pageSize.height;
    
                let yPos = 0;
                const tolerance = 1; 
    
                while (true) {
                    if (yPos > 0) {
                        pdf.addPage();
                    }
    
                    const remainingHeight = contentToCapture.offsetHeight - yPos;
                    const pageHeight = Math.min(pdfHeight, remainingHeight);
    
                    if (remainingHeight <= tolerance) {
                        break;  
                    }
    
                    const aspectRatio = canvas.width / canvas.height;
                    const pageWidth = pageHeight * aspectRatio;
    
                    pdf.addImage(imgData, 'JPEG', 0, -yPos, pageWidth, pageHeight, null, 'FAST');
                    yPos += pageHeight;
                }
    
                pdf.save('download.pdf');
            });
    };
    
    
    
    
    const displayItems = locations.map((item, index) => {
        const fee = getFeeDetails(item.details.min_cost, item.details.max_cost)
        const icon = item.details.location_type === "1" ? faLocationDot : faUtensils

        return (
            <div key={item.id}>
                <div>
                    <div className="span-items share--location-item">
                        <p className="share--location-name">
                            <FontAwesomeIcon className="btn-icons" icon={icon} />
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
                                <p className="share--expenses-header">Required Expenses</p>
                                <div>
                                    {item.expense_details.required_expenses.map(expense => {
                                        return expense.audience_types.map(audience => {
                                            return (
                                                <div className="share--expense-detail" key={audience.id}>
                                                    <p>{expense.name} ({audience.name})</p>
                                                    <p className="font-weight-500">{audience.price} PHP</p>    
                                                </div>
                                            )
                                        })
                                    })}
                                </div>
                                {item.expense_details.optional_expenses.length !== 0 &&
                                <div className="optional-expenses-container">
                                    <p className="share--expenses-header optional">Optional Expenses</p>
                                    <div>
                                    {item.expense_details.optional_expenses.map(expense => {
                                        return expense.audience_types.map(audience => {
                                            return (
                                                <div className="share--expense-detail" key={audience.id}>
                                                    <p>{expense.name} ({audience.name})</p>
                                                    <p className="font-weight-500">{audience.price}</p>    
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
                        {item.details.location_type == "2" &&
                            <div className="share--expense-detail">
                                <p>Estimated Food Expenses: {getFeeDetails(item.details.min_cost, item.details.max_cost)}</p></div>
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
                        <p>Itinerary name<span>{name} (Day {day.order})</span></p>
                        <p>Total estimated cost<span>{costEstimate}</span></p>
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