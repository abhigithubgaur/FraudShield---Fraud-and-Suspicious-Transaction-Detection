import { useState } from "react";
import { freezeAccount } from "../../api/userApi";

import {
  ShieldAlert,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const FreezeAccount = () => {
  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleFreeze = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to freeze your account?"
      );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

      const response =
        await freezeAccount();

      setMessage(
        response.message ||
          "Account frozen successfully"
      );
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Failed to freeze account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}

      <div className="flex items-center gap-4">
        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-red-100
            flex
            items-center
            justify-center
          "
        >
          <ShieldAlert
            size={30}
            className="text-red-600"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Freeze Account
          </h1>

          <p className="text-slate-500 mt-1">
            Instantly lock your account
            to stop unauthorized activity.
          </p>
        </div>
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
          "
        >
          <XCircle size={18} />
          {error}
        </div>
      )}

      {/* Main Card */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-3xl
          p-8
          shadow-sm
        "
      >
        <div className="flex items-start gap-4">

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-red-100
              flex
              items-center
              justify-center
            "
          >
            <Lock
              size={24}
              className="text-red-600"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Emergency Account Lock
            </h2>

            <p className="text-slate-600 mt-2">
              If you believe your account
              has been compromised or you
              notice suspicious activity,
              freezing your account will
              immediately block all new
              transactions.
            </p>
          </div>

        </div>

        {/* Warning List */}

        <div
          className="
            mt-8
            bg-red-50
            border
            border-red-100
            rounded-2xl
            p-6
          "
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle
              size={20}
              className="text-red-600"
            />

            <h3 className="font-semibold text-red-700">
              Before You Continue
            </h3>
          </div>

          <ul className="space-y-3 text-red-700">
            <li>
              • All new transactions will
              be blocked.
            </li>

            <li>
              • Fraud monitoring remains
              active.
            </li>

            <li>
              • You may need administrator
              assistance to reactivate
              your account.
            </li>

            <li>
              • Existing transaction
              records remain available.
            </li>
          </ul>
        </div>

        {/* Action Button */}

        <button
          onClick={handleFreeze}
          disabled={loading}
          className="
            mt-8
            w-full
            bg-red-600
            hover:bg-red-700
            text-white
            py-4
            rounded-2xl
            font-semibold
            transition-all
            disabled:opacity-70
          "
        >
          {loading
            ? "Freezing Account..."
            : "Freeze My Account"}
        </button>

      </div>

      {/* Security Note */}

      <div
        className="
          bg-indigo-50
          border
          border-indigo-100
          rounded-3xl
          p-6
        "
      >
        <h3 className="font-semibold text-indigo-800 mb-2">
          FraudShield Protection
        </h3>

        <p className="text-indigo-700">
          Freezing your account is the
          fastest way to prevent
          unauthorized transactions.
          Our fraud monitoring system
          will continue analyzing any
          suspicious activity linked to
          your account.
        </p>
      </div>

    </div>
  );
};

export default FreezeAccount;