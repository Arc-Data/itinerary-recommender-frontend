import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

const Menu = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { 
        items, 
        location, 
        loading, 
        error, 
        getFoodItems, 
        getBusinessDetail, 
        deleteFood,
        createFood} = useBusinessManager(authTokens) 
    const [ imageFile, setImageFile ] = useState() 
    const [ data, setData ] = useState({
        'item': '',
        'price': 0,
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImageFile(file);
    }

    const handleDelete = (itemId) => {
        deleteFood(id, itemId)
    }

    const displayFood = items && items.map(item => {
        return (
            <tr key={item.id}>
                <td>
                    <img className="menu--img" src={`${backendUrl}${item.image}`} alt="" />
                </td>
                <td>{item.item}</td>
                <td>{item.price}</td>
                <td><button className="menu--delete-item" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrash} /></button></td>
            </tr>
        )
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const resetData = () => {
        setData({
            'item': '',
            'price': 0,
        });
        setImageFile(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.price <= 0 || data.item == '' || !imageFile) {
            alert("Please fill all inputs to proceed")
            return
        }

        const formData = new FormData()
        formData.append('image', imageFile)

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        await createFood(id, formData)
        resetData() 
    }

    useEffect(() => {
        getBusinessDetail(id)
    }, [id])

    useEffect(() => {
        getFoodItems(id)
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
            <div className="input--form">
            <p className="heading no-margin">Menu</p>
            </div>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="input admin--container">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="item"
                        value={data.item}
                        onChange={handleInputChange}
                        className="business-input" 
                    />
                </div>
                
                <div className="input admin--container">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={handleInputChange}
                        className="business-input" 
                    />
                </div>
                <div className="input admin--container">
                    <label>Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
            <div className="d-flexCenter mt-20px">
                <button className="add--business" type="submit"><FontAwesomeIcon className='btn-icons' icon={faPlus} />Add</button>
            </div>
            </form>
            <table className="business-table menu">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {displayFood}
                </tbody>
            </table>
        </div>
    )
}

export default Menu