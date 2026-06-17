import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import {
  Mail,
  Lock,
  Shield,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await loginUser(formData);

      login(response);

      if (
        response.role ===
        "ROLE_ADMIN"
      ) {
        navigate(
          "/admin/dashboard"
        );
      } else {
        navigate(
          "/user/dashboard"
        );
      }
    } catch (err) {
      setError(
        err.response?.data ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-2xl
        border
        border-slate-200
        p-8
      "
    >
      {/* Header */}

      <div className="text-center mb-8">

        <div
          className="
            w-16
            h-16
            mx-auto
            rounded-2xl
            bg-indigo-100
            flex
            items-center
            justify-center
            mb-4
          "
        >
          <Shield
            size={30}
            className="text-indigo-600"
          />
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome Back
        </h2>

        <p className="text-slate-500 mt-2">
          Sign in to continue to
          FraudShield
        </p>

      </div>

      {/* Error */}

      {error && (
        <div
          className="
            flex
            items-center
            gap-3
            bg-red-50
            border
            border-red-200
            text-red-700
            p-4
            rounded-2xl
            mb-5
          "
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Email */}

        <div>

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                w-full
                pl-11
                pr-4
                py-3
                border
                border-slate-300
                rounded-2xl
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="
                w-full
                pl-11
                pr-4
                py-3
                border
                border-slate-300
                rounded-2xl
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />

          </div>

        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            py-3
            rounded-2xl
            font-semibold
            transition-all
            disabled:opacity-70
          "
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>

      </form>

      {/* Footer */}

      <div className="mt-8 text-center">

        <p className="text-slate-600">
          Don't have an account?
        </p>

        <Link
          to="/register"
          className="
            inline-block
            mt-2
            text-indigo-600
            font-semibold
            hover:text-indigo-700
          "
        >
          Create Account
        </Link>

      </div>

    </div>
  );
};

export default Login;