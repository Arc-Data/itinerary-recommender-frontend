import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import AuthContext from "../context/AuthContext";
import recordClicks from "../utils/recordClicks";

export default function DetailCard(props) {
    const { user } = useContext(AuthContext)
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { authTokens } = useContext(AuthContext)

    return (
        <div className="detailPage--popularCard">
            <div className="card--dest-image mb15px">
                <Link 
                    to={`/location/${props.id}`}
                    onClick={() => recordClicks(user.user_id, props.id, String(authTokens.access))}
                >
                    <img 
                    src={`${backendUrl}${props.primary_image}`} 
                    className="card--image" alt="Location" 
                    />
                </Link>
            </div>
            <div className="detailPage--popDescription">
                <h1 className="font15 bold">{props.name}</h1>
                <div className="detailPage--star">
                    {[...Array(5)].map((star, i) => (
                        <FaStar
                            key={i}
                            className="star"
                            color={i + 1 <= props.ratings.average_rating ? "#ffc107" : "#e4e5e9"}
                        />
                    ))}
                    <span className="tags"> • {props.ratings.average_rating} </span> {/* RATING FOR THE SPOT*/}
                </div>
                <span className="font14 tags">
                    {props.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            {tag}
                            {index < props.tags.length - 1 && (
                                <span className="tag-separator"> • </span>
                            )}
                        </span>
                    ))}
                </span>
            </div>
        </div>
    );
}
