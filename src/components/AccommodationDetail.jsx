import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";

const AccommodationDetail = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const { authTokens } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const { id } = useParams();
  const [showMore, setShowMore] = useState(false);

  const displayServices = services.map((service) => (
    <div className="service--item" key={service.id}>
      <div>
        <img
          className="searchPage--pic"
          src={`${backendUrl}${service.image}`}
          alt={service.item}
        />
        <span className="font-weight-600">{service.item}</span>
        <div
          className="service--descriptions"
          style={{ maxHeight: showMore ? "none" : "50px" }}
        >
          <span className="service--description font13">
            {service.description}
          </span>
        </div>
        {service.description.length > 50 && (
          <button
            className="show-more-button"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      <div className="service--price--container">
        <div className="description--item-price">₱{service.price}</div>
      </div>
    </div>
  ));

  const getServices = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/service/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.log("Error occurred while fetching services");
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className="food-place--container">
      <div className="food-place--header">
        <p className="heading2">Services</p>
      </div>
      <div className="food-items">{displayServices}</div>
    </div>
  );
};

export default AccommodationDetail;
