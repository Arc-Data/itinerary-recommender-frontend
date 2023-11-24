import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const UserBookmarks = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    return (
        <div className="itinerary">
            <Link to={`/location/${props.details.id}`}>
                <p className="bookmark--name1 heading4 font-weight-500">
                    {props.details.name}
                </p>
                <div className="itinerary--image-container ">
                    <img 
                        src={`${backendUrl}${props.details.primary_image}`} 
                        height={240}
                        width={270}
                        className="itinerary--image"
                        alt="" />
                </div>
                <div>
                    <div className="bookmark--details">
                        <p>Minimum Fee 
                            <p 
                            className="bookmark-item font14 font-weight-500 ">
                            {props.details.fee.min}
                            </p>
                        </p>
                        <p>Maximum Fee
                            <p 
                            className="bookmark-item font14 font-weight-500 ">
                            {props.details.fee.max}
                            </p>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default UserBookmarks