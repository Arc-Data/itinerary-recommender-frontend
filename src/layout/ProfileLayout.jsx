import { Link, NavLink, Outlet } from 'react-router-dom'
import UserNav from '../components/UserNav'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import AccordionHeader from '../pages/AccordionHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faBuilding, faRoute, faClipboardList, faStar, faLock } from '@fortawesome/free-solid-svg-icons'


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
						<NavLink to="rate" className="active-link">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faStar} className="btn-icons"/>Rate Trips
								</p>
							)}
						</NavLink>
						<NavLink to="business" className="active-link">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faBuilding} className='btn-icons'/>Business
								</p>
							)}
						</NavLink>
						<NavLink to="bookmark" className="active-link">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faBookmark} className='btn-icons'/>Bookmarks
								</p>
							)}
						</NavLink>
						<NavLink to="/profile/settings/change-password/" className="active-link">
							{({ isActive }) => (
								<p className={`profile--link ${isActive ? 'active-link' : ''}`}>
									<FontAwesomeIcon icon={faLock} className='btn-icons'/>Change Password
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