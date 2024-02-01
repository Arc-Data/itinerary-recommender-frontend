import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
/*Components*/
import Spinner from '../components/Spinner'
import SearchCard from '../components/SearchCard';
/*Data*/
import { useSearchParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const SearchPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const [loading, setLoading] = useState(false)
    const [locations, setLocations] = useState(null);
    const [activeTab, setActiveTab] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query");
    const type = searchParams.get('type');

    useEffect(() => {
        setLoading(true)
        const fetchData = async() => {
            const response = await fetch(`${backendUrl}/api/location/?query=${query}&type=${type}`)  
            const data = await response.json()
            setLocations(data)
            setLoading(false)

            // setTimeout(() => setLoading(false), 3000)
        }

        fetchData();
    }, [query, type]);

    const locationResults = locations && locations.map(location => {
        return (
            <SearchCard key={location.id} {...location} />
        );
    });

    return (
        <div>
            {loading ? 
            <div className='searchPage--container'>
                <div>
                    <Spinner />
                </div>
            </div>
            :
            <div className="searchPage--container">
                <h1 className="searchPage--title">Search result for "{`${query}`}"</h1>
                <p className="searchPage--result">{locations ? locations.length : "0"} of {locations ? locations.length : "0"} Results</p>
                <div className="searchPage--navbar">
                    <div
                        onClick={() => { searchParams.set('type', ''); setActiveTab(''); }}
                        className={activeTab === '' ? 'active' : ''}
                    >
                        All Results
                    </div>
                    <div
                        onClick={() => { searchParams.set('type', 'spot'); setActiveTab('spot'); }}
                        className={activeTab === 'spot' ? 'active' : ''}
                    >
                        Destination
                    </div>
                    <div
                        onClick={() => { searchParams.set('type', 'accommodation'); setActiveTab('accommodation'); }}
                        className={activeTab === 'accommodation' ? 'active' : ''}
                    >
                        Accommodation
                    </div>
                    <div
                        onClick={() => { searchParams.set('type', 'foodplace'); setActiveTab('foodplace'); }}
                        className={activeTab === 'foodplace' ? 'active' : ''}
                    >
                        Foodplace
                    </div>
                </div>
                <div className="searchPage--results">
                    {locationResults}
                </div>
                
            </div>
            }

        </div>
    );
};

export default SearchPage;
