import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modal, setModal] = useState({ show: false, message: "", type: "" });

  // Fetch users from Firestore
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or Update User
  const handleUser = async () => {
    if (!name || !email) {
      setModal({ show: true, message: "Please enter name and email!", type: "error" });
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // Edit User
        await updateDoc(doc(db, "users", editId), {
          name,
          email,
        });
        setModal({ show: true, message: "User updated successfully! ✅", type: "success" });
      } else {
        // Add User
        await addDoc(collection(db, "users"), {
          name,
          email,
          createdAt: new Date(),
        });
        setModal({ show: true, message: "User added successfully! ✅", type: "success" });
      }

      setName("");
      setEmail("");
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      setModal({ show: true, message: "Operation failed ❌", type: "error" });
    }
    setLoading(false);
  };

  // Delete User
  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setModal({ show: true, message: "User deleted successfully! ✅", type: "success" });
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      setModal({ show: true, message: "Error deleting user ❌", type: "error" });
    }
  };

  // Set user data for editing
  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-12 px-4">
      {/* App Title */}
      <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-6">
        Firebase CRUD App 🚀
      </h1>

      {/* Form Section */}
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
          {editId ? "Edit User ✏️" : "Add New User ➕"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 border border-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 border border-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUser}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-3 rounded-xl transition-all`}
          >
            {loading ? "Processing..." : editId ? "Update User ✏️" : "Add User ➕"}
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl text-white font-semibold mb-4 text-center">Users List 📝</h2>
        <div className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow-lg">
          {users.length > 0 ? (
            <table className="w-full text-white text-center">
              <thead>
                <tr className="border-b border-white">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 flex justify-center space-x-2">
                      <button
                        onClick={() => editUser(user)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        Edit ✏️
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        Delete 🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-white">No users found ❌</p>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {modal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`bg-white p-6 rounded-lg shadow-lg text-center ${modal.type === "success" ? "border-green-500" : "border-red-500"} border-2`}>
            <p className={`text-lg font-semibold ${modal.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {modal.message}
            </p>
            <button
              onClick={() => setModal({ show: false, message: "", type: "" })}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
