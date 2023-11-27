import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import SAMPLEIMAGE from "/images/osmenapeak.jpg";
import ReactDatePicker from "react-datepicker";

const ManageSpot = ({ location, editBusiness }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
	const navigate = useNavigate()

    const [formData, setFormData] = useState({
		'name': location.name,
		'address': location.address,
		'latitude': location.latitude,
		'longitude': location.longitude,
		'description': location.description,
        'location_type': location.location_type,
        'min_fee': location.min_fee,
        'max_fee': location.max_fee,
        'opening_time': new Date().setTime(0, 0, 0),
        'closing_time': new Date().setTime(0, 0, 0)
    })

    const formatTimeToString = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (location.opening_time) {
            const [hours, minutes, seconds] = location.opening_time.split(":");
            const openingTime = new Date();
            openingTime.setHours(hours, minutes, seconds);
            setFormData(prev => ({ ...prev, opening_time: openingTime }));
        }
    
        if (location.closing_time) {
            const [hours, minutes, seconds] = location.closing_time.split(":");
            const closingTime = new Date();
            closingTime.setHours(hours, minutes, seconds);
            setFormData(prev => ({ ...prev, closing_time: closingTime }));
        }
    }, []);
    
	const handleChangeInput = (e) => {
		const { name, value } = e.target
		
        if (name === 'opening_time' || name === 'closing_time') {
            const timeString = value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setFormData(prev => ({
                ...prev,
                [name]: timeString,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
 	}

	const handleSubmit = async (e) => {
		e.preventDefault() 

        if (formData.min_fee > formData.max_fee) {
            alert("Min fee couldnt be greater than maximum fee")
            return;
        }
        
        console.log(formData.opening_time)
        const data = {
            ...formData,
            "opening_time": formatTimeToString(formData.opening_time),
            "closing_time": formatTimeToString(formData.closing_time)
        };

        console.log(data)

        await editBusiness(location.id, data)
        navigate(-1)
	}

	const toggleAddProduct = () => {
		setAddProductModalOpen(prev => !prev)
	}

    return (
        <div className="profile--main-container">
            <form onSubmit={handleSubmit}>
                <div className="admin-wrapper admin--container">
                    <div className="input--form">
                    <p>Spot</p>
                    <div className="input admin--container">
                        <label htmlFor="name">Location Name</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
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
                        value={formData.address}
                        className="styled-input"
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                        <label htmlFor="latitude">Latitude</label>
                        <input

                            type="number"
                            onChange={handleChangeInput}
                            step="0.000001"
                            name="latitude"
                            value={formData.latitude}
                            className="styled-input"
                        />
                        </div>
                        <div className="input admin--container">
                        <label htmlFor="postalCode">Longitude</label>
                        <input
                            number="text"
                            onChange={handleChangeInput}
                            step="0.000001"
                            name="longitude"
                            value={formData.longitude}
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
                            onChange={handleChangeInput}
                            name="min_fee"
                            value={formData.min_fee}
                            className="styled-input"
                        />
                        </div>
                        <div className="input admin--container">
                        <label htmlFor="max_fee">Maximum Fee</label>
                        <input
                            number="text"
                            onChange={handleChangeInput}
                            name="max_fee"
                            value={formData.max_fee}
                            className="styled-input"
                        />
                        </div>
                    </div>
                    }
                    {location.location_type === "1" && 
                    <div className="admin--container">
                        <div className="input admin--container">
                        <label htmlFor="opening">Opening Time</label>
                        <ReactDatePicker
                            selected={formData.opening_time}
                            onChange={(date) => setFormData({ ...formData, opening_time: date })}                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            />
                        {/* <input
                            type="text"
                            onChange={handleChangeInput}
                            name="opening_time"
                            value={formData.opening_time}
                            className="styled-input"
                            /> */}
                        </div>
                        <div className="input admin--container">
                        <label htmlFor="closing">Closing Time</label>
                        <ReactDatePicker
                            selected={formData.closing_time}
                            onChange={(date) => setFormData({ ...formData, closing_time: date })}                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            />
                        </div>
                    </div>
                    }
                    <div className="input admin--container">
                        <label htmlFor="description">Description</label>
                        <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChangeInput}
                        />
                    </div>
                    </div>
                    <div className="image--border center admin--container">
                    <img className="edit--images" src={`${backendUrl}${location?.image}`}  />
                    <label htmlFor="imgFile">
                        {" "}
                        <a className="choose--file">Choose file</a> to upload
                    </label>
                    <input
                        type="file"
                        id="imgFile"
                        name="filename"
                        accept="image/*"
                        style={{ display: "none" }} 
                    />
                    </div>
                </div>    
                <button className="add--business font14" >Submit</button>
            </form>
        </div>
    )
}

export default ManageSpot