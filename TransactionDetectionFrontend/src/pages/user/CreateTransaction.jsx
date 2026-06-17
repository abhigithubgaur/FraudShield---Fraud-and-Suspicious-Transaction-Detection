import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { initiateTransaction } from "../../api/transactionApi";
import { getAllUsers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

import {
  Send,
  User,
  IndianRupee,
  MapPin,
  Globe,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const CreateTransaction = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [formData, setFormData] = useState({
    receiverId: "",
    amount: "",
    location: "",
    ipAddress: "",
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    loadUsers();
    detectIp();
    detectLocation();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();

      const filteredUsers =
        data.filter(
          (user) =>
            user.id !== auth.userId
        );

      setUsers(filteredUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const detectIp = async () => {
    try {
      const response = await fetch(
        "https://api.ipify.org?format=json"
      );

      const data =
        await response.json();

      setFormData((prev) => ({
        ...prev,
        ipAddress: data.ip,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: `${position.coords.latitude},${position.coords.longitude}`,
        }));
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const payload = {
        senderId: Number(auth.userId),
        receiverId: Number(
          formData.receiverId
        ),
        amount: Number(
          formData.amount
        ),
        location:
          formData.location,
        ipAddress:
          formData.ipAddress,
      };

      const response =
        await initiateTransaction(
          payload
        );

      if (
        response.status ===
        "FLAGGED"
      ) {
        navigate(
          `/user/otp/${response.transactionId}`
        );
        return;
      }

      if (
        response.status ===
        "REJECTED"
      ) {
        setError(
          response.message
        );
        return;
      }

      setMessage(
        response.message
      );

      setFormData({
        ...formData,
        receiverId: "",
        amount: "",
      });
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Transaction failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-900">
          New Transaction
        </h1>

        <p className="text-slate-500 mt-2">
          Transfer money securely
          using FraudShield
          protection.
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

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Form */}

        <div
          className="
            lg:col-span-2
            bg-white
            border
            rounded-3xl
            p-8
          "
        >
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-6"
          >

            {/* Receiver */}

            <div>

              <label className="block font-medium mb-2">
                Receiver
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

                <select
                  name="receiverId"
                  value={
                    formData.receiverId
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
                    border
                    rounded-2xl
                  "
                >
                  <option value="">
                    Select Receiver
                  </option>

                  {users.map(
                    (user) => (
                      <option
                        key={
                          user.id
                        }
                        value={
                          user.id
                        }
                      >
                        {user.name} (
                        {user.email}
                        )
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

            {/* Amount */}

            <div>

              <label className="block font-medium mb-2">
                Amount
              </label>

              <div className="relative">

                <IndianRupee
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
                  type="number"
                  step="0.01"
                  name="amount"
                  value={
                    formData.amount
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter amount"
                  required
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
                    border
                    rounded-2xl
                  "
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                py-3
                rounded-2xl
                font-semibold
                transition
              "
            >
              <Send size={18} />

              {submitting
                ? "Processing..."
                : "Submit Transaction"}
            </button>

          </form>
        </div>

        {/* Security Info */}

        <div
          className="
            bg-white
            border
            rounded-3xl
            p-6
          "
        >
          <h3 className="text-xl font-bold mb-5">
            Security Details
          </h3>

          <div className="space-y-5">

            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <MapPin size={16} />
                Location
              </div>

              <p className="text-sm break-all">
                {formData.location ||
                  "Detecting..."}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Globe size={16} />
                IP Address
              </div>

              <p className="text-sm">
                {formData.ipAddress ||
                  "Detecting..."}
              </p>
            </div>

            <div
              className="
                bg-indigo-50
                border
                border-indigo-100
                rounded-2xl
                p-4
                mt-6
              "
            >
              <p className="text-sm text-indigo-700">
                All transactions are
                monitored in real-time
                by FraudShield AI.
                Suspicious activity
                may require OTP
                verification.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default CreateTransaction;