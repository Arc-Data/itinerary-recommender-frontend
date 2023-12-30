import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Activation = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const { uidb64, token } = useParams()
    const [ activationResult, setActivationResult ] = useState()

    useEffect(() => {
        const activateUser = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/activate/${uidb64}/${token}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({uidb64, token})
                })

                if (response.ok) {
                    const data = await response.json();
                    setActivationResult(data.message)
                } else {
                    setActivationResult('Activation Failed. Please try again')
                }
            }
            catch (error) {
                console.log("error during activation", error)
                setActivationResult('Activation Failed. Please try again.')
            }
        }

        activateUser()
    }, [uidb64, token])
    
    return (
        <div>
            {activationResult && <p>{activationResult}</p>}
        </div>
    )
}

export default Activation