import dayjs from "dayjs"
import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import Recommendation from "../components/Recommendation"
import useRecommendationsManager from "../hooks/useRecommendationsManager"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

const Assistant = ({onClose, day, updateDays, getLeftOverBudget}) => {
    const { authTokens } = useContext(AuthContext)
    const { loading, status, recommendations, applyRecommendation, fetchRecommendations } = useRecommendationsManager(authTokens)
    const [selectedItem, setSelectedItem] = useState() 

    const formatDate = (day) => {
        return dayjs(day.date).format("MMM D YYYY, dddd")
    }

    const displayRecommendations = recommendations && recommendations.map((recommendation, idx) => {
        return <Recommendation 
                recommendation={recommendation} 
                onClick={() => handleClick(recommendation.id)}
                selected={selectedItem === recommendation.id}
                key={recommendation.id}/>
    })

    const handleClick = (id) => {
        setSelectedItem(id)
    }

    const handleRegenerate = (e) => {
        if (e) {
            e.stopPropagation()
        }
        const leftover = getLeftOverBudget()
        fetchRecommendations(leftover)
    }

    const handleApplyRecommendation = async (e) => {
        try {
            const data = await applyRecommendation(selectedItem, day.id);
            updateDays(day.id, data.day)
        }
        catch(error) {
            console.log("An error occured: ", error)
        }
        finally {
            onClose()
        }

    }

    useEffect(() => {
        const leftover = getLeftOverBudget()
        fetchRecommendations(leftover)
    }, [])

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="assistant">
                <div className="assistant--header">
                    <p className="assistant--header-title">AI Assistant</p>
                    <p>Use AI Assistant to generate your itinerary</p>
                </div>
                <div className="assistant--content">
                    <p>Choose 1 from the list generated. Note that this will replace the itinerary you created in <span className="assistant--date">{formatDate(day.date)}</span>.</p>
                    <div className='assistant--option-label'>
                        <p className='assistant-option'>Option A</p>
                        <p className='assistant-option'>Option B</p>
                        <p className='assistant-option'>Option C</p>
                    </div>
                        {loading ? 
                        <div> Loading... </div>
                        :
                        <div className="assistant--content-grid">
                            {displayRecommendations}
                        </div>
                        }
                    <div className="assistant--regenerate" onClick={handleRegenerate}>
                        <FontAwesomeIcon className='regenerate-icon' icon={faArrowsRotate} />
                        <p className='regenerate-btn'>Regenerate</p>
                    </div>
                </div>
                { !loading &&
                <>
                <div className="assistant--footer">
                    <button className="assistant--btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button
                        disabled={!selectedItem ? true : false} 
                        className="assistant--btn btn-primary"
                        onClick={handleApplyRecommendation}>
                            Done
                    </button>
                </div>
                </>
                }
            </div>
        </>
    )
}

export default Assistant