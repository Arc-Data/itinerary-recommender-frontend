import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import AuthContext from "../context/AuthContext"

const FoodDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { authTokens } = useContext(AuthContext)
    const { id } = useParams()
    const [foodItems, setFoodItems] = useState([])

    const getFoodItems = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/food/${id}/`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`
                }
            })

            console.log(response)
            const data = await response.json()
            setFoodItems(data)
        }
        catch(error) {
            console.log("Error occurred while fetching food items!")
        }
    }

    const displayFoodItems = foodItems && foodItems.map(food => {
        // id:6
        // image:"/media/location_food/2PCChickenJoyWDrink.jpg"
        // item: "2PC Chickenjoy with Drink"
        return (
            <div className="food--item" key={food.id}>
                {food.item}
            </div>
        )
    })

    useEffect(() => {
        getFoodItems()
    }, [])

    return (
        <div className="food-place--container">
            <div className="food-place--header">
                <p className="heading2">Menu</p>
                <button>add more items</button>
            </div>
            <div className="food-items">
                {displayFoodItems}
            </div>
        </div>
    )
}

export default FoodDetail