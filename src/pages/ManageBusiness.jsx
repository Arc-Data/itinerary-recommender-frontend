import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import back from "/images/lets-icons_back-light.svg";
import SAMPLEIMAGE from "/images/osmenapeak.jpg";
import {
	FaTrash,
	FaPencilAlt,
	} from "react-icons/fa";
import Modal from 'react-modal';

Modal.setAppElement('#root');

    // PAPASA NALANG YUNG DATA DITO SAME LANG NAMAN SA DESIGN

const ManageBusiness = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { authTokens } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false); 
    const [locationData, setLocationData] = useState({
        'name': '',
        'address': '',
        // 'contact': '',
        // 'email': '',
        // 'website': '',
        'longitude': 0,
        'latitude': 0,
        'type': '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setLocationData(prev => ({
            ...prev,
            [name]: value,
        }))

    }

    const checkInvalid = () => {
        return !locationData.name ||
            !locationData.address ||
            // !locationData.contact ||
            // !locationData.email ||
            // !locationData.website ||
            locationData.longitude == 0 ||
            locationData.latitude == 0 ||
            locationData.type === ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!checkInvalid()) {
            try {
                const response = await fetch(`${backendUrl}/api/location/request/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${String(authTokens.access)}`
                    },
                    body: JSON.stringify(locationData)
                })

                console.log(response)

                navigate('/profile/business')
                
            }
            catch(error) {

            }
        } else {
            console.log("Invalid Inputs")
        }
    }

    // MAPPING IF CONNECTED TO BACKEND NIREADY KO LANG PARA MADALI NALANG SAYO 

    // const displayProducts = products && products.map(product => {
    //     return (
    //         <tr key={request.id}>
    //             <td>{product.img}</td>
    //             <td>{product.name}</td>
    //             <td>
    //              
    //             </td>
    //             <td>{product.price}</td>
    //             <td>{product.description}</td>
    //             <td>
    //                 <div className="d-flexCenter">
    //                     <Link to="edit"> {/*NAKA LINK LANG TO SA WALANG KWENTANG PAGE KASI WALA PA FUNCTIONALITY*/}
    //                         <button 
    //                             className="business--edit mr10px btn--icon"> {/*FUNCTIONALITY HERE (EDIT) */}
    //                             <FaPencilAlt />
    //                         </button>
    //                     </Link>
    //                     <button 
    //                         className="business--delete btn--icon"> {/*FUNCTIONALITY HERE (DELETE) */}
    //                         <FaTrash />
    //                     </button>
    //                 </div>
    //             </td>
    //         </tr>
    //     )   
    // })

    const openAddProduct = () => {
        setAddProductModalOpen(true);
    };
    
    const closeAddProduct = () => {
        setAddProductModalOpen(false);
    };

    
    return (
        <div className="profile--main-container">
            <form action="POST" onSubmit={handleSubmit}>
                <div className="business--form-container">
                    <div className="business--form-section">
                        <Link to="/profile/business">
                            <button className="back--button d-flexCenter">
                                <img 
                                    src={back}  
                                    className=""
                                    alt="Back"/>
                                    Back
                            </button>
                        </Link>

                        <div className="flex">
                            <div className="business--form-header">Manage Business </div>
                            <button className="delete--businessBTN"> <FaTrash /> Delete Business</button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Location Type</label>
                            <select 
                                name="type" 
                                id="type" 
                                value={locationData.type}
                                onChange={handleInputChange} 
                                className="business-input">
                                <option value="" disabled>-- Location Type --</option>
                                <option value="1">Tourist Spot</option>
                                <option value="2">Restaurant/Food Establishment</option>
                                <option value="3">Accommodation</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Location Name</label>
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
                            <label htmlFor="address">Location Address</label>
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
                            <label htmlFor="address">Phone Number (optional)</label>
                            <input 
                                type="text" 
                                // name="contact" 
                                // id="contact" 
                                // value={locationData.contact}
                                onChange={handleInputChange}
                                placeholder="Enter Contact Number" 
                                className="business-input"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Email Address (optional)</label>
                            <input 
                                type="text" 
                                // name="email" 
                                // id="email" 
                                // value={locationData.email}
                                // onChange={handleInputChange}
                                placeholder="Enter Email Address" 
                                className="business-input"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Website (optional)</label>
                            <input 
                                type="text" 
                                // name="website" 
                                // id="website" 
                                // value={locationData.website}
                                onChange={handleInputChange}
                                placeholder="Enter Website" 
                                className="business-input"/>
                        </div>

                        <div className="form-column-group">
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
                        </div>
                        <div>
                            <p className="visibility--coordinates font14">
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

                        <div className="requests--table">  
                            <div className="flex-between">
                                <p className="requests--title bold2">Product & Services</p>
                                <button className="business--btn" onClick={openAddProduct}>
                                    <img src="/plus.svg" />
                                    <p>Add</p>
                                </button>
                            </div>
                            <table>
                                <thead className="table--th">
                                    <td></td>
                                    <td>Name</td>
                                    <td>Price</td>
                                    <td>Description</td>
                                    <td>Action</td>
                                </thead>
                                <tbody> {/*STATIC DATA */}
                                    <tr>
                                        <td>
                                            <img 
                                            src={SAMPLEIMAGE}  
                                            className="product--services-images"
                                            alt="SAMPLE"/>
                                        </td>
                                        <td>EMMAN MACAYA</td>
                                        <td>150</td>
                                        <td>Sobrang Sarap</td>
                                        <td>
                                            <div className="d-flexCenter">
                                                <Link to="edit"> {/*NAKA LINK LANG TO SA WALANG KWENTANG PAGE KASI WALA PA FUNCTIONALITY*/}
                                                    <button 
                                                        className="business--edit mr10px btn--icon"> {/*FUNCTIONALITY HERE (EDIT) */}
                                                        <FaPencilAlt />
                                                    </button>
                                                </Link>
                                                <button 
                                                    className="business--delete btn--icon"> {/*FUNCTIONALITY HERE (DELETE) */}
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <Modal
                            isOpen={isAddProductModalOpen}
                            onRequestClose={closeAddProduct}
                            contentLabel="Add Product"
                            className="addProduct--popup"
                            overlayClassName="modal-overlay"
                            >
                            <div className="modal-header">
                                <h2>Details</h2>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    // value={locationData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter Name" 
                                    className="business-input"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Price</label>
                                <input 
                                    type="text" 
                                    name="price" 
                                    id="price" 
                                    // value={locationData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter Price" 
                                    className="business-input"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Description</label>
                                <textarea 
                                    type="text" 
                                    name="description" 
                                    id="description" 
                                    // value={locationData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter Description" 
                                    className="business-input"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Product Image</label>
                                <button className="upload--btn d-flexCenter">
                                        <img className="upload--icon" src="/upload.svg" />
                                        <p>Upload</p>
                                    </button>
                            </div>
                            <div className="d-flexCenter jc-end mt-20px">
                                <button className="add--business" type="submit">Submit</button>
                            </div>
                        </Modal>
            
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ManageBusiness