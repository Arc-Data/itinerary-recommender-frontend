import React, { useEffect } from 'react';
import { useContext } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import dashboard from "/images/radix-icons_dashboard.svg";
import { FaMapMarkerAlt, FaUser, FaAngleUp, FaAngleDown, FaReceipt, FaCalendarDay, FaCar, FaQuestion  } from 'react-icons/fa'; 

function Sidebar() {
    const { logoutUser } = useContext(AuthContext);
    const [dropdown, setDropdown] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams()

    function toggleLocationDropdown() {
        setDropdown((prev) => !prev);
    }

    return (
        <div className="sidebar">
            <div className="admin--icon">
                <div className="user-icon-circle">
                    <FaUser />
                </div>
                <h1 className='admin--text'>
                    Hello, admin <span className="admin14">!</span>
                </h1>
            </div>
            <div className="sidebar--menu">
                <NavLink
                    className={({ isActive }) => isActive ? 'active14' : 'link14'}
                    to="/"
                >
                    <h4 className="users">
                    <img src={dashboard} /> Dashboard
                    </h4>
                </NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? 'active14' : 'link14'}
                    to="/admin/users"
                >
                    <h4 className="users">
                        <FaUser /> Users
                    </h4>
                </NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? 'active14' : 'link14'}
                    to="/admin/locations"
                    onClick={() => {
                        toggleLocationDropdown()
                        setSearchParams({'type': 'all'})
                    }}
                >
                    <h4 className="locations">
                        <FaMapMarkerAlt /> Locations{' '}
                        <div className='arrow--icon'>
                        {dropdown ? <FaAngleUp /> : <FaAngleDown />} 
                        </div>
                        
                    </h4>
                </NavLink>
                {dropdown && (
                    <div className='dropdown--container'>
                        <div
                            id='locations1'
                            className={({ isActive }) => (isActive ? 'active-drp dropdown' : 'link dropdown')}
                            onClick={() => setSearchParams({ type: 'spot' })}
                        >
                            <a className='locations'>Tourist Spot</a>
                        </div>
                        <div
                            id='locations1'
                            className={({ isActive }) => (isActive ? 'active-drp dropdown' : 'link dropdown')}
                            onClick={() => setSearchParams({ type: 'accommodation' })}
                        >
                           <a className='locations'>Accommodation</a> 
                        </div>
                        <div
                            id='locations1'
                            className={({ isActive }) => (isActive ? 'active-drp dropdown' : 'link dropdown')}
                            onClick={() => {
                                setSearchParams({ type: 'foodplace' })
                            }}
                        >
                             <a className='locations'>Food</a> 
                        </div>
                    </div>
                )}
                <NavLink
                    className={({ isActive }) => isActive ? 'active14' : 'link14'}
                    to="requests"
                >
                    <h4 className="users">
                        <FaReceipt /> Requests
                    </h4>
                </NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? 'active14' : 'link14'}
                    to="events"
                >
                    <h4 className="users">
                        <FaCalendarDay /> Events
                    </h4>
                </NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? 'active14' : 'link14'}
                    to="drivers"
                >
                    <h4 className="users">
                        <FaCar /> Drivers
                    </h4>
                </NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? 'active14' : 'link14'}
                    to="queries"
                >
                    <h4 className="users">
                        <FaQuestion  /> Queries
                    </h4>
                </NavLink>
            </div>
            <button className="btn logout" onClick={logoutUser}>
                Logout
            </button>
            <a className="admin--copyright">© 2023 CebuRoute. All rights reserved.</a>
        </div>
    );
}

export default Sidebar;
