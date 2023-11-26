import { useState } from "react";
import Modal from "../components/Modal"
import DatePicker from 'react-datepicker';
import { useParams } from "react-router-dom";

const DateSettings = ({onClose, updateDays}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    const handleClick = async (e) => {
        setLoading(true)
    
        try {
            const response = await fetch(`${backendUrl}/api/itinerary/${id}/calendar/`, {
                'method': "POST",
                'headers': {
                    "Content-Type": "application/json",
                },
                'body': JSON.stringify({
                    'startDate': startDate.toLocaleDateString('en-US', {'timezone': 'Asia/Manila'}),
                    'endDate': endDate.toLocaleDateString('en-US', {'timezone': 'Asia/Manila'}),
                })
            })

            if(!response.ok) {
                throw new Error('Something went wrong')
            }

            const data = await response.json()
            console.log(data.message)

            updateDays(data.days)
        }
        catch (error){
            console.log("An error occured: ", error)
        }

        setLoading(false)
    }

    return (
        <Modal onClose={onClose}>
            <div>
                <p className="datesettings--modal-title heading">Trip Date</p>
                <div className="datesettings--container">
                    <div className="datesettings--input-group">
                        <label htmlFor="startDate">Start date</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            className="datesettings--form-input"
                            startDate={startDate}
                            endDate={endDate}
                            isClearable
                        />
                    </div>
                    <div className="datesettings--input-group">
                        <label htmlFor="endDate">End date</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            className="datesettings--form-input"
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            isClearable
                        />

                    </div>
                </div>
                <button 
                    className="plan--btn btn-primary" 
                    disabled={!startDate || !endDate}
                    onClick={handleClick}>
                        {loading ? `Loading...` : `Save`}
                </button>
            </div>
        </Modal>
    )
}

export default DateSettings