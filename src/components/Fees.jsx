import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import useBusinessManager from "../hooks/useBusinessManager"
import EditFee from "../modals/EditFee"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import FeeRow from "./FeeRow"

const Fees = () => {
    const { id } = useParams()
    const { authTokens } = useContext(AuthContext)
    const { location, items: fees, error, loading, getBusinessDetail, createFeeType, getFeeTypes, editFeeType} = useBusinessManager(authTokens)

    // const [formFields, setFormFields] = useState([
    //     {
    //         'fee_name': '',
    //         'audience_type' : '',
    //         'amount' : '',
    //         'is_required': false,
    //     }
    // ])

    // const handleInputChange = (event, index) => {
    //     const { name, value, type, checked } = event.target
    //     let data = [...formFields]
    //     data[index][name] = type === 'checkbox' ? checked : value
    //     setFormFields(data)
    //     console.log(data)
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    // const deleteField = (indexToDelete) => {
    //     const updatedFields = formFields.filter((_, index) => index !== indexToDelete)
    //     setFormFields(updatedFields)
    // }

    const displayFees = fees && fees.map(fee => {
        return (
            <FeeRow fee={fee} key={fee.id}/>
        )
    })
    
    useEffect(() => {
        getBusinessDetail(id)
        getFeeTypes(id)
    }, [id])

    return (
        <div>
            <p>Fees</p>
            <table>
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
        </div>
    )
}

export default Fees