import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const PrivateRoutes = () => {
    let { user, preferences, otpRequired } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate("/")
        } else if (user.is_staff) {
            navigate("/admin")
        } else if (!preferences) {
            navigate("/preferences")
        } else if (otpRequired) {
            navigate('/verify')
        }
    
    }, [user])

    return user && (
        <Outlet />
    )
}

export default PrivateRoutes; 