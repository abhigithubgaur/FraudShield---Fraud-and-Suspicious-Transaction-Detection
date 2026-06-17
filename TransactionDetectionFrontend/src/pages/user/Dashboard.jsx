import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  CreditCard,
  History,
  ShieldAlert,
  User,
  Mail,
  Shield,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const { auth } = useAuth();

  const cards = [
    {
      title: "New Transaction",
      description:
        "Transfer money securely",
      link: "/user/transaction/create",
      icon: CreditCard,
      color: "bg-blue-600",
    },
    {
      title: "Transaction History",
      description:
        "View all previous transactions",
      link: "/user/history",
      icon: History,
      color: "bg-green-600",
    },
    {
      title: "Freeze Account",
      description:
        "Protect your account instantly",
      link: "/user/freeze",
      icon: ShieldAlert,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          p-8
          shadow-sm
        "
      >
        <div className="flex items-center gap-5">
          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-indigo-100
              flex
              items-center
              justify-center
            "
          >
            <User
              size={30}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>

            <p className="text-slate-500 mt-1">
              Manage your account and
              transactions securely.
            </p>
          </div>
        </div>

        {/* User Info */}

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div className="bg-slate-50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Mail
                size={18}
                className="text-slate-500"
              />
              <span className="text-sm text-slate-500">
                Email Address
              </span>
            </div>

            <p className="font-semibold">
              {auth?.email}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Shield
                size={18}
                className="text-slate-500"
              />
              <span className="text-sm text-slate-500">
                Account Role
              </span>
            </div>

            <p className="font-semibold">
              {auth?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Security Banner */}

      <div
        className="
          bg-linear-to-r
          from-indigo-600
          to-purple-700
          rounded-3xl
          p-8
          text-white
        "
      >
        <h2 className="text-2xl font-bold">
          Your Account is Protected
        </h2>

        <p className="mt-2 text-indigo-100">
          FraudShield continuously monitors
          suspicious activity and protects
          your transactions in real time.
        </p>
      </div>

      {/* Quick Actions */}

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-5">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Link
                key={index}
                to={card.link}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-3xl
                  p-6
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                "
              >
                <div
                  className={`
                    ${card.color}
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    text-white
                    mb-5
                  `}
                >
                  <Icon size={26} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {card.title}
                </h3>

                <p className="text-slate-500 mt-2">
                  {card.description}
                </p>

                <div className="mt-5 flex items-center text-indigo-600 font-medium">
                  Open
                  <ArrowRight
                    size={18}
                    className="ml-2"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;