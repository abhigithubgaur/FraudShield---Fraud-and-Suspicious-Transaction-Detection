import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";

import {
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await registerUser(formData);

      setMessage(response);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data ||
          "Registration failed"
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
          Create Account
        </h2>

        <p className="text-slate-500 mt-2">
          Join the FraudShield platform
        </p>
      </div>

      {/* Success */}

      {message && (
        <div
          className="
            flex
            items-center
            gap-3
            bg-green-50
            border
            border-green-200
            text-green-700
            p-4
            rounded-2xl
            mb-5
          "
        >
          <CheckCircle size={18} />
          {message}
        </div>
      )}

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

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Name */}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>

          <div className="relative">
            <User
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
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
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
              placeholder="Create a password"
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

        {/* Role */}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Account Type
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="
              w-full
              border
              border-slate-300
              rounded-2xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          >
            <option value="ROLE_USER">
              User
            </option>

            <option value="ROLE_ADMIN">
              Admin
            </option>
          </select>
        </div>

        {/* Button */}

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
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-600">
          Already have an account?
        </p>

        <Link
          to="/login"
          className="
            inline-block
            mt-2
            text-indigo-600
            font-semibold
            hover:text-indigo-700
          "
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;