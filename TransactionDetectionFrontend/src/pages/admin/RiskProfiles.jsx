import { useEffect, useState } from "react";
import {
  getRiskProfiles,
  updateUserStatus,
} from "../../api/adminApi";

import {
  Users,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";

const RiskProfiles = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getRiskProfiles();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const changeStatus = async (
    id,
    status
  ) => {
    try {
      await updateUserStatus(
        id,
        status
      );

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80)
      return "bg-red-100 text-red-700";

    if (score >= 50)
      return "bg-yellow-100 text-yellow-700";

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-purple-100 p-3 rounded-2xl">
          <Shield
            size={28}
            className="text-purple-600"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            User Risk Profiles
          </h1>

          <p className="text-slate-500">
            Monitor risky users and
            manage account status.
          </p>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border rounded-3xl p-6">
          <p className="text-slate-500">
            Total Users
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {users.length}
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <p className="text-slate-500">
            Frozen Accounts
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {
              users.filter(
                (u) =>
                  u.accountStatus ===
                  "FROZEN"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <p className="text-slate-500">
            Active Accounts
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              users.filter(
                (u) =>
                  u.accountStatus ===
                  "ACTIVE"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 border-b">
              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  User
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Risk Score
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr
                  key={user.id}
                  className="
                    border-b
                    hover:bg-slate-50
                    transition
                  "
                >
                  {/* User */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">

                      <div className="bg-slate-100 p-3 rounded-full">
                        <Users
                          size={18}
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Email */}

                  <td className="px-6 py-5 text-slate-600">
                    {user.email}
                  </td>

                  {/* Risk Score */}

                  <td className="px-6 py-5">
                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-semibold
                        ${getRiskColor(
                          user.riskScore
                        )}
                      `}
                    >
                      {user.riskScore}
                    </span>
                  </td>

                  {/* Status */}

                  <td className="px-6 py-5">
                    <span
                      className={
                        user.accountStatus ===
                        "FROZEN"
                          ? `
                            bg-red-100
                            text-red-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-semibold
                          `
                          : `
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-semibold
                          `
                      }
                    >
                      {user.accountStatus}
                    </span>
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-5">
                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          changeStatus(
                            user.id,
                            "ACTIVE"
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
                        <UserCheck
                          size={16}
                        />
                        Activate
                      </button>

                      <button
                        onClick={() =>
                          changeStatus(
                            user.id,
                            "FROZEN"
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
                        <UserX
                          size={16}
                        />
                        Freeze
                      </button>

                    </div>
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

export default RiskProfiles;