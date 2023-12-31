import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import useLocationManager from "../hooks/useLocationManager"
import { useNavigate, useParams } from "react-router-dom"
import image from '/image.png'
import Error404 from "../components/Error404"

const EditLocation = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { authTokens } = useContext(AuthContext)
    const { location, error, loading, getLocation, deleteLocation, handleChangeInput, editLocationDetails } = useLocationManager(authTokens)
    const [image, setImage] = useState()
    const [locationLoaded, setLocationLoaded] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    const handleDelete = async () => {
        await deleteLocation(id)
        navigate('/admin/locations')
    }

    const handleEdit = async () => {
        editLocationDetails(id)
        navigate('/admin/locations')
    }

    useEffect(() => {
        setLocationLoaded(false)
        const fetchData = async () => {
            await getLocation(id) 
            
            setLocationLoaded(true)
        }
        
        fetchData()
    }, [id])

    useEffect(() => {
        if (locationLoaded) {
            const imageString = `${backendUrl}${location.images[0]}`
            setImage(imageString)
        }
    }, [locationLoaded])


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
            <h1 className="edit--location">Edit Location</h1>
                <form className="admin--container">
                    <div className="input--form">
                        <select
                            value={location.location_type}
                            onChange={handleChangeInput}
                            name="type"
                            className="styled-input" 
                        >
                            <option value="">-- Location Type --</option>
                            <option value="1">Spot</option>
                            <option value="2">Food</option>
                            <option value="3">Accommodation</option>
                        </select>

                        <div className="input admin--container">
                            <label htmlFor="name">Location Name</label>
                            <input
                                type="text"
                                name="name"
                                value={location?.name}
                                onChange={handleChangeInput}
                                className="styled-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                name="address"
                                onChange={handleChangeInput}
                                value={location?.address}
                                className="styled-input" 
                            />
                        </div>
                        {location.location_type === "1" &&
                        <div className="input admin--container">
                                <label htmlFor="tags">Tags</label>
                                <input
                                    type="text"
                                    onChange={handleChangeInput}                                
                                    name="tags"
                                    value={location?.details.tags}
                                    className="styled-input" 
                                />
                        </div>
                        }
                        <div className="admin--container">
                            <div className="input admin--container">
                                <label htmlFor="latitude">Latitude</label>
                                <input
                                    type="number"
                                    step="0.000001"
                                    onChange={handleChangeInput}
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
                                    onChange={handleChangeInput}                                
                                    name="longitude"
                                    value={location?.longitude}
                                    className="styled-input" 
                                />
                            </div>
                        </div>
                        {location.location_type === "1" &&
                        <div className="admin--container">
                            <div className="input admin--container">
                                <label htmlFor="min_fee">Minimum Fee</label>
                                <input
                                    type="text"
                                    name="min_fee"
                                    onChange={handleChangeInput}
                                    value={location?.details.min_fee}
                                    className="styled-input" 
                                />
                            </div>
                            <div className="input admin--container">
                                <label htmlFor="max_fee">Maximum Fee</label>
                                <input
                                    number="text"
                                    name="max_fee"
                                    onChange={handleChangeInput}
                                    value={location?.details.max_fee}
                                    className="styled-input" 
                                />
                            </div>
                        </div>
                        }
                        <div className="admin--container">
                            <div className="input admin--container">
                                <label htmlFor="opening">Opening Time</label>
                                <input
                                    type="text"
                                    name="opening_time"
                                    onChange={handleChangeInput}
                                    value={location?.details.opening_time}
                                    className="styled-input" 
                                />
                            </div>
                            <div className="input admin--container">
                                <label htmlFor="closing">Closing Time</label>
                                <input
                                    type="text"
                                    name="closing_time"
                                    onChange={handleChangeInput}
                                    value={location?.details.closing_time}
                                    className="styled-input" 
                                />
                            </div>
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="description">Description</label>
                            <textarea
                                name="description"
                                onChange={handleChangeInput}
                                value={location?.description}
                            />
                        </div>
                    </div>
                    {location.images ?
                    <div>
                        <img src={image} height={400}/>
                    </div>
                    :
                    <div className="image--border center admin--container">
                        <img src={image} />
                        {/* <img className="edit--images" src={`${backendUrl}${location?.images}`}  /> */}
                        <label htmlFor="imgFile"> <a className='choose--file'>Choose file</a> to upload</label>
                        <input
                            type="file"
                            id="imgFile"
                            name="filename"
                            accept="image/*"
                            style={{ display: 'none' }} // Hide the default file input
                        />
                    </div>
                    }
                </form>
                <div className="admin--container">
                    <div className="input admin--container">
                        <button
                            className="submitEdit-btn"
                            onClick={handleEdit}>Edit {/* FUNCTIONALITY */}
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

export default EditLocation