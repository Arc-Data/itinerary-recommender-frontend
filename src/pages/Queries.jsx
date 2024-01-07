import { useContext, useEffect } from "react"
import useQueryManager from "../hooks/useQueryManager"
import AuthContext from "../context/AuthContext"
import dayjs from 'dayjs'

const Queries = () => {
    const { authTokens } = useContext(AuthContext)
    const { contactForms, status, getContactForms } = useQueryManager(authTokens)

    
    console.log(contactForms)
    
    const displayQueries = contactForms && contactForms.map(form => {
        return (
            <tr key={form.id}>
                <td>{form.user.first_name} {form.user.last_name}</td>
                <td>{form.user.email}</td>
                <td>{form.user.contact_number}</td>
                <td>{dayjs(form.date_created).format("MMMM D, YYYY")}</td>
                <td>Something</td>
                <td>
                    <button>Details</button>
                </td>
            </tr>
        )
    })

    useEffect(() => {
        getContactForms()
    }, [])

    if (status === "Loading") {
        return(
            <div>Loading...</div>
        )
    }

    if (status === "Error") {
        return(
            <div>An error occured</div>
        )
    }


    return (
        <div>
            <h1 className="heading">Queries</h1>
            <table>
                <thead>
                    <tr>
                        <th className="font">Username</th>
                        <th className="font">Email</th>
                        <th className="font">Contact</th>
                        <th className="font">Date</th>
                        <th className="font">Status</th>
                        <th className="font">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {displayQueries}
                </tbody>
            </table>
        </div>
    )
}

export default Queries