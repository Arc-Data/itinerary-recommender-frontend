import { useState } from "react"

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        'old': '',
        'new': '',
        'confirm': '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.new || !formData.confirm || !formData.old) {
            alert("Missing input fields")
            return
        }

        if (formData.new !== formData.confirm) {
            alert("New password and confirmation do not match");
            return;
        }
        
        try {
            console.log("Goes through")

        }
        catch (error) {
            console.log("An error occured while updating password instance")
        }

    }

    return (
        <div>
            <p>Change Password</p>
            <form onSubmit={handleSubmit}>
                <div className="form-input">
                    <label htmlFor="old">Old Password</label>
                    <input
                        type="password"
                        name="old"
                        placeholder="Enter old password"
                        id="old"
                        value={formData.old}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-input">
                    <label htmlFor="new">New Password</label>
                    <input
                        type="password"
                        name="new"
                        placeholder="Enter new password"
                        id="new"
                        value={formData.new}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-input">
                    <label htmlFor="confirm">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirm"
                        placeholder="Confirm new password"
                        id="confirm"
                        value={formData.confirm}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Change Password</button>
            </form>
        </div>
    )
}

export default ChangePassword