import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { verifyOtp } from "../../api/transactionApi";

import {
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const OtpVerification = () => {
  const { transactionId } =
    useParams();

  const navigate =
    useNavigate();

  const [otp, setOtp] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submitOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response =
        await verifyOtp(
          transactionId,
          otp
        );

      setMessage(
        response.message
      );

      setTimeout(() => {
        navigate(
          "/user/history"
        );
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">

      {/* Verification Card */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-3xl
          shadow-sm
          p-8
        "
      >
        {/* Header */}

        <div className="text-center mb-8">

          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-3xl
              bg-indigo-100
              flex
              items-center
              justify-center
              mb-5
            "
          >
            <Shield
              size={40}
              className="text-indigo-600"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            OTP Verification
          </h1>

          <p className="text-slate-500 mt-3">
            FraudShield detected a
            high-risk transaction.
            Verify your identity to
            continue.
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

        {/* Form */}

        <form
          onSubmit={submitOtp}
          className="space-y-6"
        >
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              One-Time Password
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
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                  )
                }
                placeholder="Enter OTP"
                required
                maxLength={6}
                className="
                  w-full
                  pl-11
                  pr-4
                  py-4
                  text-center
                  tracking-[0.5em]
                  text-xl
                  font-bold
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

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              py-4
              rounded-2xl
              font-semibold
              transition-all
              disabled:opacity-70
            "
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

      </div>

      {/* Security Notice */}

      <div
        className="
          mt-6
          bg-indigo-50
          border
          border-indigo-100
          rounded-3xl
          p-5
        "
      >
        <h3 className="font-semibold text-indigo-800 mb-2">
          Security Check
        </h3>

        <p className="text-sm text-indigo-700">
          This transaction was flagged
          by FraudShield's risk engine.
          OTP verification ensures that
          the request is being made by
          the legitimate account owner.
        </p>
      </div>

    </div>
  );
};

export default OtpVerification;