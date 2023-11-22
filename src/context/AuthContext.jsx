import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode"
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    

    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    const [loading, setLoading] = useState(true)
    const [preferences, setPreferences] = useState(() => localStorage.getItem('setPreferences') ? 
        JSON.parse(localStorage.getItem("setPreferences") === "true") : null)

    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault()
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

        console.log(data)
         
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
        } else {
            alert("Something went wrong")
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
                'email': formData.email,
                'password': formData.password
            })
        })

        if(response.status === 201) {
            const data = await response.json()
            alert("Successfully created user")
            loginUser({ target: { email: { value: formData.email }, password: {value: formData.password} }, preventDefault: () => {} });

        } else if(response.status === 401) {
            console.log("401")
        } else {
            
        }

        return false;
    }

    const updateToken = async() => {
        console.log("Runs the backend function")
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
        console.log(data)
        
        if(response.status === 200) {
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

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        localStorage.removeItem('setPreferences')
        navigate('/')
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
        authTokens: authTokens,
        loginUser: loginUser,    
        logoutUser: logoutUser,    
        registerUser: registerUser,
        userSetPreference: userSetPreference,
        preferences: preferences,
    }

    useEffect(() => {
        const checkTokenExpiryAndRefresh = async () => {
            if (authTokens) {
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const decodedToken = jwt_decode(authTokens.access);
    
                // Check if the token is expired or about to expire (e.g., within the next 60 seconds)
                if (decodedToken.exp && currentTimeInSeconds + 60 > decodedToken.exp) {
                    try {
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