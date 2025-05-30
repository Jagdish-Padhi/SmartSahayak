import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PrivateRoutes({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return children;
}
