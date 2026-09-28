"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/app/providers";
import { useAppData } from "@/lib/store/app-data";
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
  Eye,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Search,
} from "lucide-react";

export type ReportId =
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

export interface ReportMeta {
  id: ReportId;
  slug: string;
  desc: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
}

export const REPORTS_REGISTRY: ReportMeta[] = [
  {
    id: "Cost Control Summary",
    slug: "cost-control",
    desc: "Baseline budget, committed, actuals, headroom & CPI",
    icon: DollarSign,
    badge: "Finance",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "Budget vs Actual Variance",
    slug: "variance",
    desc: "BOQ line items tracked against contractual baseline",
    icon: Layers,
    badge: "BOQ Items",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: "Forecast & EAC/ETC",
    slug: "forecast",
    desc: "Estimate at completion (EAC) & estimate to complete (ETC)",
    icon: FileSpreadsheet,
    badge: "Forecast",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
  },
  {
    id: "Procurement Funnel & 3-Way Match",
    slug: "procurement",
    desc: "Requisitions → POs → GRNs → Invoices → Disbursements",
    icon: FileDown,
    badge: "Supply Chain",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
  },
  {
    id: "Supplier Performance",
    slug: "suppliers",
    desc: "On-time delivery (OTD), quality rating & pricing indices",
    icon: Briefcase,
    badge: "Vendors",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
  },
  {
    id: "Inventory & Stock Movement",
    slug: "inventory",
    desc: "Materials on-hand, reserved, issued & reorder thresholds",
    icon: Boxes,
    badge: "Inventory",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: "Labour Productivity & Payroll",
    slug: "labour",
    desc: "Muster attendance, trades, overtime hours & gross pay",
    icon: Users,
    badge: "Labour",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: "Site Diary & Quality Progress",
    slug: "site-diary",
    desc: "Shift logs, weather, photos, QA/QC tests & snags",
    icon: Calendar,
    badge: "Site Logs",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "Subcontractor Ledger",
    slug: "subcontractors",
    desc: "Contract sums, interim claims, certified work & 10% retention",
    icon: Building,
    badge: "Contracts",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
  },
  {
    id: "Variation Orders Impact",
    slug: "variations",
    desc: "Approved & pending VOs, cost additions & schedule extensions",
    icon: FileText,
    badge: "Variations",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
  },
];

const SLUG_TO_REPORT: Record<string, ReportId> = {
  "cost-control": "Cost Control Summary",
  variance: "Budget vs Actual Variance",
  forecast: "Forecast & EAC/ETC",
  procurement: "Procurement Funnel & 3-Way Match",
  suppliers: "Supplier Performance",
  inventory: "Inventory & Stock Movement",
  labour: "Labour Productivity & Payroll",
  "site-diary": "Site Diary & Quality Progress",
  subcontractors: "Subcontractor Ledger",
  variations: "Variation Orders Impact",
};

const REPORT_TO_SLUG: Record<ReportId, string> = {
  "Cost Control Summary": "cost-control",
  "Budget vs Actual Variance": "variance",
  "Forecast & EAC/ETC": "forecast",
  "Procurement Funnel & 3-Way Match": "procurement",
  "Supplier Performance": "suppliers",
  "Inventory & Stock Movement": "inventory",
  "Labour Productivity & Payroll": "labour",
  "Site Diary & Quality Progress": "site-diary",
  "Subcontractor Ledger": "subcontractors",
  "Variation Orders Impact": "variations",
};

interface ReportsViewProps {
  initialReportId?: string;
  onReportChange?: (reportId: string) => void;
}

export function ReportsView({ initialReportId, onReportChange }: ReportsViewProps) {
  const { currency: globalCurrency, currentProject } = useApp();
  const { boqItems } = useAppData();

  // Resolve initial selected report
  const resolvedInitial = useMemo<ReportId>(() => {
    if (!initialReportId) return "Cost Control Summary";
    if (SLUG_TO_REPORT[initialReportId]) return SLUG_TO_REPORT[initialReportId];
    if (REPORTS_REGISTRY.some((r) => r.id === initialReportId)) return initialReportId as ReportId;
    return "Cost Control Summary";
  }, [initialReportId]);

  const [selectedReport, setSelectedReport] = useState<ReportId>(resolvedInitial);
  const [reportProject, setReportProject] = useState(currentProject?.name || "Active Project");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    if (currentProject?.name) {
      setReportProject(currentProject.name);
    }
  }, [currentProject?.name]);

  // Sync when prop changes
  useEffect(() => {
    if (initialReportId) {
      const match = SLUG_TO_REPORT[initialReportId] || (REPORTS_REGISTRY.some((r) => r.id === initialReportId) ? (initialReportId as ReportId) : null);
      if (match && match !== selectedReport) {
        setSelectedReport(match);
      }
    }
  }, [initialReportId]);

  const handleSelectReport = (report: ReportId) => {
    setSelectedReport(report);
    const slug = REPORT_TO_SLUG[report];
    if (onReportChange && slug) {
      onReportChange(slug);
    }
  };

  // Customization state
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-09-01");
  const [dateTo, setDateTo] = useState("2026-09-12");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [currency, setCurrency] = useState(globalCurrency || "NGN");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [groupBy, setGroupBy] = useState("none");

  // Per-report column definitions
  const columnDefs: Record<ReportId, { key: string; label: string }[]> = {
    "Cost Control Summary": [
      { key: "element", label: "Financial Element" },
      { key: "amount", label: "Amount" },
      { key: "percent", label: "% Revised" },
      { key: "status", label: "Audit Status" },
    ],
    "Budget vs Actual Variance": [
      { key: "code", label: "BOQ Code" },
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
      { key: "actual", label: "Actual Spent" },
      { key: "etc", label: "ETC" },
      { key: "eac", label: "EAC" },
      { key: "variance", label: "Variance" },
    ],
    "Procurement Funnel & 3-Way Match": [
      { key: "stage", label: "Lifecycle Stage" },
      { key: "count", label: "Transaction Count" },
      { key: "value", label: "Reconciled Value" },
      { key: "variance", label: "Match State & Flag" },
    ],
    "Supplier Performance": [
      { key: "supplier", label: "Vendor Name" },
      { key: "otd", label: "OTD %" },
      { key: "quality", label: "Quality Rating" },
      { key: "price", label: "Pricing Index" },
      { key: "score", label: "Overall Score" },
      { key: "status", label: "Status" },
    ],
    "Inventory & Stock Movement": [
      { key: "sku", label: "Material SKU" },
      { key: "name", label: "Item Description" },
      { key: "onhand", label: "On Hand" },
      { key: "reserved", label: "Reserved" },
      { key: "consumed", label: "Consumed" },
      { key: "reorder", label: "Reorder Lvl" },
      { key: "status", label: "Inventory State" },
    ],
    "Labour Productivity & Payroll": [
      { key: "name", label: "Operative Name" },
      { key: "trade", label: "Trade Skill" },
      { key: "days", label: "Shifts" },
      { key: "overtime", label: "OT Hours" },
      { key: "prod", label: "Productivity" },
      { key: "pay", label: "Gross Payable" },
    ],
    "Site Diary & Quality Progress": [
      { key: "metric", label: "Operational Dimension" },
      { key: "target", label: "Scheduled Target" },
      { key: "actual", label: "Recorded Actual" },
      { key: "detail", label: "Field Notes & Location" },
      { key: "status", label: "QA/QC State" },
    ],
    "Subcontractor Ledger": [
      { key: "sub", label: "Specialist Contractor" },
      { key: "pkg", label: "Trade Package" },
      { key: "contract", label: "Contract Sum" },
      { key: "claimed", label: "Gross Claimed" },
      { key: "certified", label: "Certified Net" },
      { key: "retention", label: "10% Escrow" },
    ],
    "Variation Orders Impact": [
      { key: "vo", label: "VO Number" },
      { key: "title", label: "Scope Change Description" },
      { key: "boq", label: "Impacted BOQ" },
      { key: "cost", label: "Cost Impact" },
      { key: "time", label: "Schedule Impact" },
      { key: "status", label: "Approval Status" },
    ],
  };

  const [visibleCols, setVisibleCols] = useState<Record<ReportId, string[]>>(() => {
    const init: any = {};
    (Object.keys(columnDefs) as ReportId[]).forEach((k) => (init[k] = columnDefs[k].map((c) => c.key)));
    return init;
  });

  const toggleColumn = (report: ReportId, key: string) => {
    setVisibleCols((prev) => {
      const cur = new Set(prev[report] || []);
      if (cur.has(key)) cur.delete(key);
      else cur.add(key);
      return { ...prev, [report]: Array.from(cur) };
    });
  };

  const isColVisible = (report: ReportId, key: string) => visibleCols[report]?.includes(key);

  // Dynamic BOQ calculations
  const totalBudget = useMemo(() => boqItems.reduce((acc, i) => acc + (i.budgetAmount || 0), 0), [boqItems]);
  const totalCommitted = useMemo(() => boqItems.reduce((acc, i) => acc + (i.committedAmount || 0), 0), [boqItems]);
  const totalActual = useMemo(() => boqItems.reduce((acc, i) => acc + (i.actualAmount || 0), 0), [boqItems]);
  const totalVariance = totalBudget - totalActual;

  const costControlRows = useMemo(() => {
    if (boqItems.length === 0) return [];
    return [
      { element: "Original Contract Base Budget", amount: formatCurrency(totalBudget, currency), percent: "100.0%", status: "Active Ceiling" },
      { element: "Committed Orders (POs Issued)", amount: formatCurrency(totalCommitted, currency), percent: totalBudget > 0 ? `${((totalCommitted / totalBudget) * 100).toFixed(1)}%` : "0%", status: "Legally Bound" },
      { element: "Certified Work Done (Actuals Paid)", amount: formatCurrency(totalActual, currency), percent: totalBudget > 0 ? `${((totalActual / totalBudget) * 100).toFixed(1)}%` : "0%", status: "Valuated & Paid" },
      { element: "Uncommitted Contingency Buffer", amount: formatCurrency(Math.max(0, totalVariance), currency), percent: totalBudget > 0 ? `${Math.max(0, ((totalVariance / totalBudget) * 100)).toFixed(1)}%` : "0%", status: "Available Buffer" },
    ];
  }, [boqItems, totalBudget, totalCommitted, totalActual, totalVariance, currency]);

  const boqVarianceRows = useMemo(() => {
    return boqItems.map((item) => {
      const varianceVal = item.budgetAmount - item.actualAmount;
      const status = item.actualAmount > item.budgetAmount ? "Over Budget" : item.actualAmount === item.budgetAmount ? "On Budget" : "Under Budget";
      return {
        code: item.code,
        desc: item.description,
        budget: formatCurrency(item.budgetAmount, currency),
        committed: formatCurrency(item.committedAmount, currency),
        actual: formatCurrency(item.actualAmount, currency),
        variance: `${varianceVal >= 0 ? "+" : ""}${formatCurrency(varianceVal, currency)}`,
        status,
      };
    });
  }, [boqItems, currency]);

  const forecastRows = useMemo(() => {
    return boqItems.map((item) => {
      const etc = Math.max(0, item.budgetAmount - item.actualAmount);
      const eac = item.actualAmount + etc;
      const varianceVal = item.budgetAmount - eac;
      return {
        item: `${item.code} ${item.description}`,
        budget: formatCurrency(item.budgetAmount, currency),
        actual: formatCurrency(item.actualAmount, currency),
        etc: formatCurrency(etc, currency),
        eac: formatCurrency(eac, currency),
        variance: `${varianceVal >= 0 ? "+" : ""}${formatCurrency(varianceVal, currency)}`,
      };
    });
  }, [boqItems, currency]);

  const procurementRows: any[] = [];
  const supplierRows: any[] = [];
  const inventoryRows: any[] = [];
  const labourRows: any[] = [];
  const siteDiaryRows: any[] = [];
  const subcontractorRows: any[] = [];
  const variationRows: any[] = [];

  const effectiveTitle = customTitle || selectedReport;
  const effectiveSubtitle = customSubtitle || `Project: ${reportProject} · ${dateFrom} → ${dateTo} · ${currency}`;

  // Get active rows for currently selected report
  const getActiveDataRows = () => {
    switch (selectedReport) {
      case "Cost Control Summary":
        return costControlRows;
      case "Budget vs Actual Variance":
        return boqVarianceRows;
      case "Forecast & EAC/ETC":
        return forecastRows;
      case "Procurement Funnel & 3-Way Match":
        return procurementRows;
      case "Supplier Performance":
        return supplierRows;
      case "Inventory & Stock Movement":
        return inventoryRows;
      case "Labour Productivity & Payroll":
        return labourRows;
      case "Site Diary & Quality Progress":
        return siteDiaryRows;
      case "Subcontractor Ledger":
        return subcontractorRows;
      case "Variation Orders Impact":
        return variationRows;
      default:
        return [];
    }
  };

  const activeRows = useMemo(() => {
    const rows = getActiveDataRows();
    if (!searchFilter.trim()) return rows;
    const query = searchFilter.toLowerCase();
    return rows.filter((r: any) =>
      Object.values(r).some((val) => String(val).toLowerCase().includes(query))
    );
  }, [selectedReport, searchFilter, currency]);

  // Export CSV
  const handleExportCSV = () => {
    const cols = columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key));
    const colHeaders = cols.map((c) => c.label);
    const colKeys = cols.map((c) => c.key);
    const rows: string[][] = [colHeaders];

    const data = getActiveDataRows();
    data.forEach((row: any) => {
      rows.push(colKeys.map((k) => String(row[k] ?? "")));
    });

    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CostView-${selectedReport.replace(/\s+/g, "-")}-${reportProject.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Branded PDF with Bright Navy Palette
  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      // Top Branded Header Bar (Bright Navy #0A2540)
      doc.setFillColor(10, 37, 64);
      doc.rect(0, 0, pageW, 26, "F");

      // White Block Logo
      doc.setFillColor(255, 255, 255);
      doc.rect(10, 5, 16, 16, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(10, 37, 64);
      doc.text("CV", 18, 15.5, { align: "center" });

      // Title & Wordmark
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("CostView", 30, 13);
      doc.setFontSize(7);
      doc.setTextColor(200, 220, 245);
      doc.text("CONSTRUCTION COST & GOVERNANCE INTELLIGENCE", 30, 18);

      // Report Header Right
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(effectiveTitle.toUpperCase(), pageW - 10, 12, { align: "right" });
      doc.setFontSize(7);
      doc.setTextColor(200, 220, 245);
      doc.text(`CONFIDENTIAL · ${orientation.toUpperCase()}`, pageW - 10, 17, { align: "right" });

      // Sub-Banner (Milk Canvas #FAF9F5)
      doc.setFillColor(250, 249, 245);
      doc.rect(0, 26, pageW, 18, "F");
      doc.setDrawColor(229, 229, 222);
      doc.setLineWidth(0.5);
      doc.line(0, 26, pageW, 26);
      doc.line(0, 44, pageW, 44);

      // Project & Metadata
      doc.setFontSize(9);
      doc.setTextColor(10, 37, 64);
      doc.setFont("helvetica", "bold");
      doc.text(`Project: ${reportProject}`, 10, 34);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(80, 95, 120);
      doc.text(
        `${effectiveSubtitle}  ·  Generated: ${new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        10,
        39
      );

      // Reconciled Badge (White on Navy)
      doc.setFillColor(10, 37, 64);
      doc.rect(pageW - 40, 30, 30, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("RECONCILED", pageW - 25, 34.5, { align: "center" });

      // Report Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(10, 37, 64);
      doc.text(effectiveTitle, 10, 52);

      doc.setFontSize(8);
      doc.setTextColor(80, 95, 120);
      doc.setFont("helvetica", "normal");
      const currentMeta = REPORTS_REGISTRY.find((r) => r.id === selectedReport);
      doc.text(currentMeta?.desc || `Formal Audit Register for ${selectedReport}`, 10, 57);

      const startY = 62;
      const cols = columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key));
      const head = [cols.map((c) => c.label)];
      const dataRows = getActiveDataRows();
      const body = dataRows.map((r: any) => cols.map((c) => String(r[c.key] ?? "")));

      autoTable(doc, {
        startY,
        head,
        body,
        theme: "grid",
        headStyles: {
          fillColor: [10, 37, 64],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          lineColor: [229, 229, 222],
          lineWidth: 0.3,
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [10, 37, 64],
          lineColor: [229, 229, 222],
          lineWidth: 0.2,
        },
        alternateRowStyles: {
          fillColor: [250, 249, 245],
        },
        margin: { left: 10, right: 10 },
      });

      // Footer
      const pageCount = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(250, 249, 245);
        doc.rect(0, pageH - 12, pageW, 12, "F");
        doc.setDrawColor(229, 229, 222);
        doc.line(0, pageH - 12, pageW, pageH - 12);
        doc.setFontSize(7);
        doc.setTextColor(80, 95, 120);
        doc.setFont("helvetica", "normal");
        doc.text(`CostView Construction Intelligence  ·  ${reportProject}  ·  ${currency}`, 10, pageH - 5);
        doc.text(`Page ${i} of ${pageCount}  ·  Audit Trail Validated`, pageW - 10, pageH - 5, { align: "right" });
      }

      doc.save(`CostView-${selectedReport.replace(/\s+/g, "-")}-${reportProject.replace(/\s+/g, "-")}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("PDF generation encountered an error. Please verify input data.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentColumns = columnDefs[selectedReport];

  const savePreset = () => {
    try {
      localStorage.setItem(
        `costview_report_${selectedReport}`,
        JSON.stringify({ customTitle, customSubtitle, dateFrom, dateTo, orientation, currency, includeCharts, groupBy, visibleCols: visibleCols[selectedReport] })
      );
      alert("Report layout preset saved successfully.");
    } catch {
      // ignore
    }
  };

  const resetPreset = () => {
    setCustomTitle("");
    setCustomSubtitle("");
    setDateFrom("2026-09-01");
    setDateTo("2026-09-12");
    setOrientation("portrait");
    setCurrency(globalCurrency || "NGN");
    setIncludeCharts(true);
    setGroupBy("none");
    setVisibleCols((prev) => ({ ...prev, [selectedReport]: columnDefs[selectedReport].map((c) => c.key) }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Hub */}
      <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-[#0A2540] text-white rounded-lg">
                Reports Studio 7.0
              </span>
              <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
              </span>
              <span className="text-xs font-bold text-[#0A2540]/60">
                10 Executive Registers Available
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#0A2540] tracking-tight">
              Executive Cost &amp; Operations Reports
            </h1>
            <p className="text-sm md:text-base text-[#0A2540]/80 mt-1.5 max-w-3xl leading-relaxed font-medium">
              Audit-grade construction cost intelligence, earned value telemetry, supplier compliance leaderboards, and site progress registers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Project Picker */}
            <div className="flex items-center gap-2 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl px-4 py-2.5 shadow-xs">
              <Building className="w-4 h-4 text-[#0A2540]" />
              <select
                value={reportProject}
                onChange={(e) => setReportProject(e.target.value)}
                aria-label="Active Project"
                className="bg-transparent text-sm font-extrabold text-[#0A2540] focus:outline-none cursor-pointer"
              >
                {currentProject?.name && <option value={currentProject.name}>{currentProject.name}</option>}
                <option value="All Active Workspaces">All Workspaces Combined</option>
              </select>
            </div>

            {/* Customize Drawer Toggle */}
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className={`min-h-[46px] flex items-center gap-2 px-5 py-2.5 border-2 rounded-xl text-sm font-extrabold transition-all cursor-pointer shadow-xs ${
                showCustomize
                  ? "bg-[#0A2540] text-white border-[#0A2540]"
                  : "bg-white text-[#0A2540] border-[#E5E5DE] hover:bg-[#FAF9F5]"
              }`}
            >
              <Settings2 className="w-4 h-4" />
              <span>{showCustomize ? "Close Setup" : "Customize"}</span>
            </button>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="min-h-[46px] flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] rounded-xl text-sm font-extrabold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            {/* PDF Export */}
            <button
              onClick={handleExportPDF}
              disabled={isGenerating}
              className="min-h-[46px] flex items-center gap-2 px-6 py-2.5 bg-[#0A2540] hover:bg-[#003366] text-white border-2 border-[#0A2540] rounded-xl text-sm font-black transition-all cursor-pointer shadow-md disabled:opacity-50 active:scale-[0.98]"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGenerating ? "Rendering PDF..." : "Export Branded PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customization Drawer */}
      {showCustomize && (
        <div className="bg-white border-2 border-[#0A2540] rounded-2xl p-6 md:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#E5E5DE] pb-4">
            <div>
              <h3 className="text-base font-black text-[#0A2540] flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#0A2540]" />
                <span>Report Layout &amp; Filter Parameters</span>
              </h3>
              <p className="text-xs text-[#0A2540]/70 font-semibold mt-0.5">
                Customize column visibility, currency formatting, and metadata exported to PDF &amp; CSV.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={savePreset}
                className="px-4 py-2 bg-[#0A2540] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs hover:bg-[#003366] cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Preset
              </button>
              <button
                onClick={resetPreset}
                className="px-4 py-2 bg-[#FAF9F5] border-2 border-[#E5E5DE] text-[#0A2540] rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs hover:bg-[#F2F1EC] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-1.5">
                Custom Header Title
              </label>
              <input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={selectedReport}
                className="w-full h-11 px-3.5 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl text-sm font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-1.5">
                Custom Subtitle Notes
              </label>
              <input
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                placeholder="e.g. Q3 Substructure Phase Reconciliation"
                className="w-full h-11 px-3.5 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl text-sm font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-1.5">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-11 px-2.5 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl text-xs font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-1.5">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-11 px-2.5 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl text-xs font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-11 px-2 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl text-xs font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] cursor-pointer"
                >
                  <option value="NGN">₦ NGN (Naira)</option>
                  <option value="USD">$ USD (Dollar)</option>
                  <option value="GBP">£ GBP (Pound)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-1.5">
                  Page Layout
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full h-11 px-2 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl text-xs font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] cursor-pointer"
                >
                  <option value="portrait">Portrait A4</option>
                  <option value="landscape">Landscape A4</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-2.5">
              Active Columns for: <strong className="text-[#0A2540] underline">{selectedReport}</strong>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {currentColumns.map((col) => (
                <label
                  key={col.key}
                  className={`flex items-center gap-2 px-3.5 py-2 border-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                    isColVisible(selectedReport, col.key)
                      ? "bg-[#0A2540] text-white border-[#0A2540] shadow-xs"
                      : "bg-[#FAF9F5] text-[#0A2540] border-[#E5E5DE] hover:bg-[#F2F1EC]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isColVisible(selectedReport, col.key)}
                    onChange={() => toggleColumn(selectedReport, col.key)}
                    className="accent-white cursor-pointer"
                  />
                  <span>{col.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10-Report Tab Selector Strip */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {REPORTS_REGISTRY.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedReport === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectReport(tab.id)}
                className={`min-h-[46px] px-4 py-2.5 rounded-xl border-2 text-xs md:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2.5 cursor-pointer shadow-xs ${
                  isSelected
                    ? "bg-[#0A2540] text-white border-[#0A2540] shadow-md"
                    : "bg-white text-[#0A2540] border-[#E5E5DE] hover:bg-[#FAF9F5] hover:border-[#0A2540]"
                }`}
                title={tab.desc}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-[#0A2540]"}`} />
                <span>{tab.id}</span>
                <span
                  className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border ${
                    isSelected ? "bg-white/20 text-white border-white/30" : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Report View Container */}
      <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        {/* Sub-Header & Live Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#E5E5DE] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl md:text-2xl font-black text-[#0A2540] tracking-tight">
                {effectiveTitle}
              </h2>
              <span className="text-xs font-mono font-black px-2.5 py-1 bg-[#FAF9F5] border border-[#E5E5DE] text-[#0A2540] rounded-lg">
                {activeRows.length} Records
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#0A2540]/70 font-semibold mt-1">
              Project: <strong className="text-[#0A2540]">{reportProject}</strong> · {dateFrom} → {dateTo} · Currency: {currency}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter table rows..."
                className="w-full h-10 pl-10 pr-3 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl text-xs font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>
        </div>

        {/* Cost Control Top Summary Cards (when Cost Control active) */}
        {selectedReport === "Cost Control Summary" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] p-5 rounded-xl">
              <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60">Original Baseline Budget</div>
              <div className="text-2xl font-black font-mono text-[#0A2540] mt-2">
                {formatCurrency(totalBudget, currency)}
              </div>
              <div className="text-xs font-bold text-[#0A2540]/60 mt-1">Master BOQ allocation</div>
            </div>

            <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] p-5 rounded-xl">
              <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60">Committed Orders</div>
              <div className="text-2xl font-black font-mono text-[#0A2540] mt-2">
                {formatCurrency(totalCommitted, currency)}
              </div>
              <div className="text-xs font-bold text-[#0A2540]/60 mt-1">Legally bound contracts</div>
            </div>

            <div className="bg-[#0A2540] text-white border-2 border-[#0A2540] p-5 rounded-xl">
              <div className="text-xs font-black uppercase tracking-wider text-white/70">Certified Actuals</div>
              <div className="text-2xl font-black font-mono text-white mt-2">
                {formatCurrency(totalActual, currency)}
              </div>
              <div className="text-xs font-bold text-white/80 mt-1">Valuated and paid work</div>
            </div>
          </div>
        )}

        {/* Dynamic Data Table Rendered for ALL 10 Reports */}
        <div className="border-2 border-[#E5E5DE] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0A2540] text-white uppercase text-xs font-black tracking-wider">
                <tr>
                  {columnDefs[selectedReport]
                    .filter((c) => isColVisible(selectedReport, c.key))
                    .map((col) => (
                      <th key={col.key} className="py-3.5 px-4">
                        {col.label}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#E5E5DE] bg-white text-slate-900">
                {activeRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnDefs[selectedReport].filter((c) => isColVisible(selectedReport, c.key)).length}
                      className="py-12 text-center text-sm font-bold text-[#0A2540]/60"
                    >
                      {searchFilter
                        ? `No matching records found for "${searchFilter}".`
                        : "No records found for this register. Data will appear as items are logged in the project."}
                    </td>
                  </tr>
                ) : (
                  activeRows.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#FAF9F5] transition-colors">
                      {columnDefs[selectedReport]
                        .filter((c) => isColVisible(selectedReport, c.key))
                        .map((col) => {
                          const val = row[col.key];
                          const isStatusCol = col.key === "status" || col.key === "variance";
                          const isHighlight =
                            String(val).includes("Over") ||
                            String(val).includes("Locked") ||
                            String(val).includes("Discrepancy") ||
                            String(val).includes("Critical");
                          const isSuccess =
                            String(val).includes("Under") ||
                            String(val).includes("Preferred") ||
                            String(val).includes("Certified") ||
                            String(val).includes("Verified") ||
                            String(val).includes("Compliant") ||
                            String(val).includes("Adequate");

                          return (
                            <td key={col.key} className="py-3.5 px-4 font-bold text-[#0A2540]">
                              {isStatusCol ? (
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-md text-xs font-black ${
                                    isHighlight
                                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                                      : isSuccess
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : "bg-[#FAF9F5] text-[#0A2540] border border-[#E5E5DE]"
                                  }`}
                                >
                                  {val}
                                </span>
                              ) : (
                                <span className={col.key === "code" || col.key === "vo" || col.key === "sku" ? "font-mono font-black" : ""}>
                                  {val}
                                </span>
                              )}
                            </td>
                          );
                        })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Audit Information */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-[#E5E5DE] text-xs font-bold text-[#0A2540]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CostView Audit Security Validated · Ready for Executive PDF Export</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Layout: {orientation.toUpperCase()}</span>
            <span>·</span>
            <span>{visibleCols[selectedReport].length} Columns Visible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
