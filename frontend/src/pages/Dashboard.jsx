import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-xl font-bold">
          Welcome, {currentUser?.email || "User"}!
        </h1>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>
    </>
  );
}
