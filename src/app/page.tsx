"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const Homepage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
     
    </div>
  );
};

export default Homepage;
