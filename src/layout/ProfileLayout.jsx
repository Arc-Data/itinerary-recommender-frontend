import { Link, Outlet } from 'react-router-dom'
import UserNav from '../components/UserNav'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import AccordionHeader from '../pages/AccordionHeader'
import { faBookmark, faBuilding, faRoute } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ProfileLayout = () => {
	const { user } = useContext(AuthContext)
	const [openTrips, setOpenTrips] = useState(true)
	
	const toggleTrips = () => {
		setOpenTrips(prev => !prev)
	}
	
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
							<AccordionHeader 
								active={openTrips}
								handleClick={toggleTrips}
								icon={faRoute}
								text={"Your Trips"}
								className='accordion-header-text'
							/>
							{openTrips &&
							<div className='accordion-content'>
								<div>
									<Link to="trips">
										Itineraries
									</Link>
								</div>
								<div>
									<Link to ="rate">
										Recent
									</Link>
								</div>
							</div>
							}
						<Link to = "business">
							<div className='profile--link'>
								<FontAwesomeIcon icon={faBuilding} className='btn-icons'/>
								<p>Business</p>
							</div>
						</Link>
						<Link to = "bookmark">
							<div className="profile--link">
								<FontAwesomeIcon icon={faBookmark} className='btn-icons'/>
								<p>Bookmarks</p>
							</div>
						</Link>
					</div>
				</div>
				<Outlet />
			</div>
		</div>
	)
}

export default ProfileLayout