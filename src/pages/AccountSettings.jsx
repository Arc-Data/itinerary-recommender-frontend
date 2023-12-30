import { useState } from "react"
import { Link } from "react-router-dom"

const AccountSettings = () => {
    
    return (
        <div>
            <div>Account Settings</div>
            <Link to="change-password">Change Password</Link>
    
        </div>
    )
}

export default AccountSettings