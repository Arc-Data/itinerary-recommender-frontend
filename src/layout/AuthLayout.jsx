import { Link, Outlet } from "react-router-dom";
import herobackground from "/herobackground.jpeg";

const AuthLayout = () => {
    return (
        <div className="container--sign-log">
            <div className="container-form">
                <Link to="/">
					<img className="cebu--logo" src="/images/logo.png" alt="LandingPage" />
				</Link>
                <Outlet />
            </div>
            <div className="container-images">  
                <img src={herobackground}/>
            </div>
        </div>
    )
}

export default AuthLayout