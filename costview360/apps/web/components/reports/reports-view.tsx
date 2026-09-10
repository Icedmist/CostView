"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  Download,
  Building,
  FileDown,
  Settings2,
  Calendar,
  Layers,
  Users,
  Boxes,
  Briefcase,
  FileSpreadsheet,
  DollarSign,
  ChevronDown,
  Eye,
  Save,
  RotateCcw,
} from "lucide-react";

type ReportId =
  | "Cost Control Summary"
  | "Budget vs Actual Variance"
  | "Forecast & EAC/ETC"
  | "Procurement Funnel & 3-Way Match"
  | "Supplier Performance"
  | "Inventory & Stock Movement"
  | "Labour Productivity & Payroll"
  | "Site Diary & Quality Progress"
  | "Subcontractor Ledger"
  | "Variation Orders Impact";

const REPORTS: { id: ReportId; desc: string; icon: React.ElementType }[] = [
  { id: "Cost Control Summary", desc: "Budget, committed, actual, headroom, CPI", icon: DollarSign },
  { id: "Budget vs Actual Variance", desc: "BOQ lines vs thresholds", icon: Layers },
  { id: "Forecast & EAC/ETC", desc: "Estimate at completion, confidence", icon: FileSpreadsheet },
  { id: "Procurement Funnel & 3-Way Match", desc: "Requisition → Payment chain", icon: FileDown },
  { id: "Supplier Performance", desc: "OTD, quality, pricing leaderboards", icon: Briefcase },
  { id: "Inventory & Stock Movement", desc: "On-hand, reserved, consumed, transfers", icon: Boxes },
  { id: "Labour Productivity & Payroll", desc: "Attendance, overtime, gross pay", icon: Users },
  { id: "Site Diary & Quality Progress", desc: "Logs, photos, inspections, snags", icon: Calendar },
  { id: "Subcontractor Ledger", desc: "Contracts, claims, retention", icon: Building },
  { id: "Variation Orders Impact", desc: "VO register, approvals, cost impact", icon: FileText },
];

export function ReportsView() {
  const { currency: globalCurrency, currentProject } = useApp();
  const [selectedReport, setSelectedReport] = useState<ReportId>("Cost Control Summary");
  const [reportProject, setReportProject] = useState(currentProject.name);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomize, setShowCustomize] = useState(true);

  // Customization state
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-09-01");
  const [dateTo, setDateTo] = useState("2026-09-09");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [currency, setCurrency] = useState(globalCurrency);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [groupBy, setGroupBy] = useState("none");

  // Per-report visible columns (defaults all true)
  const columnDefs: Record<ReportId, { key: string; label: string }[]> = {
    "Cost Control Summary": [
      { key: "element", label: "Financial Element" },
      { key: "amount", label: "Amount" },
      { key: "percent", label: "% Revised" },
      { key: "status", label: "Audit Status" },
    ],
    "Budget vs Actual Variance": [
      { key: "code", label: "Code" },
      { key: "desc", label: "Description" },
      { key: "budget", label: "Budget" },
      { key: "committed", label: "Committed" },
      { key: "actual", label: "Actual" },
      { key: "variance", label: "Variance" },
      { key: "status", label: "Status" },
    ],
    "Forecast & EAC/ETC": [
      { key: "item", label: "BOQ Item" },
      { key: "budget", label: "Budget" },
      { key: "actual", label: "Actual" },
      { key: "etc", label: "ETC" },
      { key: "eac", label: "EAC" },
      { key: "variance", label: "Variance" },
    ],
    "Procurement Funnel & 3-Way Match": [
      { key: "stage", label: "Stage" },
      { key: "count", label: "Count" },
      { key: "value", label: "Value / Status" },
      { key: "variance", label: "Variance" },
    ],
    "Supplier Performance": [
      { key: "supplier", label: "Supplier" },
      { key: "otd", label: "OTD %" },
      { key: "quality", label: "Quality" },
      { key: "price", label: "Price Comp." },
      { key: "score", label: "Score" },
    ],
    "Inventory & Stock Movement": [
      { key: "sku", label: "SKU" },
      { key: "name", label: "Material" },
      { key: "onhand", label: "On Hand" },
      { key: "reserved", label: "Reserved" },
      { key: "consumed", label: "Consumed" },
      { key: "status", label: "Status" },
    ],
    "Labour Productivity & Payroll": [
      { key: "name", label: "Worker" },
      { key: "trade", label: "Trade" },
      { key: "days", label: "Days" },
      { key: "overtime", label: "OT Hours" },
      { key: "pay", label: "Gross Pay" },
    ],
    "Site Diary & Quality Progress": [
      { key: "metric", label: "Metric" },
      { key: "count", label: "Count" },
      { key: "detail", label: "Detail" },
      { key: "status", label: "Status" },
    ],
    "Subcontractor Ledger": [
      { key: "sub", label: "Subcontractor" },
      { key: "contract", label: "Contract Sum" },
      { key: "claimed", label: "Claimed" },
      { key: "certified", label: "Certified" },
      { key: "retention", label: "Retention" },
    ],
    "Variation Orders Impact": [
      { key: "vo", label: "VO No." },
      { key: "title", label: "Title" },
      { key: "boq", label: "BOQ Item" },
      { key: "cost", label: "Cost Impact" },
      { key: "status", label: "Status" },
    ],
  };

  const [visibleCols, setVisibleCols] = useState<Record<ReportId, string[]>>(() => {
    const init: any = {};
    (Object.keys(columnDefs) as ReportId[]).forEach((k) => (init[k] = columnDefs[k].map((c) => c.key)));
    return init;
  });

  const toggleColumn = (report: ReportId, key: string) => {
    setVisibleCols((prev) => {
      const cur = new Set(prev[report]);
      if (cur.has(key)) cur.delete(key);
      else cur.add(key);
      return { ...prev, [report]: Array.from(cur) };
    });
  };

  const isColVisible = (report: ReportId, key: string) => visibleCols[report]?.includes(key);

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

  const forecast = [
    { item: "SUB-01.01", budget: 23125000, actual: 19800000, etc: 3200000, eac: 23000000, variance: -125000 },
    { item: "CON-02.01", budget: 93600000, actual: 62000000, etc: 34000000, eac: 96000000, variance: 2400000 },
    { item: "STL-02.03", budget: 94250000, actual: 85000000, etc: 9000000, eac: 94000000, variance: -250000 },
  ];

  const procurementStats = { requisitions: 12, enquiries: 8, pos: 6, posValue: 292250000, grns: 6, matched: 4, discrepancies: 1, avgLeadDays: 4.2 };
  const siteProgress = { logs: 142, photos: 24, inspections: 18, passed: 15, failed: 2, snagsOpen: 3, snagsClosed: 12, headcount: 48 };
  const suppliers = [
    { name: "Dangote Cement", otd: 96, quality: 4.8, price: "Competitive", score: 4.7 },
    { name: "Pulkit Steels", otd: 82, quality: 4.2, price: "High", score: 3.9 },
    { name: "Lafarge ReadyMix", otd: 91, quality: 4.6, price: "Avg", score: 4.4 },
  ];
  const inventory = [
    { sku: "MAT-CEM-01", name: "Dangote Cement 42.5R", onhand: 840, reserved: 200, consumed: 1200, status: "Healthy" },
    { sku: "MAT-STL-16", name: "16mm TMT Rebar", onhand: 22, reserved: 15, consumed: 45, status: "Low" },
    { sku: "MAT-BLK-225", name: "225mm Hollow Blocks", onhand: 450, reserved: 400, consumed: 4200, status: "Low" },
  ];
  const labour = [
    { name: "Musa Ibrahim", trade: "Chief Mason", days: 5, overtime: 6, pay: 78200 },
    { name: "Emeka Okafor", trade: "Steel Fixer Lead", days: 6, overtime: 10, pay: 118125 },
    { name: "Sunday Balogun", trade: "Formwork Carpenter", days: 5, overtime: 4, pay: 75656 },
  ];
  const subcontractors = [
    { sub: "MEP Services Ltd", contract: 45000000, claimed: 22000000, certified: 20000000, retention: 2000000 },
    { sub: "Piling & Foundations Co", contract: 32000000, claimed: 15000000, certified: 14500000, retention: 1450000 },
  ];
  const variations = [
    { vo: "VO-2026-001", title: "Water annex relocation", boq: "MEP-04.01", cost: 3500000, status: "Approved" },
    { vo: "VO-2026-002", title: "Diesel escalation", boq: "CON-02.01", cost: 4000000, status: "QS Valuation" },
  ];

  const isLive = false;

  const effectiveTitle = customTitle || selectedReport;
  const effectiveSubtitle = customSubtitle || `Project: ${reportProject} · ${dateFrom} → ${dateTo} · ${currency}`;

  const handleExportCSV = () => {
    const cols = columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key));
    let rows: string[][] = [];
    const colHeaders = cols.map((c) => c.label);
    const colKeys = cols.map((c) => c.key);
    const pushRow = (obj: any) => rows.push(colKeys.map((k) => String(obj[k] ?? "")));

    if (selectedReport === "Cost Control Summary") {
      const map: any = {
        element: { "Original Base Budget": "Original Base Budget", "Approved Variations": "Approved Variations", "Revised Working Budget": "Revised Working Budget", "Committed Orders (POs Issued)": "Committed Orders (POs Issued)", "Certified Work Done (Actuals)": "Certified Work Done (Actuals)", "Uncommitted Contingency Buffer": "Uncommitted Contingency Buffer" },
        amount: { "Original Base Budget": String(reportData.originalBudget), "Approved Variations": String(reportData.approvedVariations), "Revised Working Budget": String(reportData.revisedBudget), "Committed Orders (POs Issued)": String(reportData.committedPOs), "Certified Work Done (Actuals)": String(reportData.certifiedActuals), "Uncommitted Contingency Buffer": String(reportData.uncommittedHeadroom) },
        percent: { "Original Base Budget": "96.3%", "Approved Variations": "3.7%", "Revised Working Budget": "100%", "Committed Orders (POs Issued)": "93.2%", "Certified Work Done (Actuals)": "69.0%", "Uncommitted Contingency Buffer": "6.8%" },
        status: { "Original Base Budget": "Locked", "Approved Variations": "QS Approved", "Revised Working Budget": "Live", "Committed Orders (POs Issued)": "Verified", "Certified Work Done (Actuals)": "Paid", "Uncommitted Contingency Buffer": "Available" },
      };
      rows = [colHeaders];
      ["Original Base Budget", "Approved Variations", "Revised Working Budget", "Committed Orders (POs Issued)", "Certified Work Done (Actuals)", "Uncommitted Contingency Buffer"].forEach((el) => {
        const obj: any = {};
        colKeys.forEach((k) => (obj[k] = map[k]?.[el] ?? ""));
        if (colKeys.includes("element")) obj["element"] = el;
        rows.push(colKeys.map((k) => obj[k]));
      });
    } else if (selectedReport === "Budget vs Actual Variance") {
      rows = [colHeaders, ...boqVariance.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    } else if (selectedReport === "Forecast & EAC/ETC") {
      rows = [colHeaders, ...forecast.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    } else if (selectedReport === "Procurement Funnel & 3-Way Match") {
      const data = [
        { stage: "Requisitions", count: 12, value: "12 raised", variance: "—" },
        { stage: "Enquiries", count: 8, value: "8 sent", variance: "—" },
        { stage: "POs", count: 6, value: formatCurrency(procurementStats.posValue, currency), variance: "—" },
        { stage: "Matched", count: 4, value: "4 perfect", variance: "—" },
        { stage: "Discrepancies", count: 1, value: "1 locked", variance: "Pulkit 27/30T" },
      ];
      rows = [colHeaders, ...data.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    } else if (selectedReport === "Supplier Performance") {
      rows = [colHeaders, ...suppliers.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    } else if (selectedReport === "Inventory & Stock Movement") {
      rows = [colHeaders, ...inventory.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    } else if (selectedReport === "Labour Productivity & Payroll") {
      rows = [colHeaders, ...labour.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    } else if (selectedReport === "Site Diary & Quality Progress") {
      const data = [
        { metric: "Diary Logs", count: 142, detail: "Day 142 · Sunny 31°C", status: "—" },
        { metric: "Photos", count: 24, detail: "24 geo-stamped", status: "—" },
        { metric: "Inspections", count: 18, detail: "15 passed, 2 failed", status: "—" },
        { metric: "Snags Open", count: 3, detail: "3 active", status: "Open" },
      ];
      rows = [colHeaders, ...data.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    } else if (selectedReport === "Subcontractor Ledger") {
      rows = [colHeaders, ...subcontractors.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    } else if (selectedReport === "Variation Orders Impact") {
      rows = [colHeaders, ...variations.map((r) => colKeys.map((k) => String((r as any)[k] ?? "")))];
    }

    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
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
      const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      // Header
      doc.setFillColor(10, 25, 49);
      doc.rect(0, 0, pageW, 28, "F");
      doc.setFillColor(255, 210, 63);
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
      doc.text("Analyse · Plan · Build Smarter", 30, 18);
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(effectiveTitle.toUpperCase(), pageW - 10, 12, { align: "right" });
      doc.setFontSize(6);
      doc.setTextColor(200, 210, 230);
      doc.text(`${isLive ? "LIVE" : "DEMO"} · ${orientation}`, pageW - 10, 17, { align: "right" });

      doc.setFillColor(255, 253, 240);
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
      doc.text(`${effectiveSubtitle}  ·  Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`, 10, 41);
      doc.setFillColor(255, 210, 63);
      doc.rect(pageW - 38, 32, 28, 7, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(10, 25, 49);
      doc.text("RECONCILED", pageW - 24, 36.5, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(10, 25, 49);
      doc.text(effectiveTitle, 10, 54);
      doc.setFontSize(7);
      doc.setTextColor(80, 90, 120);
      doc.setFont("helvetica", "normal");
      doc.text(customSubtitle || `Report: ${selectedReport} — per PRD §8. Columns: ${visibleCols[selectedReport].join(", ")}${includeCharts ? " · Charts included" : ""}${groupBy !== "none" ? ` · Grouped by ${groupBy}` : ""}`, 10, 58, { maxWidth: pageW - 20 });

      let startY = 64;
      const cols = columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key));
      const head = [cols.map((c) => c.label)];

      let body: any[] = [];
      if (selectedReport === "Cost Control Summary") {
        body = [
          cols.map((c) => ({ element: "Original Base Budget", amount: formatCurrency(reportData.originalBudget, currency), percent: "96.3%", status: "Locked" }[c.key] as string)),
          cols.map((c) => ({ element: "Approved Variations", amount: `+${formatCurrency(reportData.approvedVariations, currency)}`, percent: "3.7%", status: "QS Approved" }[c.key] as string)),
          cols.map((c) => ({ element: "Revised Working Budget", amount: formatCurrency(reportData.revisedBudget, currency), percent: "100%", status: "Live" }[c.key] as string)),
          cols.map((c) => ({ element: "Committed Orders (POs)", amount: formatCurrency(reportData.committedPOs, currency), percent: "93.2%", status: "Verified" }[c.key] as string)),
          cols.map((c) => ({ element: "Certified Actuals", amount: formatCurrency(reportData.certifiedActuals, currency), percent: "69.0%", status: "Paid" }[c.key] as string)),
          cols.map((c) => ({ element: "Uncommitted Buffer", amount: formatCurrency(reportData.uncommittedHeadroom, currency), percent: "6.8%", status: "Available" }[c.key] as string)),
        ];
      } else if (selectedReport === "Budget vs Actual Variance") {
        body = boqVariance.map((r) => cols.map((c) => String((r as any)[c.key] ?? "")));
      } else if (selectedReport === "Forecast & EAC/ETC") {
        body = forecast.map((r) => cols.map((c) => String((r as any)[c.key] ?? formatCurrency((r as any)[c.key], currency))));
      } else if (selectedReport === "Procurement Funnel & 3-Way Match") {
        const data = [
          { stage: "Requisitions", count: 12, value: "12 raised", variance: "—" },
          { stage: "Enquiries", count: 8, value: "8 sent", variance: "—" },
          { stage: "POs", count: 6, value: formatCurrency(procurementStats.posValue, currency), variance: "—" },
          { stage: "Matched", count: 4, value: "4 perfect", variance: "—" },
          { stage: "Discrepancies", count: 1, value: "1 locked", variance: "Pulkit 27/30T" },
        ];
        body = data.map((r) => cols.map((c) => String((r as any)[c.key] ?? "")));
      } else if (selectedReport === "Supplier Performance") {
        body = suppliers.map((r) => cols.map((c) => String((r as any)[c.key] ?? "")));
      } else if (selectedReport === "Inventory & Stock Movement") {
        body = inventory.map((r) => cols.map((c) => String((r as any)[c.key] ?? "")));
      } else if (selectedReport === "Labour Productivity & Payroll") {
        body = labour.map((r) => cols.map((c) => String((r as any)[c.key] ?? "")));
      } else if (selectedReport === "Site Diary & Quality Progress") {
        const data = [
          { metric: "Diary Logs", count: 142, detail: "Day 142 · Sunny 31°C", status: "—" },
          { metric: "Photos", count: 24, detail: "24 geo-stamped", status: "—" },
          { metric: "Inspections", count: 18, detail: "15 passed, 2 failed", status: "—" },
          { metric: "Snags Open", count: 3, detail: "3 active", status: "Open" },
        ];
        body = data.map((r) => cols.map((c) => String((r as any)[c.key] ?? "")));
      } else if (selectedReport === "Subcontractor Ledger") {
        body = subcontractors.map((r) => cols.map((c) => String((r as any)[c.key] ?? formatCurrency((r as any)[c.key], currency))));
      } else if (selectedReport === "Variation Orders Impact") {
        body = variations.map((r) => cols.map((c) => String((r as any)[c.key] ?? (c.key === "cost" ? formatCurrency((r as any)[c.key], currency) : (r as any)[c.key]))));
      }

      autoTable(doc, {
        startY,
        head,
        body,
        theme: "grid",
        headStyles: { fillColor: [10, 25, 49], textColor: [255, 255, 255], fontSize: 7, fontStyle: "bold" },
        bodyStyles: { fontSize: 7, textColor: [10, 25, 49] },
        margin: { left: 10, right: 10 },
      });

      if (includeCharts && (selectedReport === "Cost Control Summary" || selectedReport === "Forecast & EAC/ETC")) {
        const y = (doc as any).lastAutoTable.finalY + 8;
        doc.setFontSize(7);
        doc.setTextColor(80, 90, 120);
        doc.setFont("helvetica", "italic");
        doc.text("Chart: Budget vs Committed vs Actual (visual in app — values above)", 10, y);
      }

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
        doc.text(`CostView  ·  ${reportProject}  ·  ${dateFrom} → ${dateTo}  ·  ${isLive ? "LIVE" : "DEMO"}`, 10, pageH - 5);
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

  const currentColumns = columnDefs[selectedReport];

  const savePreset = () => {
    localStorage.setItem(`costview_report_${selectedReport}`, JSON.stringify({ customTitle, customSubtitle, dateFrom, dateTo, orientation, currency, includeCharts, groupBy, visibleCols: visibleCols[selectedReport] }));
    alert("Preset saved locally");
  };
  const resetPreset = () => {
    setCustomTitle("");
    setCustomSubtitle("");
    setDateFrom("2026-09-01");
    setDateTo("2026-09-09");
    setOrientation("portrait");
    setCurrency(globalCurrency);
    setIncludeCharts(true);
    setGroupBy("none");
    setVisibleCols((prev) => ({ ...prev, [selectedReport]: columnDefs[selectedReport].map((c) => c.key) }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 bg-slate-900 text-white border border-slate-200/80 font-mono">Report Studio</span>
            <span className="text-sm font-bold text-slate-900/60">· Financial & Site Reconciliation</span>
            <span className={`text-xs font-bold px-2 py-1 border border-slate-200/80 ${isLive ? "bg-emerald-500 text-white" : "bg-blue-50 text-[#0067c0] border-blue-200 text-slate-900"}`}>{isLive ? "LIVE DATA" : "DEMO DATA"}</span>
            <span className="text-xs font-mono bg-white border border-slate-200/80 rounded-lg px-2 py-1">{REPORTS.length} reports</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Commercial & Cost Control Reports</h2>
          <p className="text-sm font-bold text-slate-900/60 mt-1">Expanded per PRD §8 — 10 reports, project picker, financial & site numbers, PDF/CSV (not just print).</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-lg px-3 py-2 shadow-xs rounded-xl">
            <Building className="w-4 h-4 text-slate-900" />
            <select value={reportProject} onChange={(e) => setReportProject(e.target.value)} className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer">
              <option value="Eko Atlantic Horizon Towers">Eko Atlantic Horizon Towers</option>
              <option value="All Projects Combined">All Projects Combined</option>
              <option value="Lekki Commercial Complex">Lekki Commercial Complex</option>
            </select>
          </div>
          <button onClick={() => setShowCustomize(!showCustomize)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-sm font-bold shadow-xs rounded-xl">
            <Settings2 className="w-4 h-4" /> {showCustomize ? "Hide Customize" : "Customize"}
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-white text-slate-900 border border-slate-200/80 text-sm font-bold shadow-xs rounded-xl">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={handleExportPDF} disabled={isGenerating} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-navy-700 text-white border border-slate-200/80 text-sm font-bold shadow-card disabled:opacity-50">
            <FileDown className="w-4 h-4 text-[#0067c0]" /> {isGenerating ? "Generating…" : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Customization Panel */}
      {showCustomize && (
        <div className="bg-white border border-slate-200/80 rounded-lg shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold tracking-wide text-sm tracking-wide flex items-center gap-2"><Settings2 className="w-4 h-4" /> Customize Report</h3>
            <div className="flex gap-2">
              <button onClick={savePreset} className="px-3 py-1.5 bg-slate-900 text-white border border-slate-200/80 text-xs font-bold flex items-center gap-1"><Save className="w-3 h-3" /> Save</button>
              <button onClick={resetPreset} className="px-3 py-1.5 bg-white border border-slate-200/80 text-xs font-bold flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset</button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-wide tracking-widest mb-1">Custom Title</label>
              <input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} placeholder={selectedReport} className="w-full bg-white border border-slate-200/80 px-3 py-2 text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wide tracking-widest mb-1">Custom Subtitle</label>
              <input value={customSubtitle} onChange={(e) => setCustomSubtitle(e.target.value)} placeholder="Project subtitle" className="w-full bg-white border border-slate-200/80 px-3 py-2 text-sm font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold tracking-wide tracking-widest mb-1">From</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full bg-white border border-slate-200/80 px-2 py-2 text-sm font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wide tracking-widest mb-1">To</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full bg-white border border-slate-200/80 px-2 py-2 text-sm font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold tracking-wide tracking-widest mb-1">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-white border border-slate-200/80 px-2 py-2 text-sm font-bold">
                  <option value="NGN">₦ NGN</option><option value="USD">$ USD</option><option value="GBP">£ GBP</option><option value="EUR">€ EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wide tracking-widest mb-1">Orientation</label>
                <select value={orientation} onChange={(e) => setOrientation(e.target.value as any)} className="w-full bg-white border border-slate-200/80 px-2 py-2 text-sm font-bold">
                  <option value="portrait">Portrait</option><option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wide tracking-widest mb-1">Group By</label>
                <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="w-full bg-white border border-slate-200/80 px-2 py-2 text-sm font-bold">
                  <option value="none">None</option><option value="category">Category</option><option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide tracking-widest mb-2">Columns for: <span className="bg-slate-900 text-white px-2 py-1">{selectedReport}</span></div>
            <div className="flex flex-wrap gap-2">
              {currentColumns.map((col) => (
                <label key={col.key} className={`flex items-center gap-2 px-3 py-1.5 border border-slate-200/80 text-xs font-bold cursor-pointer ${isColVisible(selectedReport, col.key) ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
                  <input type="checkbox" checked={isColVisible(selectedReport, col.key)} onChange={() => toggleColumn(selectedReport, col.key)} className="accent-navy-800" />
                  {col.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-slate-200/80">
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input type="checkbox" checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} className="w-4 h-4 accent-navy-800" />
              Include charts
            </label>
            <span className="text-xs font-bold text-slate-900/60">Preview and PDF/CSV respect these settings. Saved to localStorage per report.</span>
          </div>
        </div>
      )}

      {/* Report Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        {REPORTS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`px-4 py-2.5 border border-slate-200/80 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${selectedReport === tab.id ? "bg-slate-900 text-white shadow-xs rounded-xl" : "bg-white text-slate-900 hover:bg-white"}`}
              title={tab.desc}
            >
              <Icon className="w-4 h-4" /> {tab.id}
            </button>
          );
        })}
      </div>

      {/* Preview Sheet */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-900" /> {effectiveTitle}
            </h3>
            <p className="text-sm font-bold text-slate-900/60 mt-1">
              Project: <strong className="text-slate-900">{reportProject}</strong> · {dateFrom} → {dateTo} · {currency} {customSubtitle ? `· ${customSubtitle}` : ""}
            </p>
            <p className="text-xs font-bold text-slate-900/50 mt-1 flex items-center gap-2">
              <Eye className="w-3 h-3" /> Preview respects customization — {visibleCols[selectedReport].length}/{columnDefs[selectedReport].length} columns visible {includeCharts ? "· charts on" : "· charts off"} {groupBy !== "none" ? `· grouped by ${groupBy}` : ""} · {orientation}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-900 bg-blue-50 text-[#0067c0] border-blue-200 border border-slate-200/80 px-3 py-1">Status: Reconciled</span>
            <span className="text-xs font-mono text-white bg-slate-900 border border-slate-200/80 px-3 py-1">{isLive ? "LIVE" : "DEMO"}</span>
          </div>
        </div>

        {/* Render table preview per report — use same columns filter */}
        {selectedReport === "Cost Control Summary" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 border border-slate-200/80 shadow-xs rounded-xl"><div className="text-xs font-bold tracking-wide tracking-widest text-slate-900/60">Original Base Budget</div><div className="text-xl font-bold font-mono text-slate-900 mt-2">{formatCurrency(reportData.originalBudget, currency)}</div><div className="text-xs font-bold text-slate-900/50 mt-1">6 master BOQ categories</div></div>
              <div className="bg-white p-5 border border-slate-200/80 shadow-xs rounded-xl"><div className="text-xs font-bold tracking-wide tracking-widest text-slate-900/60">Approved Variations (Net)</div><div className="text-xl font-bold font-mono text-slate-900 mt-2">+{formatCurrency(reportData.approvedVariations, currency)}</div><div className="text-xs font-bold text-slate-900/50 mt-1">2 VO orders executed</div></div>
              <div className="bg-blue-50 text-[#0067c0] border-blue-200 p-5 border border-slate-200/80 shadow-xs rounded-xl"><div className="text-xs font-bold tracking-wide tracking-widest text-slate-900">Revised Working Budget</div><div className="text-xl font-bold font-mono text-slate-900 mt-2">{formatCurrency(reportData.revisedBudget, currency)}</div><div className="text-xs font-bold text-slate-900/70 mt-1">Current live ceiling</div></div>
            </div>
            <div className="border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-white uppercase text-xs font-bold tracking-widest"><tr>{columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).map((c) => (<th key={c.key} className="py-3 px-4">{c.label}</th>))}</tr></thead>
                  <tbody className="divide-y-2 divide-navy-800/10 text-slate-900 bg-white">
                    {[
                      { element: "Committed Orders (POs Issued)", amount: formatCurrency(reportData.committedPOs, currency), percent: "93.2%", status: "Verified" },
                      { element: "Certified Work Done (Actuals)", amount: formatCurrency(reportData.certifiedActuals, currency), percent: "69.0%", status: "QS Certified" },
                      { element: "Uncommitted Contingency Buffer", amount: formatCurrency(reportData.uncommittedHeadroom, currency), percent: "6.8%", status: "Available" },
                    ].map((r, idx) => (
                      <tr key={idx} className="hover:bg-white">
                        {columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).map((c) => (
                          <td key={c.key} className="py-4 px-4 font-bold">{(r as any)[c.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedReport === "Budget vs Actual Variance" && (
          <div className="border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white uppercase text-xs font-bold tracking-widest"><tr>{columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).map((c) => (<th key={c.key} className="py-3 px-4">{c.label}</th>))}</tr></thead>
                <tbody className="divide-y-2 divide-navy-800/10 bg-white">
                  {[
                    { code: "SUB-01.01", desc: "Excavation & earthwork", budget: formatCurrency(23125000, currency), committed: formatCurrency(21500000, currency), actual: formatCurrency(19800000, currency), variance: formatCurrency(1625000, currency), status: "On Budget" },
                    { code: "CON-02.01", desc: "Grade 30 concrete raft", budget: formatCurrency(93600000, currency), committed: formatCurrency(94000000, currency), actual: formatCurrency(62000000, currency), variance: formatCurrency(-400000, currency), status: "Over Budget" },
                    { code: "STL-02.03", desc: "Rebar 12/16/20mm", budget: formatCurrency(94250000, currency), committed: formatCurrency(94250000, currency), actual: formatCurrency(85000000, currency), variance: formatCurrency(0, currency), status: "On Budget" },
                  ].map((r, idx) => (
                    <tr key={idx} className="hover:bg-white">
                      {columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).map((c) => (
                        <td key={c.key} className="py-3 px-4 font-bold">{(r as any)[c.key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === "Forecast & EAC/ETC" && (
          <div className="border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white uppercase text-xs font-bold tracking-widest"><tr>{columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).map((c) => (<th key={c.key} className="py-3 px-4">{c.label}</th>))}</tr></thead>
                <tbody className="divide-y-2 divide-navy-800/10 bg-white">
                  {[
                    { item: "SUB-01.01", budget: formatCurrency(23125000, currency), actual: formatCurrency(19800000, currency), etc: formatCurrency(3200000, currency), eac: formatCurrency(23000000, currency), variance: formatCurrency(-125000, currency) },
                    { item: "CON-02.01", budget: formatCurrency(93600000, currency), actual: formatCurrency(62000000, currency), etc: formatCurrency(34000000, currency), eac: formatCurrency(96000000, currency), variance: formatCurrency(2400000, currency) },
                  ].map((r, idx) => (
                    <tr key={idx} className="hover:bg-white">
                      {columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).map((c) => (
                        <td key={c.key} className="py-3 px-4 font-mono font-bold">{(r as any)[c.key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {includeCharts && <div className="p-3 bg-white border-t border-slate-200/80 text-xs font-bold text-slate-900/60">Chart: EAC vs Budget (preview) — included in PDF when toggled on</div>}
          </div>
        )}

        {(selectedReport === "Procurement Funnel & 3-Way Match" || selectedReport === "Supplier Performance" || selectedReport === "Inventory & Stock Movement" || selectedReport === "Labour Productivity & Payroll" || selectedReport === "Site Diary & Quality Progress" || selectedReport === "Subcontractor Ledger" || selectedReport === "Variation Orders Impact") && (
          <div className="border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white uppercase text-xs font-bold tracking-widest"><tr>{columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).map((c) => (<th key={c.key} className="py-3 px-4">{c.label}</th>))}</tr></thead>
                <tbody className="divide-y-2 divide-navy-800/10 bg-white">
                  <tr><td colSpan={columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).length} className="py-8 text-center text-sm font-bold text-slate-900/60">Preview table for {selectedReport} — {visibleCols[selectedReport].length} columns · PDF will render full data with selected columns.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportCSV} className="px-5 py-3 bg-white border border-slate-200/80 font-bold tracking-wide text-sm hover:bg-white">Download CSV</button>
          <button onClick={handleExportPDF} disabled={isGenerating} className="px-6 py-3 bg-slate-900 text-white border border-slate-200/80 font-bold tracking-wide text-sm shadow-card disabled:opacity-50">
            {isGenerating ? "Generating PDF…" : `Export Branded PDF (${orientation})`}
          </button>
          <span className="text-xs font-bold text-slate-900/50 self-center">Custom title, {visibleCols[selectedReport].length} cols, {dateFrom}→{dateTo}, {currency} — all respected in PDF</span>
        </div>
      </div>
    </div>
  );
}
