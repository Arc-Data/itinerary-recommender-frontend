import { useContext, useState } from "react"
import Modal from "./Modal"
import useDayManager from "../hooks/useDayManager"
import AuthContext from "../context/AuthContext"

const Color = ({onClose, day, updateDays}) => {
    const { authTokens } = useContext(AuthContext)
    const [selectedColor, setSelectedColor] = useState()

    const { updateDayColor } = useDayManager(authTokens)

    const colors = ['#d11149', '#e62314', '#6610f2', '#257ce6', '#72ce27', '#ffb600', '#184E77']

    const handleSubmit = async (e) => {
        try {
            const data = await updateDayColor(day.id, selectedColor)
            updateDays(day.id, data.day)
        }
        catch (error) {
            console.log("An error occured: ", error)
        } 
        finally {
            onClose()
        }
    }

    return (
        <Modal onClose={onClose}>
            <div className="color--modal">
                <p className='heading3'>Pick location marker color</p>
                <div className="color--selection">
                    {colors.map((color, idx) => {
                        const style = {
                            'backgroundColor': color,
                            'border': `${selectedColor === color ? "2px solid #333" : ""} `
                        }
                        
                        return (
                        <div
                            key={idx} 
                            name={color}
                            style={style}
                            onClick={() => setSelectedColor(color)}
                            className="color--selection-item"></div>
                        )
                    })}
                </div>
                <div className='color-button-container'>
                    <button 
                        className="assistant--btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!selectedColor}
                        className="assistant--btn btn-primary">Done</button>
                </div>
            </div>
        </Modal>
    )
}

export default Color