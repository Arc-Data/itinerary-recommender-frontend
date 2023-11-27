import { useState, useEffect, useContext } from "react";
import searchIcon from "/images/search.png";
import AuthContext from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import Modal from "react-modal";

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { authTokens, user } = useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/user/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        const sortedData = data.sort((a, b) => a.id - b.id);

        setUsers(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/user/${selectedUserId}/delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUserId)
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return (
      fullName.includes(searchInput.toLowerCase()) ||
      user.email.includes(searchInput.toLowerCase())
    );
  });

  const userElements = filteredUsers.map((user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.first_name}</td>
      <td>{user.last_name}</td>
      <td>{user.email}</td>
      <td className="admin--table-action">
        <button className="delete" onClick={() => handleDelete(user.id)}>
            <FaTrash/>
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <div>
        <form className="admin--container">
          <img className="search--icon" src={searchIcon} alt="Search Icon" />
          <input
            type="text"
            placeholder="Search for user..."
            className="admin--search--bar"
            value={searchInput}
            onChange={handleSearchChange}
          />
          <button className="btn search" type="button">
            Search
          </button>
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <td className="font">ID</td>
            <td className="font">First Name</td>
            <td className="font">Last Name</td>
            <td className="font">Email</td>
            <td className="font">Action</td>
          </tr>
        </thead>
        <tbody>{userElements}</tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete User Modal"
        className="modal"
      >
        <div className="confirm-delete">
          <p className="confirm-delete--title">Deleting</p>
          <p className="confirm-delete--subtext">
            This action will delete the user, are you sure?
          </p>
          <div className="modal-btn--options">
            <button onClick={confirmDelete} className="modal-btn modal--delete">
              Delete
            </button>
            <button
              onClick={closeDeleteModal}
              className="modal-btn modal--cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Users;
