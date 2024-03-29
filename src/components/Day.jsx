import { useContext, useEffect, useState } from "react"
import LocationItem from "./LocationItem"
import dayjs from "dayjs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faChevronDown, faChevronUp, faBars, faPlus, faDotCircle, faCircle, faEllipsis, faPalette, faEdit, faFileArrowDown, faTrashCan, faRemove, faTrash, faLocationDot, faCheckDouble, faShare } from "@fortawesome/free-solid-svg-icons";
import AddLocation from "../modals/AddLocation";
import ConfirmDeleteItem from "../modals/ConfirmDeleteItem";
import { DragDropContext,  Draggable } from "react-beautiful-dnd";
import AuthContext from "../context/AuthContext";
import StrictModeDroppable from "../components/StrictModeDroppable"
import Assistant from "../modals/Assistant";
import Color from "./Color";
import getFeeDetails from "../utils/getFeeDetails";
import ConfirmDeleteDay from "../modals/ConfirmDeleteDay";
import useItemLocationManager from "../hooks/useItemLocationManager";
import utc from 'dayjs/plugin/utc'
import CompletionModal from "../modals/CompletionModal";
import ShareDetails from "../modals/ShareDetails";

dayjs.extend(utc)

const Day = ({ day, updateDays, removeDay, addMarker, 
        deleteMarker, includedLocations, setIncludedLocations, increaseEstimatedCost, 
        decreaseEstimatedCost, markCompletionAndReset, getLeftOverBudget, itineraryName}) => {
    
    const { authTokens } = useContext(AuthContext)
    const [open, setOpen] = useState(false)

    const [locations, setLocations] = useState([])
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [ordering, setOrdering] = useState(false)
    const [itemOrdering, setItemOrdering] = useState([])
    const [openLocationModal, setLocationModal] = useState(false)
    const [openDeleteModal, setDeleteModal] = useState(false)
    const [openDeleteDayModal, setOpenDeleteDayModal] = useState(false)
    const [openAssistantModal, setAssistantModal] = useState(false)
    const [openDaySettings, setOpenDaySettings] = useState(false)
    const [openColorModal, setOpenColorModal] = useState(false)
    const [openCompletionModal, setOpenCompletionModal] = useState(false)
    const [openShareDetails, setOpenShareDetails] = useState(false)

    const [leftOverBudget, setLeftOverBudget] = useState(0)
    const [costEstimate, setCostEstimate] = useState(0)

    const { updateItemOrdering } = useItemLocationManager(authTokens)

    useEffect(() => {
        setLocations(day.itinerary_items)
    }, [day])

    const toggleOpen = () => {
        setOpen(prev => !prev)
    }

    const toggleDeleteModal = (event, itemId) => {
        if(event) {
            event.stopPropagation()
        }

        setDeleteModal(prev => !prev)
        setSelectedItemId(itemId)
    }

    const toggleLocationModal = (event) => {
        if(event) {
            event.stopPropagation()
        }
        setLocationModal(prev => !prev)
    }

    const toggleDeleteDayModal = (event) => {
        if (event) {
            event.stopPropagation()
        }
        setOpenDaySettings(false)
        setOpenDeleteDayModal(prev => !prev)
    }

    const toggleShareDetails = () => {
        setOpenDaySettings(false)
        setOpenShareDetails(prev => !prev)
    }

    const toggleAssistantModal = (event) => {
        if(event) {
            event.stopPropagation()
        }
        setAssistantModal(prev => !prev)
    }

    const toggleOpenColorModal = (event) => {
        if(event) {
            event.stopPropagation()
        }
        setOpenDaySettings(false)
        setOpenColorModal(prev => !prev)
    }

    const toggleCompletionModal = (e) => {
        if (e) {
            e.stopPropagation()
        }
        setOpenCompletionModal(prev => !prev)
    }

    const toggleOrdering = () => {
        const isOrderingActive = !ordering
        setOrdering(prev => !prev)

        if(isOrderingActive) {
            const arr = [...locations]
            setItemOrdering(arr)
        }
    }

    const itineraryLocations = () => locations.map(location => {
        return (
            <LocationItem location={location} key={location.id}/>
        )
    })

    const preventSettingsPropagation = (e) => {
        e.stopPropagation()
    }

    const toggleDaySettingsClick = () => {
        setOpenDaySettings(prev => !prev)
    }

    const moveItemUp = (index) => {
        if (index === 0) return;
    
        const reorderedLocations = [...itemOrdering];
        const temp = reorderedLocations[index];
        reorderedLocations[index] = reorderedLocations[index - 1];
        reorderedLocations[index - 1] = temp;
    
        setItemOrdering(reorderedLocations);
    };
    
    const moveItemDown = (index) => {
        if (index === locations.length - 1) return;
    
        const reorderedLocations = [...itemOrdering];
        const temp = reorderedLocations[index];
        reorderedLocations[index] = reorderedLocations[index + 1];
        reorderedLocations[index + 1] = temp;
    
        setItemOrdering(reorderedLocations);
    };

    const onSaveOrdering = async () => {
        const locations = [...itemOrdering]
        const updatedLocations = await updateItemOrdering(locations, day.id)
        setLocations(updatedLocations)
        toggleOrdering()
    }

    const onDragEnd = (result) => {
        if(!result.destination) {
            return;
        }

        const reorderedlocations = [...itemOrdering]
        const [reorderedItem] = reorderedlocations.splice(result.source.index, 1)
        reorderedlocations.splice(result.destination.index, 0, reorderedItem)
    
        setItemOrdering(reorderedlocations)
    }

    useEffect(() => {
        let min = locations.reduce((total, item) => item.details.min_cost + total, 0)
        let max = locations.reduce((total, item) => item.details.max_cost + total, 0)

        const costString = getFeeDetails(min, max)
        setCostEstimate(costString)
    }, [locations])


    return (
        <div className="plan--itinerary">
            <div onClick={toggleOpen} className="plan--itinerary-day">
                <p>
                    <FontAwesomeIcon className="icon--chevron" icon={open ? faChevronUp : faChevronDown} size="2xs" />           
                    <span className='heading3'>{dayjs(day.date).format("dddd, MMM D")}</span>
                </p>
                <div className="plan--day-settings" onClick={preventSettingsPropagation}>
                    {day.date_status !== "soon" && !day.completed && locations.length > 0 && 
                    <div className="plan--day-complete" onClick={toggleCompletionModal}><FontAwesomeIcon className="btn-icons" icon={faCheckDouble} />Mark as visited</div>
                    }
                    <div className="plan--day-ellipsis">
                        <FontAwesomeIcon icon={faEllipsis} onClick={toggleDaySettingsClick}/>
                        { openDaySettings && 
                        <div className="plan--day-dropcontent"> 
                            {!day.completed && 
                            <div className="plan--day-dropcontent-item" onClick={toggleDeleteDayModal}>
                                <FontAwesomeIcon icon={faTrashCan} />
                                <p>Delete</p>
                            </div>
                            }
                            <div className="plan--day-dropcontent-item" onClick={toggleOpenColorModal}>
                                <FontAwesomeIcon icon={faPalette} />
                                <p>Map marker</p>
                            </div>
                            <div className="plan--day-dropcontent-item" onClick={toggleShareDetails}>
                                <FontAwesomeIcon icon={faFileArrowDown} />
                                <p>Download</p>
                            </div>
                            
                        </div>                    
                        }
                    </div>
                </div>
                {locations.length !== 0  && 
                <p className="plan---details">
                    <span>Total places: {locations.length} </span> - 
                    <span> Cost estimate: {costEstimate}</span>
                </p>
                }
            </div>
            
            { open && 
            <>  

            { ordering ? (
            <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable droppableId="droppable">
                    {(provided) => (
                        <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="plan--order-container">
                                
                                <p>Drag the items around to influence their ordering.</p>
                                {itemOrdering.map((location, index) => (
                                    <Draggable 
                                        key={location.id}
                                        index={index}
                                        draggableId={location.id.toString()}>
                                    {(provided) => (
                                        <div 
                                            className="order-item"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <FontAwesomeIcon icon={faBars} />
                                            <FontAwesomeIcon icon={faLocationDot} className="assistant--location-icon"/>
                                            <p>{location.details.name}</p>
                                            <div className="order-icons">
                                                <div className="order-icon" onClick={() => moveItemUp(index)}>
                                                    <FontAwesomeIcon icon={faChevronUp} />
                                                </div>
                                                <div className="order-icon" onClick={() => moveItemDown(index)}>
                                                    <FontAwesomeIcon icon={faChevronDown} />
                                                </div>
                                                <div className="order-icon" onClick={(e) => toggleDeleteModal(e, location.id)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                    )}
                </StrictModeDroppable>
            </DragDropContext>
            )
            :
            <div className="plan--itinerary-items">
                {itineraryLocations()}
            </div>
            }
            <div className="plan--btn-container">
                {!day.completed && 
                <div className="plan--btn-list">
                    {ordering ? 
                    <>
                        <button
                            onClick={toggleOrdering} 
                            className="plan--btn btn-secondary">
                            Cancel
                        </button>
                        <button
                            onClick={onSaveOrdering} 
                            className="plan--btn btn-primary">
                            Done
                        </button>
                    </>
                    :
                    <>
                        <button
                            onClick={toggleLocationModal} 
                            className="plan--btn btn-primary">
                            <span><FontAwesomeIcon className="btn-icons" icon={faPlus}/>Add Location</span>
                        </button>
                        <button 
                            onClick={toggleAssistantModal}
                            className="plan--btn btn-secondary">
                            <span className="ai-assistant"><FontAwesomeIcon className="btn-icons" icon={faWandMagicSparkles}/>AI Assistant</span>
                        </button>
                        {locations &&
                        <button className="btn-link" onClick={toggleOrdering}>Edit</button>
                        }
                    </>
                    }                    
                </div>
                }
            </div>
            </>
            }
            {openLocationModal && 
            <AddLocation 
                onClose={toggleLocationModal} 
                locations={locations}
                setLocations={setLocations}
                day={day}
                includedLocations={includedLocations}
                setIncludedLocations={setIncludedLocations}
                addMarker={addMarker} 
                deleteMarker={deleteMarker} 
                increaseEstimatedCost={increaseEstimatedCost}
                decreaseEstimatedCost={decreaseEstimatedCost}
                />
            }
            {openDeleteModal && 
            <ConfirmDeleteItem 
                onClose={toggleDeleteModal}
                itemId={selectedItemId}
                deleteMarker={deleteMarker}
                locations={locations}
                setLocations={setLocations} 
                includedLocations={includedLocations}
                setIncludedLocations={setIncludedLocations}
                setItemOrdering={setItemOrdering}
                updateDays={updateDays}
                decreaseEstimatedCost={decreaseEstimatedCost}
                />
            }
            {openAssistantModal &&
            <Assistant 
                onClose={toggleAssistantModal}
                day={day}
                updateDays={updateDays}
                getLeftOverBudget={getLeftOverBudget}/>
            }
            {openColorModal &&
            <Color 
                onClose={toggleOpenColorModal}
                day={day}
                updateDays={updateDays}/>
            }
            {openDeleteDayModal &&
            <ConfirmDeleteDay 
                onClose={toggleDeleteDayModal} 
                removeDay={removeDay}
                dayId={day.id}/>
            }
            {openCompletionModal && 
            <CompletionModal 
                onClose={toggleCompletionModal}
                dayId={day.id}
                markCompletionAndReset={markCompletionAndReset}/>
            }
            {openShareDetails &&
            <ShareDetails 
                onClose={toggleShareDetails} 
                day={day}
                costEstimate={costEstimate}
                name={itineraryName}
                locations={locations}/>
            }
        </div>
    )
}

export default Day