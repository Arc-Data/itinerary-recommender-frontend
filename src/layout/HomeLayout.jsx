import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink, Link, Outlet } from "react-router-dom"

const HomeLayout = () => {
    return (
        <div className = "home--page-content">
			<header className="home--banner">
				<div className="home--banner-itinerary heading2">
					<div>
						<p>Start creating your itinerary to Cebu!</p>
						<Link to="/create">
							<button className='create-itinerary-btn'><FontAwesomeIcon className='btn-icons' icon={faPenToSquare} />Create now</button>
						</Link>
					</div>
					<img src="/banner-1.jpg" className="banner-img"/>
				</div>
				<div className="home--banner-business heading3">
					<p>Promote your food business with CebuRoute</p>
					<img src="/banner-2.png" className="banner-img" />
				</div>
				<div className="home--banner-ai heading3">
					<p>Try our AI Recommendation Feature while building your itinerary</p>
					<img src="/banner-3.png" className="banner-img" />
				</div>
			</header>
            <nav className="home--page-navigation">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/business">Business</NavLink>
                <NavLink to="/event">Events</NavLink>
            </nav>
            <Outlet />
        </div>
    )
}

export default HomeLayout