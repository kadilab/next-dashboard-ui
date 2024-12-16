"use client";

import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // User being edited
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    profile_image: "",
    user_role: "customer",
    account_approved: false,
    driver_active_status: false,
    busy: false,
    password_hash: "",
  });

  const API_URL = "http://localhost/api/api.php/records/users";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.records || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUser ? `${API_URL}/${editingUser.id_user}` : API_URL;
  
    try {
      let passwordHash = newUser.password_hash;
  
      // Si un nouveau mot de passe est fourni (ou lors de la création d'utilisateur)
      if (!editingUser || newUser.password_hash) {
        const saltRounds = 10; // Complexité du hachage
        passwordHash = bcrypt.hashSync(newUser.password_hash, saltRounds);
      }
  
      // Préparer les données utilisateur à envoyer
      const userData = {
        ...newUser,
        password_hash: passwordHash,
      };
  
      const response = await fetch(url, {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to ${editingUser ? "update" : "add"} user: ${message}`);
      }
  
      await fetchUsers(); // Recharger la liste des utilisateurs après ajout ou modification
      setShowModal(false);
      setEditingUser(null);
      setNewUser({
        firstname: "",
        lastname: "",
        mobile: "",
        email: "",
        profile_image: "",
        user_role: "customer",
        account_approved: false,
        driver_active_status: false,
        busy: false,
        password_hash: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to delete user: ${message}`);
      }

      await fetchUsers(); // Reload the list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({ ...user });
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="w-full mx-auto bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-6 bg-[#0a2033] text-white rounded-t-lg">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <button
            onClick={() => {
              setEditingUser(null);
              setNewUser({
                firstname: "",
                lastname: "",
                mobile: "",
                email: "",
                profile_image: "",
                user_role: "customer",
                account_approved: false,
                driver_active_status: false,
                busy: false,
                password_hash: "",
              });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add New User
          </button>
        </div>

        <div className="p-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-medium">
              <tr>
                <th className="px-6 py-3 text-left">First Name</th>
                <th className="px-6 py-3 text-left">Last Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Approved</th>
                <th className="px-6 py-3 text-left">Driver Active</th>
                <th className="px-6 py-3 text-left">Busy</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {users.map((user) => (
                <tr
                  key={user.id_user}
                  className={`${
                    user.id_user % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-3">{user.firstname}</td>
                  <td className="px-6 py-3">{user.lastname}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.user_role}</td>
                  <td className="px-6 py-3">{user.account_approved ? "Yes" : "No"}</td>
                  <td className="px-6 py-3">{user.driver_active_status ? "Yes" : "No"}</td>
                  <td className="px-6 py-3">{user.busy ? "Yes" : "No"}</td>
                  <td className="px-6 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id_user)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={newUser.firstname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={newUser.lastname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="user_role"
                  value={newUser.user_role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="account_approved"
                    checked={newUser.account_approved}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Approved
                </label>
                <label className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="driver_active_status"
                    checked={newUser.driver_active_status}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Driver Active
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="busy"
                    checked={newUser.busy}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Busy
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password_hash"
                  value={newUser.password_hash}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  required={!editingUser}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
