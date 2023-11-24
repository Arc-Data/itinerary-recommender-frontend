import { Link } from "react-router-dom"

const UserBookmarks = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    return (
        <div className="itinerary">
            <Link to={`/location/${props.details.id}`}>
                <div className="itinerary--image-container ">
                    <img 
                        src={`${backendUrl}${props.details.primary_image}`} 
                        height={240}
                        width={270}
                        className="itinerary--image"
                        alt="" />
                </div>
            </Link>
            <div>
                <p className="bookmark--name1 font-weight-500">
                    {props.details.name}
                </p> 
            </div>
        </div>
    )
}

export default UserBookmarks