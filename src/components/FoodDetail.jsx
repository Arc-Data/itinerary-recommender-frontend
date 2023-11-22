import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import AuthContext from "../context/AuthContext"

const FoodDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { authTokens } = useContext(AuthContext)
    const { id } = useParams()
    const [foodItems, setFoodItems] = useState([])

    console.log(foodItems)

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
            console.log("error occured while fetching food items")
        }
    }

    useEffect(() => {
        getFoodItems()
    }, [])

    return (
        <div>FoodDetail</div>
    )
}

export default FoodDetail