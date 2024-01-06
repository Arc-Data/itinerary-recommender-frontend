import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot, faLocationDot, faUsers, faHotel , faUtensils , faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import ReactApexChart from 'react-apexcharts';

import { useLocation, Link } from 'react-router-dom';

	const Dashboard = () => {
		const location = useLocation();
		const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
		const { authTokens } = useContext(AuthContext);
		const [dashboardData, setDashboardData] = useState(null);
		const [preferencePercentages, setPreferencePercentages] = useState(null);
		const [chartData, setChartData] = useState([]);
		const [topSpots, setTopSpots] = useState([]);
		const [topAccommodation, setTopAccommodation] = useState([]);
		const [topFoodPlace, setTopFoodPlace] = useState([]);
		const [topBookmarks, setTopBookmarks] = useState([]);
		const [topLocationItinerary, setTopLocationItinerary] = useState([]);
		const [loading, setLoading] = useState(true); 
		const [selectedTopList, setSelectedTopList] = useState('spots');
		

	useEffect(() => {
	const fetchCounts = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/dashboard/counts/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authTokens.access}`,
			},
			});

			if (!response.ok) {
			throw new Error('Failed to fetch counts');
			}

			const data = await response.json();
			setDashboardData(data.dashboard_datacount);
		} catch (error) {
			console.error('Error fetching counts:', error.message);
		}
		};

		const fetchPreferencePercentages = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/preference/`, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authTokens.access}`,
					},
				});
		
			if (!response.ok) {
				throw new Error('Failed to fetch preference percentages');
			}
		
			const data = await response.json();
			setPreferencePercentages(data.preference_percentages);
		
			const chartData = Object.keys(data.preference_percentages).map(preference => ({
				x: preference,
				y: data.preference_percentages[preference],
				fillColor: preferenceColors[preference],
			}));
			setChartData(chartData);
			setLoading(false);
			} catch (error) {
			console.error('Error fetching preference percentages:', error.message);
			setLoading(false);
			}
		};

		const fetchTopSpots = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/top-spots/`, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authTokens.access}`,
					},
				});
			
			if (!response.ok) {
				throw new Error('Failed to fetch top spots');
			}
		
			const data = await response.json();
			setTopSpots(data.top_spots);
			console.log(data)
			
			} catch (error) {
			console.error('Error fetching top spots:', error.message);
			}
		};

		const fetchTopAccommodation = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/top-accommodations/`, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authTokens.access}`,
					},
				});
			
			if (!response.ok) {
				throw new Error('Failed to fetch top spots');
			}
		
			const data = await response.json();
			setTopAccommodation(data.top_accommodations);
			console.log(data)
			
			} catch (error) {
			console.error('Error fetching top spots:', error.message);
			}
		};
		
		const fetchTopBookmarks = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/top-bookmarks/`, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authTokens.access}`,
					},
				});
		
			if (!response.ok) {
				throw new Error('Failed to fetch top bookmarks');
			}
			const data = await response.json();
			setTopBookmarks(data.top_bookmarks);
			} catch (error) {
			console.error('Error fetching top bookmarks:', error.message);
			}
		};

		const fetchTopFoodPlaces = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/top-foodplaces/`, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authTokens.access}`,
					},
				});
		
			if (!response.ok) {
				throw new Error('Failed to fetch top bookmarks');
			}
			const data = await response.json();
			setTopFoodPlace(data.top_food_places);
			} catch (error) {
			console.error('Error fetching top bookmarks:', error.message);
			}
		};

		const fetchTopLocationItinerary = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/top-locations-itinerary/`, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authTokens.access}`,
					},
				});
		
			if (!response.ok) {
				throw new Error('Failed to fetch top bookmarks');
			}
			const data = await response.json();
			setTopLocationItinerary(data.top_locations_itinerary);
			console.log(data)
			} catch (error) {
			console.error('Error fetching top bookmarks:', error.message);
			}
		};


		fetchCounts();
		fetchPreferencePercentages();
		fetchTopSpots();
		fetchTopAccommodation();
		fetchTopFoodPlaces();
		fetchTopLocationItinerary();
		fetchTopBookmarks();
	}, [backendUrl, authTokens.access]);

	const preferenceColors = {
		art: '#2D7D90',
		activity: '#38A3A5',
		culture: '#48B89F',
		entertainment: '#57CC99',
		history: '#80ED99', 
		nature: '#A4F3B3',
		religion: '#C7F9CC',
	  };

	const handleTopListChange = (event) => {
		setSelectedTopList(event.target.value);
	  };

	  const tableHeaders = () => {
		switch (selectedTopList) {
		  case 'spots':
		  case 'accommodation':
		  case 'foodPlaces':
			return (
			  <tr className='table--th1'>
				<th>Name</th>
				<th>Average Rating</th>
				<th>Total Reviews</th>
			  </tr>
			);
		  case 'locationItinerary':
			return (
			  <tr className='table--th1'>
				<th>Name</th>
				<th>Total Occurrences</th>
			  </tr>
			);
		  default:
			return null;
		}
	  };

	return (
		<div>
			<div className='flex'>
				<h1 className="heading9">Dashboard</h1>
				{location.pathname !== '/admin/download' && (
				<Link to={`/admin/download`}>
					<button className="share--details-download-btn">
						<FontAwesomeIcon className="btn-icons" icon={faFileArrowDown} /> Download
					</button>
				</Link>
				)}
			</div>
		{loading ? (
			<p>Loading...</p>
			) : (
			<div className="dashboard--container">
				<div className="dashboard--performance">
				<p className="font20 font-weight-600">Overall Performance</p>
				<div className="dashboard--performance-container">
					{dashboardData && (
					<>
						<div className="dashboard--total-container">
						<div className="dashboard--items d-flexCenter bordercolor">
							<FontAwesomeIcon  className="dashboard--users"  icon={faUsers} style={{color: "#38A3A5",}}/>
							<div>
							<h1 className="bold heading9 ">{dashboardData.user_count}</h1>
							<p className="mt-5px  ">Total number of users</p>
							</div>
						</div>
						</div>
						<div className="dashboard--total-container">
						<div className="dashboard--items d-flexCenter bordercolor">
						<FontAwesomeIcon icon={faLocationDot}  className="dashboard--users " style={{color: "#38A3A5"}}/>
							<div>
							<p className="bold heading9 ">{dashboardData.location_count}</p>
							<p className="mt-5px  ">Total number of locations</p>
							</div>
						</div>
						</div>
						<div className="dashboard--total-container">
						<div className="dashboard--items d-flexCenter bordercolor">
							<FontAwesomeIcon icon={faMapLocationDot}  className="dashboard--users " style={{color: "#38A3A5",}} />
							<div>
							<h1 className="bold heading9 ">{dashboardData.itinerary_count}</h1>
							<p className="mt-5px  ">Total number of Itinerary</p>
							</div>
						</div>
						</div>
					</>
					)}
				</div>
				</div>
				<div className='User--preference-container'>
					<div>
						<p className="font20 font-weight-600">User Preference</p>
						<div className="dashboard--performance-container style--barGraph">
							{preferencePercentages && (
								<ReactApexChart
									options={{
									chart: {
									type: 'bar',
									height: '350',
									background: 'none',
									foreColor: '#333',
									},
									xaxis: {
										categories: Object.keys(preferencePercentages),
										labels: {
											style: {
												fontWeight: 500,
											},
										},
									},
									plotOptions: {
									bar: {
										horizontal: false,
										columnWidth: '55%',
										borderWidth: 1,
										position: 'top',
										endingShape: 'flat', 
									},
			
									},
									dataLabels: {
									enabled: false,
									},
									fill: {
									colors: [ '#2D7D90'],
									opacity: 1,
									},
									tooltip: {
									y: {
										formatter: function (val) {
										return Math.round(val) + '%';
										},
									},
									},
									yaxis: {
									labels: {
										formatter: function (value) {
										return Math.round(value) + '%';
										},
									},
									},
									
								}}
								series={[{ data: chartData }]}
								type="bar"
								height={450}
								width={650}
								/>
							)}
						</div>
					</div>
					<div className='dashboard--location-container'>
					{dashboardData && (
						<>
						<p className="font20 font-weight-600">Location</p>
						<div className="locations-items">
							<div className="dashboard--items d-flexCenter height120 bordercolor1">
								<FontAwesomeIcon icon={faLocationDot}  className="dashboard--users " style={{ color: "#57CC99"}}/>
								<div className='width120'>
									<h1 className="bold heading9 ">{dashboardData.spot_count}</h1>
									<p className="mt-5px ">Total number of spots</p>
								</div>
							</div>
						</div>
						<div className="locations-items">
							<div className="dashboard--items d-flexCenter height120 bordercolor1">
								<FontAwesomeIcon icon={faHotel}  className="dashboard--users " style={{ color: "#57CC99"}}/>
								<div className='width120'>
									<h1 className="bold heading9 ">{dashboardData.accommodation_count}</h1>
									<p className="mt-5px ">Total number of accommodation</p>
								</div>
						</div>
						</div>
						<div className="locations-items">
							<div className="dashboard--items d-flexCenter height120 bordercolor1 ">
								<FontAwesomeIcon icon={faUtensils}  className="dashboard--users " style={{ color: "#57CC99"}}/>
								<div className='width120'>
									<h1 className="bold heading9 ">{dashboardData.food_place_count}</h1>
									<p className="mt-5px ">Total number of food places</p>
								</div>
							</div>
						</div>
						</>
						)}
					</div>
				</div>
				<div className='User--preference-container'>
					<div className='dashboard--total-container'>
						<div className="dropdown--list-admin d-flexCenter">
						<p className="font20 font-weight-600">Top {selectedTopList === 'spots' ? 'Spots' : selectedTopList === 'accommodation' ? 'Accommodation' : selectedTopList === 'foodPlaces' ? 'Food Places' : 'Visited'}</p>
							<div className="top-list-dropdown-admin">
								<select id="topList" value={selectedTopList} onChange={handleTopListChange}>
									<option value="spots">Top Spots</option>
									<option value="accommodation">Top Accommodation</option>
									<option value="foodPlaces">Top Food Places</option>
									<option value="locationItinerary">Top Visited </option>
								</select>
							</div>
						</div>
						<table className="top-spot-table">
							<thead>{tableHeaders()}
							</thead>
							<tbody>
							{selectedTopList === 'spots' && topSpots && topSpots.map((spot, index) => (
								<tr key={index} className="top-spot-item">
									<td>{spot.name}</td>
									<td>{spot.average_rating}</td>
									<td>{spot.total_reviews}</td>
								</tr>
								))}
							{selectedTopList === 'accommodation' && topAccommodation && topAccommodation.map((accommodation, index) => (
								<tr key={index} className="top-spot-item">
									<td>{accommodation.name}</td>
									<td>{accommodation.average_rating}</td>
									<td>{accommodation.total_reviews}</td>
								</tr>
								))}
							{selectedTopList === 'foodPlaces' && topFoodPlace && topFoodPlace.map((foodPlace, index) => (
								<tr key={index} className="top-spot-item">
									<td>{foodPlace.name}</td>
									<td>{foodPlace.average_rating}</td>
									<td>{foodPlace.total_reviews}</td>
								</tr>
								))}
							{selectedTopList === 'locationItinerary' && topLocationItinerary && topLocationItinerary.map ((itineraries, index) => (
								<tr ley={index} className='top-spot-item'>
									<td>{itineraries.name}</td>
									<td>{itineraries.total_occurrences}</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
					<div className='dashboard--total-container'>
						<p className="font20 font-weight-600">Top Bookmarks</p>
						<table className="top-bookmark-table">
							<thead>
							<tr className='table--th1'>
								<th>Name</th>
								<th>Bookmark Count</th>
							</tr>
							</thead>
							<tbody>
							{topBookmarks.map((bookmark, index) => (
								<tr key={index} className="top-spot-item">
								<td>{bookmark.location_name}</td>
								<td>{bookmark.bookmark_count}</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)}
		</div>
	);
	};

	export default Dashboard;
