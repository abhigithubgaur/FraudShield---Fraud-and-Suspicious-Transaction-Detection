import {
  Outlet,
  NavLink,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import useAlerts from "../hooks/useAlerts";
import NotificationBell from "../components/notifications/NotificationBell";

import {
  LayoutDashboard,
  CreditCard,
  History,
  ShieldAlert,
  LogOut,
} from "lucide-react";

const UserLayout = () => {
  const { auth, logout } =
    useAuth();

  useAlerts(auth?.userId);

  const navItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Transfer",
      path: "/user/transaction/create",
      icon: CreditCard,
    },
    {
      name: "History",
      path: "/user/history",
      icon: History,
    },
    {
      name: "Security",
      path: "/user/freeze",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}

      <header
        className="
          sticky
          top-0
          z-50
          bg-white
          border-b
          border-slate-200
          shadow-sm
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-8
            h-20
            flex
            items-center
            justify-between
          "
        >
          {/* Logo */}

          <div>
            <h1 className="text-2xl font-bold text-indigo-600">
              FraudShield
            </h1>

            <p className="text-xs text-slate-500">
              Secure Banking
            </p>
          </div>

          {/* Navigation */}

          <nav className="flex items-center gap-2">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    font-medium
                    transition

                    ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }
                  `
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}

          </nav>

          {/* Right Side */}

          <div className="flex items-center gap-4">

            <NotificationBell />

            <div className="text-right">
              <p className="font-semibold text-sm">
                {auth?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">
                {auth?.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="
                flex
                items-center
                gap-2
                bg-red-600
                hover:bg-red-700
                text-white
                px-4
                py-2
                rounded-xl
              "
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Content */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-8
          py-8
        "
      >
        <Outlet />
      </main>

    </div>
  );
};

export default UserLayout;