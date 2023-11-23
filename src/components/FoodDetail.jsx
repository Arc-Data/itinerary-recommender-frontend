import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import AuthContext from "../context/AuthContext"

const FoodDetail = ({isOwnedByUser}) => {
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

            const data = await response.json()
            setFoodItems(data)
            console.log(data)
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
                <div>
                    <img className="searchPage--pic" src={`${backendUrl}${food.image}`}  />
                    <span className="food--item-name font-weight-600">{food.item}</span>
                </div>
                <div className="price--container">
                    <div className="food--item-price">₱{food.price}</div>
                </div>
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
                {isOwnedByUser &&
                <button className="food-place--update-menu" >Update Menu</button>
                }
            </div>
            <div className="food-items">
                {displayFoodItems}
            </div>
        </div>
    )
}

export default FoodDetail