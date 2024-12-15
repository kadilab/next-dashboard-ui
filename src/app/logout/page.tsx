"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loading from "@/components/Loading";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem("user");

    // Redirect to login page
    router.push("/sign-in");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Loading/>
    </div>
  );
};

export default Logout;
