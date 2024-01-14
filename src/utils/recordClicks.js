import { get, ref, set, update } from "firebase/database";
import { db } from "../utils/firebase";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const recordClicks = async (userId, locationId, access) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    try {
        console.log("I am here")
        const response = await fetch(`${backendUrl}/api/click/${locationId}/`, {
            method: "POST",
            headers:  {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`
            }
        })

        console.log(response)

    } catch (error) {
        console.log("An unexpected error has occurred while saving data to firebase", error);
    }
};

export default recordClicks;
