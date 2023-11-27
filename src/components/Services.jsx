import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"

const Services = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { 
        items, 
        location, 
        loading, 
        error, 
        getServices, 
        createService,
        getBusinessDetail} = useBusinessManager(authTokens)
    const [ imageFile, setImageFile ] = useState() 
    const [ data, setData ] = useState({
        'item': '',
        'price': 0,
        'description': '',
    })

    useEffect(() => {
        getBusinessDetail(id)
    }, [])

    useEffect(() => {
        getServices(id)
    }, [location])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImageFile(file);
    }

    const displayServices = items && items.map(item => {
        return (
            <tr key={item.id}>
                <td>Insert image here</td>
                <td>{item.item}</td>
                <td>{item.price}</td>
                <td><button>Delete</button></td>
            </tr>
        )
    })

    const resetData = () => {
        setData({
            'item': '',
            'price': 0,
            'description': ''
        });
        setImageFile(null);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        })) 
    }

    console.log(data)

    const checkInvalid = () => {
        return data.price < 0 || data.description === '' || 
            data.item === '' || !imageFile
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (checkInvalid()) {
            alert("Please fill in all required inputs")
            return
        }

        const formData = new FormData()
        formData.append('image', imageFile)

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        await createService(id, formData)
        resetData()
    }

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <div>An error occured: {error}</div>
        )
    }

    return (
        <div>
            <p>Services</p>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="input admin--container">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="item"
                        value={data.item}
                        onChange={handleInputChange}
                        className="styled-input" 
                    />
                </div>
                
                <div className="input admin--container">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={handleInputChange}
                        className="styled-input" 
                    />
                </div>

                <div className="input admin--container">
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={data.description}
                        onChange={handleInputChange}
                        className="styled-input" 
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
                <button className="add--business font14" type="submit">Submit</button>
            </div>
            </form>
            <table className='business--app-table'>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {displayServices}
                </tbody>
            </table>
        </div>
    )
}

export default Services