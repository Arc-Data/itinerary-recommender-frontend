import { Link, NavLink, Outlet } from 'react-router-dom'
import UserNav from '../components/UserNav'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import AccordionHeader from '../pages/AccordionHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faBuilding, faRoute, faClipboardList, faStar, faGear } from '@fortawesome/free-solid-svg-icons'


const ProfileLayout = () => {
	const { user } = useContext(AuthContext)
	
	return (
		<div>
			<UserNav />
			<div className='profile--container'>
				<div className='profile--sidebar'>
					<div className='profile--section'>
						<p className='profile--icon'>{user.full_name[0].toUpperCase()}</p>
						<p className="profile--name">{user.full_name.toUpperCase()}</p>
						<p className="profile--email">{user.email}</p>
					</div>
					<div className='profile--links-section'>
						<NavLink to="trips">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faClipboardList} className="btn-icons" />
									Itineraries
								</p>
							)}
						</NavLink>
						<NavLink to="rate" activeClassName="active-link">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faStar} className="btn-icons"/>Rate Trips
								</p>
							)}
						</NavLink>
						<NavLink to="business" activeClassName="active-link">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faBuilding} className='btn-icons'/>Business
								</p>
							)}
						</NavLink>
						<NavLink to="bookmark" activeClassName="active-link">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faBookmark} className='btn-icons'/>Bookmarks
								</p>
							)}
						</NavLink>
						<NavLink to="settings" activeClassName="active-link">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faGear} className='btn-icons'/>Settings
								</p>
							)}
						</NavLink>
					</div>
				</div>
				<Outlet />
			</div>
		</div>
	)
}

export default ProfileLayout