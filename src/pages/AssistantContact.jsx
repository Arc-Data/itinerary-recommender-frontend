import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faMapMarker, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import UserNav from '../components/UserNav';
import useDriverManager from "../hooks/useDriverManager";

function AssistantContact() {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const { authTokens } = useContext(AuthContext);
  const { drivers, getDrivers, loading, error } = useDriverManager(authTokens);

  const [flippedCard, setFlippedCard] = useState(null);
  const [selectedCarType, setSelectedCarType] = useState("");

  useEffect(() => {
    getDrivers();
  }, []); 

  const handleContactClick = (id) => {
    setFlippedCard(id);
  };

  const handleCarTypeChange = (event) => {
    setSelectedCarType(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const filteredDrivers = selectedCarType
    ? drivers.filter((driver) => driver.car_type.toString() === selectedCarType)
    : drivers;

  const mapCarType = (type) => {
    const carTypeMap = {
      1: "Sedan",
      2: "Van",
      3: "SUV",
    };
  
    return carTypeMap[type] || "Unknown";
  };

  return (
    <div>
      <UserNav />
      <div className="driver--containers">
        <div className="driver--text flex ">
          <select className="select--driver" onChange={handleCarTypeChange} value={selectedCarType}>
            <option value="">Car Type (All)</option>
            <option value="1">Sedan (4 Seater)</option>
            <option value="2">Van (12-15 Seater)</option>
            <option value="3">Suv (8 Seater)</option>
          </select>
        </div>
        <div className='hero--cards'>
          {filteredDrivers.map((assistant) => (
            <div
              key={assistant.id}
              className={`card--destination ${flippedCard === assistant.id ? 'flipped' : ''}`}
            >
              <div className="driver--image">
                <img
                  src={`${backendUrl}${assistant.image}`}
                  className="driver--images"
                  alt="Card"
                />
              </div>
              <div className="driver--div">
                <h2>Driver Information</h2>
                <p className=""> <span>Name:</span> {assistant.first_name} {assistant.last_name} </p>
                <p className="font12"> <span>Email: </span> {assistant.email}</p>
                <h2>Car Details</h2>
                <p className=""><span>Car type: </span> {mapCarType(assistant.car_type)}</p>
                <p className=""><span>Car: </span>{assistant.car}</p>
                <p className=""><span>Seating Capacity: </span>{assistant.max_capacity}</p>
                <p className=""><span>Plate Number: </span>{assistant.plate_number}</p>
              </div>
              <div className='driver--button-div'>
                <button
                  className='contact--button1'
                  onClick={() => handleContactClick(assistant.id)}
                >
                  Contact Now
                </button>
              </div>
              {flippedCard === assistant.id && (
                <div className="flipped-content">
                  <h2>Contact Information</h2>
                  <div className="driver--div">
                  <p><FontAwesomeIcon icon={faPhone} /> <span className="font-weight-500">{assistant.contact}</span></p> 
                  <p><FontAwesomeIcon icon={faEnvelope} /> <span className="font-weight-500 font13">{assistant.email}</span></p> 
                  <p><FontAwesomeIcon icon={faFacebookSquare} /> <span className="font-weight-500">{assistant.facebook}</span> </p>
                  </div>
                  <h2>Additional Information</h2>
                  <span className="font-weight-500">{assistant.additional_information}</span> 
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssistantContact;
