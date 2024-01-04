import { useContext, useEffect } from "react"
import useBusinessManager from "../hooks/useBusinessManager"
import AuthContext from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

const HomeBusiness = () => {
    const { authTokens } = useContext(AuthContext)
    const { ownedLocations: locations, loading, getOwnedBusinesses } = useBusinessManager(authTokens)
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const displayLocations = locations && locations.map(location => {
        return (
            <div>
                <Link to={`/profile/business/${location.id}`}>
                    
                <div key={location.id} className="home--business-item">
                    <img src={`${backendUrl}${location.primary_image}`} alt="" className="home--business-img"/>
                    <div className="home--business-item-details">
                        <p className="name"><FontAwesomeIcon icon={faBuilding} className='btn-icons'/>{location.name}</p>
                        <p className="address"><FontAwesomeIcon icon={faLocationDot} className="btn-icons"/>{location.address}</p>
                    </div>
                </div>
                </Link>
            </div>
            
        )
    })

    console.log(locations)

    useEffect(() => {
        getOwnedBusinesses()
    }, [])

    if (loading) {
        return (
            <div>Loading ...</div>
        )
    }

    return (
        <div>
            <p className="heading">Owned Locations</p>
            <div className="home--business-container">

                {locations.length > 0 ? 
                displayLocations
                :
                <div>
                    <Link to='/profile/business/add'>Do you own a location in Cebu and want to promote your location? </Link>
                </div>
                }
            </div>
        </div>
    )
}

export default HomeBusiness