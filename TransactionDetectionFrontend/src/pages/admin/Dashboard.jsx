import { useEffect, useState } from "react";
import { getMetrics } from "../../api/adminApi";
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  IndianRupee,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!metrics) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Transactions",
      value: metrics.totalTransactions,
      icon: Activity,
      color: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Flagged Transactions",
      value: metrics.flaggedTransactionsCount,
      icon: AlertTriangle,
      color: "bg-yellow-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      title: "Active Alerts",
      value: metrics.activeAlertsCount,
      icon: ShieldAlert,
      color: "bg-red-500",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Total Volume",
      value: `₹${Number(
        metrics.totalVolumeProcessed
      ).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "High Risk Users",
      value: metrics.highRiskUsersCount,
      icon: Users,
      color: "bg-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Monitor fraud activity, transaction volume,
          alerts and risk levels in real-time.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                rounded-3xl
                p-6
                border
                border-slate-200
                hover:shadow-xl
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold text-slate-900 mt-3">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`${card.bg} p-4 rounded-2xl`}
                >
                  <Icon
                    size={28}
                    className={card.text}
                  />
                </div>
              </div>

              <div className="mt-5">
                <div
                  className={`h-1.5 rounded-full ${card.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Quick Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-5">
            System Overview
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Total Transactions
              </span>

              <span className="font-semibold">
                {metrics.totalTransactions}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Flagged Transactions
              </span>

              <span className="font-semibold text-yellow-600">
                {metrics.flaggedTransactionsCount}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Active Alerts
              </span>

              <span className="font-semibold text-red-600">
                {metrics.activeAlertsCount}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                High Risk Users
              </span>

              <span className="font-semibold text-purple-600">
                {metrics.highRiskUsersCount}
              </span>
            </div>
          </div>
        </div>

        {/* Alert Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-5">
            Risk Summary
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span>Flagged Transactions</span>
                <span>
                  {metrics.flaggedTransactionsCount}
                </span>
              </div>

              <div className="h-3 bg-slate-200 rounded-full">
                <div className="h-3 bg-yellow-500 rounded-full w-3/4"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Active Alerts</span>
                <span>
                  {metrics.activeAlertsCount}
                </span>
              </div>

              <div className="h-3 bg-slate-200 rounded-full">
                <div className="h-3 bg-red-500 rounded-full w-2/3"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>High Risk Users</span>
                <span>
                  {metrics.highRiskUsersCount}
                </span>
              </div>

              <div className="h-3 bg-slate-200 rounded-full">
                <div className="h-3 bg-purple-500 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;