import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
/*Components*/
import SearchCard from '../components/SearchCard';
/*Data*/
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const [locations, setLocations] = useState(null);
    const [activeTab, setActiveTab] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query");
    const type = searchParams.get('type');

    useEffect(() => {
        const fetchData = async() => {
            const response = await fetch(`${backendUrl}/api/location/?query=${query}&type=${type}`);
            const data = await response.json();
            setLocations(data);
            console.log(data);
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
            <div className="searchPage--container">
                <h1 className="searchPage--title">Search result for "{`${query}`}"</h1>
                <p className="searchPage--result">{locations ? locations.length : "0"} of {locations ? locations.length : "0"} Results</p>
                <div className="searchPage--navbar">
                    <div
                        onClick={() => { setSearchParams(''); setActiveTab(''); }}
                        className={activeTab === '' ? 'active' : ''}
                    >
                        All Results
                    </div>
                    <div
                        onClick={() => { setSearchParams('spot'); setActiveTab('spot'); }}
                        className={activeTab === 'spot' ? 'active' : ''}
                    >
                        Destination
                    </div>
                    <div
                        onClick={() => { setSearchParams('accommodation'); setActiveTab('accommodation'); }}
                        className={activeTab === 'accommodation' ? 'active' : ''}
                    >
                        Accommodation
                    </div>
                    <div
                        onClick={() => { setSearchParams('foodplace'); setActiveTab('foodplace'); }}
                        className={activeTab === 'foodplace' ? 'active' : ''}
                    >
                        Foodplace
                    </div>
                </div>
                <div className="searchPage--results">
                    {locationResults}
                </div>
                
            </div>
        </div>
    );
};

export default SearchPage;
