import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../context/AuthContext";

import {
  getTransactionHistory,
} from "../../api/transactionApi";

import {
  History,
  IndianRupee,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const TransactionHistory = () => {
  const { auth } = useAuth();

  const [transactions, setTransactions] =
    useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data =
        await getTransactionHistory(
          auth.userId
        );

      if (Array.isArray(data)) {
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (
    status
  ) => {
    switch (status) {
      case "APPROVED":
        return (
          <span
            className="
              bg-green-100
              text-green-700
              px-3
              py-1
              rounded-full
              text-sm
              font-medium
            "
          >
            Approved
          </span>
        );

      case "REJECTED":
        return (
          <span
            className="
              bg-red-100
              text-red-700
              px-3
              py-1
              rounded-full
              text-sm
              font-medium
            "
          >
            Rejected
          </span>
        );

      case "FLAGGED":
        return (
          <span
            className="
              bg-yellow-100
              text-yellow-700
              px-3
              py-1
              rounded-full
              text-sm
              font-medium
            "
          >
            Flagged
          </span>
        );

      default:
        return (
          <span
            className="
              bg-slate-100
              text-slate-700
              px-3
              py-1
              rounded-full
              text-sm
            "
          >
            {status}
          </span>
        );
    }
  };

  const getFraudColor = (
    score
  ) => {
    if (score >= 80)
      return "text-red-600";

    if (score >= 50)
      return "text-yellow-600";

    return "text-green-600";
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="bg-indigo-100 p-4 rounded-2xl">
          <History
            size={30}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Transaction History
          </h1>

          <p className="text-slate-500 mt-1">
            Review all your recent
            transfers and fraud checks.
          </p>
        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-3xl p-6">
          <p className="text-slate-500">
            Total Transactions
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {transactions.length}
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <p className="text-slate-500">
            Approved
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              transactions.filter(
                (tx) =>
                  tx.status ===
                  "APPROVED"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <p className="text-slate-500">
            Flagged
          </p>

          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {
              transactions.filter(
                (tx) =>
                  tx.status ===
                  "FLAGGED"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* Transaction Table */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-3xl
          overflow-hidden
          shadow-sm
        "
      >

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">
            Transactions
          </h2>
        </div>

        {transactions.length ===
        0 ? (
          <div className="p-10 text-center text-slate-500">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>

                  <th className="text-left p-4">
                    ID
                  </th>

                  <th className="text-left p-4">
                    Receiver
                  </th>

                  <th className="text-left p-4">
                    Amount
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-left p-4">
                    Fraud Score
                  </th>

                </tr>
              </thead>

              <tbody>

                {transactions.map(
                  (tx) => (
                    <tr
                      key={tx.id}
                      className="
                        border-t
                        hover:bg-slate-50
                      "
                    >
                      <td className="p-4 font-medium">
                        #{tx.id}
                      </td>

                      <td className="p-4">
                        {tx.receiverId}
                      </td>

                      <td className="p-4 font-semibold">
                        ₹{tx.amount}
                      </td>

                      <td className="p-4">
                        {getStatusBadge(
                          tx.status
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`
                            font-bold
                            ${getFraudColor(
                              tx.fraudScore
                            )}
                          `}
                        >
                          {
                            tx.fraudScore
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Security Info */}

      <div
        className="
          bg-indigo-50
          border
          border-indigo-100
          rounded-3xl
          p-6
        "
      >
        <div className="flex items-start gap-3">

          <Shield className="text-indigo-600 mt-1" />

          <div>

            <h3 className="font-semibold text-indigo-800">
              Fraud Monitoring
            </h3>

            <p className="text-indigo-700 mt-1">
              Every transaction is
              analyzed by FraudShield's
              risk engine. High-risk
              transfers may require
              additional verification.
            </p>

          </div>

        </div>
      </div>

    </div>
  );
};

export default TransactionHistory;