import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"

const Activation = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { status, activateUser } = useContext(AuthContext)
    const { uidb64, token } = useParams()

    useEffect(() => {
        activateUser(uidb64, token)
    }, [uidb64, token])
    
    return (
        <div>
            {status && <p>{status}</p>}
            <Link to="/login">
                <button>Login</button>
            </Link>
        </div>
    )
}

export default Activation