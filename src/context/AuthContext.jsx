import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode"
import { useNavigate, Link } from "react-router-dom";

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    const [ status, setStatus ] = useState()
    const [loading, setLoading] = useState(true)
    const [preferences, setPreferences] = useState(() => localStorage.getItem('setPreferences') ? 
        JSON.parse(localStorage.getItem("setPreferences") === "true") : null
    )
    const [otpRequired, setOtpRequired] = useState(() => localStorage.getItem('otpRequired') ? 
        JSON.parse(localStorage.getItem("otpRequired")) : null
    );
    
    const navigate = useNavigate()

    const sendOTPRequest = async (access) => {
        try {
            const response = await fetch(`${backendUrl}/api/generate-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            })
        }
        catch (error) {
            console.log("An error occured while generating OTP request :", error)
        }
    }

    const verifyOTP = async (code) => {
        try {
            const response = await fetch(`${backendUrl}/api/verify-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${String(authTokens.access)}`
                },
                body: JSON.stringify({
                    'code': code
                })
            })

            const data = await response.json()
            setStatus(data.detail)

            if (data.detail === 'Success') {
                setOtpRequired(false)
                localStorage.setItem("otpRequired", false)
                
                if (!preferences) {
                    navigate('/preferences')
                }
                navigate('/home')
            }
        }
        catch (error) {
            console.log("An error occured while verifying user otp : ", error)
        }
    }

    const activateUser = async (uidb64, token) => {
        try {
            const response = await fetch(`${backendUrl}/api/activate/${uidb64}/${token}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({uidb64, token})
            })

            const data = await response.json();
            setStatus(data.message)
        }
        catch (error) {
            setStatus(error)
        }
    }

    const loginUser = async (e) => {
        e.preventDefault()        
        setStatus('')

        try {
            const response = await fetch(`${backendUrl}/api/token/`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    'email':e.target.email.value, 
                    'password':e.target.password.value
                })
            })
            const data = await response.json()

            if(response.status === 200) {
                const userData = jwt_decode(data.access)
    
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                if (userData.exp && currentTimeInSeconds > userData.exp) {
                    await updateToken();
                }

                setAuthTokens(data)
                setUser(userData)
                setPreferences(userData.set_preferences)
                setOtpRequired(userData.otp_required)
    
                localStorage.setItem('authTokens', JSON.stringify(data))
                localStorage.setItem('setPreferences', JSON.stringify(userData.set_preferences))
                localStorage.setItem('otpRequired', JSON.stringify(userData.otp_required))

                if(userData.is_staff) {
                    navigate('/admin')
                } 
                else if (userData.otp_required) {
                    await sendOTPRequest(data.access)
                    navigate('/verify')
                }
                else if (!userData.set_preferences) {
                    navigate("/preferences")
                }
                else {
                    navigate('/home')
                }
            }
            else {
                setStatus(data.detail)
            }
        } catch (error) {
            console.log("An error occured while logging in user: ", error)
        }
    }

    const registerUser = async (formData) => {
        const strongPasswordRegex = /^(?=.*[!@#$%^&*(),.-?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).{8,}$/
        const isValidPassword = strongPasswordRegex.test(formData.password)

        if (!isValidPassword) {
            setStatus("Password must be 8 or more characters with at least one special character, one uppercase letter, and one digit.")
            return
        }

        const response = await fetch(`${backendUrl}/api/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                'first_name': formData.firstname,
                'last_name': formData.lastname,
                'contact_number': formData.contact,
                'email': formData.email,
                'password': formData.password
            })
        })
        const data = await response.json()

        if (data.detail) {
            setStatus(data.detail)
        }

        if(response.status === 201) {
            setStatus('')
            navigate('/login')
        }

        return false
    }

    const resetPassword = async (uidb64, token, password) => {
        try {
            const response = await fetch(`${backendUrl}/api/reset/${uidb64}/${token}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'password': password,
                })
            })

            const data = await response.json()

            if (response.status === 200) {
                return data.email
            }

            return false
        }
        catch(error) {
            console.log("An error occured while reseting password: ", error)            
            return false
        }
        
    }

    const updateToken = async() => {
        const response = await fetch(`${backendUrl}/api/token/refresh/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                'refresh':authTokens?.refresh, 
            })
        })
        const data = await response.json()
        
        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
 
        } else {
            logoutUser()
        }

        if(loading) {
            setLoading(false)
        }
    }

    const checkResetInstance = async (uidb64, token) => {
        try {
            const response = await fetch(`${backendUrl}/api/reset/${uidb64}/${token}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (response.status == 200) {
                return true
            } else {
                return false
            }
        }   
        catch (error) {
            console.log("An error occured while checking reset instance. ", error)
        }

    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        localStorage.removeItem('setPreferences')
        localStorage.removeItem('otpRequired')
        navigate('/')
    }

    const forgotPassword = async (email) => {
        try {
            const response = await fetch(`${backendUrl}/api/forgot/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'email': email
                })
            })

            if (response.status == 404) {
                setStatus(<span>That email account doesn't exist. Enter a different account or <Link to="/signup"> create a new one </Link></span>)
                return
            } else if (response.status == 200) {
                setStatus(`Instructions have been sent to your email! `)
            }
        }
        catch (error) {
            console.log("An error occured while sending forgot password request. ", error)
        }
    }

    const userSetPreference = () => {
        if (user) {
            localStorage.setItem('setPreferences', true)
            setPreferences(true)
            navigate("/home")
        }
    }

    const contextData = {
        user: user,
        status: status,
        authTokens: authTokens,
        activateUser: activateUser,
        loginUser: loginUser,    
        setStatus: setStatus,
        logoutUser: logoutUser,    
        registerUser: registerUser,
        resetPassword: resetPassword,
        forgotPassword: forgotPassword,
        checkResetInstance: checkResetInstance,
        userSetPreference: userSetPreference,
        preferences: preferences,
        otpRequired: otpRequired,
        sendOTPRequest: sendOTPRequest,
        verifyOTP: verifyOTP,
    }

    useEffect(() => {
        const checkTokenExpiryAndRefresh = async () => {
            if (authTokens) {
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const decodedToken = jwt_decode(authTokens.access);

                if (decodedToken.exp && currentTimeInSeconds + 120 > decodedToken.exp) {
                    try {
                        await updateToken();
                    } catch (error) {
                        logoutUser();
                    }
                }
            } 

            setLoading(false)
        };
        
        checkTokenExpiryAndRefresh();
        
        const eightMinutes = 1000 * 60 * 8
        const intervalId = setInterval(checkTokenExpiryAndRefresh, eightMinutes)

        return () => clearInterval(intervalId)
    }, [authTokens, updateToken, logoutUser])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}