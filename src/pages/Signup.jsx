import { useContext, useState } from "react"
import { Link, Navigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Spinner from "../components/Spinner";

const Signup = () => {
    const { registerUser, user, status, setStatus } = useContext(AuthContext)
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [formData, setFormData] = useState({
        'firstname': '',
        'lastname': '', 
        'email': '',
        'password': '',
        'contact': '',
        'confirm': '',
    })
    const [ loading, setLoading ] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    
    if(user) {
        return (user.is_staff ? <Navigate to="/admin" /> : <Navigate to="/home" />)
    }
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        if(name === 'confirm') {
            formData.password === value ? setPasswordMatch(true) : setPasswordMatch(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        if(passwordMatch) {
            await registerUser(formData)
        } else {
            alert("Passwords do not match")
        }

        setLoading(false)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }

    return (
        <div>
            <h2 className='heading'>Sign Up</h2>
            <form className='modal-login-sign-form' onSubmit={handleSubmit}>
                <div className="name-inputs">
                    <div>
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstname" 
                            placeholder="Enter your first name" 
                            value={formData.firstname}
                            onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastname" 
                            placeholder="Enter your last name" 
                            value={formData.lastname}
                            onChange={handleInputChange} />
                    </div>
                </div>
                <label>Email</label>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleInputChange} />
                <label>Contact</label>
                <input 
                    type="contact" 
                    name="contact" 
                    placeholder="Enter contact number" 
                    value={formData.contact}
                    onChange={handleInputChange} />
                <label>Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <button
                    type="button"
                    className={`toggle-password-button ${showPassword ? 'visible' : ''}`}
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </button>
                <label>Confirm Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    name="confirm"
                    value={formData.confirm}
                    onChange={handleInputChange} />
                <button
                    type="button"
                    className={`toggle-password-button ${showPassword ? 'visible' : ''}`}
                    onClick={togglePasswordVisibility}>
                    {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </button>
                {loading ? 
                <Spinner /> 
                :
                <button className='button-login-sign' type="submit">Sign Up</button>
                }
                <div className="login-sign-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    );
}

export default Signup;