import { useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import useLocationManager from "../hooks/useLocationManager"
import { useNavigate, useParams } from "react-router-dom"
import image from '/image.png'
import Error404 from "../components/Error404"

const DeleteLocation = () => {
    const { authTokens } = useContext(AuthContext)
    const { location, error, loading, getLocation, deleteLocation } = useLocationManager(authTokens)
    const { id } = useParams()
    const navigate = useNavigate()

    const handleDelete = async () => {
        await deleteLocation(id)
        navigate('/admin')
    }

    useEffect(() => {
        getLocation(id)
    }, [])

    if (loading) {
        return (
            <div className="admin-wrapper">
                Loading Location Data
            </div>
        )
    }

    if (error && error === 404) {
        return (
            <div className="admin-wrapper">
                <Error404 />
            </div>
        )
    } else if (error) {
        <div className="admin-wrapper">
            Something wrong occured.
        </div>
    }

    return (
        <div className="admin-wrapper">
            <h1>Edit Location</h1>
                <div className="input admin--container">
                    <div className="image--border center input admin--container">
                        <img src={image} />
                        <label htmlFor="imgFile"> <a className='choose--file'>Choose file</a> to upload</label>
                        <input
                            type="file"
                            id="imgFile"
                            name="filename"
                            accept="image/*"
                            style={{ display: 'none' }} 
                        />
                    </div>
                </div>
                <div className="admin--container">
                    <div className="input admin--container">
                        <label htmlFor="type">Location Types</label>
                        <select
                            value={location?.location_type}
                            name="type"
                            className="styled-input" 
                        >
                            <option value="">-- Location Type --</option>
                            <option value="1">Spot</option>
                            <option value="2">Food</option>
                            <option value="3">Accommodation</option>
                        </select>
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="closing">Location Tags</label>
                        <input
                            number="text"
                            name="closing"
                            value={location?.details.tags}
                            className="styled-input" 
                        />
                    </div>
                </div>
                <div className="input admin--container">
                    <label htmlFor="name">Location Name</label>
                    <input
                        type="text"
                        name="name"
                        value={location?.name}
                        className="styled-input" 
                    />
                </div>
                <div className="input admin--container">
                    <label htmlFor="address">Location Address</label>
                    <input
                        type="text"
                        name="address"
                        value={location?.address}
                        className="styled-input" 
                    />
                </div>
                <div className="input admin--container">
                    <label htmlFor="name">Location Description</label>
                    <input
                        type="text"
                        name="description"
                        value={location?.description}
                        className="styled-input" 
                    />
                </div>
                <div className="admin--container">
                    <div className="input admin--container">
                        <label htmlFor="min_fee">Minimum Fee</label>
                        <input
                            type="number"
                            name="min_fee"
                            value={location?.details.min_fee}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="max_fee">Maximum Fee</label>
                        <input
                            number="text"
                            name="max_fee"
                            value={location?.details.max_fee}
                            className="styled-input" 
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                name="latitude"
                                value={location?.latitude}
                                className="styled-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="postalCode">Longitude</label>
                            <input
                                number="text"
                                step="0.000001"
                                name="longitude"
                                value={location?.longitude}
                                className="styled-input" 
                            />
                        </div>
                    </div>
                </div>
                <div className="admin--container">
                    <div className="input admin--container">
                        <label htmlFor="opening">Opening Time</label>
                        <input
                            type="text"
                            name="opening"
                            value={location?.details.opening_time}
                            className="styled-input" 
                        />
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="closing">Closing Time</label>
                        <input
                            number="text"
                            name="closing"
                            value={location?.details.closing_time}
                            className="styled-input" 
                        />
                    </div>
                </div>
                <div className="admin--container">
                    <div className="input admin--container">
                        <button
                            className="submitEdit-btn"
                            onClick={handleDelete}>Submit {/* FUNCTIONALITY */}
                        </button>
                    </div>
                    <div className="input admin--container">
                        <button
                            className="delete-btn"
                            onClick={handleDelete}>Delete
                        </button>
                    </div>
                </div>
                
                    
                
        </div>
    )
}

export default DeleteLocation