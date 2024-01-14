import { useContext, useEffect, useState } from "react"
import { Link, Navigate, Outlet } from 'react-router-dom';
import AuthContext from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../components/Spinner'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
    const { loginUser, user, status, setStatus } = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        await loginUser(e)
        setLoading(false)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }

    useEffect(() => {
        setStatus('')
    }, [])

    useEffect(() => {
        if (user) {
            user.is_staff ? <Navigate to="/admin" /> : <Navigate to="/home" />
        }
    }, [user])
    
    return (
        <div>
            <h2 className='heading'>Login</h2>
            {status && <p className="login-error error status">{status}!</p>}
            <form className='modal-login-sign-form' onSubmit={handleLogin}>
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter your email" required/>

                <label>
                Password
                    <div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        required
                    />
                    <button
                        type="button"
                        className={`toggle-password-button ${showPassword ? 'visible' : ''}`}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                    </button>
                    </div>
                </label>
                <div className="forgot-password">
                    <Link to="/Forgot"><h1 className='font-weight-500'>Forgot Password</h1></Link>
                </div>
                {loading ? 
                <Spinner />
                :
                <button className='button-login-sign'>Login</button>
                }
                <div className="login-sign-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div> 
            </form>
        </div>
    )
}

export default Login;