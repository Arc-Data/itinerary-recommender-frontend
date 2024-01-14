import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faLock } from '@fortawesome/free-solid-svg-icons';

const ChangePassword = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { authTokens } = useContext(AuthContext)
    const [ status, setStatus ] = useState('')

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
        setStatus('')
        const strongPasswordRegex = /^(?=.*[!@#$%^&*(),.-?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).{8,}$/
        const isValidPassword = strongPasswordRegex.test(formData.newPassword)
        console.log(formData.oldPassword, formData.newPassword)

        if (!formData.newPassword || !formData.confirm || !formData.oldPassword) {
            setStatus("Missing input fields")
            return 
        } else if (formData.newPassword !== formData.confirm) {
            setStatus("Password and confirmation does not match");
            return 
        } else if (!isValidPassword) {
            setStatus("New Password must be 8 or more characters with at least one special character, one uppercase letter, and one digit.")
            return
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

            console.log(response)
            const data = await response.json()
            console.log(data)

            if (response.status === 400) {
                setStatus(data.detail)
                return
            } else if (!response.ok) {
                setStatus("An error occured")
                return 
            } 

            setStatus('Change Password Success')
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
            <p className="successfully font-weight-500">
                <FontAwesomeIcon icon={faLock} className="warning-icon mr5px" />
                Create New Password
            </p>
            <form className="verify-text textAlign" onSubmit={handleSubmit}>
                <p className="mb15px textAlignC"> Your new password must be different from previous used passwords.</p>
                {status && <p className="login-error error">{status}</p>  }
                <div className="form-input">
                    <label htmlFor="oldPassword">Old password</label>
                    <input
                        required
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
                    <label htmlFor="newPassword">New password</label>
                    <input
                        required
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
                    <label htmlFor="confirm">Confirm new password</label>
                    <input
                        required
                        type="password"
                        name="confirm"
                        placeholder="Confirm Password"
                        id="confirm"
                        value={formData.confirm}
                        onChange={handleChange}
                        className={`business-input ${formData.newPassword !== formData.confirm && 'error-border'}`}
                    />
                </div>

                <button className="reset-password-btn" type="submit">Reset Password</button>
            </form>
        </div>
    )
}

export default ChangePassword