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
        JSON.parse(localStorage.getItem("setPreferences") === "true") : null)

    const navigate = useNavigate()

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
        console.log("Huh")

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
    
                localStorage.setItem('authTokens', JSON.stringify(data))
                localStorage.setItem('setPreferences', JSON.stringify(userData.set_preferences))
                
                if(!userData.set_preferences) {
                    console.log("Should have done this")
                }
    
                if(userData.is_staff) {
                    navigate('/admin')
                } else if (!userData.set_preferences) {
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

        if(response.status === 201) {
            navigate('/success')
        } else if(response.status === 401) {
            console.log("401")
        } else {
                        
        }
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
                console.log("Returning email: ", data.email)
                return data.email
            }

            console.log("Something wrong happened")
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
            console.log("Updated token successfully")
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
 
        } else {
            console.log("Supposedly logs out the user")
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
                return 'Valid'
            } else {
                return 'Invalid'
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
        navigate('/')
    }

    const forgotPassword = async (e) => {
        e.preventDefault()
        const email = e.target.email.value

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
    }

    useEffect(() => {
        const checkTokenExpiryAndRefresh = async () => {
            console.log("Checking for expiry")
            if (authTokens) {
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const decodedToken = jwt_decode(authTokens.access);
                console.log("Expiration :", decodedToken.exp)
                // Check if the token is expired or about to expire (e.g., within the next 60 seconds)
                if (decodedToken.exp && currentTimeInSeconds + 60 > decodedToken.exp) {
                    try {
                        console.log("Trying to update token: ...")
                        await updateToken();
                    } catch (error) {
                        console.error('Failed to refresh token:', error);
                        // Handle the error, such as logging out the user
                        logoutUser();
                    }
                }
            } 

            setLoading(false)
        };
        
        checkTokenExpiryAndRefresh();
        
        const fourMinutes = 1000 * 60 * 4
        const intervalId = setInterval(checkTokenExpiryAndRefresh, fourMinutes)

        return () => clearInterval(intervalId)
    }, [authTokens, updateToken, logoutUser])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}