import React, { useContext, useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import SAMPLEIMAGE from "/images/osmenapeak.jpg";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ManageBusiness = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [businessData, setBusinessData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await fetch(`${backendUrl}/api/user/business/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authTokens.access}`,
          },
        });

        if (response.status === 404) {
          throw new Error("Error fetching data");
        }
        
        const data = await response.json();
        setBusinessData(data.business);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); 
      }
    };

    fetchData(id);
  }, [id, authTokens.access]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!businessData) {
    return <div>Error loading data</div>; 
  }

  const deleteBusiness = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/business/${id}/delete/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authTokens.access}`,
        },
      });
  
      navigate('/profile/business');
    } catch (error) {
      console.error("Error deleting business:", error);
    }
  };
  

  const openAddProduct = () => {
    setAddProductModalOpen(true);
  };

  const closeAddProduct = () => {
    setAddProductModalOpen(false);
  };

  
  const openDeleteBusiness = () => {
    setOpenDeleteModal(true);
  };

  const closeDeleteBusiness = () => {
    setOpenDeleteModal(false);
  };
  


  return (
    <div className="profile--main-container">
      <div className="admin-wrapper">
        <form className="admin--container">
          <div className="input--form">
            <select
              value={businessData?.location_type}
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
                value={businessData?.name}
                className="styled-input"
              />
            </div>
            <div className="input admin--container">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                value={businessData?.address}
                className="styled-input"
              />
            </div>
            <div className="input admin--container">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                name="tags"
                value={businessData?.tags}
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
                  value={businessData?.latitude}
                  className="styled-input"
                />
              </div>
              <div className="input admin--container">
                <label htmlFor="postalCode">Longitude</label>
                <input
                  number="text"
                  step="0.000001"
                  name="longitude"
                  value={businessData?.longitude}
                  className="styled-input"
                />
              </div>
            </div>
            <div className="admin--container">
              <div className="input admin--container">
                <label htmlFor="min_fee">Minimum Fee</label>
                <input
                  type="text"
                  name="min_fee"
                  value={location?.min_fee}
                  className="styled-input"
                />
              </div>
              <div className="input admin--container">
                <label htmlFor="max_fee">Maximum Fee</label>
                <input
                  number="text"
                  name="max_fee"
                  value={location?.max_fee}
                  className="styled-input"
                />
              </div>
            </div>
            <div className="admin--container">
              <div className="input admin--container">
                <label htmlFor="opening">Opening Time</label>
                <input
                  type="text"
                  name="opening_time"
                  value={location?.opening_time}
                  className="styled-input"
                />
              </div>
              <div className="input admin--container">
                <label htmlFor="closing">Closing Time</label>
                <input
                  type="text"
                  name="closing_time"
                  value={location?.closing_time}
                  className="styled-input"
                />
              </div>
            </div>
            <div className="input admin--container">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                // value={location?.description}
              />
            </div>
          </div>
          <div className="image--border center admin--container">
            <img className="edit--images" src={`${backendUrl}${businessData?.image}`}  />
            <label htmlFor="imgFile">
              {" "}
              <a className="choose--file">Choose file</a> to upload
            </label>
            <input
              type="file"
              id="imgFile"
              name="filename"
              accept="image/*"
              style={{ display: "none" }} // Hide the default file input
            />
          </div>
        </form>
        
        <div className="admin--container">
          <div className="input admin--container">
            <button 
                onClick={openDeleteBusiness} 
                className="delete-btn">
                Delete Business
            </button>
          </div>
        </div>
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
          <tbody>
            <tr>
              <td>
                <img
                  src={SAMPLEIMAGE}
                  className="product--services-images"
                  alt="SAMPLE"
                />
              </td>
              <td></td>
              <td>150</td>
              <td>Sobrang Sarap</td>
              <td>
                <div className="d-flexCenter">
                    <button className="business--edit mr10px btn--icon">
                      <FaPencilAlt />
                    </button>
                  <button className="business--delete btn--icon">
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={openDeleteModal}
        onRequestClose={closeDeleteBusiness}
        contentLabel="Add Product"
        className="addProduct--popup"
        overlayClassName="modal-overlay"
      >
        <div className="confirm-delete">
                <p className="confirm-delete--title">Deleting</p>
                <p className="confirm-delete--subtext">This action will delete the business, are you sure?</p>
                <div className="modal-btn--options">
                    <button onClick={closeDeleteBusiness} className="modal-btn modal--cancel">Cancel</button>
                    <button onClick={deleteBusiness} className="modal-btn modal--delete">Delete</button>
                </div>
            </div>

      </Modal>
    

      <Modal
        isOpen={isAddProductModalOpen}
        onRequestClose={closeAddProduct}
        contentLabel="Add Product"
        className="addProduct--popup"
        overlayClassName="modal-overlay"
      >
        <h1 className="modal-header">Details</h1>
        <div className="form-group">
          <label htmlFor="address">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter Name"
            className="business-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Price</label>
          <input
            type="text"
            name="price"
            id="price"
            placeholder="Enter Price"
            className="business-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            placeholder="Enter Description"
            className="business-input"
          />
        </div>
        <div className="mt-20px">
          <label htmlFor="address">Add Images</label>
          <button className="upload-btn font14">
            <img className="upload-icon" src="/upload.svg" alt="Upload Icon" />
            <label htmlFor="imgFile" className="choose-file">
              Upload Pictures
            </label>
            <input
              type="file"
              id="imgFile"
              name="filename"
              accept="image/*"
              style={{ display: "none" }}
            />
          </button>
        </div>
        <div className="d-flexCenter mt-20px">
          <button className="add--business font14" type="submit">
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageBusiness;
