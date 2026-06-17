import { useEffect, useState } from "react";
import {
  getAlerts,
  resolveTransaction,
} from "../../api/adminApi";

import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (
    transactionId,
    action
  ) => {
    try {
      await resolveTransaction(
        transactionId,
        action
      );

      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const severityColor = (severity) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "FLAGGED":
        return "bg-orange-100 text-orange-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-100 p-3 rounded-2xl">
          <ShieldAlert
            size={28}
            className="text-red-600"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Fraud Alerts
          </h1>

          <p className="text-slate-500">
            Review suspicious transactions and
            take action.
          </p>
        </div>
      </div>

      {/* Table Card */}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 border-b">

              <tr className="text-left">

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Alert
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Transaction
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Amount
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Fraud Score
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Severity
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Reason
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="
                    border-b
                    hover:bg-slate-50
                    transition
                  "
                >
                  <td className="px-6 py-5 font-medium">
                    #{alert.id}
                  </td>

                  <td className="px-6 py-5">
                    {alert.transaction?.id}
                  </td>

                  <td className="px-6 py-5 font-semibold">
                    ₹
                    {Number(
                      alert.transaction?.amount
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5">
                    <span className="font-semibold">
                      {
                        alert.transaction
                          ?.fraudScore
                      }
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${severityColor(
                          alert.severity
                        )}
                      `}
                    >
                      {alert.severity}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${statusColor(
                          alert.transaction
                            ?.status
                        )}
                      `}
                    >
                      {
                        alert.transaction
                          ?.status
                      }
                    </span>
                  </td>

                  <td className="px-6 py-5 max-w-xs">
                    <p className="text-sm text-slate-600">
                      {alert.reason}
                    </p>
                  </td>

                  <td className="px-6 py-5">

                    {alert.transaction
                      ?.status ===
                      "FLAGGED" ? (
                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleAction(
                              alert.transaction.id,
                              "APPROVE"
                            )
                          }
                          className="
                            flex
                            items-center
                            gap-2
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            px-4
                            py-2
                            rounded-xl
                            text-sm
                            transition
                          "
                        >
                          <CheckCircle
                            size={16}
                          />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleAction(
                              alert.transaction.id,
                              "REJECT"
                            )
                          }
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
                            text-sm
                            transition
                          "
                        >
                          <XCircle
                            size={16}
                          />
                          Reject
                        </button>

                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <AlertTriangle
                          size={16}
                        />
                        Closed
                      </div>
                    )}

                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default Alerts;