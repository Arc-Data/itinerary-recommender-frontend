import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import Spinner from "../components/Spinner";

const Reset = () => {
    const [ loading, setLoading ] = useState(true)
    const { uidb64, token } = useParams()
    const [ status, setStatus ] = useState()
    const { checkResetInstance, resetPassword, loginUser } = useContext(AuthContext)
    const [ formData, setFormData ] = useState({
        'newPassword': '',
        'confirmPassword': '',
    })
    const [ showPassword, setShowPassword ] = useState(false)

    const handleShowPassword = () => {
        setShowPassword(prev => !prev)
    }

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
            
            if(!check) {
                setStatus('Invalid Reset Link. Link might have expired.')
            }

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

    const validatePassword = (pass1, pass2) => {
        const strongPasswordRegex = /^(?=.*[!@#$%^&*(),.-?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).{8,}$/
        const isValid = strongPasswordRegex.test(pass1)

        if (pass1 !== pass2) {
            setStatus("Passwords do not match")
            setLoading(false)
            return false
        } else if (!isValid) {
            console.log(pass1, pass2)
            setStatus("Password must be 8 or more characters with at least one special character, one uppercase letter, and one digit.")
            setLoading(false)
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("I am here")
        setLoading(true)
        if (!validatePassword(formData.newPassword, formData.confirmPassword)) return 

        const email = await resetPassword(uidb64, token, formData.newPassword)
        console.log("Doing this")
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

        setLoading(false)
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <div className="">
            <p className="heading"> 
                Change Password
            </p>
            <p className="mb15px mt-15px"> Your new password must be different from previous used passwords.</p>
            {status && 
            <p className="login-error error">{status}</p>
            }
            <form action="POST" onSubmit={handleSubmit}>
            <div className="form-input">
                <label htmlFor="newPassword">New Password</label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter New Password"
                    id="newPassword" 
                    name="newPassword"
                    onChange={handleInputChange}
                    className={`business-input ${formData.newPassword !== formData.confirmPassword && 'error-border'}`}
                />
                <button 
                    type="button"
                    className={`toggle-password-button ${showPassword ? 'visible' : ''}`}>
                        <FontAwesomeIcon icon={faEyeSlash} 
                        onClick={handleShowPassword}/>
                    </button>
            </div>
            
            <div className="form-input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    onChange={handleInputChange}
                    className={`business-input ${formData.newPassword !== formData.confirmPassword && 'error-border'}`}
                />
                <button 
                    type="button"
                    className={`toggle-password-button ${showPassword ? 'visible' : ''}`}>
                        <FontAwesomeIcon icon={faEyeSlash} 
                        onClick={handleShowPassword}/>
                </button>
            </div>
                <button className="reset-password-btn button-login-sign">Submit</button>
            </form>
        </div>
    )
}

export default Reset