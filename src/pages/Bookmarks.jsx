import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import UserBookmarks from "../components/UserBookmarks";

const Bookmarks = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { authTokens , loading } = useContext(AuthContext);
    const [usersBookmarks, setUsersBookmarks] = useState([]);

    // GET RECENT BOOKMARKS
    const getUserBookmarks = async () => {
        console.log("Fetching Bookmarks");
        try {
            const response = await fetch(
                `${backendUrl}/api/bookmarks/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authTokens.access}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error fetching recent bookmarks data");
            }

            const data = await response.json();
            console.log(data);
            setUsersBookmarks(data);
        } catch (error) {
            console.error("Error while fetching recent bookmarks data: ", error);
        }
    };

    useEffect(() => {
        getUserBookmarks();
    }, []);

    const recentBookmarkCards = usersBookmarks && usersBookmarks.map(bookmark => (
        <UserBookmarks key={bookmark.id} {...bookmark} />
    ));

    console.log(recentBookmarkCards)

    return (
        <div className="profile--main-content">
            <p className="header-title heading">Your bookmarks</p>
            <p className="header-subtitle heading5">Locations</p>
            {loading ? 
			<div>
				Loading...
			</div>
			:
			<div className="trips--container">
				{recentBookmarkCards}
			</div>
			}
        </div>
    );
};

export default Bookmarks;
