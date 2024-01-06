import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faLock } from '@fortawesome/free-solid-svg-icons';

const Reset = () => {
    const [ loading, setLoading ] = useState(true)
    const { uidb64, token } = useParams()
    const [ status, setStatus ] = useState()
    const { checkResetInstance, resetPassword, loginUser } = useContext(AuthContext)
    const [ formData, setFormData ] = useState({
        'newPassword': '',
        'confirmPassword': '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        })) 
    }

    useEffect(() => {
        setLoading(true)
        const fetchResetInstance = async () => {
            const check = await checkResetInstance(uidb64, token)
            setStatus(check)
            setLoading(false)
        }

        fetchResetInstance()
    }, [])

    if (loading) {
        return (
            <div>Loading</div>
        )
    }

    if (status === 'Invalid') {
        return (
            <div className="register--success">
                
                <div 
                    className="successfully heading3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon mr5px" />
                        Invalid Reset Link
                </div>
                <div className="verify-text">Check your email and click the latest link.</div>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match")
            return 
        }

        const email = await resetPassword(uidb64, token, formData.newPassword)

        if(email) {
            const syntheticEvent = {
                preventDefault: () => {},
                target: {
                    email: {
                        value: email
                    },
                    password: {
                        value: formData.newPassword,
                    }
                }
            }

            loginUser(syntheticEvent)
        } else {
            setStatus('Invalid')
        }
    }

    return (
        <div className="register--success textAlign">
            <div className="successfully heading3 "> 
                <FontAwesomeIcon icon={faLock} className="warning-icon mr5px" />
                Change Password
            </div>
            <form className="verify-text" action="POST" onSubmit={handleSubmit}>
            <p className="mb15px"> Your new password must be different from previous used passwords.</p>
            <div className="form-input">
                <label htmlFor="newPassword">New Password</label>
                <input 
                    type="password" 
                    placeholder="Enter New Password"
                    id="newPassword" 
                    name="newPassword"
                    onChange={handleInputChange}
                    className={`business-input ${formData.newPassword !== formData.confirmPassword && 'error-border'}`}
                />
            </div>
            
            <div className="form-input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    onChange={handleInputChange}
                    className={`business-input ${formData.newPassword !== formData.confirmPassword && 'error-border'}`}
                />
            </div>
                <button className="bg-308B8C">Submit</button>
            </form>
        </div>
    )
}

export default Reset