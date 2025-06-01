import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Schedules from "../pages/Schedule";
import Hw from "../pages/Hw.jsx";
import Habit from "../pages/Habit.jsx";
import Doubt from "../pages/Doubt";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

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
            <Schedules />
          </PrivateRoute>
        }
      />
      <Route
        path="/hw"
        element={
          <PrivateRoute>
            <Hw />
          </PrivateRoute>
        }
      />
      <Route
        path="/doubt"
        element={
          <PrivateRoute>
            <Doubt />
          </PrivateRoute>
        }
      />
      <Route
        path="/habit"
        element={
          <PrivateRoute>
            <Habit />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
