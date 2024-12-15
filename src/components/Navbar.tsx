"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // Simulate fetching user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse user info from localStorage
    }
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Dynamically change the language
  };

  const handleLogout = () => {
   
    router.push("/logout"); // Redirect to login page
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#0a2033]">
      {/* Branding or Search */}
      <div className="text-2xl font-bold text-white">Quick Admin</div>

      {/* User Profile Section */}
      <div className="relative flex items-center gap-4">
        {/* User Name and Role */}
        {user && (
          <div className="flex flex-col text-right">
            <span className="text-xl leading-3 text-white font-medium">
              {user.firstname} {user.lastname}
            </span>
            <span className="text-[15px] text-orange-200">
              {user.user_role || "Unknown Role"}
            </span>
          </div>
        )}

        {/* Profile Picture */}
        <Image
          src="/avatar.png"
          alt="Profile Picture"
          width={36}
          height={36}
          className="rounded-full cursor-pointer"
          onClick={toggleMenu}
        />

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-12 top-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <ul className="text-gray-700">
              <li
                onClick={() => router.push("/profile")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </li>
              <li
                onClick={() => router.push("/settings")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Settings
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
