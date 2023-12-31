import { Link } from 'react-router-dom';

const Forgot = () => {
    return (
        <div>
            <h2 className='heading'>Forgot Password</h2>
            <form className='modal-login-sign-form' onSubmit={(e) => loginUser(e)}>
                <label>Email:</label>
                <input type="email" name="email" placeholder="Enter your email" />

                <button className='button-login-sign'>Send Code</button>
                <div className="login-sign-link">
                    Don't have an account? <Link to="/Signup">Sign Up</Link>
                </div> 
            </form>
        </div>
    )
}

export default Forgot;