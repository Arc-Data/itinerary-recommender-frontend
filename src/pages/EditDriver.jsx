import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import useDriverManager from "../hooks/useDriverManager";
import { useNavigate, useParams } from "react-router-dom";
import image from '/image.png';
import Error404 from "../components/Error404";

const EditDriver = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    const { authTokens } = useContext(AuthContext);
    const { driver, error, loading, getDriver, deleteDriver, handleChangeInput, editDriverDetails } = useDriverManager(authTokens);
    const [driverImage, setDriverImage] = useState();
    const [driverLoaded, setDriverLoaded] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        await deleteDriver(id);
        navigate('/admin/drivers');
    };

    const handleEdit = async () => {
        await editDriverDetails(id);
        alert("Successfully Added");
        navigate('/admin/drivers');
      };

    useEffect(() => {
        setDriverLoaded(false);
        const fetchData = async () => {
            await getDriver(id);
            setDriverLoaded(true);
        };
        
        fetchData();
    }, [id]);

    useEffect(() => {
        if (driverLoaded && driver && driver.image) {
          const imageString = `${backendUrl}${driver.image}`;
          setDriverImage(imageString);
        }
      }, [driverLoaded, driver]);

      const handleImageChange = (e) => {
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setDriverImage(imageUrl);
        setImage(file); 
    };

    if (!driverLoaded || !driver) {
        return (
            <div className="admin-wrapper">
                Loading Driver Data
            </div>
        );
    }

    if (error && error === 404) {
        return (
            <div className="admin-wrapper">
                <Error404 />
            </div>
        );
    } else if (error) {
        return (
            <div className="admin-wrapper">
                Something went wrong.
            </div>
        );
    }
    

    return (
        <div className="admin-wrapper">
            <h1 className="edit--location">Edit Driver</h1>
                <form className="admin--container">
                    <div className="input--form">
                        <h1 className='mt-20px'>Personal Information </h1>
                            <div className="input admin--container">
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={driver.first_name}
                                    onChange={handleChangeInput}
                                    className="styled-input" 
                                />
                            </div>
                            <div className="input admin--container">
                                <label htmlFor="last_name">First Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={driver.last_name}
                                    onChange={handleChangeInput}
                                    className="styled-input" 
                                />
                            </div>
                            <div className="input admin--container">
                                <label htmlFor="contact">Phone Number</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={driver.contact}
                                    onChange={handleChangeInput}
                                    className="styled-input" 
                                />
                            </div>
                            <div className="input admin--container">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={driver.email}
                                    onChange={handleChangeInput}
                                    className="styled-input" 
                                />
                            </div>
                            <div className="input admin--container">
                                <label htmlFor="facebook">Facebook</label>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={driver.facebook}
                                    onChange={handleChangeInput}
                                    className="styled-input" 
                                />
                            </div> 
                            <div className="input admin--container">
                                <label htmlFor="additional_information">Additional Information</label>
                                <input
                                    type="text"
                                    name="additional_information"
                                    value={driver.additional_information}
                                    onChange={handleChangeInput}
                                    className="styled-input"
                                />
                            </div>

                            <h1 className='mt-20px'>Car Information </h1>

                        <div className="input admin--container">
                            <select
                                value={driver.car_type}
                                onChange={handleChangeInput}
                                name="car_type"
                                className="styled-input" 
                            >
                                <option value="">-- Car Type --</option>
                                <option value="1">Sedan</option>
                                <option value="2">Van</option>
                                <option value="3">SUV</option>
                            </select>
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="car">Car</label>
                            <input
                                type="text"
                                onChange={handleChangeInput}
                                name="car"
                                value={driver.car}
                                className="styled-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="max_capacity">Max capacity</label>
                            <input
                                type="number"
                                onChange={handleChangeInput}
                                name="max_capacity"
                                value={driver.max_capacity}
                                className="styled-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="plate_number">Plate Number</label>
                            <input
                                type="text"
                                onChange={handleChangeInput}
                                name="plate_number"
                                value={driver.plate_number}
                                className="styled-input" 
                            />
                        </div>
                    </div>
                  
                <div className="image--border center admin--container">
                    <img className="edit--images1" src={driverImage || `${backendUrl}${driver.image}`} />
                    <label htmlFor="imgFile">
                        {" "}
                        <a className="choose--file">Choose file</a> to upload
                    </label>
                    <input
                        type="file"
                        id="imgFile"
                        name="filename"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }} 
                    />
                </div>
                
                </form>
                <div className="admin--container">
                    <div className="input admin--container">
                        <button
                            className="submitEdit-btn"
                            onClick={handleEdit}>Edit 
                        </button>
                    </div>
                    {/* <div className="input admin--container">
                        <button
                            className="delete-btn"
                            onClick={handleDelete}>Delete
                        </button>
                    </div> */}
                </div>
        </div>
    )
}

export default EditDriver
