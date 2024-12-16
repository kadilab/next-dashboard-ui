"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa"; // Icône de la Terre

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false); // État pour le menu de langue
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
    setLangMenuOpen(false); // Fermer le menu après sélection
  };

  const handleLogout = () => {
    router.push("/logout"); // Redirect to login page
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleLangMenu = () => {
    setLangMenuOpen(!langMenuOpen);
  };

  return (
    <div className="flex items-center rounded-s-2xl ms-[14.6%] pe-[17%] fixed top-0 left-0 w-full z-50 shadow-black justify-between p-4 bg-[#06113c]">
      {/* Branding or Search */}
      <div className="text-2xl hidden lg:block font-bold text-white">Quick Management</div>

      {/* User Profile Section */}
      <div className="relative flex items-center justify-end gap-4">
        {/* Language Selection */}
        <div className="relative">
          <button
            onClick={toggleLangMenu}
            className="flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md"
          >
            <FaGlobe className="text-[#0a2033] text-xl" />
          </button>
          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <ul className="text-gray-700">
                <li
                  onClick={() => changeLanguage("en")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  English
                </li>
                <li
                  onClick={() => changeLanguage("fr")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Français
                </li>
                <li
                  onClick={() => changeLanguage("es")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Español
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User Name and Role */}
        {user && (
          <div className="flex flex-col text-right">
            <span className="text-sm leading-3 text-white font-medium">
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
          width={24}
          height={24}
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
                {t("logout")}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
