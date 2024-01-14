import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import FeeRow from "./FeeRow"
import AddFeeType from "../modals/AddFeeType"


const Fees = () => {
    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { location, items: fees, error, loading, getBusinessDetail, createFeeType, getFeeTypes, editFeeType, addFeeType, deleteFeeType} = useBusinessManager(authTokens)
    const [ openFeeTypeModal, setOpenFeeTypeModal ] = useState(false)

    const toggleAddFeeTypeModal = () => {
        setOpenFeeTypeModal(prev => !prev)
    }

    const displayFees = fees && fees.map(fee => {
        return (
            <FeeRow fee={fee} key={fee.id} deleteFeeType={deleteFeeType}/>
        )
    })
    
    useEffect(() => {
        getBusinessDetail(id)
        getFeeTypes(id)
    }, [id])

    return (
        <div>
            <p className="heading">Fees</p>
            <button className="add-fee-type-btn" onClick={toggleAddFeeTypeModal}><FontAwesomeIcon className="btn-icons" icon={faPlus}/>Add</button>
            <table className="business-table">
                <thead>
                    <tr>
                        <td>Fee</td>
                        <td>Required</td>
                        <td>Audience Types</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {displayFees}
                </tbody>
            </table>
            { openFeeTypeModal && 
            <AddFeeType 
                onClose={toggleAddFeeTypeModal} 
                addFeeType={addFeeType}/>
            }
        </div>
    )
}

export default Fees