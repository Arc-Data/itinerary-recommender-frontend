import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import Spinner from "../components/Spinner"
import { Link } from "react-router-dom"

const Verify = () => {
    const { user, preferences, authTokens, sendOTPRequest, status, verifyOTP } = useContext(AuthContext)
    const [ code, setCode ] = useState('')
    const [ loading, setLoading ] = useState(false)

    const resendOtp = async (e) => {
        setLoading(true)
        await sendOTPRequest(authTokens.access)  
        setLoading(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await verifyOTP(code)

        setLoading(false)
    }


    return (
        <div>
            <h2 className="heading">Verify Its You</h2>
            <p>An OTP (One-Time-Password) has been sent to {user.email}. Input the correct OTP to proceed</p>
            {status && <p>{status}</p>}
            <form method="POST" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="code">Code</label>
                    <input 
                        type="code" 
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                        disabled={loading}
                        />
                </div>
                {loading ? 
                <Spinner />
                :
                <div>
                    <Link onClick={resendOtp}>Resend OTP</Link>
                    <button type="submit">Submit</button>
                </div>
                }
            </form>
        </div>
    )
}

export default Verify