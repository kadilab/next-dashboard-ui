
"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import i18n from "../i18n/i18n";
import { I18nextProvider } from "react-i18next";





export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");1
    if (!user) {
      router.push("/sign-in");
    }
  }, [router]);

  return (
    <html lang="en">
      <body>
          <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </body>
    </html>
  );
}

