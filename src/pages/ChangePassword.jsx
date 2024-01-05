import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faLock } from '@fortawesome/free-solid-svg-icons';

const ChangePassword = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { authTokens } = useContext(AuthContext)

    const [formData, setFormData] = useState({
        'oldPassword': '',
        'newPassword': '',
        'confirm': '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.newPassword || !formData.confirm || !formData.oldPassword) {
            alert("Missing input fields")
            return
        }

        if (formData.newPassword !== formData.confirm) {
            alert("newPassword password and confirmation do not match");
            return;
        }
        
        try {
            const response = await fetch(`${backendUrl}/api/change-password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${String(authTokens.access)}`
                },
                body: JSON.stringify({
                    'old_password': formData.oldPassword,
                    'new_password': formData.newPassword,
                })
            })

            if (response.status === 400) {
                alert("Incorrect oldPassword Password")
                return
            }

            alert("Password Changed")
            setFormData({
                'oldPassword': '',
                'newPassword': '',
                'confirm': '',
            })

        }
        catch (error) {
            console.log("An error occured while updating password instance", error)
        }
    }

    return (
        <div className="register--success">
            <p className="successfully">
                <FontAwesomeIcon icon={faLock} className="warning-icon mr5px" />
                Create new Password
            </p>
            <form className="verify-text textAlign" onSubmit={handleSubmit}>
            <p className="mb15px textAlignC"> Your new password must be different from previous used passwords.</p>
                <div className="form-input">
                    <label htmlFor="oldPassword">Old Password</label>
                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Enter Old Password"
                        id="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="business-input"
                    />
                </div>

                <div className="form-input">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Enter New Password"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`business-input ${formData.newPassword !== formData.confirm && 'error-border'}`}
                    />
                </div>

                <div className="form-input">
                    <label htmlFor="confirm">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirm"
                        placeholder="Confirm Password"
                        id="confirm"
                        value={formData.confirm}
                        onChange={handleChange}
                        className={`business-input ${formData.newPassword !== formData.confirm && 'error-border'}`}
                    />
                </div>

                <button className="bg-308B8C " type="submit">Reset Password</button>
            </form>
        </div>
    )
}

export default ChangePassword