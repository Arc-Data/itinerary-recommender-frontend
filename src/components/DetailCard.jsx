import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import AuthContext from "../context/AuthContext";
import { addDoc, setDoc, getDocs, query, where } from "firebase/firestore";
import { userClicks } from "../utils/firebase"

export default function DetailCard(props) {
    const { user } = useContext(AuthContext)
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const handleUserClick = async () => {
        try {
            const userQuery = query(userClicks, where("userId", "==", user.user_id))
            const userSnapshot = await getDocs(userQuery)
            
            if (userSnapshot.empty) {
                const newUserRef = await addDoc(userClicks, {
                    userId: user.user_id,
                    clicks: [{locationId: props.id, count: 1}]
                })
                
            } else {
                console.log("Should be here")

                const userDoc = userSnapshot.docs[0]
                const userClicksData = userDoc.data().clicks || [];
                const existingClick = userClicksData.find(click => click.locationId === props.id);
                
                if (existingClick) {
                  existingClick.count += 1;
                } else {
                  userClicksData.push({ locationId: props.id, count: 1 });
                }

                await setDoc(userDoc.ref, { clicks: userClicksData });            }
        }
        catch (error) {
            console.log("An unexepected error has occured while saving data to firebase", error)
        }
    }

    return (
        <div className="detailPage--popularCard">
            <div className="card--dest-image mb15px">
                <Link 
                    to={`/location/${props.id}`}
                    onClick={handleUserClick}
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
