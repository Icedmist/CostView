"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import { FileText, Download, Building, FileDown } from "lucide-react";

export function ReportsView() {
  const { currency, currentProject } = useApp();
  const [selectedReport, setSelectedReport] = useState("Cost Control Summary");
  const [reportProject, setReportProject] = useState(currentProject.name);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportData = {
    originalBudget: 301815000,
    approvedVariations: 11700000,
    revisedBudget: 313515000,
    committedPOs: 292250000,
    certifiedActuals: 216400000,
    uncommittedHeadroom: 21265000,
    costPerformanceIndex: 1.04,
  };

  const boqVariance = [
    { code: "SUB-01.01", desc: "Excavation & earthwork", budget: 23125000, committed: 21500000, actual: 19800000, variance: 1625000, status: "On Budget" },
    { code: "CON-02.01", desc: "Grade 30 concrete raft", budget: 93600000, committed: 94000000, actual: 62000000, variance: -400000, status: "Over Budget" },
    { code: "STL-02.03", desc: "Rebar 12/16/20mm", budget: 94250000, committed: 94250000, actual: 85000000, variance: 0, status: "On Budget" },
    { code: "BLK-03.01", desc: "225mm blockwork", budget: 35840000, committed: 33000000, actual: 24500000, variance: 2840000, status: "Under Budget" },
    { code: "MEP-04.01", desc: "Electrical first fix", budget: 45000000, committed: 42000000, actual: 20000000, variance: 3000000, status: "Under Budget" },
  ];

  const procurementStats = {
    requisitions: 12,
    enquiries: 8,
    pos: 6,
    posValue: 292250000,
    grns: 6,
    matched: 4,
    discrepancies: 1,
    pending: 1,
    avgLeadDays: 4.2,
  };

  const siteProgress = {
    logs: 142,
    photos: 24,
    inspections: 18,
    passed: 15,
    failed: 2,
    snagsOpen: 3,
    snagsClosed: 12,
    safetyIncidents: 0,
    headcount: 48,
  };

  const isLive = false;

  const handleExportCSV = () => {
    let rows: string[][] = [];
    if (selectedReport === "Cost Control Summary") {
      rows = [
        ["Financial Element", "Amount", "% Revised", "Status"],
        ["Original Base Budget", String(reportData.originalBudget), "96.3%", "Locked"],
        ["Approved Variations", String(reportData.approvedVariations), "3.7%", "QS Approved"],
        ["Revised Working Budget", String(reportData.revisedBudget), "100%", "Live"],
        ["Committed POs", String(reportData.committedPOs), "93.2%", "Verified"],
        ["Certified Actuals", String(reportData.certifiedActuals), "69.0%", "Paid"],
        ["Uncommitted Buffer", String(reportData.uncommittedHeadroom), "6.8%", "Available"],
      ];
    } else if (selectedReport === "Budget vs Actual Variance") {
      rows = [
        ["Code", "Description", "Budget", "Committed", "Actual", "Variance", "Status"],
        ...boqVariance.map((r) => [r.code, r.desc, String(r.budget), String(r.committed), String(r.actual), String(r.variance), r.status]),
      ];
    } else if (selectedReport === "Procurement Funnel & 3-Way Match") {
      rows = [
        ["Stage", "Count", "Value/Status"],
        ["Requisitions", String(procurementStats.requisitions), "12 raised"],
        ["Enquiries/RFQs", String(procurementStats.enquiries), "8 sent"],
        ["Purchase Orders", String(procurementStats.pos), formatCurrency(procurementStats.posValue, currency)],
        ["GRNs Delivered", String(procurementStats.grns), "6 verified"],
        ["Matched", String(procurementStats.matched), "4 perfect matches"],
        ["Discrepancies", String(procurementStats.discrepancies), "1 locked (Pulkit 27/30T)"],
        ["Avg Lead Time", String(procurementStats.avgLeadDays), "days"],
      ];
    } else {
      rows = [
        ["Metric", "Count", "Detail"],
        ["Diary Logs", String(siteProgress.logs), "Day 142 latest"],
        ["Photos", String(siteProgress.photos), "24 geo-stamped"],
        ["Inspections", String(siteProgress.inspections), `${siteProgress.passed} passed, ${siteProgress.failed} failed`],
        ["Snags Open", String(siteProgress.snagsOpen), "3 active"],
        ["Snags Closed", String(siteProgress.snagsClosed), "12 remediated"],
        ["Headcount", String(siteProgress.headcount), "48 workers Shift #142"],
        ["Safety Incidents", String(siteProgress.safetyIncidents), "0 lost-time (Day 114)"],
      ];
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CostView-${selectedReport.replace(/\s+/g, "-")}-${reportProject.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      // --- Header: navy bar with CV block and title ---
      doc.setFillColor(10, 25, 49); // navy #0A1931
      doc.rect(0, 0, pageW, 28, "F");
      // CV block mustard
      doc.setFillColor(255, 210, 63); // mustard
      doc.setDrawColor(10, 25, 49);
      doc.setLineWidth(0.6);
      doc.rect(10, 6, 16, 16, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(10, 25, 49);
      doc.text("CV", 18, 15.5, { align: "center" });
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text("CostView", 30, 13);
      doc.setFontSize(6);
      doc.setTextColor(255, 210, 63);
      doc.text("PRO  ·  Analyse · Plan · Build Smarter", 30, 18);
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("REPORT STUDIO", pageW - 10, 12, { align: "right" });
      doc.setFontSize(6);
      doc.setTextColor(200, 210, 230);
      doc.text(`${selectedReport}  ·  ${isLive ? "LIVE" : "DEMO"}`, pageW - 10, 17, { align: "right" });

      // Sub-header: project + date + status
      doc.setFillColor(255, 253, 240); // cream
      doc.rect(0, 28, pageW, 18, "F");
      doc.setDrawColor(10, 25, 49);
      doc.setLineWidth(0.4);
      doc.line(0, 28, pageW, 28);
      doc.line(0, 46, pageW, 46);
      doc.setFontSize(8);
      doc.setTextColor(10, 25, 49);
      doc.setFont("helvetica", "bold");
      doc.text(`Project: ${reportProject}`, 10, 36);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(80, 90, 120);
      doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}  ·  Currency: ${currency}  ·  CPI: ${reportData.costPerformanceIndex}`, 10, 41);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setFillColor(255, 210, 63);
      doc.rect(pageW - 38, 32, 28, 7, "FD");
      doc.setTextColor(10, 25, 49);
      doc.text("RECONCILED", pageW - 24, 36.5, { align: "center" });

      // Title block
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(10, 25, 49);
      doc.text(selectedReport, 10, 54);
      doc.setFontSize(7);
      doc.setTextColor(80, 90, 120);
      doc.setFont("helvetica", "normal");
      if (selectedReport === "Cost Control Summary") {
        doc.text("Budget vs committed vs actual — live commercial & cost control reconciliation per PRD §8. Project picker: single or all projects.", 10, 58);
      } else if (selectedReport === "Budget vs Actual Variance") {
        doc.text("BOQ line-item variance — threshold ±5%. Every variance shows reconciled status per PRD §1.6.", 10, 58);
      } else if (selectedReport === "Procurement Funnel & 3-Way Match") {
        doc.text("Requisition → Enquiry → PO → GRN → Invoice → Payment — 3-way match with discrepancy flags per PRD §3.2.", 10, 58);
      } else {
        doc.text("Site progress built from Diary/Photos/Inspections/Snags — real numbers, not narrative per PRD §8.", 10, 58);
      }

      let startY = 64;

      // Summary cards as mini table for Cost Control Summary
      if (selectedReport === "Cost Control Summary") {
        autoTable(doc, {
          startY,
          head: [["Original Base Budget", "Approved Variations", "Revised Working Budget"]],
          body: [[formatCurrency(reportData.originalBudget, currency), `+${formatCurrency(reportData.approvedVariations, currency)}`, formatCurrency(reportData.revisedBudget, currency)]],
          theme: "grid",
          headStyles: { fillColor: [10, 25, 49], textColor: [255, 255, 255], fontSize: 7, fontStyle: "bold", halign: "center" },
          bodyStyles: { fontSize: 8, fontStyle: "bold", halign: "center", textColor: [10, 25, 49] },
          columnStyles: { 2: { fillColor: [255, 210, 63] } },
          margin: { left: 10, right: 10 },
        });
        startY = (doc as any).lastAutoTable.finalY + 6;
      }

      // Main table per report
      if (selectedReport === "Cost Control Summary") {
        autoTable(doc, {
          startY,
          head: [["Financial Element", "Amount", "% Revised", "Audit Status"]],
          body: [
            ["Committed Orders (POs Issued)", formatCurrency(reportData.committedPOs, currency), "93.2%", "Verified Against Invoices"],
            ["Certified Work Done (Actuals)", formatCurrency(reportData.certifiedActuals, currency), "69.0%", "QS Certified & Paid"],
            ["Uncommitted Contingency Buffer", formatCurrency(reportData.uncommittedHeadroom, currency), "6.8%", "Available Headroom"],
            ["Revised Working Budget", formatCurrency(reportData.revisedBudget, currency), "100%", "Live Ceiling"],
          ],
          theme: "grid",
          headStyles: { fillColor: [10, 25, 49], textColor: [255, 255, 255], fontSize: 7, fontStyle: "bold" },
          bodyStyles: { fontSize: 7, textColor: [10, 25, 49] },
          columnStyles: { 1: { halign: "right", fontStyle: "bold" }, 2: { halign: "right" }, 3: { halign: "center" } },
          margin: { left: 10, right: 10 },
        });
      } else if (selectedReport === "Budget vs Actual Variance") {
        autoTable(doc, {
          startY,
          head: [["Code", "Description", "Budget", "Committed", "Actual", "Variance", "Status"]],
          body: boqVariance.map((r) => [
            r.code,
            r.desc,
            formatCurrency(r.budget, currency),
            formatCurrency(r.committed, currency),
            formatCurrency(r.actual, currency),
            formatCurrency(r.variance, currency),
            r.status,
          ]),
          theme: "grid",
          headStyles: { fillColor: [10, 25, 49], textColor: [255, 255, 255], fontSize: 6, fontStyle: "bold" },
          bodyStyles: { fontSize: 6, textColor: [10, 25, 49] },
          columnStyles: { 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" }, 5: { halign: "right", fontStyle: "bold" }, 6: { halign: "center", fontStyle: "bold" } },
          margin: { left: 10, right: 10 },
        });
      } else if (selectedReport === "Procurement Funnel & 3-Way Match") {
        autoTable(doc, {
          startY,
          head: [["Stage", "Count", "Value / Status", "Variance"]],
          body: [
            ["Requisitions", String(procurementStats.requisitions), "12 raised", "—"],
            ["Supplier Enquiries / RFQs", String(procurementStats.enquiries), "8 sent", "—"],
            ["Purchase Orders", String(procurementStats.pos), formatCurrency(procurementStats.posValue, currency), "—"],
            ["GRNs Delivered", String(procurementStats.grns), "6 verified", "—"],
            ["Perfect 3-Way Matches", String(procurementStats.matched), "4 matched", "—"],
            ["Discrepancies", String(procurementStats.discrepancies), "1 locked", "Pulkit 27/30T (-₦4.35M)"],
            ["Avg Lead Time", `${procurementStats.avgLeadDays} days`, "—", "—"],
          ],
          theme: "grid",
          headStyles: { fillColor: [10, 25, 49], textColor: [255, 255, 255], fontSize: 7, fontStyle: "bold" },
          bodyStyles: { fontSize: 7, textColor: [10, 25, 49] },
          margin: { left: 10, right: 10 },
        });
      } else {
        autoTable(doc, {
          startY,
          head: [["Metric", "Count", "Detail", "Status"]],
          body: [
            ["Diary Logs", String(siteProgress.logs), "Day 142 latest · Sunny 31°C", "—"],
            ["Progress Photos", String(siteProgress.photos), "24 geo-stamped", "—"],
            ["Inspections", String(siteProgress.inspections), `${siteProgress.passed} passed, ${siteProgress.failed} failed`, "—"],
            ["Snags Open", String(siteProgress.snagsOpen), "3 active (Block B)", "Open"],
            ["Snags Closed", String(siteProgress.snagsClosed), "12 remediated", "Closed"],
            ["Workforce", `${siteProgress.headcount} workers`, "Shift #142 · Formwork gang", "—"],
            ["Safety", `${siteProgress.safetyIncidents} incidents`, "Day 114 incident-free", "—"],
          ],
          theme: "grid",
          headStyles: { fillColor: [10, 25, 49], textColor: [255, 255, 255], fontSize: 7, fontStyle: "bold" },
          bodyStyles: { fontSize: 7, textColor: [10, 25, 49] },
          margin: { left: 10, right: 10 },
        });
      }

      // Footer on each page
      const pageCount = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(255, 253, 240);
        doc.rect(0, pageH - 12, pageW, 12, "F");
        doc.setDrawColor(10, 25, 49);
        doc.line(0, pageH - 12, pageW, pageH - 12);
        doc.setFontSize(6);
        doc.setTextColor(80, 90, 120);
        doc.setFont("helvetica", "normal");
        doc.text(`CostView  ·  ${reportProject}  ·  ${isLive ? "LIVE Supabase" : "DEMO seed (supabase/seed.sql)"}  ·  ${new Date().toISOString().slice(0, 10)}`, 10, pageH - 5);
        doc.text(`Page ${i} of ${pageCount}  ·  Confidential`, pageW - 10, pageH - 5, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.setTextColor(10, 25, 49);
        doc.text("Analyse · Plan · Build Smarter", pageW / 2, pageH - 5, { align: "center" });
      }

      doc.save(`CostView-${selectedReport.replace(/\s+/g, "-")}-${reportProject.replace(/\s+/g, "-")}.pdf`);
    } catch (e) {
      console.error(e);
      alert("PDF generation failed — see console");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
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
            Branded PDF per PRD §8 — project picker, real figures, site progress numbers. Export PDF or CSV (not just print).
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
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-cream-100 text-navy-800 border-2 border-navy-800 text-sm font-black shadow-brutal-sm"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-white border-2 border-navy-800 text-sm font-black shadow-brutal disabled:opacity-50"
          >
            <FileDown className="w-4 h-4 text-mustard-400" />
            <span>{isGenerating ? "Generating…" : "Export PDF"}</span>
          </button>
        </div>
      </div>

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

        {selectedReport === "Cost Control Summary" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-cream-100 p-5 border-2 border-navy-800 shadow-brutal-sm">
                <div className="text-xs font-black uppercase tracking-widest text-navy-800/60">Original Base Budget</div>
                <div className="text-xl font-black font-mono text-navy-800 mt-2">{formatCurrency(reportData.originalBudget, currency)}</div>
                <div className="text-xs font-bold text-navy-800/50 mt-1">6 master BOQ categories</div>
              </div>
              <div className="bg-white p-5 border-2 border-navy-800 shadow-brutal-sm">
                <div className="text-xs font-black uppercase tracking-widest text-navy-800/60">Approved Variations (Net)</div>
                <div className="text-xl font-black font-mono text-navy-800 mt-2">+{formatCurrency(reportData.approvedVariations, currency)}</div>
                <div className="text-xs font-bold text-navy-800/50 mt-1">2 VO orders executed</div>
              </div>
              <div className="bg-mustard-400 p-5 border-2 border-navy-800 shadow-brutal-sm">
                <div className="text-xs font-black uppercase tracking-widest text-navy-800">Revised Working Budget</div>
                <div className="text-xl font-black font-mono text-navy-800 mt-2">{formatCurrency(reportData.revisedBudget, currency)}</div>
                <div className="text-xs font-bold text-navy-800/70 mt-1">Current live ceiling</div>
              </div>
            </div>
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
                CPI: <span className="font-mono font-black text-navy-800">{reportData.costPerformanceIndex}</span> · {isLive ? "LIVE Supabase" : "DEMO seed (supabase/seed.sql)"}
              </div>
            </div>
          </>
        )}

        {selectedReport === "Budget vs Actual Variance" && (
          <div className="border-2 border-navy-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-800 text-white uppercase text-xs font-black tracking-widest">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Budget</th>
                    <th className="py-3 px-4 text-right">Committed</th>
                    <th className="py-3 px-4 text-right">Actual</th>
                    <th className="py-3 px-4 text-right">Variance</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-navy-800/10 bg-white">
                  {boqVariance.map((r) => (
                    <tr key={r.code} className="hover:bg-cream-100">
                      <td className="py-3 px-4 font-mono font-black text-navy-800">{r.code}</td>
                      <td className="py-3 px-4 font-bold">{r.desc}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(r.budget, currency)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(r.committed, currency)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(r.actual, currency)}</td>
                      <td className={`py-3 px-4 text-right font-mono font-black ${r.variance < 0 ? "text-red-600" : "text-navy-800"}`}>{formatCurrency(r.variance, currency)}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 text-xs font-black border-2 border-navy-800 ${r.status === "Over Budget" ? "bg-red-500 text-white" : r.status === "Under Budget" ? "bg-mustard-400 text-navy-800" : "bg-white text-navy-800"}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === "Procurement Funnel & 3-Way Match" && (
          <div className="border-2 border-navy-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-800 text-white uppercase text-xs font-black tracking-widest">
                  <tr>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4 text-center">Count</th>
                    <th className="py-3 px-4">Value / Status</th>
                    <th className="py-3 px-4">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-navy-800/10 bg-white">
                  <tr><td className="py-3 px-4 font-black">Requisitions</td><td className="py-3 px-4 text-center font-mono font-black">{procurementStats.requisitions}</td><td className="py-3 px-4">12 raised</td><td className="py-3 px-4">—</td></tr>
                  <tr><td className="py-3 px-4 font-black">Enquiries / RFQs</td><td className="py-3 px-4 text-center font-mono font-black">{procurementStats.enquiries}</td><td className="py-3 px-4">8 sent</td><td className="py-3 px-4">—</td></tr>
                  <tr><td className="py-3 px-4 font-black">Purchase Orders</td><td className="py-3 px-4 text-center font-mono font-black">{procurementStats.pos}</td><td className="py-3 px-4">{formatCurrency(procurementStats.posValue, currency)}</td><td className="py-3 px-4">—</td></tr>
                  <tr><td className="py-3 px-4 font-black">GRNs Delivered</td><td className="py-3 px-4 text-center font-mono font-black">{procurementStats.grns}</td><td className="py-3 px-4">6 verified</td><td className="py-3 px-4">—</td></tr>
                  <tr className="bg-green-50"><td className="py-3 px-4 font-black">Perfect 3-Way Matches</td><td className="py-3 px-4 text-center font-mono font-black text-green-700">{procurementStats.matched}</td><td className="py-3 px-4">4 matched</td><td className="py-3 px-4">—</td></tr>
                  <tr className="bg-red-50"><td className="py-3 px-4 font-black">Discrepancies</td><td className="py-3 px-4 text-center font-mono font-black text-red-600">{procurementStats.discrepancies}</td><td className="py-3 px-4">1 locked</td><td className="py-3 px-4 font-bold text-red-600">Pulkit 27/30T (-₦4.35M)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === "Site Diary & Quality Progress" && (
          <div className="border-2 border-navy-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-800 text-white uppercase text-xs font-black tracking-widest">
                  <tr>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4 text-center">Count</th>
                    <th className="py-3 px-4">Detail</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-navy-800/10 bg-white">
                  <tr><td className="py-3 px-4 font-black">Diary Logs</td><td className="py-3 px-4 text-center font-mono font-black">{siteProgress.logs}</td><td className="py-3 px-4">Day 142 · Sunny 31°C</td><td className="py-3 px-4">—</td></tr>
                  <tr><td className="py-3 px-4 font-black">Progress Photos</td><td className="py-3 px-4 text-center font-mono font-black">{siteProgress.photos}</td><td className="py-3 px-4">24 geo-stamped</td><td className="py-3 px-4">—</td></tr>
                  <tr><td className="py-3 px-4 font-black">Inspections</td><td className="py-3 px-4 text-center font-mono font-black">{siteProgress.inspections}</td><td className="py-3 px-4">{siteProgress.passed} passed, {siteProgress.failed} failed</td><td className="py-3 px-4">—</td></tr>
                  <tr><td className="py-3 px-4 font-black">Snags Open</td><td className="py-3 px-4 text-center font-mono font-black text-amber-600">{siteProgress.snagsOpen}</td><td className="py-3 px-4">3 active (Block B)</td><td className="py-3 px-4"><span className="bg-amber-400 border-2 border-navy-800 px-2 py-1 text-xs font-black">Open</span></td></tr>
                  <tr><td className="py-3 px-4 font-black">Snags Closed</td><td className="py-3 px-4 text-center font-mono font-black">{siteProgress.snagsClosed}</td><td className="py-3 px-4">12 remediated</td><td className="py-3 px-4"><span className="bg-green-500 text-white border-2 border-navy-800 px-2 py-1 text-xs font-black">Closed</span></td></tr>
                  <tr><td className="py-3 px-4 font-black">Workforce</td><td className="py-3 px-4 text-center font-mono font-black">{siteProgress.headcount}</td><td className="py-3 px-4">Shift #142</td><td className="py-3 px-4">—</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportCSV} className="px-5 py-3 bg-white border-2 border-navy-800 font-black uppercase text-sm hover:bg-cream-100">Download CSV</button>
          <button onClick={handleExportPDF} disabled={isGenerating} className="px-6 py-3 bg-navy-800 text-white border-2 border-navy-800 font-black uppercase text-sm shadow-brutal disabled:opacity-50">
            {isGenerating ? "Generating PDF…" : "Export Branded PDF"}
          </button>
        </div>
        <p className="text-xs font-bold text-navy-800/50">PDF: branded header, tables via jspdf-autotable, footer with page numbers — per PRD §6 Document Storage (automated PDF for Reports). CSV also available.</p>
      </div>
    </div>
  );
}
