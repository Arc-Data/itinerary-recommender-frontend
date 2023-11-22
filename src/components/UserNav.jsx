import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';


const UserNav = () => {
    const [dropdown, setDropdown] = useState(false);
    const { logoutUser, user } = useContext(AuthContext)
    const letter = user.full_name[0].toUpperCase()
    const email = user.email;
    const full_name = user.full_name.toUpperCase();
    const navigate = useNavigate()

    const toggleDropdown = () => {
        setDropdown(prev => !prev);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        const searchQuery = e.target.search.value
        navigate({
            pathname: "/search",
            search: createSearchParams({
                query: searchQuery
            }).toString()
        })
    }

    return (
        <nav className='user--navbar'>
            <div className='nav-wrapper'>
                <Link to = "/home">
                    <img className="cebu--route" src="/images/logo.png" alt="LandingPage" />
                </Link>
                <form onSubmit={handleSearchSubmit} method="GET">
                    <div className='user--search'>
                        <div className='search--bar-container'>
                            <FontAwesomeIcon className='search--icon' icon={faSearch} />
                            <input
                                type="search"
                                placeholder="Search CebuRoute"
                                className='search--bar font-weight-400' 
                                name="search" />
                        </div>
                    </div>
                </form>

                <div className='user--links'>
                    <Link to="/create">
                        <button className='user--create-trip'><FontAwesomeIcon icon={faPlus} className='btn-icons'/>
New trip</button>
                    </Link>
                    <div className='user--profile' onClick={toggleDropdown}>
                        <span>{letter}</span>
                        {dropdown && 
                        <div className="user--dropdown-content">
                            <Link to="/profile">
                                <div className='user--profile-menu'>
                                    <div className='user--profile'>
                                        <p>{letter}</p>
                                    </div>
                                    <div>
                                        <p className='user--full_name font-weight-600'>{full_name}</p>
                                        <p className='user--email'>{email}</p>
                                    </div>
                                </div>
                            </Link>
                            <div className="user--logout">
                                <p className='font-weight-500' onClick={logoutUser}>Sign out</p>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default UserNav
