"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fetch all users from your API
      const response = await fetch("http://localhost/api/api.php/records/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();
      const users = data.records || [];

      // Find a user with matching email, password, and role
      const user = users.find(
        (u) => u.email === email && u.password_hash === password && u.user_role === "admin"
      );

      if (!user) {
        throw new Error("Invalid email, password, or insufficient permissions.");
      }
      // Save user information and redirect
      localStorage.setItem("user", JSON.stringify(user)); // Save user info locally
      router.push("/admin"); // Redirect to the admin dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="items-center justify-center w-full">
          <Image src={"/logo white.png"} className="mx-[34%] mb-3" width={120} height={100} alt="logo" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 mt-4 text-white bg-[#0a2033] rounded-md shadow hover:bg-[#152f47] focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          <a href="/register" className="text-blue-500 hover:underline"></a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
