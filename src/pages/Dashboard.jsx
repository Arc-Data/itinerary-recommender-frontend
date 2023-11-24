import users from "/images/uil_users-alt.svg";
import location from "/images/akar-icons_location.svg";

const Profile = () => {
    return (
        <div>
            <h1 className="heading2">Dashboard</h1>
            <div className="dashboard--container">
                <div className="dashboard--performance">
                    <p className="font14 font-weight-600">Overall Performance</p>
                    <div className="dashboard--performance-container">
                        <div className="dashboard--total-container">
                            <div className="dashboard--items d-flexCenter">
                                <img className="dashboard--users" src={users} />
                                <div>
                                <h1 className="bold heading4">100,000</h1>
                                <p className="mt-5px font13">Total number of users</p>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard--total-container">
                            <div className="dashboard--items d-flexCenter">
                                <img className="dashboard--users" src={location} />
                                <div>
                                <h1 className="bold heading4">2,000</h1>
                                <p className="mt-5px font13">Total number of locations</p>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard--total-container">
                            <div className="dashboard--items d-flexCenter">
                                <img className="dashboard--users" src={users} />
                                <div>
                                <h1 className="bold heading4">100,000</h1>
                                <p className="mt-5px font13">Total number of users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
  
  export default Profile