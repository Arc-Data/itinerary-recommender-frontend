import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';

const Forgot = () => {
    const [ loading, setLoading] = useState(false)
    const { forgotPassword, status, setStatus } = useContext(AuthContext)

    useEffect(() => {
        setStatus('')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await forgotPassword(e.target.email.value)
        setLoading(false)
    }

    return (
        <div>
            <h2 className='heading'>Forgot Password</h2>
            <form className='modal-login-sign-form' onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter your email" />
                <p className="login-sign-link forgot font-weight-400">{status}</p>
                {loading ? 
                <Spinner />
                :
                <button className='button-login-sign'>Send Code</button>
                }
                <div className="login-sign-link">
                    Don't have an account? <Link to="/Signup">Sign Up</Link>
                </div> 
            </form>
        </div>
    )
}

export default Forgot;