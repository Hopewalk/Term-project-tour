import React, { useEffect, useState } from "react";
import ax from "../conf/ax"; // Import Axios instance

function EditProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ first_name: "", last_name: "" });

  useEffect(() => {
    // Fetch user details from Strapi
    ax.get("/users/me")
      .then((response) => {
        console.log("User data:", response.data); // Debugging
        setUser(response.data);
        setUpdatedUser({ first_name: response.data.first_name, last_name: response.data.last_name });
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    ax.put(`/users/${user.id}`, updatedUser)
      .then((response) => {
        setUser(response.data);
        setEditMode(false);
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>

        {editMode ? (
          <>
            <label className="block mt-2">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={updatedUser.first_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            
            <label className="block mt-2">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={updatedUser.last_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p><strong>First Name:</strong> {user.first_name}</p>
            <p><strong>Last Name:</strong> {user.last_name}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
