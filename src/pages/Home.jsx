import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Itinerary from "../components/Itinerary";
import DetailCard from "../components/DetailCard";
import BookmarkHomepage from "../components/BookmarkHomepage";
import useItineraryManager from "../hooks/useItineraryManager";
import useDayManager from "../hooks/useDayManager";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCalendarDays, faCircleCheck} from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import useRecommendationsManager from "../hooks/useRecommendationsManager";


const HomePage = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
	const { user, authTokens } = useContext(AuthContext)
	const { itineraries, getItineraries, deleteItinerary } = useItineraryManager(authTokens)
	const { days, error, loading, getActiveTrips, markDaysAsCompleted } = useDayManager(authTokens)
	const { recommendations, getRecommendedFoodPlaces } = useRecommendationsManager(authTokens)
	const [ selectedDays, setSelectedDays ] = useState([])
	const [recommendedLocations, setRecommendedLocations] = useState([]);
	const [recentBookmarks, setRecentBookmarks] = useState([]);
	

	// GET RECOMMENDED LOCATIONS
	const getRecommendedLocations = async () => {
		try {
		  const response = await fetch(
			`${backendUrl}/api/recommendations/homepage/`,
			{
			  method: "GET",
			  headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${authTokens.access}`,
			  },
			}
		  );

		  if (!response.ok) {
			throw new Error("Error fetching recommended locations data");
		  }
  
		  const data = await response.json();
		  setRecommendedLocations(data.recommendations);
		} catch (error) {
		  console.error("Error while fetching recommended locations data: ", error);
		}
	  };

	// GET RECENT BOOKMARKS
	const getRecentBookmarks = async () => {
		try {
			const response = await fetch(
				`${backendUrl}/api/bookmarks/`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${authTokens.access}`,
					},
				}
			);
		
			if (!response.ok) {
				throw new Error("Error fetching recent bookmarks data");
			}

			const data = await response.json();
			setRecentBookmarks(data);
		} catch (error) {
			console.error("Error while fetching recent bookmarks data: ", error);
		}
	};
	  

	useEffect(() => {
		getItineraries();
		getActiveTrips();
		getRecommendedLocations();
		getRecentBookmarks();
		getRecommendedFoodPlaces()
	}, [])

	const toggleDaySelection = (dayId) => {
		const isSelected = selectedDays.includes(dayId)
		
		if (isSelected) {
			setSelectedDays(prev => prev.filter(id => id !== dayId))
		} 
		else {
			setSelectedDays(prev => [...prev, dayId])
		}
	}

	const handleMarkDaysAsCompleted = () => {
		markDaysAsCompleted(selectedDays)
	}

	const displayActiveTrips = () => {
 		return days.map(day => {
			const locations = day.locations.join(" • ")

			return (
				<div key={day.id} className="active--day-item">
					<div>
						<p className='active--trip-name heading3'>{day.name}</p>
						<p className='active--trip-date font-weight-500'><FontAwesomeIcon className='btn-icons' icon={faCalendarDays} />{dayjs(day.date).format('MMM D, YYYY')}</p>
					</div>
					<div className="active--trip-locations font-weight-500">{locations}</div>
					<div className="active--trip-btns">
						<div>
							<Link to={`/plan/${day.itinerary}`}>
								<button className="active--trip-edit"><FontAwesomeIcon icon={faPenToSquare} /></button>
							</Link>					
							<Link to={`/profile/rate/${day.id}`}>
								<button className="active--trip-view"><FontAwesomeIcon icon={faCircleCheck} /></button>
							</Link>
						</div>
					</div>
				</div>
			)
		})
	}

	const itemsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);
	const totalRecommendedLocations = recommendedLocations.length;
	const totalPages = Math.ceil(totalRecommendedLocations / itemsPerPage);

	const handlePagination = (direction) => {
		if (direction === "prev" && currentPage > 1) {
		  setCurrentPage((prev) => prev - 1);
		} else if (direction === "next" && currentPage < totalPages) {
		  setCurrentPage((prev) => prev + 1);
		}
	  };
	
	  const startIdx = (currentPage - 1) * itemsPerPage;
	  const endIdx = startIdx + itemsPerPage;
	  const currentRecommendedLocations = recommendedLocations.slice(
		startIdx,
		endIdx
	  );
	
	const recommendedCards = currentRecommendedLocations.map((location) => (
	<DetailCard key={location.id} {...location} />
	));




	const [currentFoodPage, setCurrentFoodPage] = useState(1);
	const totalRecommendedFoodPlaces = recommendations.length;
	const totalFoodPages = Math.ceil(totalRecommendedFoodPlaces / itemsPerPage);
	
	const handleFoodPagination = (direction) => {
	  if (direction === "prev" && currentFoodPage > 1) {
		setCurrentFoodPage((prev) => prev - 1);
	  } else if (direction === "next" && currentFoodPage < totalFoodPages) {
		setCurrentFoodPage((prev) => prev + 1);
	  }
	};
	
	const startFoodIdx = (currentFoodPage - 1) * itemsPerPage;
	const endFoodIdx = startFoodIdx + itemsPerPage;
	const currentRecommendedFoodPlaces = recommendations.slice(
	  startFoodIdx,
	  endFoodIdx
	);
	
	const recommendedFoodplaces = currentRecommendedFoodPlaces.map((location) => (
	  <DetailCard key={location.id} {...location} />
	));


	const displayItineraries = itineraries && itineraries.map(itinerary => {
		return (
			<Itinerary key={itinerary.id} itinerary={itinerary} handleDelete={deleteItinerary}/>
		)
	})

	const recentBookmarkCards = recentBookmarks && recentBookmarks.map(bookmark => (
		// <div key={bookmark.id}>Something</div>
		<BookmarkHomepage key={bookmark.id} {...bookmark} />
	));
	

	return (
		<div className="home--page-main-content">
			{ days.length !== 0 && 
			<div className="active--trips">
				<p className="header-title heading">Active Trips</p>
				<div className="active--trips-container">
					{displayActiveTrips()}
					{selectedDays.length > 0 && 
						<button className="active--trip-save" onClick={handleMarkDaysAsCompleted}>Mark as done</button>
					}
				</div>
			</div>
			}
			{itineraries.length !== 0 ? 
			<div>
				<p className="heading">Your trips</p>
				<div className="trips--container">
					{displayItineraries}
				</div>
			</div>
			:
			<div className="home--no-trips no-padding">
				{/* <div>
					<p>Start planning for your trip!</p> 
					<Link to="/create">
						<button>Create Trip</button>
					</Link>
				</div> */}
			</div>
			}
			<div className="recommended--locations--bookmarks">
				<div className="recommended--locations">
					<h1 className='heading'>Recommended Locations</h1>
					<div className="detailPage--cards">{recommendedCards}</div>
					{totalRecommendedLocations > itemsPerPage && (
						<div className="pagination-location">
						<button onClick={() => handlePagination("prev")} className="arrow-button1 leftSpot ">
							<FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '12px' }}/>
						</button>
						<button onClick={() => handlePagination("next")} className="arrow-button1 rightSpot">
							<FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '12px' }}/>
						</button>
						</div>
					)}
				</div>
				<div className="recent--bookmarks">
					<h1 className='heading4'>Recent Bookmarks</h1>
					{recentBookmarks.length > 0 ? (
						<div className="homepage--bookmarks">{recentBookmarkCards}</div>
					) : (
						<>
							<p className="bookmarked--location">
								You haven't bookmarked any locations yet.
							</p>
							<Link to="/search?query=" className="search--bookmark">
								<p className="font-weight-500">Search Location</p>
							</Link>
							
						</>
					)}
				</div>
				{recommendations.length !== 0 && 
				<div className="recommended--locations">
					<h1 className='heading'>Recommended Food places</h1>
					<div className="detailPage--cards">{recommendedFoodplaces}</div>
					{totalRecommendedFoodPlaces > itemsPerPage && (
						<div className="pagination-location">
						<button onClick={() => handleFoodPagination("prev")} className="arrow-button1 leftSpot">
							<FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '12px' }} />
						</button>
						<button onClick={() => handleFoodPagination("next")} className="arrow-button1 rightSpot">
							<FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '12px' }} />
						</button>
						</div>
					)}
				</div>
				}
			</div>
		</div>
	)
}

export default HomePage;