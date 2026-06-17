import { useEffect, useState } from "react";
import {
  getRules,
  updateRules,
} from "../../api/adminApi";

import {
  Shield,
  AlertTriangle,
  Zap,
  Save,
  CheckCircle,
} from "lucide-react";

const FraudRules = () => {
  const [rules, setRules] = useState({
    highAmountThreshold: "",
    velocityLimitHigh: "",
    velocityLimitMedium: "",
  });

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const data = await getRules();
      setRules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setRules({
      ...rules,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response =
        await updateRules(rules);

      setMessage(
        response.message ||
          "Rules updated successfully"
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex items-center gap-4 mb-8">

        <div className="bg-indigo-100 p-4 rounded-2xl">
          <Shield
            size={30}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Fraud Rules Management
          </h1>

          <p className="text-slate-500 mt-1">
            Configure fraud detection
            thresholds and transaction
            monitoring policies.
          </p>
        </div>

      </div>

      {/* Success Message */}

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
            mb-6
          "
        >
          <CheckCircle size={18} />
          {message}
        </div>
      )}

      {/* Cards */}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">

        <div className="bg-white border rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-red-500" />
            <h3 className="font-semibold">
              High Amount Rule
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            Transactions exceeding this
            value are automatically
            flagged.
          </p>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="text-orange-500" />
            <h3 className="font-semibold">
              High Velocity Rule
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            Maximum transactions allowed
            before high-risk detection.
          </p>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="text-indigo-500" />
            <h3 className="font-semibold">
              Medium Velocity Rule
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            Medium-risk transaction
            monitoring threshold.
          </p>
        </div>

      </div>

      {/* Main Form */}

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* High Amount */}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              High Amount Threshold (₹)
            </label>

            <input
              type="number"
              name="highAmountThreshold"
              value={
                rules.highAmountThreshold
              }
              onChange={handleChange}
              placeholder="Enter amount"
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
            />
          </div>

          {/* High Velocity */}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Velocity Limit High
            </label>

            <input
              type="number"
              name="velocityLimitHigh"
              value={
                rules.velocityLimitHigh
              }
              onChange={handleChange}
              placeholder="Enter limit"
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
            />
          </div>

          {/* Medium Velocity */}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Velocity Limit Medium
            </label>

            <input
              type="number"
              name="velocityLimitMedium"
              value={
                rules.velocityLimitMedium
              }
              onChange={handleChange}
              placeholder="Enter limit"
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
            />
          </div>

          {/* Save Button */}

          <button
            type="submit"
            className="
              flex
              items-center
              gap-2
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              px-6
              py-3
              rounded-2xl
              font-medium
              transition-all
            "
          >
            <Save size={18} />
            Save Rules
          </button>

        </form>

      </div>

    </div>
  );
};

export default FraudRules;