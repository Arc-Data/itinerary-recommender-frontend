import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Forgot = () => {
    const { forgotPassword, status, loading, setStatus } = useContext(AuthContext)

    useEffect(() => {
        setStatus('')
    }, [])

    return (
        <div>
            <h2 className='heading'>Forgot Password</h2>
            <form className='modal-login-sign-form' onSubmit={forgotPassword}>
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter your email" />
                <p className="login-sign-link forgot font-weight-400">{status}</p>

                <button className='button-login-sign'>Send Code</button>
                <div className="login-sign-link">
                    Don't have an account? <Link to="/Signup">Sign Up</Link>
                </div> 
            </form>
        </div>
    )
}

export default Forgot;