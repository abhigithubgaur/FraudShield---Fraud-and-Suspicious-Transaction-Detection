import {
  Outlet,
  NavLink,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  TriangleAlert,
  Shield,
  Settings,
  FileBarChart,
  LogOut,
} from "lucide-react";

const AdminLayout = () => {
  const { logout, auth } =
    useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Alerts",
      path: "/admin/alerts",
      icon: TriangleAlert,
    },
    {
      name: "Risk Profiles",
      path: "/admin/risk-profiles",
      icon: Shield,
    },
    {
      name: "Rules",
      path: "/admin/rules",
      icon: Settings,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: FileBarChart,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Top Navbar */}

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
            <h1 className="text-2xl font-bold text-red-600">
              FraudShield Admin
            </h1>

            <p className="text-xs text-slate-500">
              Fraud Monitoring Center
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
                        ? "bg-red-100 text-red-700"
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

            <div className="text-right">
              <p className="font-semibold text-sm">
                {auth?.name || "Admin"}
              </p>

              <p className="text-xs text-slate-500">
                Administrator
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

export default AdminLayout;