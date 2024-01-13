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
import Forgot from './pages/Forgot'
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
import ManageBusiness from './pages/ManageBusiness';
import Bookmarks from './pages/Bookmarks';
import Recent from './pages/Recent';
import RateDay from './pages/RateDay';
import Request from './pages/Request';
import Event from './pages/Event';
import AddEvent from './pages/AddEvent'
import Dashboard from './pages/Dashboard';
import Menu from "./components/Menu"
import ManageLayout from './layout/ManageLayout';
import BusinessOverview from './components/BusinessOverview';
import DownloadDashboard from './pages/DownloadDashboard';
import Services from './components/Services';
import Fees from './components/Fees';
import Test from './pages/Test';
import AssistantContact from './pages/AssistantContact';
import AccountSettings from './pages/AccountSettings';
import ChangePassword from './pages/ChangePassword';
import AuthLayout from './layout/AuthLayout';
import Activation from './pages/Activation'
import RegisterSuccess from './pages/RegisterSuccess';
import Reset from './pages/Reset';
import Drivers from './pages/Drivers';
import FeeDetails from './pages/FeeDetails';
import HomeLayout from './layout/HomeLayout';
import HomeEvent from './components/HomeEvent';
import HomeBusiness from './components/HomeBusiness';
import AddDriver from './pages/AddDriver'
import EditDriver from './pages/EditDriver';
import Queries from './pages/Queries';
import Verify from './pages/Verify';
/*css*/
	
function App() {
	return (
		<BrowserRouter>
		<AuthProvider>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/activate/:uidb64/:token" element={<Activation />}/>
					<Route path="/success" element={<RegisterSuccess />} />
					<Route path="/forgot" element={<Forgot />} />
					<Route path="/verify" element={<Verify />} />
					<Route path="/reset/:uidb64/:token" element={<Reset />} />
				</Route>

				<Route path="/preferences" element={<Preferences/>}/>
				<Route element={<PrivateRoutes />} >
					<Route path="/test" element={<Test />} />
					
					<Route element={<BaseLayout />}>
						<Route path="/location/:id" element={<Detail/>}/>
						<Route element={<HomeLayout />}>
							<Route path="/home" element={<HomePage />} />
							<Route path="/event" element={<HomeEvent />} /> 
							<Route path="/business" element={<HomeBusiness />} /> 
						</Route>
						<Route path="/search" element={<SearchPage />} />
					</Route>

					<Route path="/profile" element={<ProfileLayout/>}>
						<Route path="/profile/" element={<Profile />} />
						<Route path="/profile/trips" element={<Trips/>} />
						<Route path="/profile/business" element={<Business/>} />
						<Route path="/profile/business/add" element={<AddBusiness/>} />
						<Route path="/profile/settings/" element={<AccountSettings />} />
						<Route path="/profile/settings/change-password/" element={<ChangePassword />} />
						
						<Route path="/profile/business/:id" element={<ManageLayout />}>
							<Route index element={<BusinessOverview />} />
							<Route path="/profile/business/:id/menu" element={<Menu />}/>
							<Route path="/profile/business/:id/services" element={<Services />}/>
							<Route path="/profile/business/:id/fees" element={<Fees />}/>
							<Route path="/profile/business/:id/fees/:feeId/edit" element={<FeeDetails />}/>
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
					<Route path="/plan/:id/assistantContact/" element={<AssistantContact/>} />

				</Route>
				<Route path="/admin" element={<AdminRoutes />}>
					<Route path="/admin/" index element={<Dashboard/>} />
					<Route path="/admin/users" index element={<Users users={data[0].users}/>} />
					<Route path="/admin/location" element={<AddLocation/>} />
					<Route path="/admin/locations" element={<Location/>} />
					<Route path="/admin/driver" element={<AddDriver/>} />
					<Route path="/admin/drivers" element={<Drivers/>} />
					<Route path="/admin/driver/:id/edit" element={<EditDriver />} />


					<Route path="/admin/location/:id" element={<ManageLayout />} >
						<Route path="/admin/location/:id/" element={<BusinessOverview />} />
						<Route path="/admin/location/:id/menu" element={<Menu />} />
						<Route path="/admin/location/:id/services" element={<Services />} />
						<Route path="/admin/location/:id/fees" element={<Fees />} />
						<Route path="/admin/location/:id/fees/:feeId/edit" element={<FeeDetails />} />
						<Route path="/admin/location/:id/edit" element={<ManageBusiness />} />
					</Route>
		
					<Route path="/admin/requests" element={<Request />} />
					<Route path="/admin/events" element={<Event />} />
					<Route path="/admin/event" element={<AddEvent />} />
					<Route path="/admin/queries" element={<Queries />} />
					<Route path="/admin/download" element={<DownloadDashboard />} />
				</Route>
			</Routes>
		</AuthProvider>
		</BrowserRouter>
	)
}

export default App;