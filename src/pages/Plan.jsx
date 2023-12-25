import { useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import Day from "../components/Day"
import dayjs from "dayjs"
import CreateNav from "../components/CreateNav"
import Map from "../components/Map"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faPhone, faCalendarAlt, faCheck, faMap, faMoneyBill, faPencilAlt, faPenToSquare} from "@fortawesome/free-solid-svg-icons"
import DateSettings from "../modals/DateSettings"
import useItineraryManager from "../hooks/useItineraryManager"
import useDayManager from "../hooks/useDayManager"
import useMarkerManager from "../hooks/useMarkerManager"
import Error404 from "../components/Error404"
import Error403 from "../components/Error403"
import AccordionHeader from "./AccordionHeader"
import getFeeDetails from "../utils/getFeeDetails"

const Plan = () => {
	const { authTokens } = useContext(AuthContext)
	const { id } = useParams()
	const [ includedLocations, setIncludedLocations ] = useState([])

	const { 
		loading: itineraryLoading,
		error: itineraryError,
		itinerary,
		editedName,
		setEditedName,
		getItineraryById,
		editItineraryName,
		handleEditItinerary,
		cancelEditName, 
		getLeftOverBudget,
		editedExpenses,
		submitEditedItineraryExpenses,
	} = useItineraryManager(authTokens)

	const inputRef = useRef(null)
	
	const { 
		markers, 
		getMarkersData, 
		deleteMarker, 
		addMarker } = useMarkerManager()

	const {
		loading: daysLoading,
		error: daysError,
		days,
		minCost,
		maxCost,
		removeDay,
		updateDays,
		markCompletionAndReset,
		updateCalendarDays,
		updateEstimatedCost,
		getDays,
		increaseEstimatedCost,
		decreaseEstimatedCost,
	} = useDayManager(authTokens)

	const [isExpenseOpen, setExpenseOpen] = useState(true)
	const [isItineraryOpen, setItineraryOpen] = useState(true)
	const [isCalendarOpen, setCalendarOpen] = useState(false)
	const [editName, setEditName] = useState(false)
	const [editable, setEditable] = useState(false)

	const [costEstimate, setCostEstimate] = useState(0);

	console.log(minCost, maxCost)
	console.log(itinerary?.budget)

	useEffect(() => {
		const fetchData = async () => {
			try {
				await getItineraryById(id)
				await getDays(id)
			}
			catch(error) {
				console.log("Error while retrieving itinerary")
			}
		}

		fetchData()
	}, [id])

	useEffect(() => {
		console.log("This triggers")
		let min = 0;
		let max = 0;

		if (days && days.length > 0) {
			days.forEach((day) => {
				min += day.itinerary_items.reduce((total, item) => item.details.min_cost + total, 0);
				max += day.itinerary_items.reduce((total, item) => item.details.max_cost + total, 0);
			});
		}

		updateEstimatedCost(min, max)
	}, [days]) 

	useEffect(() => {
		const costString = getFeeDetails(minCost, maxCost)
		setCostEstimate(costString)
	}, [minCost, maxCost])

	useEffect(() => {
		const locations = getMarkersData(days)
		setIncludedLocations(locations)
	}, [days])
	
	useEffect(() => {
		if (inputRef.current && editName) {
			inputRef.current.focus();
		}
	}, [editName])

	const toggleSettings = () => {
		setEditable(prev => !prev)
	}

	const toggleCalendar = (e) => {
		if(e) {
			e.stopPropagation()
		}

		setCalendarOpen(prev => !prev)
	}
	
	const toggleExpense = () => {
		setExpenseOpen(prev => !prev)
	}
	
	const toggleItinerary = () => {
		setItineraryOpen(prev => !prev)
	}

	const toggleEditName = () => {
		setEditName(prev => !prev)
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleEditName()
		} else if (e.key === 'Escape') {
			cancelEditName()
			toggleEditName()
		}
	}

	const handleEditName = () => {
		editItineraryName(id)
		toggleEditName()
	}

	const handleSubmit = () => {
		submitEditedItineraryExpenses(id)
		toggleSettings(prev => !prev)
	}

	const handleBudgetCalculcation = (days, day, budget) => {
		return getLeftOverBudget(days, day, budget)
	}

	const displayDays = days && days.map(day => {
		return <Day 
			key={day.id} 
			day={day} 
			updateDays={updateDays}
			removeDay={removeDay}
			addMarker={addMarker}
			deleteMarker={deleteMarker}
			includedLocations={includedLocations}
			setIncludedLocations={setIncludedLocations}
			increaseEstimatedCost={increaseEstimatedCost}
			decreaseEstimatedCost={decreaseEstimatedCost}
			markCompletionAndReset={markCompletionAndReset}
			getLeftOverBudget={() => handleBudgetCalculcation(days, day, itinerary.budget)}
			/>
		})

	const getDayTabs = days && days.map(day => {
		return (
			<div key={day.id}>
				<p></p>
				<p>{dayjs(day.date).format('ddd, M/D')}</p>
			</div>
		)
	})

	if (itineraryLoading) return (
		<div>Loading Itinerary Details</div>
	)

	if(itineraryError) {
		if (itineraryError===404) {
			return (
				<div>
					<UserNav />
					<Error404 />
				</div>
			)
		}
		else if (itineraryError===403) {
			return (
				<div>
					<UserNav />
					<Error403 />
				</div>
			)
		}
		else {
			return (
				<div>{itineraryError}</div>
			)
		}
	}

	if (daysLoading) return (
		<div>Loading Related Days Information</div>
	)

	if (daysError) return (
		<div>{daysError}</div>
	)
 
	return (
		<>
		<div className="create--layout">
			<div>
				<CreateNav />
				<div className="plan--layout">
					<aside className="plan--side-panel">
						<div>
							<AccordionHeader 
								active={isExpenseOpen}
								handleClick={toggleExpense}
								icon={faMoneyBill}
								text={"Expenses"}
							/>
							{isExpenseOpen && 
							<div className="accordion-content">
								<div >
									<p></p>
									<p>Budget</p>
								</div>
								<div >
									<p></p>
									<p>Group Size</p>
								</div>
							</div>}
						</div>
						<div>
							<AccordionHeader 
								active={isItineraryOpen}
								handleClick={toggleItinerary}
								icon={faMap}
								text={"Itinerary"}/>
							{isItineraryOpen && 
							<div className="accordion-content">
								{ getDayTabs }
							</div>
							}
						</div>
						<div className="contact--div">
							<p>Need a ride for your upcoming trip? Contact our drivers now!</p>
							<Link to="assistantContact">
							<button className="contact--button">
								<FontAwesomeIcon icon={faPhone} style={{ marginRight: "8px", color: "black" }} />
								Contact now
							</button>
							</Link>
						</div>
					</aside>
					<main className="plan--main-panel">
						<section className="plan--expense-section">
							<div className='span-items'>
								<p className="heading">Expenses</p>
								{
									
									editable ?
									<button className='save-details-btn no-margin-top no-margin-bottom' onClick={handleSubmit}>
									<FontAwesomeIcon className='save-details-icon' icon={faCheck} />
									</button>
									:
									<button className='edit-details-btn no-margin-top no-margin-bottom' onClick={toggleSettings}>
									<FontAwesomeIcon className='edit-details-icon' icon={faPenToSquare} />
									</button>
								}
							</div>
							<div className="plan--expense-form">
								<div className="form-row">
									<label className='plan--label' htmlFor="number_of_people">Groupsize</label>
									{editable ?
									<input 
										type="number" 
										name="number_of_people"
										id="number_of_people"
										onChange={handleEditItinerary}
										defaultValue={editedExpenses?.number_of_people}
									/>
									:
									<p className="plan--edited-details">{editedExpenses?.number_of_people}</p>	
									}	
								</div>
								<div className="form-row">
									<label className='plan--label' htmlFor="budget">Budget (per person)</label>
									{editable ? 
										<input 
											type="number" 
											name="budget" 
											id="budget"
											defaultValue={itinerary?.budget}
											onChange={handleEditItinerary}
										/>							
									:
										<>
											<p className={`plan--edited-details ${itinerary?.budget && itinerary.budget < minCost ? 'error' : ''}`}>
												₱{itinerary?.budget}
								  			</p>
											  {itinerary?.budget && itinerary.budget < minCost ? (
										  	<p className="budget--error-message">Your budget is not enough for this trip!</p>
											) : (
											  null
											)}
										</>
									}
								</div>
							</div>
							<div className='plan--cost-estimate'>
									<p className='plan--label'>Estimated Expenses: ₱ {costEstimate}</p>
								</div>
						</section>
						<section className="plan--itinerary-section">
							{editName ? 
							<div className="plan--itinerary-header">
								<div className="plan--itinerary-title">
									<input 
										ref={inputRef}
										value={editedName}
										placeholder={"Enter Trip Name"} 
										onChange={(e) => setEditedName(e.target.value)} 
										maxLength={60}
										onKeyDown={handleKeyPress}
										className="plan--edit-name" />
								</div>
								<FontAwesomeIcon 
									icon={faCheck} 
									onClick={handleEditName} 
									className="check-icon"/>
							</div>
							:
							<div className="plan--itinerary-header">
								<div className="plan--itinerary-title">
									<p className="plan--title heading">{itinerary?.name}</p>
								</div>
								<div className="plan--itinerary-header-icons">
									<FontAwesomeIcon 
										icon={faPenToSquare}
										onClick={toggleEditName} 
										className="pencil-icon"/>
									<FontAwesomeIcon 
										className="calendar-icon"
										onClick={toggleCalendar}
										icon={faCalendarAlt}/>
								</div>
							</div>
							}
							{displayDays}
						</section>
					</main>
				</div>
			</div>
			<Map markers={markers}/>
		</div>
		{isCalendarOpen && <DateSettings onClose={toggleCalendar} updateDays={updateCalendarDays}/>}
		</>
    	
  	)
}

export default Plan