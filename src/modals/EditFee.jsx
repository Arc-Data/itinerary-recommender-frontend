import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import Modal from "../components/Modal"

const EditFee = ({onClose, item, editFeeType}) => {
    const [audienceTypes, setAudienceTypes] = useState(item.audience_types)

    const addRow = () => {
        setAudienceTypes((prevAudienceTypes) => [
          ...prevAudienceTypes,
          { id: new Date().getTime(), name: "", price: 0, description: "" },
        ]);
      };

    return (
        <Modal onClose={onClose} >
            <div>
                <p>{item.name}</p>
                <p>{item.is_required ? "Required" : "Optional"}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Audience Type</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Add</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayFeeRow}
                    </tbody>
                </table>
                <button onClick={addRow}>Add Row</button>
            </div>
            <button onClick={onClose}>Cancel</button>
        </Modal>
    )
}

export default EditFee