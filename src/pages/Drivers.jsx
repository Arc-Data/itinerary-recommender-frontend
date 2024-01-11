import { Link, NavLink, useSearchParams } from 'react-router-dom'
import searchIcon from '/images/search.png';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import useDriverManager from '../hooks/useDriverManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import {
	FaArrowRight,
    FaEdit,
	} from "react-icons/fa";

    function Drivers() {
        const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
        const [currentPage, setCurrentPage] = useState(1);
        const [searchParams, setSearchParams] = useSearchParams();
        const [searchTerm, setSearchTerm] = useState("");
        const type = searchParams.get('type');
        
    
        const { authTokens } = useContext(AuthContext);
        const { drivers, error, loading, getDrivers } = useDriverManager(authTokens);
    
        const handleSearchChange = (event) => {
            const term = event.target.value;
            setSearchTerm(term);
        };
    
        const filteredDrivers = drivers.filter((driver) =>
            driver.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.facebook.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.car.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const sortedDrivers = filteredDrivers.sort((a, b) => a.id - b.id);
        const paginatedDrivers = sortedDrivers.slice(startIndex, endIndex);
    
        const locationElements = paginatedDrivers.map((driver) => (
            <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.first_name} {driver.last_name}</td>
                <td>{driver.email}</td>
                <td>{driver.contact}</td>
                <td>{driver.facebook}</td>
                <td>{driver.car}</td>
                <td className="admin--table-action">
                    <Link to={`/admin/driver/${driver.id}/edit`}>
                        <button className="edit"><FaEdit /></button>
                    </Link>
                </td>
            </tr>
        ));
    
        useEffect(() => {
            const fetchResults = async () => {
                await getDrivers(currentPage, "", type);
            };
    
            fetchResults();
        }, [currentPage, type]);
    
        const totalPages = Math.ceil(filteredDrivers.length / 10) || 1;
    
        const handlePageChange = (newPage) => {
            if (newPage >= 1 && newPage <= totalPages) {
                setCurrentPage(newPage);
            }
        };
    
        const generatePageButtons = () => {
            const buttons = [];
    
            if (drivers?.previous) {
                buttons.push(
                    <button
                        key="first"
                        id="pagination--button1"
                        className={`plan--btn ${currentPage === 1 ? "" : ""}`}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </button>
                );
    
                buttons.push(
                    <button
                        key="prev"
                        id="pagination--button1"
                        className={`plan--btn ${currentPage === 1 ? "" : ""}`}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
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
                        onClick={() => handlePageChange(page)}
                        disabled={page === currentPage}
                    >
                        {page}
                    </button>
                );
            }
    
            if (drivers?.next) {
                buttons.push(
                    <button
                        key="next"
                        id="pagination--button1"
                        className={`plan--btn ${currentPage === 1 ? "" : ""}`}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                );
    
                buttons.push(
                    <button
                        key="last"
                        id="pagination--button1"
                        className={`plan--btn ${currentPage === 1 ? "" : ""}`}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </button>
                );
            }
    
            return buttons;
        };
    
        if (loading) {
            return <div>Loading</div>;
        }
    
        if (error) {
            return <div>Error</div>;
        }
    

    return (
        <>
            <div className='search--container'>
                <img className='admin--search--icon' src={searchIcon} alt="Search Icon" />
                <input 
                    type="text"
                    placeholder="Search for driver"
                    className="admin--search--bar" 
                    onChange={handleSearchChange}
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
                        to="/admin/driver"
                        className="link font14"
                    >
                        Add Driver
                    </NavLink>
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="font">ID</th>
                        <th className="font">Name</th>
                        <th className="font">Email</th>
                        <th className="font">Contact</th>
                        <th className="font">Facebook</th>
                        <th className="font">Car Type</th>
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

export default Drivers