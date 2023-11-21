import { Link } from 'react-router-dom';

export default function Navbar() {
	return (
		<nav className='navbar'>
			<Link to="/">
				<img className="cebu--route" src="/images/logocebu.png" alt="LandingPage" />
			</Link>
			<div className='link'>
				<Link to="login">
					<button className='link--button font-weight-600'>
						Login
					</button>
				</Link>
				<Link to="signup">
					<button className='link--button font-weight-600'>
						Signup
					</button>
				</Link>
			</div>
		</nav>
	)
}