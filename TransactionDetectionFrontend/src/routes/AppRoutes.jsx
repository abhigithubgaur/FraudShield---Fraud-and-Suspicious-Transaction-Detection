import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";

import UserDashboard from "../pages/user/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

import CreateTransaction from "../pages/user/CreateTransaction";
import OtpVerification from "../pages/user/OtpVerification";
import TransactionHistory from "../pages/user/TransactionHistory";
import FreezeAccount from "../pages/user/FreezeAccount";

import Alerts from "../pages/admin/Alerts";
import RiskProfiles from "../pages/admin/RiskProfiles";
import FraudRules from "../pages/admin/FraudRules";
import Reports from "../pages/admin/Reports";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      <Route
        path="/user"
        element={
          <UserRoute>
            <UserLayout />
          </UserRoute>
        }
      >
        <Route
          path="dashboard"
          element={<UserDashboard />}
        />
                <Route
  path="transaction/create"
  element={<CreateTransaction />}
/>

<Route
  path="otp/:transactionId"
  element={<OtpVerification />}
/>

<Route
  path="history"
  element={<TransactionHistory />}
/>
<Route
  path="freeze"
  element={<FreezeAccount />}
/>
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />
        <Route
  path="alerts"
  element={<Alerts />}
/>

<Route
  path="risk-profiles"
  element={<RiskProfiles />}
/>
<Route
  path="rules"
  element={<FraudRules />}
/>

<Route
  path="reports"
  element={<Reports />}
/>
      </Route>

    </Routes>
  );
};

export default AppRoutes;