import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { useParams } from "react-router-dom"

const Reset = () => {
    const [ loading, setLoading ] = useState(true)
    const { uidb64, token } = useParams()
    const [ status, setStatus ] = useState()
    const { checkResetInstance } = useContext(AuthContext)

    console.log(uidb64, token)

    useEffect(() => {
        setLoading(true)
        const check = checkResetInstance(uidb64, token)
        setStatus(check)
        setLoading(false)
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

    return (
        <div>
            <form action="POST" >
                <button>Submit</button>
            </form>
        </div>
    )
}

export default Reset