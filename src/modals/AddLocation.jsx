import { useContext, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faLocationDot, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import Modal from "../components/Modal"
import getTimeDetails from "../utils/getTimeDetails"
import getFeeDetails from "../utils/getFeeDetails"
import useItemLocationManager from "../hooks/useItemLocationManager"
import useRecommendationsManager from "../hooks/useRecommendationsManager"
import RecommendationList from "../components/RecommendationList"

const AddLocation = ({onClose, locations, setLocations, day, includedLocations, setIncludedLocations, addMarker, deleteMarker, increaseEstimatedCost, decreaseEstimatedCost}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { authTokens } = useContext(AuthContext)
    const { addItem, deleteItem, updateItemOrdering } = useItemLocationManager(authTokens)
    const { recommendations: spotRecommendations, loading: recommendationsLoading, fetchNearbyRecommendations, fetchPreferenceRecommendations } = useRecommendationsManager(authTokens)
    const { recommendations: foodRecommendations, loading: foodRecommendationsLoading, fetchNearbyFoodRecommendations } = useRecommendationsManager(authTokens)

    const [recentlyAddedLocations, setRecentlyAddedLocations] = useState([])
    const [searchData, setSearchData] = useState(null)
    const [openBookmarks, setOpenBookmarks] = useState(false)
    const [searchString, setSearchString] = useState("")
    const [displayedSearchItems, setDisplayedSearchItems] = useState(null)
    const [bookmarked, setBookmarked] = useState([])
 
    let debounceTimeout = 2000;
    let timeout;

    const toggleBookmarkSection = () => {
        setOpenBookmarks(prev => !prev)
    }

    const searchLocations = async (search) => {
        const response = await fetch(`${backendUrl}/api/location/plan/?query=${search}&hide`)
        const data = await response.json()
        setSearchData(data)
    }

    const handleDeleteLocation = async (location, latitude, longitude) => {
        
        try {
            await deleteItem(location.id)
            
            const updatedLocations = locations.filter(i => i.id !== location.id)
            const updatedIncludedLocations = includedLocations.filter(i => i.id !== location.id)
            const updatedRecentlyAddedLocations = recentlyAddedLocations.filter(i => i.id !== location.id)
    
            setLocations(updatedLocations)
            setIncludedLocations(updatedIncludedLocations)
            setRecentlyAddedLocations(updatedRecentlyAddedLocations)
            
            decreaseEstimatedCost(location.details.min_cost, location.details.max_cost)
            updateItemOrdering(updatedLocations)
            deleteMarker(latitude, longitude, location.details.event)
        }
        catch (error) {
            console.log("An error occured: ", error)
        }
    }

    const handleAddLocation = async (locationId) => {
        try {
            const item = await addItem(locationId, day.id, locations.length)

            const arr1 = [...locations, item]
            const arr2 = [...includedLocations, item]
            const arr3 = [...recentlyAddedLocations, item]
            
            setLocations(arr1)
            setIncludedLocations(arr2)
            setRecentlyAddedLocations(arr3)
            increaseEstimatedCost(item.details.min_cost, item.details.max_cost)
            addMarker(item.details.latitude, item.details.longitude, day.color, item.details.name, item.details.event)
            setSearchString("")
        }
        catch(error) {
            console.log("An error occured : ", error)
        }
    }

    const handleChange = (e) => {
        clearTimeout(timeout)
        setSearchString(e.target.value)

        if(searchString.length === 0) {
            setSearchData(null)
            setDisplayedSearchItems(null)
            return
        }
        
        timeout = setTimeout(() => {
            searchLocations(e.target.value)
        }, debounceTimeout)
    }

    const checkDuplicateLocation = (locationId) => {
        const status = includedLocations.some(i => {
            return i.location == locationId
        })

        return status
    }

    const displayRecentlyAdded = recentlyAddedLocations && recentlyAddedLocations.map(location => {
        return (
            <div key={location.id} location={location} className="add-location-modal--recently-added">
                <FontAwesomeIcon icon={faLocationDot} className="assistant--location-icon"/>
                <p>{location.details.name}</p>
                <div>
                    <FontAwesomeIcon 
                        icon={faClose} 
                        className="add-location-modal--remove"
                        onClick={() => handleDeleteLocation(location, location.details.latitude, location.details.longitude)}/>                
                </div>
            </div>
        )
    })

    const displayBookmark = bookmarked && bookmarked.map(bookmark => {
        return !checkDuplicateLocation(bookmark.location) && (
        <div key={bookmark.id} className="add-location-modal--search-item">
            <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
            <div>
                <p className="add-location-modal--title">{bookmark.details.name}</p>
                <p className="add-location-modal--subtext">{bookmark.details.address}</p>
            </div>
            <button className="add-location-modal--add-btn" onClick={() => handleAddLocation(bookmark.location)}>+</button>
        </div>
        )   
    })

    useEffect(() => {
        const getBookmarks = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/bookmarks/`, {
                    "method": "GET",
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authTokens.access}`
                    }
                })
                const data = await response.json()
                setBookmarked(data)
                
            }
            catch(error) {
                console.log("An error occured while getting user bookmarks", error)
            }
        }

        getBookmarks()
    }, [])

    useEffect(() => {
        if (locations.length !== 0) {
            fetchNearbyRecommendations(day.id)
            fetchNearbyFoodRecommendations(day.id)
        }  else {
            fetchPreferenceRecommendations()
        }
    }, [locations])

    useEffect(() => {
        if (searchData) {
            const results = searchData.map(location => {
                const fee = (location.fee.min && location.fee.max) ? getFeeDetails(location.fee.min, location.fee.max) : 0
                const opening_time = location.schedule?.opening ? getTimeDetails(location.schedule.opening) : 0
                const closing_time = location.schedule?.closing ? getTimeDetails(location.schedule.closing) : 0

                return !checkDuplicateLocation(location.id) && (
                    <div key={location.id} location={location} className="add-location-modal--search-item">
                        <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                        <div>
                            <Link to={`/location/${location.id}`}>
                            <p className="add-location-modal--title">{location.name}</p>
                            </Link>
                            <p className="add-location-modal--subtext">{location.address}</p>
                            <p className="add-location-modal--subtext"><span>Opens {opening_time} - {closing_time} </span>•<span> Entrance Fee: {fee} </span></p>
                        </div>
                        <button className="add-location-modal--add-btn" onClick={() => handleAddLocation(location.id)}><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                )
            })
            setDisplayedSearchItems(results)
        }

    }, [searchData, recentlyAddedLocations])

    return (
        <Modal onClose={onClose}>
            <div className="add-location-modal--tabs plan-page">
                <div className={`${openBookmarks ? "" : "active"}` } onClick={toggleBookmarkSection}>Location</div>
                <div className={`${openBookmarks ? "active" : ""}`} onClick={toggleBookmarkSection}>Bookmarks</div>
            </div>
            {openBookmarks ?
            <div>
                <div className="add-location-modal--recently-added-container">
                    {displayRecentlyAdded}
                </div>
                <div className="add-location-modal--results">
                    {displayBookmark}
                </div>
            </div> 
            : 
            <div className="add-location-modal--content">
                
                <input 
                    type="search"
                    placeholder="Search location name..."
                    name="location"
                    id="location"
                    className="plan--search-input add-location--search-input"
                    onChange={handleChange}
                    value={searchString}
                />
                {recentlyAddedLocations.length !== 0 && 
                <div className="add-location-modal--recently-added-container">
                    {displayRecentlyAdded}
                </div> }
                <div>
                    {!searchString.length && 
                    <>
                    {locations.length === 0 ? 
                    <p className="heading2">Recommended for you</p>
                    :
                    <p className="heading2">Recommended Nearby Locations</p>
                    }
                    {recommendationsLoading  ? 
                    <div>Loading</div>
                    :
                    <RecommendationList 
                        recommendations={spotRecommendations}
                        onAddRecommendation={handleAddLocation}/>
                    }
                    </>
                    }
                </div>

                <div>
                    {!searchString.length && locations.length !== 0 && 
                    <>
                    <p className="heading2">Recommended Food Locations</p>
                    {foodRecommendationsLoading ? 
                    <div>Loading</div>
                    :
                    <RecommendationList 
                        recommendations={foodRecommendations}
                        onAddRecommendation={handleAddLocation}/>
                    }
                    </>
                    }
                </div>
                {searchString.length ? 
                <div className="add-location-modal--results-container">
                    <p>Search Results for "{searchString}"</p>
                    <div className="add-location-modal--results">
                        {displayedSearchItems}
                    </div> 
                </div> : null}
            </div>
            }
        </Modal>
    )
}

export default AddLocation