import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faMapMarker, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import UserNav from '../components/UserNav';
import sampleData from '../AssistantContact';

function AssistantContact() {
  const [flippedCard, setFlippedCard] = useState(null);

  const handleContactClick = (id) => {
    setFlippedCard(id);
  };

  return (
    <div>
      
      <UserNav />
      <div className='hero--cards'>
        {sampleData.map((assistant) => (
          <div
            key={assistant.id}
            className={`card--destination ${flippedCard === assistant.id ? 'flipped' : ''}`}
          >
            <div className="driver--image">
              <img
                src={`/../images/${assistant.img}`}
                className="driver--images"
                alt="Card"
              />
            </div>
            <div className="driver--div">
              <h2>Driver Information</h2>
              <p className=""> <span>Name:</span> {assistant.name}</p>
              <p className=""><span>Birthday: </span>{assistant.birthday}</p>
              <p className=""><span>Address: </span>{assistant.address}</p>
              <p className=""><span>Driver Since: </span>{assistant.DriverSince}</p>
              <h2>Car Details</h2>
              <p className=""><span>Car type: </span>{assistant.carType}</p>
              <p className=""><span>Car: </span>{assistant.car}</p>
              <p className=""><span>Seating Capacity: </span>{assistant.seatingCap}</p>
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
                <p><FontAwesomeIcon icon={faPhone} /> <span className="font-weight-500">{assistant.phoneNumber}</span></p> 
                <p><FontAwesomeIcon icon={faEnvelope} /> <span className="font-weight-500">{assistant.email}</span></p> 
                <p><FontAwesomeIcon icon={faFacebookSquare} /> <span className="font-weight-500">{assistant.FbPage}</span> </p>
                </div>
                <h2>Additional Information</h2>
                <span className="font-weight-500">{assistant.information}</span> 
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssistantContact;
