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
        <div className="register--success">
            <div className="successfully heading3">{status && <p>{status}</p>}</div>
            <div className="verify-text">
                You may now proceed to log in to your account. Enjoy!
                <Link to="/login">
                    <button className="button-login-sign bg-308B8C">Login</button>
                </Link>
            </div>
           
        </div>
    )
}

export default Activation