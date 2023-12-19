import { get, ref, set, update } from "firebase/database";
import { db } from "../utils/firebase";

const recordClicks = async (userId, locationId) => {
    try {
        const dbRef = ref(db, `users/${userId}`);
        const userSnapshot = await get(dbRef);
        
        if(!userSnapshot.exists()) {
            await set(dbRef, {
                clicks: [{
                    location: locationId,
                    amount: 1
                }]
            })
        } else {
             // If the user exists, update the clicks
             const userClicks = userSnapshot.val().clicks || [];
             const existingClick = userClicks.find(click => click.location === locationId);
 
             if (existingClick) {
                 // If the location already exists, increment the count
                 existingClick.amount += 1;
             } else {
                 // If the location doesn't exist, add a new entry
                 userClicks.push({
                     location: locationId,
                     amount: 1
                 });
             }
 
             // Update the clicks in the database using the update method
             const updates = {};
             updates[`/users/${userId}/clicks`] = userClicks;
 
             return update(ref(db), updates);
        }

    } catch (error) {
        console.log("An unexpected error has occurred while saving data to firebase", error);
    }
};

export default recordClicks;
