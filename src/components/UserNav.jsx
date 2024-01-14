import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faStar, faBuilding, faBookmark, faRightFromBracket, faLock } from '@fortawesome/free-solid-svg-icons';

const UserNav = () => {
    const [dropdown, setDropdown] = useState(false);
    const [searchParams , setSearchParams] = useSearchParams()
    const { logoutUser, user } = useContext(AuthContext)
    const letter = user.full_name[0].toUpperCase()
    const email = user.email;
    const full_name = user.full_name.toUpperCase();
    const navigate = useNavigate()
    const type = searchParams.get('type')

    const toggleDropdown = () => {
        setDropdown(prev => !prev);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        const searchQuery = e.target.search.value
        navigate(`/search?query=${searchQuery}&type=${type}`)
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
                            <Link to="/profile/trips">
                                <div className='profile--section'>
						            <p className='profile--icon'>{user.full_name[0].toUpperCase()}</p>
						            <p className="profile--name">{user.full_name.toUpperCase()}</p>
						            <p className="profile--email">{user.email}</p>
					            </div>
                            </Link>
                            <Link to="/profile/rate">
                                <div className="dropdown--options">
                                    <FontAwesomeIcon icon={faStar} className="btn-icons"/>
                                    <p className='font-weight-500'>Rate Trips</p>
                                </div>
                            </Link>
                            <Link to="/profile/business">
                                <div className="dropdown--options">
                                    <FontAwesomeIcon icon={faBuilding} className='btn-icons'/>
                                    <p className='font-weight-500'>Manage Business</p>
                                </div>
                            </Link>
                            <Link to="/profile/bookmark">
                                <div className="dropdown--options">
                                    <FontAwesomeIcon icon={faBookmark} className='btn-icons'/>
                                    <p className='font-weight-500'>Bookmarks</p>
                                </div>
                            </Link>
                            <Link to="/profile/settings/change-password/">
                                <div className="dropdown--options">
                                    <FontAwesomeIcon icon={faLock} className='btn-icons'/>
                                    <p className='font-weight-500'>Change Password</p>
                                </div>
                            </Link>
                            <div className="dropdown--options">
                                <FontAwesomeIcon icon={faRightFromBracket} className='btn-icons'/>
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
