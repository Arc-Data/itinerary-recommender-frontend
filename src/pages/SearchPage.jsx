import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
/*Components*/
import SearchCard from '../components/SearchCard';
/*Data*/
import { useSearchParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const SearchPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const [locations, setLocations] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get("query")
    const type = searchParams.get('type')

    useEffect(() => {
        setLoading(true)
        const fetchData = async() => {
            const response = await fetch(`${backendUrl}/api/location/?query=${query}&type=${type}`)  
            const data = await response.json()
            setLocations(data)

            // setTimeout(() => setLoading(false), 3000)
        }

        fetchData()
    }, [query, type])
    

    const locationResults = locations && locations.map(location => {
        return (
            <SearchCard key={location.id} {...location} />
        )
    })
    
    return (
        <div>
            {loading ? 
            <div className='searchPage--container'>
                <div>
                    <Skeleton height={200} count={20} color="#3498db" highlightColor={"#f5f5f5"} baseColor='#fff'/>
                </div>
            </div>
            :
            <div className="searchPage--container">
                <h1 className="searchPage--title">Search result for "{`${query}`}"</h1>
                <p className="searchPage--result">{locations ? locations.length : "0"} of {locations ? locations.length : "0"} Results</p>
                <div className="searchPage--navbar">
                    <div onClick={() => setSearchParams({'query': query,'type': ''})}>All Results</div>
                    <div onClick={() => setSearchParams({'query': query,'type':'spot'})}>Destination</div>
                    <div onClick={() => setSearchParams({'query': query,'type':'accommodation'})}>Accommodation</div>
                    <div onClick={() => setSearchParams({'query': query,'type':'foodplace'})}>Restaurant</div>
                </div>
                <div className="searchPage--card">
                    {locationResults}
                </div>
            </div>
            }

        </div>
    )
}
    
export default SearchPage;