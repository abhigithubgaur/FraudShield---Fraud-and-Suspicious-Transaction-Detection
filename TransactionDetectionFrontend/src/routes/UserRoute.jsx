import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CreateTransaction from "../pages/user/CreateTransaction";
import OtpVerification from "../pages/user/OtpVerification";
import TransactionHistory from "../pages/user/TransactionHistory";

const UserRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  if (auth.role !== "ROLE_USER") {
    return <Navigate to="/login" />;
  }


  return children;
};

export default UserRoute;