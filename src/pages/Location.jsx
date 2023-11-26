import { Link, NavLink, useSearchParams } from 'react-router-dom'
import searchIcon from '/images/search.png';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import useLocationManager from '../hooks/useLocationManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import {
	FaArrowRight,
    FaEdit,
	} from "react-icons/fa";

function Location() {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const [searchParams, setSearchParams] = useSearchParams()
    const type = searchParams.get('type')

    const authTokens = useContext(AuthContext)
    const { result, error, loading, getLocations } = useLocationManager(authTokens)
    const [currentPage, setCurrentPage] = useState(1)
    const locationElements = result?.results.map(location => (
        <tr key={location.id}>
            <td>{location.id}</td>
            <td>
                <img className="location--img" 
                    src={`${backendUrl}${location.primary_image}`}/></td>
            <td>{location.name}</td>
            <td style={{width: '25%'}}>{location.address}</td>
            <td>
                <Link to={`/admin/location/${location.id}`}>
                    <button className='editDeleteLoc--btn'><FaEdit/></button> 
                </Link>
            </td>
        </tr>
    ))
    
    useEffect(() => {
        const fetchResults = async () => {
            await getLocations(currentPage, "", type)
        }

        fetchResults()
    }, [currentPage])

    useEffect(() => {
        const fetchResults = async () => {
            await getLocations(currentPage, "", type)
        }

        fetchResults()
    }, [type])

    const totalPages = Math.ceil(result?.count / 10) || 1;
    
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearchChange = (e) => {
        if (e.key === 'Enter') {
            console.log(type)
            const query = e.target.value
            setCurrentPage(1)
            getLocations(1, query, type)
        }
    }
    
    const generatePageButtons = () => {
        const buttons = [];
    
        if (result?.previous) {
            buttons.push(
                <button 
                    key="first" 
                    id="pagination--button1"
					className={`plan--btn ${currentPage === 1 ? "" : ""}`}
                    onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
            );
    
            buttons.push(
                <button 
                    key="prev" 
                    id="pagination--button1"
					className={`plan--btn ${currentPage === 1 ? "" : ""}`}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
            );
        }
    
        for (let page = Math.max(currentPage - 2, 1); page <= Math.min(currentPage + 2, totalPages); page++) {
            buttons.push(
                <button 
                    key={page} 
                    id='pagination--button'
                    className={`plan--btn ${
                        page === currentPage ? "btn-primary" : "btn-secondary"
                        }`}
                    onClick={() => handlePageChange(page)} disabled={page === currentPage}>
                    {page}
                </button>
            );
        }
    
        if (result?.next) {
            buttons.push(
                <button 
                    key="next" 
                    id="pagination--button1"
					className={`plan--btn ${currentPage === 1 ? "" : ""}`}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            );
    
            buttons.push(
                <button 
                    key="last" 
                    id="pagination--button1"
					className={`plan--btn ${currentPage === 1 ? "" : ""}`}
                    onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                    <FontAwesomeIcon icon={faAnglesRight} />
                </button>
            );
        }
    
        return buttons;
    };

    if (loading) {
        return (
            <div>Loading</div>
        )
    }

    if (error) {
        return (
            <div>Error</div>
        )
    }

    return (
        <>
            <div className='search--container'>
                <img className='admin--search--icon' src={searchIcon} alt="Search Icon" />
                <input 
                    type="text"
                    placeholder="Search for location"
                    className="admin--search--bar" 
                    onKeyDown={handleSearchChange}
                />
                <button 
                    className="btn search"
                    type="button"
                >
                    Search
                </button>
                <button 
                    className="btn add-location"
                    type="button"
                >
                    <NavLink 
                        to="/admin/location"
                        className="link"
                    >
                        Add Location
                    </NavLink>
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="font">ID</th>
                        <th className="font">Image</th>
                        <th className="font">Name</th>
                        <th className="font">Address</th>
                        <th className="font">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {locationElements}
                </tbody>
            </table>
            <div className="pagination">{generatePageButtons()}</div>
        </>
    )
}

export default Location