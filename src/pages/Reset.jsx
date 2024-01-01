import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { useParams } from "react-router-dom"

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
            <div>Invalid Reset Link</div>
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
        <div>
            <form action="POST" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input 
                        type="password" 
                        id="newPassword" 
                        name="newPassword"
                        onChange={handleInputChange}/>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword"
                        onChange={handleInputChange}/>
                </div>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default Reset