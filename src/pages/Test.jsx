import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Test = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { authTokens } = useContext(AuthContext)

    const testFunction = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/test/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${String(authTokens.access)}`
                }
            })

        }
        catch(error) {
            console.log("An error occured while fetching test api : ", error)
        }
    }
    
    return (
        <div>
            <p>Page for testing purposes</p>
            <button onClick={testFunction}>This button</button>
        </div>
    )
}

export default Test