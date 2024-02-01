import { useContext, useEffect, useState } from "react"
import { Link, Navigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Spinner from "../components/Spinner";
import ReactDatePicker from 'react-datepicker'

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
        'birthdate': ''
    })
    const [ loading, setLoading ] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    console.log(formData)
    
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
            setStatus("Passwords do not match")
        }

        setLoading(false)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }

    useEffect(() => {
        setStatus('')
    }, [])

    return (
        <div className="sign-up-container">
            <h2 className='heading'>Sign Up</h2>
            {status && <p className="login-error error">{status}</p>}
            <form className='modal-login-sign-form' onSubmit={handleSubmit}>
                <div className="name-inputs">
                    <div>
                        <label>First Name</label>
                        <input
                            required 
                            type="text" 
                            name="firstname" 
                            placeholder="John" 
                            value={formData.firstname}
                            onChange={handleInputChange}
                            pattern="[A-Za-z]+([A-Za-z ]*)"
                            />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            required 
                            type="text" 
                            name="lastname" 
                            placeholder="Doe" 
                            value={formData.lastname}
                            onChange={handleInputChange}
                            pattern="[A-Za-z]+([A-Za-z ]*)"
                            />
                    </div>
                </div>
                <label>Email</label>
                    <input
                        required 
                        type="email" 
                        name="email" 
                        placeholder="sample@gmail.com" 
                        value={formData.email}
                        onChange={handleInputChange} 
                    />
                <div className="name-inputs no-margin-top">
                    <div>
                        <label>Phone Number</label>
                        <input
                            type="contact" 
                            name="contact" 
                            placeholder="09601234567" 
                            value={formData.contact}
                            onChange={handleInputChange}
                            pattern="^(09|\+639)\d{9}$" 
                        />
                    </div>
                    <div className="signup--birthday">
                        <label className="no-margin">Birthday</label>
                        <ReactDatePicker
                            selected={formData.birthdate}
                            onChange={(date) => setFormData({ ...formData, birthdate: date })}
                            dateFormat="MMMM d, yyyy"
                            placeholderText="October 10, 2001"
                        />
                    </div>
                </div>
                <label>Password</label>
                <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
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
    )
}

export default Signup;