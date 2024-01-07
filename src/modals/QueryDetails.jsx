import Modal from "../components/Modal"

const QueryDetails = ({onClose, form}) => {
    console.log(form)

    return (
        <Modal onClose={onClose}>
            <div>
                <h1>Query Details</h1>
                <p>{form.user.firstname} {form.user.lastname}</p>
                <p>{form.user.email}</p>
                <p>{form.user.contact_number}</p>
                <p>{form.query}</p>
            </div>
        </Modal>
    )
}

export default QueryDetails