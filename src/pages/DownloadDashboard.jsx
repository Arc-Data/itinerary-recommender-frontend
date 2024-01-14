      import React, { useEffect, useState, useContext, useRef } from 'react';
      import AuthContext from '../context/AuthContext';
      import html2canvas from "html2canvas";
      import { jsPDF } from "jspdf";
      import "jspdf-autotable";
      import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
      import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

      const DownloadDashboard = () => {
        const dashboardRef = useRef(null);
        const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
        const { authTokens } = useContext(AuthContext);
        const [topLocationItinerary, setTopLocationItinerary] = useState([]);
        const [topSpots, setTopSpots] = useState([]);
        const [topAccommodation, setTopAccommodation] = useState([]);
        const [topFoodPlace, setTopFoodPlace] = useState([]);
        const [topBookmarks, setTopBookmarks] = useState([]);
        const [selectedTopList, setSelectedTopList] = useState('completedTrip');
        const [monthlyReportData, setMonthlyReportData] = useState({});
        const [frequencyLocation, setFrequencyLoc] = useState([]);
        const [completedTrip, setCompletedTripInfo] = useState([]);
        const [userPreference, setUserPreference] = useState([]);
        const [currentDate, setCurrentDate] = useState(new Date());
        const [selectedMonth, setSelectedMonth] = useState(1); 
        const [downloadClicked, setDownloadClicked] = useState(false);

        useEffect(() => {
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

          const fetchMonthlyReport = async () => {
            try {
              const response = await fetch(`${backendUrl}/api/monthly-report/${selectedMonth}/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authTokens.access}`,
                },
              });
          
              if (!response.ok) {
                throw new Error('Failed to fetch monthly report');
              }
          
              const data = await response.json();
          
              setFrequencyLoc(data.location_frequency.slice(0, 20));
              setMonthlyReportData(data);
              setCompletedTripInfo(data.completed_trips_info);
            } catch (error) {
              console.error('Error fetching monthly report:', error.message);
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
              throw new Error('Failed to fetch top spots');
            }
          
            const data = await response.json();
            setUserPreference(data);
            console.log()
            } catch (error) {
            console.error('Error fetching User Preference:', error.message);
            }
          };


          fetchMonthlyReport();
          fetchTopSpots();
          fetchTopAccommodation();
          fetchTopFoodPlaces();
          fetchTopBookmarks();
          fetchTopLocationItinerary();
          fetchPreferencePercentages();

          const intervalId = setInterval(() => {
            setCurrentDate(new Date());
          }, 1000); 
          return () => clearInterval(intervalId);

        }, [backendUrl, authTokens.access, selectedMonth]);

        
        const handleDownload = async () => {
          try {
            setDownloadClicked(true);   
            const canvas = await html2canvas(dashboardRef.current);
            const imageData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("portrait", "in", "a4");
            pdf.addImage(imageData, "PNG", 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

            pdf.save("CebuRoute_Report.pdf");
          } catch (error) {
            console.error("Error generating PDF:", error.message);
          }
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
                    <th>Location Name</th>
                    <th>Average Rating of the Location</th>
                    <th>Total Reviews of the user </th>
                  </tr>
                );
              case 'locationItinerary':
                return (
                    <tr className='table--th1'>
                      <th>Location Name</th>
                      <th>Overall Frequency of Every Spots</th>
                    </tr>
                );
              case 'bookmarks': 
                return (
                  <tr className='table--th1'>
                    <th>Location Name</th>
                    <th>Bookmark Count</th>
                  </tr>
                );
                case 'completedTrip': 
                return (
                  <tr className='table--th1'>
                    <th>Date</th>
                    <th>Total Visited Location</th>
                    <th>Percentage for Overall Visits for This Month</th>
                  </tr>
                );
                case 'userpreference': 
                return (
                  <tr className='table--th1'>
                    <th>User Interest</th>
                    <th>Percentage for Overall User Preference</th>
                    <th>Total number of User</th>
                  </tr>
                );
              default:
                return null;
            }
          };

          const months = [
            { value: 1, label: 'January' },
            { value: 2, label: 'February' },
            { value: 3, label: 'March' },
            { value: 4, label: 'April' },
            { value: 5, label: 'May' },
            { value: 6, label: 'June' },
            { value: 7, label: 'July' },
            { value: 8, label: 'August' },
            { value: 9, label: 'September' },
            { value: 10, label: 'October' },
            { value: 11, label: 'November' },
            { value: 12, label: 'December' },
          ];

          const handleMonthChange = (event) => {
            setSelectedMonth(parseInt(event.target.value, 10));
          };

          const formatDate = (date) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
          };

          const formattedSelectedMonth = `${months.find((m) => m.value === selectedMonth)?.label || ''} ${new Date().getFullYear()}`;

          const getHeaderText = (selectedTopList) => {
            switch (selectedTopList) {
              case 'completedTrip':
                return (
                  <>
                    <h1 className="reports--title">Completed Trip Report </h1>
                    <p className='reports--date font-weight-500'> ({formattedSelectedMonth}) </p>
                    <div className="completedTrip">
                      The information displayed below is pertain to Completed Trips recorded in the month of {months.find((m) => m.value === selectedMonth)?.label || ''}. The report provides the total visited locations by the user and the overall percentage for this month.
                    </div>
                  </>
                );
              case 'userpreference':
                return (
                  <>
                    <h1 className="reports--title">User Preference Report </h1>
                    <p className='reports--date font-weight-500'> ({formattedSelectedMonth}) </p>
                    <div className="completedTrip">
                      The information displayed below is pertain to User Preference recorded in the month of {months.find((m) => m.value === selectedMonth)?.label || ''}. The report provides the percentage of every interest of the user.
                    </div>
                  </>
                );
              case 'locationItinerary':
                return (
                  <>
                    <h1 className="reports--title">Most Frequent Itinerary Report </h1>
                    <p className='reports--date font-weight-500'> ({formattedSelectedMonth}) </p>
                    <div className="completedTrip">
                      The information displayed below pertains to the top 20 most frequent locations in the month of {months.find((m) => m.value === selectedMonth)?.label || ''}. The report provides the frequency of every spots.
                    </div>
                  </>
                );
              case 'spots':
                return (
                  <>
                    <h1 className="reports--title">Most Visited Locations Report </h1>
                    <p className='reports--date font-weight-500'> ({formattedSelectedMonth}) </p>
                    <div className="completedTrip">
                      The information displayed below pertains to the top 10 most visited locations in the month of {months.find((m) => m.value === selectedMonth)?.label || ''}. The report provides the average ratings and total reviews in every spots.
                    </div>
                  </>
                );
              case 'accommodation':
                return (
                  <>
                    <h1 className="reports--title">Most Visited Accommodation Report </h1>
                    <p className='reports--date font-weight-500'> ({formattedSelectedMonth}) </p>
                    <div className="completedTrip">
                      The information displayed below pertains to the top 10 most visited accommodation in the month of {months.find((m) => m.value === selectedMonth)?.label || ''}. The report provides the average ratings and total reviews in every spots.
                    </div>
                  </>
                );
              case 'foodPlaces':
                return (
                  <>
                    <h1 className="reports--title">Most Visited Food Place Report </h1>
                    <p className='reports--date font-weight-500'> ({formattedSelectedMonth}) </p>
                    <div className="completedTrip">
                      The information displayed below pertains to the top 10 most visited food place in the month of {months.find((m) => m.value === selectedMonth)?.label || ''}. The report provides the average ratings and total reviews in every spots.
                    </div>
                  </>
                );
              case 'bookmarks':
                return (
                  <>
                    <h1 className="reports--title">Most Bookmarked Locations Report</h1>
                    <p className='reports--date font-weight-500'> ({formattedSelectedMonth}) </p>
                    <div className="completedTrip">
                      The information displayed below pertains to the top 10 bookmarked locations in the month of {months.find((m) => m.value === selectedMonth)?.label || ''}. The report provides the total count of bookmarked locations based on user activity.
                    </div>
                  </>
                );
              default:
                return '';
            }
          };

        return (
          <>
            <div className="share--details-container" ref={dashboardRef}>
              <div className="span-items">
                <img className="cebu--route" src="/images/logo.png" alt="LandingPage" />
                <button data-html2canvas-ignore="true" className="share--details-download-btn" onClick={handleDownload}>
                  <FontAwesomeIcon className="btn-icons" icon={faFileArrowDown} /> Download Report
                </button>
              </div>
              <div className='flex'>
                <div className="top-list-dropdown-admin mt-20px">
                  <h1 data-html2canvas-ignore="true" >Select Report to download </h1>
                  <select data-html2canvas-ignore="true"  id="topList" value={selectedTopList} onChange={handleTopListChange}>
                    <option value="completedTrip">Completed Trips Info</option>
                    <option value="userpreference">User Preference</option>
                    <option value="locationItinerary">Top Frequent Location </option>
                    <option value="spots">Top Spots</option>
                    <option value="accommodation">Top Accommodation</option>
                    <option value="foodPlaces">Top Food Places</option>
                    <option value="bookmarks">Top Bookmarks</option>
                  </select>
                </div>
                <div className="mt-20px">
                  <h1 data-html2canvas-ignore="true" >Select Month to download </h1>
                  <select data-html2canvas-ignore="true" id="topList" value={selectedMonth} onChange={handleMonthChange}>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>  
              </div>
              <div className="share--dashboard-header">
                {getHeaderText(selectedTopList)}
              </div>
              <div className='flex mt-15px'>
                {/* <div>
                  <p className=''>Total Number of Unique Visitors: <span className='font-weight-600'>{monthlyReportData.unique_visitor_counts}</span></p>
                  <p className='mt-15px'>Total Number of Completed Trips: <span className='font-weight-600'>{monthlyReportData.completed_trips}</span></p>
                </div> */}
                <div className="mt-20px ml5px ">
                  <p>Date: <span className='font-weight-600'>{formatDate(currentDate)}</span></p>
                  <p>Time: <span className='font-weight-600'>{currentDate.toLocaleTimeString()}</span></p>
                </div>
              </div>
              <table className='border--table'>
              <thead>{tableHeaders()}</thead>
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
                {selectedTopList === 'locationItinerary' && frequencyLocation && frequencyLocation
                  .sort((a, b) => b.frequency - a.frequency) // Sort in descending order based on frequency
                  .map((itineraries, index) => (
                    <tr key={index} className='top-spot-item'>
                      <td>{itineraries.location__name}</td>
                      <td>{itineraries.frequency}</td>
                    </tr>
                ))}
                {selectedTopList === 'bookmarks' && topBookmarks && topBookmarks.map((bookmark, index) => (
                  <tr key={index} className="top-spot-item">
                    <td>{bookmark.location_name}</td>
                    <td>{bookmark.bookmark_count}</td>
                  </tr>
                ))}
               {selectedTopList === 'completedTrip' &&
                completedTrip &&
                completedTrip
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((complete, index) => (
                    <tr key={index} className="top-spot-item">
                      <td>{formatDate(new Date(complete.date))}</td>
                      <td>{complete.total_locations_visited}</td>
                      <td>
                        {complete.percentage_completed_trips
                          ? `${complete.percentage_completed_trips.toFixed(2)}%`
                          : 'N/A'}
                      </td>
                    </tr>
                ))}
               {selectedTopList === 'userpreference' && userPreference && (
                  Object.entries(userPreference.preference_percentages)
                    .sort(([, dataA], [, dataB]) => (dataB || 0) - (dataA || 0))
                    .map(([preference, percentage], index) => {
                      const countData = userPreference.counts.find(item => item.preference_name === preference);
                      return (
                        <tr key={index} className="top-spot-item">
                          <td>{preference}</td>
                          <td>{percentage.toFixed(2)}%</td>
                          <td>{countData ? countData.count : 0}</td>
                        </tr>
                      );
                    })
                )}
                </tbody>
              </table>
              <p className='mt-5px font13'> @2023 CebuRoute. All rights reserved.</p>
            </div>
          </>
        );
      };

      export default DownloadDashboard;