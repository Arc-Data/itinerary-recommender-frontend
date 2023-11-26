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
import { faPenToSquare, faCalendarDays, faCircleCheck } from '@fortawesome/free-regular-svg-icons';

const HomePage = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

	const { authTokens } = useContext(AuthContext)
	const { itineraries, getItineraries, deleteItinerary } = useItineraryManager(authTokens)
	const [ selectedDays, setSelectedDays ] = useState([])
	const { days, error, loading, getActiveTrips, markDaysAsCompleted } = useDayManager(authTokens)
	const [recommendedLocations, setRecommendedLocations] = useState([]);
	const [recentBookmarks, setRecentBookmarks] = useState([]);

	// GET RECOMMENDED LOCATIONS
	const getRecommendedLocations = async () => {
		console.log("Inside recommendations function")
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
		console.log("Fetching Bookmarks")
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
						{/* <input 
							type="checkbox" 
							checked={selectedDays.includes(day.id)}
							onChange={() => toggleDaySelection(day.id)}
							className="active--trip-checkbox no-margin-top no-margin-bottom"
						/> */}
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

	const displayItineraries = itineraries && itineraries.map(itinerary => {
		return (
			<Itinerary key={itinerary.id} itinerary={itinerary} handleDelete={deleteItinerary}/>
		)
	})

	const recommendedCards = recommendedLocations.map((location) => (
		<DetailCard key={location.id} {...location} />
	  ));

	const recentBookmarkCards = recentBookmarks && recentBookmarks.map(bookmark => (
		// <div key={bookmark.id}>Something</div>
		<BookmarkHomepage key={bookmark.id} {...bookmark} />
	));
	

	return (
		<div className = "home--page-content">
			<header className="home--banner">
				<div className="home--banner-itinerary heading2">
					<div>
						<p>Start creating your itinerary to Cebu!</p>
						<Link to="/create">
							<button className='create-itinerary-btn'><FontAwesomeIcon className='btn-icons' icon={faPenToSquare} />Create now</button>
						</Link>
					</div>
					<img src="/banner-1.jpg" className="banner-img"/>
				</div>
				<div className="home--banner-business heading3">
					<p>Promote your food business with CebuRoute</p>
					<img src="/banner-2.png" className="banner-img" />
				</div>
				<div className="home--banner-ai heading3">
					<p>Try our AI Recommendation Feature while building your itinerary</p>
					<img src="/banner-3.png" className="banner-img" />
				</div>
			</header>
			{ days.length !== 0 && 
			<div>
				<p className="header-title heading">Active Trips</p>
				<div className="active--trips-container">
					{displayActiveTrips()}
					{selectedDays.length > 0 && 
						<button className="active--trip-save" onClick={handleMarkDaysAsCompleted}>Mark as done</button>
					}
				</div>
			</div>
			}
			{ itineraries && (
			<div>
				<p className="heading">Your trips</p>
				<div className="trips--container">
					{displayItineraries}
				</div>
			</div>
			)}
			<div className="recommended--locations--bookmarks">
				<div className="recommended--locations">
					<h1 className='heading'>Recommended Locations</h1>
					<div className="detailPage--cards">{recommendedCards}</div>
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
							<Link to="/search?query=" className="search--bokmark">
							Search Location
							</Link>
							
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default HomePage;