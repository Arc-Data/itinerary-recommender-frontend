import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useBusinessManager from '../hooks/useBusinessManager'
import AuthContext from '../context/AuthContext'
import AudienceRow from '../components/AudienceRow'
import AddAudienceType from '../modals/AddAudienceType'

const FeeDetails = () => {
    const { feeId } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { 
        item: fee, 
        items: audience_types, 
        loading, 
        error, 
        getFeeDetails, 
        deleteAudienceType
    } = useBusinessManager(authTokens)
    const navigate = useNavigate()
    const [ openAddAudienceModal, setOpenAddAudienceModal ] = useState(false)

    const toggleAddAudienceModal = () => {
        setOpenAddAudienceModal(prev => !prev)
    }

    useEffect(() => {
        getFeeDetails(feeId)
    }, [feeId])

    const goBack = () => {
        navigate(-1)
    }
    
    const displayAudienceTypes = audience_types && audience_types.map(type => {
        return (
            <AudienceRow key={type.id} type={type} deleteAudienceType={deleteAudienceType}/>
        )
    })

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <div>{error}</div>
        )
    }

    return (
        <div>
            <p onClick={goBack}>Back</p>
            <p>{fee.name} Details</p>
            <button onClick={toggleAddAudienceModal}>Add Audience Type</button>
            <table>
                <thead>
                    <tr>
                        <td>Audience Type</td>
                        <td>Price</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                {displayAudienceTypes}
                </tbody>
            </table>
            {openAddAudienceModal && 
            <AddAudienceType onClose={toggleAddAudienceModal} />
            }
        </div>
    )
}

export default FeeDetails