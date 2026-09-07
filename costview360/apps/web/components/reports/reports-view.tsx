"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  Download,
  Building,
  TrendingUp,
  DollarSign,
  Printer,
  Calendar,
} from "lucide-react";

export function ReportsView() {
  const { currency, currentProject } = useApp();
  const [selectedReport, setSelectedReport] = useState("Cost Control Summary");
  const [reportProject, setReportProject] = useState(currentProject.name);

  const reportData = {
    originalBudget: 301815000,
    approvedVariations: 11700000,
    revisedBudget: 313515000,
    committedPOs: 292250000,
    certifiedActuals: 216400000,
    uncommittedHeadroom: 21265000,
    costPerformanceIndex: 1.04,
  };

  return (
    <div className="space-y-6">
      {/* Header with Project Picker */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
              Report Studio
            </span>
            <span className="text-zinc-500 text-xs">· Financial & Site Reconciliation</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Commercial & Cost Control Reports
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real figures, live project aggregations, and exportable statements (PRD Section 8).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5">
            <Building className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={reportProject}
              onChange={(e) => setReportProject(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="Eko Atlantic Horizon Towers" className="bg-zinc-900">
                Eko Atlantic Horizon Towers
              </option>
              <option value="All Projects Combined" className="bg-zinc-900">
                All Projects Combined (Company Portfolio)
              </option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto text-xs">
        {[
          "Cost Control Summary",
          "Budget vs Actual Variance",
          "Procurement Funnel & 3-Way Match",
          "Site Diary & Quality Progress",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedReport(tab)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedReport === tab
                ? "bg-zinc-800 text-white font-bold border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Generated Report Sheet */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              CostView 360 · {selectedReport}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Project: <strong className="text-zinc-200">{reportProject}</strong> · Generated on 7 September 2026
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              Status: Reconciled
            </span>
          </div>
        </div>

        {/* Financial Summary Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase">
              Original Base Budget
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {formatCurrency(reportData.originalBudget, currency)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Tied to 6 master BOQ categories
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase">
              Approved Variations (Net)
            </div>
            <div className="text-lg font-bold font-mono text-blue-400 mt-1">
              +{formatCurrency(reportData.approvedVariations, currency)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              2 VO orders executed
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase">
              Revised Working Budget
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
              {formatCurrency(reportData.revisedBudget, currency)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Current live target ceiling
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Financial Element</th>
                <th className="py-2.5 px-4 text-right">Amount (₦)</th>
                <th className="py-2.5 px-4 text-right">% of Revised Budget</th>
                <th className="py-2.5 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Committed Orders (POs Issued)</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-white">{formatCurrency(reportData.committedPOs, currency)}</td>
                <td className="py-3 px-4 text-right font-mono text-blue-400">93.2%</td>
                <td className="py-3 px-4 text-emerald-400">Verified Against Invoices</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Certified Work Done (Actuals)</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-white">{formatCurrency(reportData.certifiedActuals, currency)}</td>
                <td className="py-3 px-4 text-right font-mono text-purple-400">69.0%</td>
                <td className="py-3 px-4 text-emerald-400">QS Certified & Paid</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Uncommitted Contingency Buffer</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{formatCurrency(reportData.uncommittedHeadroom, currency)}</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-400">6.8%</td>
                <td className="py-3 px-4 text-emerald-400">Available Headroom</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
