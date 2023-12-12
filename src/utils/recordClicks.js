import { addDoc, setDoc, getDocs, query, where} from "firebase/firestore"
import { userClicks } from "../utils/firebase"

const recordClicks = async (userId, locationId) => {
    try {
        console.log("Recording Click Data for location id: ", locationId)
        const userQuery = query(userClicks, where("userId", "==", userId))
        const userSnapshot = await getDocs(userQuery)
        
        if (userSnapshot.empty) {
            await addDoc(userClicks, {
                userId: userId,
                clicks: [{locationId: locationId, count: 1}]
            })
            
        } else {
            const userDoc = userSnapshot.docs[0]
            const userClicksData = userDoc.data().clicks || [];
            const existingClick = userClicksData.find(click => click.locationId === locationId);
            
            if (existingClick) {
              existingClick.count += 1;
            } else {
              userClicksData.push({ locationId: locationId, count: 1 });
            }

            await setDoc(userDoc.ref, { userId: userId, clicks: userClicksData });            }
    }
    catch (error) {
        console.log("An unexepected error has occured while saving data to firebase", error)
    }
}

export default recordClicks