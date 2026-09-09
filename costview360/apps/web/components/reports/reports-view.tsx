"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  Download,
  Building,
  Printer,
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

  const handleExportCSV = () => {
    const rows = [
      ["Financial Element", "Amount", "% Revised", "Status"],
      ["Original Base Budget", String(reportData.originalBudget), "96.3%", "Locked"],
      ["Approved Variations", String(reportData.approvedVariations), "3.7%", "QS Approved"],
      ["Revised Working Budget", String(reportData.revisedBudget), "100%", "Live"],
      ["Committed POs", String(reportData.committedPOs), "93.2%", "Verified"],
      ["Certified Actuals", String(reportData.certifiedActuals), "69.0%", "Paid"],
      ["Uncommitted Buffer", String(reportData.uncommittedHeadroom), "6.8%", "Available"],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CostView-${selectedReport.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLive = false; // TODO: wire to Supabase when live

  return (
    <div className="space-y-6">
      {/* Header — fixed coloring: white bg, navy text */}
      <div className="bg-white border-2 border-navy-800 shadow-brutal p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-black tracking-widest px-3 py-1 bg-navy-800 text-white border-2 border-navy-800 font-mono">
              Report Studio
            </span>
            <span className="text-sm font-bold text-navy-800/60">· Financial & Site Reconciliation</span>
            <span className={`text-xs font-black px-2 py-1 border-2 border-navy-800 ${isLive ? "bg-green-500 text-white" : "bg-mustard-400 text-navy-800"}`}>
              {isLive ? "LIVE DATA" : "DEMO DATA"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-navy-800 tracking-tight">
            Commercial & Cost Control Reports
          </h2>
          <p className="text-sm font-bold text-navy-800/60 mt-1">
            Live aggregations when Supabase connected — currently showing seeded demo for Eko Atlantic. Export CSV or print.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-cream-100 border-2 border-navy-800 px-3 py-2 shadow-brutal-sm">
            <Building className="w-4 h-4 text-navy-800" />
            <select
              value={reportProject}
              onChange={(e) => setReportProject(e.target.value)}
              className="bg-transparent text-sm font-bold text-navy-800 focus:outline-none cursor-pointer"
            >
              <option value="Eko Atlantic Horizon Towers">Eko Atlantic Horizon Towers</option>
              <option value="All Projects Combined">All Projects Combined</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-mustard-400 hover:bg-mustard-500 text-navy-800 border-2 border-navy-800 text-sm font-black shadow-brutal-sm hover:shadow-brutal transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-navy-800 hover:bg-navy-700 text-white border-2 border-navy-800 text-sm font-black shadow-brutal-sm"
          >
            <Printer className="w-4 h-4 text-mustard-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Report Selector — larger, visible */}
      <div className="flex items-center gap-2 border-b-2 border-navy-800 pb-3 overflow-x-auto">
        {[
          "Cost Control Summary",
          "Budget vs Actual Variance",
          "Procurement Funnel & 3-Way Match",
          "Site Diary & Quality Progress",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedReport(tab)}
            className={`px-4 py-2.5 border-2 border-navy-800 text-sm font-black whitespace-nowrap transition-all ${
              selectedReport === tab
                ? "bg-navy-800 text-white shadow-brutal-sm"
                : "bg-white text-navy-800 hover:bg-cream-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Report Sheet — corrected contrast */}
      <div className="bg-white border-2 border-navy-800 shadow-brutal p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 border-b-2 border-navy-800 pb-5">
          <div>
            <h3 className="text-lg md:text-xl font-black text-navy-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-navy-800" /> CostView · {selectedReport}
            </h3>
            <p className="text-sm font-bold text-navy-800/60 mt-1">
              Project: <strong className="text-navy-800">{reportProject}</strong> · Generated on {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-navy-800 bg-mustard-400 border-2 border-navy-800 px-3 py-1">
              Status: Reconciled
            </span>
            <span className="text-xs font-mono text-white bg-navy-800 border-2 border-navy-800 px-3 py-1">
              {isLive ? "LIVE" : "DEMO"}
            </span>
          </div>
        </div>

        {/* Summary Cards — visible navy/cream, not zinc */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-cream-100 p-5 border-2 border-navy-800 shadow-brutal-sm">
            <div className="text-xs font-black uppercase tracking-widest text-navy-800/60">
              Original Base Budget
            </div>
            <div className="text-xl font-black font-mono text-navy-800 mt-2">
              {formatCurrency(reportData.originalBudget, currency)}
            </div>
            <div className="text-xs font-bold text-navy-800/50 mt-1">
              6 master BOQ categories
            </div>
          </div>

          <div className="bg-white p-5 border-2 border-navy-800 shadow-brutal-sm">
            <div className="text-xs font-black uppercase tracking-widest text-navy-800/60">
              Approved Variations (Net)
            </div>
            <div className="text-xl font-black font-mono text-navy-800 mt-2">
              +{formatCurrency(reportData.approvedVariations, currency)}
            </div>
            <div className="text-xs font-bold text-navy-800/50 mt-1">
              2 VO orders executed
            </div>
          </div>

          <div className="bg-mustard-400 p-5 border-2 border-navy-800 shadow-brutal-sm">
            <div className="text-xs font-black uppercase tracking-widest text-navy-800">
              Revised Working Budget
            </div>
            <div className="text-xl font-black font-mono text-navy-800 mt-2">
              {formatCurrency(reportData.revisedBudget, currency)}
            </div>
            <div className="text-xs font-bold text-navy-800/70 mt-1">
              Current live ceiling
            </div>
          </div>
        </div>

        {/* Table — high contrast, larger type */}
        <div className="border-2 border-navy-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-800 text-white uppercase text-xs font-black tracking-widest">
                <tr>
                  <th className="py-3 px-4">Financial Element</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">% Revised</th>
                  <th className="py-3 px-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-navy-800/10 text-navy-800 bg-white">
                <tr className="hover:bg-cream-100">
                  <td className="py-4 px-4 font-black">Committed Orders (POs Issued)</td>
                  <td className="py-4 px-4 text-right font-mono font-black">{formatCurrency(reportData.committedPOs, currency)}</td>
                  <td className="py-4 px-4 text-right font-mono font-bold">93.2%</td>
                  <td className="py-4 px-4"><span className="bg-navy-800 text-white px-2 py-1 text-xs font-black">Verified</span></td>
                </tr>
                <tr className="hover:bg-cream-100">
                  <td className="py-4 px-4 font-black">Certified Work Done (Actuals)</td>
                  <td className="py-4 px-4 text-right font-mono font-black">{formatCurrency(reportData.certifiedActuals, currency)}</td>
                  <td className="py-4 px-4 text-right font-mono font-bold">69.0%</td>
                  <td className="py-4 px-4"><span className="bg-mustard-400 border-2 border-navy-800 px-2 py-1 text-xs font-black">QS Certified</span></td>
                </tr>
                <tr className="hover:bg-cream-100 bg-cream-100/50">
                  <td className="py-4 px-4 font-black">Uncommitted Contingency Buffer</td>
                  <td className="py-4 px-4 text-right font-mono font-black text-navy-800">{formatCurrency(reportData.uncommittedHeadroom, currency)}</td>
                  <td className="py-4 px-4 text-right font-mono font-black">6.8%</td>
                  <td className="py-4 px-4"><span className="bg-green-500 text-white border-2 border-navy-800 px-2 py-1 text-xs font-black">Available</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-cream-100 border-t-2 border-navy-800 text-xs font-bold text-navy-800/60">
            CPI: <span className="font-mono font-black text-navy-800">{reportData.costPerformanceIndex}</span> · Data source: {isLive ? "Supabase live aggregations" : "Seed demo (supabase/seed.sql) — will be live when project has real transactions"}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportCSV} className="px-5 py-3 bg-navy-800 text-white border-2 border-navy-800 font-black uppercase text-sm shadow-brutal-sm">Download CSV</button>
          <button onClick={() => window.print()} className="px-5 py-3 bg-white border-2 border-navy-800 font-black uppercase text-sm">Print Report</button>
        </div>
      </div>
    </div>
  );
}
