import { useContext, useEffect, useState } from "react"
import useQueryManager from "../hooks/useQueryManager"
import AuthContext from "../context/AuthContext"
import dayjs from 'dayjs'
import QueryDetails from "../modals/QueryDetails"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
    
const Queries = () => {
    const { authTokens } = useContext(AuthContext)
    const { contactForms, status, getContactForms, toggleAdminResponded } = useQueryManager(authTokens)

    const [showUnrespondedOnly, setShowUnrespondedOnly] = useState(false);
    const [ selectedForm, setSelectedForm ] = useState()

    const filteredContactForms = showUnrespondedOnly
        ? contactForms.filter(form => !form.admin_responded)
        : contactForms;

    const closeModal = () => {
        setSelectedForm(null)
    }

     const displayQueries = filteredContactForms && filteredContactForms.map(form => {
        const statusColor = form.admin_responded ? "#00ab41" : "#FFD228";
        return (
            <tr key={form.id}>
                <td>{form.user.first_name} {form.user.last_name}</td>
                <td>{form.user.email}</td>
                <td>{form.user.contact_number}</td>
                <td>{dayjs(form.date_created).format("MMMM D, YYYY")}</td>
                <td style={{ color: statusColor }}>{form.admin_responded ? "Responded" : "Pending"}</td>
                <td>
                    <button className="queries--btn" onClick={() => setSelectedForm(form)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
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
            <div className="queries--text">
                <div className="mt-22px mr10px">Show Unresponded Only</div>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={showUnrespondedOnly}
                        onChange={() => setShowUnrespondedOnly(!showUnrespondedOnly)}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
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
            {selectedForm && (
                <QueryDetails onClose={closeModal} form={selectedForm} toggleAdminResponded={toggleAdminResponded}/>
            )}
        </div>
    )
}

export default Queries