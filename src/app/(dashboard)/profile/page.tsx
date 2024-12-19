"use client";

import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null); // Stocke les informations utilisateur
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Récupérer les données utilisateur depuis localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFirstname(storedUser.firstname);
      setLastname(storedUser.lastname);
      setEmail(storedUser.email);
      setProfileImage(storedUser.profile_image || "/avatar.png");
    }
  }, []);

  // Gérer le changement d'image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
      if (!validExtensions.includes(file.type)) {
        setError("Please select a valid image file (jpeg, png, jpg)");
        return;
      }

      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(`Failed to upload image: ${errorMsg}`);
        }

        const { fileName } = await response.json();
        setProfileImage(`/uploads/${fileName}`); // Mettre à jour l'aperçu avec le chemin de l'image
        setError(null); // Réinitialiser les erreurs en cas de succès
      } catch (err) {
        console.error(err);
        setError("Failed to upload image");
      }
    }
  };

  // Gérer la mise à jour du profil
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost/api/api.php/records/users/${user.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            password: password || user.password_hash, // Ne met à jour le mot de passe que s'il a été modifié
            profile_image: profileImage, // Enregistre uniquement le chemin de l'image
          }),
        }
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to update profile: ${errorMsg}`);
      }

      const updatedUser = {
        ...user,
        firstname,
        lastname,
        email,
        profile_image: profileImage,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser)); // Mettre à jour localStorage
      setUser(updatedUser);
      setSuccess("Profile updated successfully.");
      setError(null); // Réinitialiser les erreurs
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          My Profile
        </h2>

        {/* Messages de succès/erreur */}
        {success && (
          <p className="text-green-500 text-sm text-center mb-4">{success}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Image de profil */}
          <div className="flex flex-col items-center">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <label
              htmlFor="profileImage"
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
            >
              Change Profile Picture
            </label>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Prénom */}
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Nom */}
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 focus:outline-none"
              }`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
