import { useState } from "react";
import { downloadReport } from "../../api/adminApi";

import {
  Download,
  FileSpreadsheet,
  BarChart3,
  CheckCircle,
} from "lucide-react";

const Reports = () => {
  const [downloading, setDownloading] =
    useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const blob =
        await downloadReport();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "fraud_report.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(
        url
      );
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex items-center gap-4 mb-8">

        <div className="bg-green-100 p-4 rounded-2xl">
          <BarChart3
            size={30}
            className="text-green-600"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Reports & Analytics
          </h1>

          <p className="text-slate-500 mt-1">
            Export fraud detection
            reports and transaction
            insights.
          </p>
        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white border rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileSpreadsheet className="text-green-500" />
            <h3 className="font-semibold">
              CSV Export
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            Download fraud alert data
            for external analysis.
          </p>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="text-blue-500" />
            <h3 className="font-semibold">
              Audit Ready
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            Generate compliance and
            audit-friendly exports.
          </p>
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="text-purple-500" />
            <h3 className="font-semibold">
              Historical Data
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            Export stored fraud events
            and transaction history.
          </p>
        </div>

      </div>

      {/* Main Export Card */}

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Fraud Alert Report
            </h2>

            <p className="text-slate-500 mt-2">
              Download all fraud alerts,
              scores, risk levels, and
              transaction details as a
              CSV file.
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-green-600
              hover:bg-green-700
              disabled:bg-green-400
              text-white
              px-6
              py-3
              rounded-2xl
              font-medium
              transition-all
              min-w-55
            "
          >
            <Download size={18} />

            {downloading
              ? "Downloading..."
              : "Download CSV Report"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Reports;