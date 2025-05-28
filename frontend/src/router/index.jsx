import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Schedules from "../pages/Schedule.jsx"
import PrivateRoute from "../components/PrivateRoute";

export default function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <PrivateRoute>
              <Schedules/>
            </PrivateRoute>
          }
        />
      </Routes>
   
  );
}
