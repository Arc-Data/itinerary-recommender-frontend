import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
/*Pages*/
import data from './data';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/Home';
import PrivateRoutes from './utils/PrivateRoutes'
import SearchPage from './pages/SearchPage';
import Users from './pages/Users'
import Location from './pages/Location'
import Detail from './pages/Detail'
import AddLocation from './pages/AddLocation'
import CreateTrip from './pages/CreateTrip';
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
/*Components*/
/*Layout*/
import BaseLayout from './layout/BaseLayout';
import CreateTripLayout from './layout/CreateTripLayout';
import Plan from './pages/Plan';
import Preferences from './pages/Preferences';
import AdminRoutes from './utils/AdminRoutes';
import ProfileLayout from './layout/ProfileLayout';
import Profile from './pages/Profile';
import Trips from './pages/Trips';
import Business from './pages/Business';
import AddBusiness from './pages/AddBusiness';
import EditBusiness from './pages/EditBusiness';
import ManageBusiness from './pages/ManageBusiness';
import Bookmarks from './pages/Bookmarks';
import Recent from './pages/Recent';
import RateDay from './pages/RateDay';
import Request from './pages/Request';
import Dashboard from './pages/Dashboard';
import EditLocation from './pages/EditLocation';
import Services from "./components/Services"
import ManageLayout from './layout/ManageLayout';
import BusinessOverview from './components/BusinessOverview';
import DownloadDashboard from './pages/DownloadDashboard';
	/*css*/
	
function App() {
	return (
		<BrowserRouter>
		<AuthProvider>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/forgotpass" element={<ForgotPassword />} />

				<Route path="/preferences" element={<Preferences/>}/>
				<Route element={<PrivateRoutes />} >
					
					<Route element={<BaseLayout />}>
						<Route path="/location/:id" element={<Detail/>}/>
						<Route path="/home" element={<HomePage />} />
						<Route path="/search" element={<SearchPage />} />
					</Route>

					<Route path="/profile" element={<ProfileLayout/>}>
						<Route path="/profile/" element={<Profile />} />
						<Route path="/profile/trips" element={<Trips/>} />
						<Route path="/profile/business" element={<Business/>} />
						<Route path="/profile/business/add" element={<AddBusiness/>} />
						
						<Route path="/profile/business/:id" element={<ManageLayout />}>
							<Route path="/profile/business/:id/" element={<BusinessOverview />} />
							<Route path="/profile/business/:id/services" element={<Services />}/>
							<Route path="/profile/business/:id/edit" element={<ManageBusiness />} />
						</Route>
						
						<Route path="/profile/bookmark" element={<Bookmarks/>} />
						<Route path="/profile/rate" element={<Recent/>} />
						<Route path="/profile/rate/:id" element={<RateDay />} />
					</Route>

					<Route element={<CreateTripLayout/>}>
						<Route path="/create" element={<CreateTrip />} /> 
					</Route>
					<Route path="/plan/:id/" element={<Plan />} />

				</Route>
				<Route path="/admin" element={<AdminRoutes />}>
					<Route path = "/admin/" index element={<Dashboard/>} />
					<Route path = "/admin/users" index element={<Users users={data[0].users}/>} />
					<Route path="/admin/location" element={<AddLocation/>} />
					<Route path="/admin/locations" element={<Location/>} />
{/* 					
					<Route path="/profile/business/:id" element={<ManageLayout />}>
							<Route path="/profile/business/:id/" element={<BusinessOverview />} />
							<Route path="/profile/business/:id/services" element={<Services />}/>
							<Route path="/profile/business/:id/edit" element={<ManageBusiness />} />
						</Route> */}
					
					<Route path="/admin/location/:id" element={<ManageLayout />} >
						<Route path="/admin/location/:id/" element={<BusinessOverview />} />
						<Route path="/admin/location/:id/services" element={<Services />} />
						<Route path="/admin/location/:id/edit" element={<ManageBusiness />} />
					</Route>
					
					<Route path="/admin/requests" element={<Request />} />
					<Route path="/admin/download" element={<DownloadDashboard />} />
				</Route>
			</Routes>
		</AuthProvider>
		</BrowserRouter>
	)
}

export default App;