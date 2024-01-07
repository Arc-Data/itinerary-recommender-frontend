import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot, faLocationDot, faUsers, faHotel , faUtensils , faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import ReactApexChart from 'react-apexcharts';
import { faCog } from '@fortawesome/free-solid-svg-icons'; // Add this import for the cog icon


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
		const [areaChartData, setAreaChartData] = useState([]);
		const [pieChartData, setPieChartData] = useState([]);
		const [semiDonut, setSemiDonut] = useState([]);
		const [foodTagPercent, setFoodTagPercent] = useState([]);
		const [visitedFoodTag, setVisitedFoodTag] = useState([]);
		const [visitedSpotActivity, setVisitedSpotActivity] = useState([]);
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
			} catch (error) {
			console.error('Error fetching top Accommodation:', error.message);
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
			console.error('Error fetching top Food Places:', error.message);
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
			} catch (error) {
			console.error('Error fetching top Location Itinerary:', error.message);
			}
		};


		const fetchTagsPercent = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/tags-percent/`, {
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
				setPieChartData(data.filter(tag => tag.tag !== null));
			} catch (error) {
				console.error('Error fetching Tags Percent:', error.message);
			}
		};

		  const fetchVisitedSpotsTags = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/user-spot-tags/`, {
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
				setSemiDonut(data);
			} catch (error) {
				console.error('Error fetching Visited Spot Tags:', error.message);
			}
		};

		const fetchFoodTagPercent = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/foodtag-percent/`, {
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
				setFoodTagPercent(data);
			} catch (error) {
				console.error('Error fetching top bookmarks:', error.message);
			}
		};

		const topActivityPercent = async () => {
			try {
			  const response = await fetch(`${backendUrl}/api/dashboard/activity-percent/`, {
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
			  setAreaChartData(data);
		  
			  const areaChartData = data.map(item => ({
				x: item.activity || 'Unknown',
				y: parseFloat(item.percentage).toFixed(2),
			  }));
			  setAreaChartData(areaChartData);
			} catch (error) {
			  console.error('Error fetching top Activity Percent:', error.message);
			}
		  };

		const topVisitedFoodTag = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/user-foodplace-tags/`, {
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
				setVisitedFoodTag(data);
			} catch (error) {
				console.error('Error fetching top bookmarks:', error.message);
			}
		};

		const topVisitedSpotActivity = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/dashboard/user-spot-activity/`, {
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
				setVisitedSpotActivity(data);
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
		fetchTagsPercent();
		fetchVisitedSpotsTags();
		fetchFoodTagPercent();
		topActivityPercent();
		topVisitedFoodTag();
		topVisitedSpotActivity();
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

	  const options = {
		labels: pieChartData.map(tag => `${tag.tag} (${tag.count})`),
		fill: {
		  colors: 
		  	["#2D7D90",
		   	"#38A3A5", "#48B89F", 
		   	"#57CC99", "#80ED99",
			"#A4F3B3", "#C7F9CC", 
			"#C7F9CC", "#8e44ad", 
			"#2c3e50", "#f1c40f", 
			"#e67e22", "#e74c3c", 
			"#ecf0f1", "#95a5a6", 
			"#f39c12", "#d35400",
			"#c0392b", "#bdc3c7",
			"#7f8c8d"],
		  opacity: 1,
		},
		legend: {
		  markers: {
			fillColors: 
				["#2D7D90", "#38A3A5", 
				"#48B89F", "#57CC99", 
				"#80ED99", "#A4F3B3", 
				"#C7F9CC", "#C7F9CC", 
				"#2980b9", "#8e44ad", 
				"#2c3e50", "#f1c40f", 
				"#e67e22", "#e74c3c",
				"#ecf0f1", "#95a5a6", 
				"#f39c12", "#d35400", 
				"#c0392b", "#bdc3c7", 
				"#7f8c8d"],
		  },
		},
	  };
	  
	  const areaChartOptions = {
		chart: {
		  height: '350',
		  background: 'none',
		  foreColor: '#333',
		},
		xaxis: {
		  type: 'category',
		},
		yaxis: {
		  title: {
			text: 'Total Percentage of Activity',
		  },
		},
		fill: {
			colors: '#82d9ca',
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#2D7D90', '#38A3A5', '#48B89F', '#57CC99'],
			  shadeIntensity: 1,
			  type: 'vertical',
			  opacityFrom: 1,
			  opacityTo: 1,
			  stops: [0, 100, 100, 100]
			},
		  },
		dataLabels: {
		  enabled: false,
		},
		tooltip: {
		  x: {
			format: 'yyyy-MM-dd',
		  },
		},
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
					<div>
						<p className="font20 font-weight-600">Activity Percentage</p>
						<div className="dashboard--performance-container style--barGraph">
							{areaChartData && (
							<ReactApexChart
								options={areaChartOptions}
								series={[{ name: 'Percent', data: areaChartData ,  }]}
								type="bar"
								height={450}
								width={620}
							/>
							)}
						</div>
					</div>
					<div>
					<p className="font20 font-weight-600">Tags Percentage</p>
						<div>
							<div className="dashboard--performance-container style--barGraph1 ">
								{pieChartData && (
									<ReactApexChart
										options={{
											...options,
											dataLabels: {
												formatter: function (value) {
													return `${value.toFixed(2)}%`;
												},
											},
										}}
										series={pieChartData.map(tag => parseFloat(tag.percentage.toFixed(2)))}
										type="donut"
										height={450}
										width={390}
									/>
								)}
							</div>
						</div>
						<p className="font20 font-weight-600 mt-5px">Top Visited Tags</p>
						<div>
							<div className="dashboard--performance-container style--barGraph1 mb--10px ">
								{semiDonut && (
								<ReactApexChart
									options={{
									labels: semiDonut.map(item => `${item.tag} (${item.count})`),
									fill: {
										colors: 
											["#2D7D90", "#38A3A5", "#48B89F", "#57CC99", 
											"#80ED99", "#A4F3B3", "#C7F9CC", "#C7F9CC", 
											"#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", 
											"#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", 
											"#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"],
										opacity: 1,
									  },
									  legend: {
										markers: {
										  fillColors: 
										  	["#2D7D90", "#38A3A5", "#48B89F", "#57CC99", 
											"#80ED99", "#A4F3B3", "#C7F9CC", "#C7F9CC", 
											"#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", 
											"#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", 
											"#f39c12", "#d35400", "#c0392b", "#bdc3c7", 
											"#7f8c8d"],
										},
									  },
									}}
									series={semiDonut.map(item => item.percentage)}
									type="donut"
									height={450}
									width={390}
								/>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className='User--preference-container'>
					<div>
						<p className="font20 font-weight-600">Food Tag Percentage</p>
						<div className="dashboard--performance-container style--barGraph">
							{foodTagPercent && (
							<ReactApexChart
								options={{
								chart: {
									type: 'bar',
									height: 450,
									background: 'none',
									foreColor: '#333',
								},
								plotOptions: {
									bar: {
									horizontal: true,
									columnWidth: '55%',
									endingShape: 'flat',
									},
								},
								dataLabels: {
									enabled: false,
								},
								xaxis: {
									categories: foodTagPercent.map(tag => tag.tag),
									labels: {
									formatter: function (val) {
										return val + '%';
									},
									},
								},
								yaxis: {
									title: {
									text: 'Food Tag',
									},
									labels: {
									formatter: function (value) {
										return value && value.toFixed ? value.toFixed(2) + '%' : value;
									},
									},
								},
								tooltip: {
									y: {
									formatter: function (val) {
										return val && val.toFixed ? val.toFixed(2) + ' count' : val;
									},
									},
								},
								fill: {
									colors: '#82d9ca',
									type: 'gradient',
									gradient: {
									  shade: 'dark',
									  gradientToColors: ['#2D7D90', '#38A3A5', '#48B89F', '#57CC99'],
									  shadeIntensity: 1,
									  type: 'horizontal',
									  opacityFrom: 1,
									  opacityTo: 1,
									  stops: [0, 100, 100, 100]
									},
								  },
								}}
								series={[{ data: foodTagPercent.map(tag => tag.count) }]}
								type="bar"
								height={450}
								width={620}
							/>
							)}
						</div>
					</div>
					<div>
						<p className="font20 font-weight-600">Top Visited Spot Activity</p>
						<div className="dashboard--performance-container style--barGraph2 ">
							{visitedSpotActivity && (
							<ReactApexChart
								options={{
								chart: {
									background: 'none',
									foreColor: '#333',
								},
								xaxis: {
									categories: visitedSpotActivity.map(item => item.activity),
								},
								dataLabels: {
									enabled: false,
								},
								fill: {
									colors: '#82d9ca',
									type: 'gradient',
									gradient: {
									  shade: 'dark',
									  gradientToColors: ['#2D7D90', '#38A3A5', '#48B89F', '#57CC99'],
									  shadeIntensity: 1,
									  type: 'vertical',
									  opacityFrom: 1,
									  opacityTo: 1,
									  stops: [0, 100, 100, 100]
									},
								  },
								}}
								series={[{ name: 'Percentage', data: visitedSpotActivity.map(item => item.percentage.toFixed(2)) }]}
								type="bar"
								height={450}
								width={400}
							/>
							)}
						</div>
					</div>
				</div>
				<p className="font20 font-weight-600">Top Visited FoodPlace Tags</p>
					<div className="dashboard--performance-container style--barGraph2 style--barGraph3 ">
						{visitedFoodTag && (
						<ReactApexChart
							options={{
							chart: {
								background: 'none',
								foreColor: '#333',
							},
							xaxis: {
								categories: visitedFoodTag.map(item => item.foodtag),
							},
							dataLabels: {
								enabled: false,
							},
							fill: {
								colors: '#82d9ca',
								type: 'gradient',
								gradient: {
								  shade: 'dark',
								  gradientToColors: ['#2D7D90', '#38A3A5', '#48B89F', '#57CC99'],
								  shadeIntensity: 1,
								  type: 'vertical',
								  opacityFrom: 1,
								  opacityTo: 1,
								  stops: [0, 100, 100, 100]
								},
							  },
							}}
							series={[{ name: 'Percentage', data: visitedFoodTag.map(item => item.percentage.toFixed(2)) }]}
							type="bar"
							height={400}
							width={1080}
						/>
						)}
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
						<p className="font20 font-weight-600 mt-20px">Top 10 Bookmarks</p>
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
