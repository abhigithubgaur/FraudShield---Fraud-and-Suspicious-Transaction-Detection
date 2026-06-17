import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  if (auth.role !== "ROLE_ADMIN") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;