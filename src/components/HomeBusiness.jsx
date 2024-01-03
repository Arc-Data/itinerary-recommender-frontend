import { useContext, useEffect } from "react"
import useBusinessManager from "../hooks/useBusinessManager"
import AuthContext from "../context/AuthContext"

const HomeBusiness = () => {
    const { authTokens } = useContext(AuthContext)
    const { ownedLocations: locations, loading, getOwnedBusinesses } = useBusinessManager(authTokens)

    const displayLocations = locations && locations.map(location => {
        return (
            <div key={location.id}>{location.name}</div>
        )
    })

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
            <div>
                {displayLocations} - This should link to the business detail section in the profile page
            </div>
        </div>
    )
}

export default HomeBusiness