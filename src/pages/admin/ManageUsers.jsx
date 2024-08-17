import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { deleteUserApi, getAllUsers } from "../../apis/api";

const POLLING_INTERVAL = 5000; // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    getAllUsers()
      .then((res) => {
        if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          toast.error("Failed to fetch users.");
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch users.");
      });
  };

  useEffect(() => {
    fetchUsers(); // Fetch users initially

    const intervalId = setInterval(fetchUsers, POLLING_INTERVAL); // Set up polling

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    deleteUserApi(id)
      .then((res) => {
        if (!res.success) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          fetchUsers(); // Refresh user list after deletion
        }
      })
      .catch((error) => {
        toast.error("Failed to delete user.");
      });
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between">
        <h1>View Users</h1>
      </div>
      <table className="table mt-4">
        <thead className="table-success">
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Failed Login Attempts</th>
            <th>Email Verified</th>
            <th>Password Last Changed</th>
            <th>Account Locked Until</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.failedLoginAttempts}</td>
                <td>{user.emailVerified ? "Yes" : "No"}</td>
                <td>{new Date(user.passwordLastChanged).toLocaleString()}</td>
                <td>{user.accountLockedUntil ? new Date(user.accountLockedUntil).toLocaleString() : "N/A"}</td>
                <td>
                  <div className="btn-group" role="group">
                    <Link
                      to={`/edit-user/${user._id}`}
                      className="btn btn-success"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUsers;
