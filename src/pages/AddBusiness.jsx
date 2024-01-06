import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCircleXmark, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AddBusiness = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    
    const { authTokens } = useContext(AuthContext)
    const navigate = useNavigate()
    const [locationData, setLocationData] = useState({
        'name': '',
        'address': '',
        'contact': '',
        'email': '',
        'website': '',
        'longitude': 0,
        'latitude': 0,
        'type': '',
        'description': ''
    })

    console.log('Location Data: ', locationData)

    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [tags, setTags] = useState([])
    const [image, setImage] = useState(null)
    const [spotTags, setSpotTags] = useState([])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setLocationData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleTagInputChange = (e) => {
        const { value } = e.target
        setQuery(value)
        searchTags(value)
    }

    const searchTags = async (query) => {
        try {
          const response = await fetch(`${backendUrl}/api/foodtag/search/?query=${query}`, {
                "method": "GET",
                "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authTokens.access}`
                }
          })
          let data = await response.json()
          const filteredTags = data.filter((tag) => !tags.includes(tag.name));
          setSearchResults(filteredTags)
        } catch (error) {
          console.error('Error searching tags:', error);
        }
    }

    const addTag = async (tagName) => {
        try {
            if (!tags.includes(tagName)) {
                setTags(prevTags => [...prevTags, tagName])
                await createTag(tagName)
            }
            setQuery('')
        } catch (error) {
            console.error('Error adding tag:', error)
        }
    }

    const createTag = async (tagName) => {
        try {
            const response = await fetch(`${backendUrl}/api/foodtag/get/?tag_name=${tagName}`, {
                "method": "GET",
                "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authTokens.access}`
                }
            })
    
            if (response.ok) {
                const data = await response.json()
                console.log('Tag created:', data)
            } else {
                console.error('Failed to create tag:', response.statusText)
            }
        } catch (error) {
            console.error('Error creating tag:', error)
        }
    }

    const removeTag = async (tagName) => {
        try {
            setTags(tags.filter((tag) => tag !== tagName))
            searchTags('')
        } catch (error) {
          console.error('Error removing tag:', error)
        }
    }

    const handleSpotTagChange = (e, tagName) => {
        const isChecked = e.target.checked
      
        if (isChecked) {
          if (!tags.includes(tagName)) {
            setTags((prevTags) => [...prevTags, tagName])
          }
        } else {
          setTags((prevTags) => prevTags.filter((tag) => tag !== tagName))
        }
    }

    const tagSearchResults = (query !== '' || query !== null) && (
        <div className="tag-results-container">
            {searchResults.map((tag, index) => (
                <div key={index} className="tag-result-box" onClick={() => addTag(tag.name)}>
                    {tag.name}
                </div>
            ))}
        </div>
    )

    const addedTagItem = tags.map((tag, index) => (
        <div className="tag-item" key={index}>
            {tag}
            <button className="delete-tag-button" onClick={() => removeTag(tag)}>
                <FontAwesomeIcon icon={faCircleXmark} />
            </button>
        </div>
    ))

    useEffect(() => {
        const getSpotTags = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/tags/get/`, {
              method: "GET",
              headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${String(authTokens.access)}`
              }
            });
            const data = await response.json();
            setSpotTags(data)
          } catch (error) {
            console.error("Error fetching spot tags:", error);
          }
        };
    
        getSpotTags()
    
      }, [backendUrl, authTokens.access])

    const checkInvalid = () => {
        const value = 
            !locationData.name  ||
            !locationData.address ||
            locationData.longitude == 0 ||
            locationData.latitude == 0 ||
            locationData.type === ''

            if (value) {
                alert("Missing inputs")
            }

            return value
        }

    const checkImageUploaded = () => {
        if (!image) {
            alert("Please upload an image before submitting.");
            return false;
        }
        return true;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImage(file)
    }

    const handleUploadClick = (e) => {
        e.stopPropagation()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag(query)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!checkInvalid() && checkImageUploaded()) {
            try {
                const formData = new FormData();

                Object.entries(locationData).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                const imageInput = document.getElementById("imgFile")
                if (imageInput.files.length > 0) {
                    formData.append("image", imageInput.files[0])
                }

                if (tags.length > 0) {
                    formData.append("tags", JSON.stringify(tags))
                }

                const response = await fetch(`${backendUrl}/api/location/request/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${String(authTokens.access)}`
                    },
                    body: formData
                });

                if(response.ok) {
                    navigate('/profile/business')
                }
                
            }
            catch(error) {
                console.log("An error occured while creating request: ", error)
            }
        } else {
            console.log("Invalid Inputs")
        }
    }
    
    

    return (
        <div className="profile--main-container">
            <form action="POST" onSubmit={handleSubmit}>
                <div className="business--form-container">
                    <div className="business--form-section">
                        <Link to="/profile/business">
                            <button className="back--button d-flexCenter">
                                <FontAwesomeIcon className='btn-icons' icon={faArrowLeft} />
                                Back
                            </button>
                        </Link>
                        <div className="business--form-content">
                            <div>
                                <div className="heading">General Information</div>
                                <div className="form-group">
                                    <label htmlFor="type">Location Type</label>
                                    <select 
                                        name="type" 
                                        id="type" 
                                        value={locationData.type}
                                        onChange={handleInputChange}
                                        className="business-type">
                                        <option value="" disabled>-- Location Type --</option>
                                        <option value="1">Tourist Spot</option>
                                        <option value="2">Restaurant/Food Establishment</option>
                                        <option value="3">Accommodation</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        id="name"
                                        value={locationData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Location Name" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input 
                                        type="text" 
                                        name="address" 
                                        id="address" 
                                        value={locationData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter Location Address" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact">Phone Number (optional)</label>
                                    <input 
                                        type="number" 
                                        name="contact" 
                                        id="contact" 
                                        value={locationData.contact}
                                        onChange={handleInputChange}
                                        placeholder="Enter Contact Number" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Email Address (optional)</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        value={locationData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter Email Address" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Website (optional)</label>
                                    <input 
                                        type="text" 
                                        name="website" 
                                        id="website" 
                                        value={locationData.website}
                                        onChange={handleInputChange}
                                        placeholder="Enter Website" 
                                        className="business-input"/>
                                </div>
                                <div className="form-group">
                                        <h1 className="heading business-details">Business Details</h1>
                                        <label htmlFor="description">Description</label>
                                        <input 
                                            type="text" 
                                            name="description" 
                                            id="description" 
                                            value={locationData.description}
                                            onChange={handleInputChange}
                                            className="business-input"/>
                                </div>
                                <div className="form-column-group">
                                    <div className="form-group">
                                        <label htmlFor="address">Latitude</label>
                                        <input 
                                            type="number" 
                                            name="latitude" 
                                            id="latitude" 
                                            value={locationData.latitude}
                                            onChange={handleInputChange}
                                            className="business-input"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Longitude</label>
                                        <input 
                                            type="number" 
                                            name="longitude" 
                                            id="longitude" 
                                            value={locationData.longitude}
                                            onChange={handleInputChange}
                                            className="business-input"/>
                                    </div>
                                </div>
                                <div>
                                    <p className="visibility--coordinates">
                                        To improve your business's visibility on the site, we require your
                                        coordinates. Please click on the{" "}
                                        <a
                                            href="https://support.google.com/maps/answer/18539?hl=en&co=GENIE.Platform%3DDesktop#:~:text=Get%20the%20coordinates%20of%20a%20place&text=Right%2Dclick%20the%20place%20or,decimal%20format%20at%20the%20top."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            How to Obtain My Coordinates
                                        </a>{" "}
                                        link to access instructions.
                                    </p>
                                </div>
                                <div>
                                    {
                                        locationData.type === '2' && 
                                        <div className="form-group">
                                        <h1 className="heading business-details">Tags</h1>
                                            <label htmlFor="tags">Tags</label>
                                            <div className="tags-input-container business-input">
                                                {addedTagItem}
                                                <input 
                                                    type="text" 
                                                    value={query} 
                                                    onChange={handleTagInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Add or search tags..."
                                                    className="tags-input"
                                                />
                                            </div>
                                            {tagSearchResults}
                                        </div>
                                    }
                                    {
                                        locationData.type === '1' && 
                                        <div>
                                            <h1 className="heading business-details">Tags</h1>
                                            {spotTags.map((tag, index) => (
                                                <div key={index} className="tags-checkbox-container">
                                                    <input
                                                    type="checkbox"
                                                    id={`tag-${index}`}
                                                    name={`tag-${index}`}
                                                    checked={tags.includes(tag.name)}
                                                    onChange={(e) => handleSpotTagChange(e, tag.name)}
                                                    className="tags-checkbox"
                                                    />
                                                    <label className="tags-checkbox-label" htmlFor={`tag-${index}`}>{tag.name}</label>
                                                </div>
                                                ))}
                                        </div>
                                    }
                                </div>
                                <div className="flex jc-end mt-20px">
                                    <button className="add--business font14" >Submit</button>  
                                </div>
                            </div>
                            <div>
                                {image && (
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Selected Image"
                                    style={{ marginRight: '10px', maxWidth: '100px' }}
                                />
                                <p style={{ marginRight: '10px' }}>{image.name}</p>
                                    <button onClick={() => setImage(null)}><FontAwesomeIcon className="delete--upload-img" icon={faCircleXmark} /></button>
                                </div>
                                )}
                                <div className="upload-btn" onClick={handleUploadClick}>
                                    <FontAwesomeIcon className='upload-icon btn-icons' icon={faUpload} />
                                    <label htmlFor="imgFile" className="choose-file">
                                        Upload image
                                    </label>
                                    <input
                                        type="file"
                                        id="imgFile"
                                        name="filename"
                                        accept="image/*"
                                        style={{ "display": 'none' }}
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddBusiness