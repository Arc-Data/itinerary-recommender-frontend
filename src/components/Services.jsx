import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"


const Services = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { items, location, loading, error, getFoodItems, getBusinessDetail, handleServiceType } = useBusinessManager(authTokens) 

    console.log(items)

    const displayFood = items && items.map(item => {
        return (
            <tr key={item.id}>
                <td>
                    <img src={`${backendUrl}${item.image}`} alt="" />
                </td>
                <td>{item.item}</td>
                <td>{item.price}</td>
            </tr>
        )
    })

    const displayServices = items && items.map(item => {
        return (
            <tr key={item.id}>
                <td>Temp data</td>
            </tr>
        )
    })


    const displayItems = () => {
        if (location.location_type === "2") {
            return displayFood
        } else if (location.location_type === "3") {
            return displayServices
        }
    }

    useEffect(() => {
        getBusinessDetail(id)
    }, [id])

    useEffect(() => {
        if (location) {
            handleServiceType(location.id, location.location_type)
        }
    }, [location])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <div>{error}</div>
        )
    }

    return (
        <div>
            <p>Services</p>
            <div>
                <div className="input admin--container">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        className="styled-input" 
                    />
                </div>
                <div className="input admin--container">
                    <label>Description</label>
                    <input
                        type="text"
                        className="styled-input" 
                    />
                </div>
                <div className="input admin--container">
                    <label>Price</label>
                    <input
                        type="text"
                        className="styled-input" 
                    />
                </div>
            </div>
            <div className="d-flexCenter mt-20px">
                <button className="add--business font14" type="submit">Submit</button>
            </div>
            <table className='business--app-table'>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date filed</th>
                    </tr>
                </thead>
                <tbody>
                    {displayItems()}
                </tbody>
            </table>
        </div>
    )
}

export default Services