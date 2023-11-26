import Modal from "react-modal"

const ProductModal = ({onClose, isAddProductModalOpen, toggleAddProduct}) => {
    return (
        <Modal
            isOpen={isAddProductModalOpen}
            onRequestClose={toggleAddProduct}
            contentLabel="Add Product"
            className="addProduct--popup"
            overlayClassName="modal-overlay">
            <h1 className="modal-header">Details</h1>
            <div className="form-group">
            <label htmlFor="address">Name</label>
            <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
                className="business-input"
            />
            </div>
            <div className="form-group">
            <label htmlFor="address">Price</label>
            <input
                type="text"
                name="price"
                id="price"
                placeholder="Enter Price"
                className="business-input"
            />
            </div>
            <div className="form-group">
            <label htmlFor="address">Description</label>
            <textarea
                type="text"
                name="description"
                id="description"
                placeholder="Enter Description"
                className="business-input"
            />
            </div>
            <div className="mt-20px">
            <label htmlFor="address">Add Images</label>
            <button className="upload-btn font14">
                <img className="upload-icon" src="/upload.svg" alt="Upload Icon" />
                <label htmlFor="imgFile" className="choose-file">
                Upload Pictures
                </label>
                <input
                type="file"
                id="imgFile"
                name="filename"
                accept="image/*"
                style={{ display: "none" }}
                />
            </button>
            </div>
            <div className="d-flexCenter mt-20px">
            <button className="add--business font14" type="submit">
                Submit
            </button>
            </div>
        </Modal>
    )
}

export default ProductModal