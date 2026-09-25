"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  FileCheck2,
  ShieldCheck,
  Building2,
  FolderTree,
  Scale,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Download,
  Upload,
  History,
  Lock,
  Eye,
  Users,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  X,
  FileCode,
  Calendar,
  Check,
  BookOpen,
} from "lucide-react";

export type DocumentCategory =
  | "Company Documents"
  | "Contracts & Agreements"
  | "Legal Documents"
  | "Financial Documents"
  | "Correspondence";

export type DocumentFlowStage =
  | "Create/Receive"
  | "Store"
  | "Review"
  | "Approve"
  | "Use"
  | "Update"
  | "Archive";

export interface CorporateDocument {
  id: string;
  docNumber: string;
  title: string;
  category: DocumentCategory;
  description: string;
  version: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
  flowStage: DocumentFlowStage;
  status: "Active" | "Under Review" | "Approved" | "Archived" | "Pending Renewal";
  accessLevel: "Company-Wide" | "Executive & Commercial" | "Board & Legal" | "Site Operations";
  department: string;
  historyCount: number;
}

export interface ApprovalItem {
  id: string;
  title: string;
  type: "Capital Expenditure" | "Variation Order" | "Contract Sign-off" | "Subcontractor Claim" | "Policy Exception";
  amount?: number;
  submittedBy: string;
  submittedDate: string;
  department: string;
  priority: "High" | "Normal" | "Urgent";
  status: "Pending Review" | "Approved" | "Rejected";
  approvers: { name: string; role: string; signed: boolean }[];
  description: string;
}

export interface DepartmentNode {
  id: string;
  name: string;
  code: string;
  headOfDept: string;
  staffCount: number;
  location: string;
  keyResponsibilities: string[];
}

export interface PolicyDocument {
  id: string;
  code: string;
  title: string;
  category: "Procurement & Commercial" | "HSE & Site Safety" | "Financial Controls" | "Governance & HR";
  effectiveDate: string;
  version: string;
  reviewCycle: "Annual" | "Bi-Annual" | "Quarterly";
  complianceRate: number;
  summary: string;
}

export interface ComplianceRecord {
  id: string;
  statutoryBody: string;
  permitTitle: string;
  certificateNumber: string;
  status: "Valid & Current" | "Expiring Soon" | "Under Renewal";
  expiryDate: string;
  daysRemaining: number;
  relevance: string;
}

const INITIAL_DOCUMENTS: CorporateDocument[] = [
  {
    id: "doc-01",
    docNumber: "DOC-CAC-2024-001",
    title: "CAC Certificate of Incorporation & Form CAC 1.1",
    category: "Company Documents",
    description: "Corporate Affairs Commission statutory incorporation and memorandum of association.",
    version: "v1.0",
    fileSize: "3.4 MB",
    fileType: "PDF",
    uploadedBy: "Barr. Adaeze (Legal Counsel)",
    uploadedAt: "2024-01-15",
    flowStage: "Use",
    status: "Active",
    accessLevel: "Company-Wide",
    department: "Executive & Legal",
    historyCount: 3,
  },
  {
    id: "doc-02",
    docNumber: "DOC-LASBCA-2025-014",
    title: "LASBCA Approved Building Development Permit",
    category: "Legal Documents",
    description: "Lagos State Building Control Agency official developmental and structural approval for Horizon Commercial Towers.",
    version: "v2.2",
    fileSize: "14.8 MB",
    fileType: "PDF",
    uploadedBy: "Engr. Tayo (Site Director)",
    uploadedAt: "2025-04-10",
    expiryDate: "2027-04-10",
    flowStage: "Use",
    status: "Active",
    accessLevel: "Site Operations",
    department: "Project Engineering",
    historyCount: 5,
  },
  {
    id: "doc-03",
    docNumber: "DOC-FIRS-TCC-2026",
    title: "FIRS Federal Tax Clearance Certificate (TCC)",
    category: "Company Documents",
    description: "Valid federal tax compliance certificate for corporate income tax (CIT) and education tax clearance.",
    version: "v2026.1",
    fileSize: "1.2 MB",
    fileType: "PDF",
    uploadedBy: "Ngozi (Financial Controller)",
    uploadedAt: "2026-01-20",
    expiryDate: "2026-12-31",
    flowStage: "Use",
    status: "Active",
    accessLevel: "Executive & Commercial",
    department: "Finance & Accounts",
    historyCount: 4,
  },
  {
    id: "doc-04",
    docNumber: "DOC-MSA-DANGOTE-09",
    title: "Dangote Cement Master Supply & Rebate Agreement",
    category: "Contracts & Agreements",
    description: "Annual bulk supply agreement with negotiated discount rates and delivery terms to Lekki site depot.",
    version: "v1.3",
    fileSize: "5.1 MB",
    fileType: "PDF",
    uploadedBy: "Kelechi (Procurement Lead)",
    uploadedAt: "2026-02-01",
    expiryDate: "2027-01-31",
    flowStage: "Use",
    status: "Active",
    accessLevel: "Executive & Commercial",
    department: "Procurement & Supply",
    historyCount: 2,
  },
  {
    id: "doc-05",
    docNumber: "DOC-APG-ZENITH-082",
    title: "Zenith Bank Advance Payment Guarantee (APG) Bond",
    category: "Financial Documents",
    description: "Bank guarantee protecting 15% mobilization payment on Horizon Commercial Towers.",
    version: "v1.0",
    fileSize: "2.7 MB",
    fileType: "PDF",
    uploadedBy: "Ngozi (Financial Controller)",
    uploadedAt: "2025-11-12",
    expiryDate: "2026-11-12",
    flowStage: "Store",
    status: "Active",
    accessLevel: "Board & Legal",
    department: "Finance & Accounts",
    historyCount: 2,
  },
  {
    id: "doc-06",
    docNumber: "DOC-COR-CONS-041",
    title: "Structural Engineer Transmittal: Raft Rebar Amendment",
    category: "Correspondence",
    description: "Formal transmittal from S&M Consultants with sealed clarification on column reinforcement laps at Grid 4-E.",
    version: "v1.0",
    fileSize: "4.3 MB",
    fileType: "PDF",
    uploadedBy: "Engr. Tayo (Site Director)",
    uploadedAt: "2026-09-18",
    flowStage: "Use",
    status: "Active",
    accessLevel: "Site Operations",
    department: "Project Engineering",
    historyCount: 1,
  },
  {
    id: "doc-07",
    docNumber: "DOC-EIA-FEDMIN-2024",
    title: "Federal Ministry of Environment EIA Final Certificate",
    category: "Legal Documents",
    description: "Environmental Impact Assessment certificate and environmental management plan (EMP) compliance.",
    version: "v1.0",
    fileSize: "8.9 MB",
    fileType: "PDF",
    uploadedBy: "Barr. Adaeze (Legal Counsel)",
    uploadedAt: "2024-08-04",
    flowStage: "Archive",
    status: "Active",
    accessLevel: "Company-Wide",
    department: "Executive & Legal",
    historyCount: 3,
  },
  {
    id: "doc-08",
    docNumber: "DOC-COREN-FIRM-2026",
    title: "COREN Corporate Engineering Practicing License",
    category: "Company Documents",
    description: "Council for the Regulation of Engineering in Nigeria valid corporate practice registration.",
    version: "v2026.1",
    fileSize: "1.8 MB",
    fileType: "PDF",
    uploadedBy: "Engr. Tayo (Site Director)",
    uploadedAt: "2026-01-05",
    expiryDate: "2026-12-31",
    flowStage: "Use",
    status: "Active",
    accessLevel: "Company-Wide",
    department: "Project Engineering",
    historyCount: 6,
  },
];

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: "app-01",
    title: "Rebar Supply PO-2026-092 Pulkit Steels (30 Tons)",
    type: "Capital Expenditure",
    amount: 34500000,
    submittedBy: "Kelechi (Procurement Lead)",
    submittedDate: "2026-09-24",
    department: "Procurement & Supply",
    priority: "Urgent",
    status: "Pending Review",
    approvers: [
      { name: "Kelechi (Procurement)", role: "Originator", signed: true },
      { name: "Babajide (Chief QS)", role: "Commercial Gate", signed: true },
      { name: "Snow (Managing Director)", role: "Final Sign-off", signed: false },
    ],
    description: "Requires board-level authorization as requisition exceeds N10,000,000 corporate threshold.",
  },
  {
    id: "app-02",
    title: "Site Instruction SI-014: Basement Pump Sump Relocation",
    type: "Variation Order",
    amount: 4200000,
    submittedBy: "Engr. Tayo (Site Director)",
    submittedDate: "2026-09-23",
    department: "Project Engineering",
    priority: "High",
    status: "Pending Review",
    approvers: [
      { name: "Engr. Tayo", role: "Site Engineer", signed: true },
      { name: "Babajide (Chief QS)", role: "Cost Verification", signed: false },
    ],
    description: "Architectural alignment requested by MEP consultant to avoid high-voltage cable trench.",
  },
  {
    id: "app-03",
    title: "Interim Payment Certificate IPC-03 (Apex MEP Services)",
    type: "Subcontractor Claim",
    amount: 18900000,
    submittedBy: "Babajide (Chief QS)",
    submittedDate: "2026-09-22",
    department: "Commercial & QS",
    priority: "Normal",
    status: "Approved",
    approvers: [
      { name: "Babajide (Chief QS)", role: "Measurement Certifier", signed: true },
      { name: "Ngozi (Financial Controller)", role: "Treasury Release", signed: true },
    ],
    description: "10% retention withheld (N1.89M) per Subcontract Agreement terms. Net payout N17.01M.",
  },
];

const INITIAL_DEPARTMENTS: DepartmentNode[] = [
  {
    id: "dept-01",
    name: "Commercial & Quantity Surveying",
    code: "CQS",
    headOfDept: "Babajide (Chief Quantity Surveyor)",
    staffCount: 6,
    location: "Head Office / Victoria Island",
    keyResponsibilities: ["BOQ preparation & measurement", "Rate analysis & cost control", "Subcontractor valuations & IPCs", "Final account closeout"],
  },
  {
    id: "dept-02",
    name: "Project Engineering & Site Ops",
    code: "ENG",
    headOfDept: "Engr. Tayo (Site Director)",
    staffCount: 18,
    location: "Horizon Towers Site Office",
    keyResponsibilities: ["Daily site execution & diary", "Structural QA/QC inspections", "Trade coordination & productivity", "HSE safety enforcement"],
  },
  {
    id: "dept-03",
    name: "Procurement & Supply Chain",
    code: "PRC",
    headOfDept: "Kelechi (Head of Procurement)",
    staffCount: 5,
    location: "Central Depot & Head Office",
    keyResponsibilities: ["3-way match validation", "Vetted vendor prequalification", "Bulk buying & rebates", "Logistics & site delivery dispatch"],
  },
  {
    id: "dept-04",
    name: "Finance, Treasury & Accounts",
    code: "FIN",
    headOfDept: "Ngozi (Financial Controller)",
    staffCount: 4,
    location: "Head Office / Victoria Island",
    keyResponsibilities: ["Disbursement ledger management", "Bank guarantees (APG) & escrow", "Statutory tax & FIRS filings", "Cash flow forecasting"],
  },
  {
    id: "dept-05",
    name: "Executive & Legal Governance",
    code: "EXEC",
    headOfDept: "Snow Ibrahim Imam (Managing Director)",
    staffCount: 3,
    location: "Boardroom & Regional Offices",
    keyResponsibilities: ["Corporate strategy & capital allocation", "Regulatory compliance & licensing", "High-tier client relationships", "Company-wide approvals"],
  },
];

const INITIAL_POLICIES: PolicyDocument[] = [
  {
    id: "pol-01",
    code: "POL-PRC-3WAY",
    title: "Mandatory 3-Way Match & Procurement Gate Policy",
    category: "Procurement & Commercial",
    effectiveDate: "2024-02-01",
    version: "v3.2",
    reviewCycle: "Annual",
    complianceRate: 100,
    summary: "No invoice may be settled by Treasury unless matched against an approved PO and a verified physical Goods Received Note (GRN) stamped by the site storekeeper.",
  },
  {
    id: "pol-02",
    code: "POL-FIN-CAPEX",
    title: "Capital Expenditure & Delegation of Financial Authority (DOA)",
    category: "Financial Controls",
    effectiveDate: "2024-01-10",
    version: "v2.0",
    reviewCycle: "Annual",
    complianceRate: 98,
    summary: "Site purchases up to N250,000 require Site Manager signoff; N250K-N2M requires Chief QS; N2M-N10M requires Financial Controller; above N10M requires Managing Director authorization.",
  },
  {
    id: "pol-03",
    code: "POL-HSE-ZERO",
    title: "Site Health, Safety & Environmental Zero-Harm Standard",
    category: "HSE & Site Safety",
    effectiveDate: "2024-03-15",
    version: "v4.0",
    reviewCycle: "Quarterly",
    complianceRate: 95,
    summary: "Mandatory daily toolbox briefings, full PPE enforcement, zero toleration for working at heights without certified harnesses and scuffled scaffolding.",
  },
  {
    id: "pol-04",
    code: "POL-CON-RETENTION",
    title: "Subcontractor 10% Defect Liability Retention Protocol",
    category: "Procurement & Commercial",
    effectiveDate: "2024-06-01",
    version: "v1.8",
    reviewCycle: "Bi-Annual",
    complianceRate: 100,
    summary: "Standard 10% retention withheld from all interim claims. 50% released at Practical Completion; 50% released following 6-month defects liability inspection.",
  },
];

const INITIAL_COMPLIANCE: ComplianceRecord[] = [
  {
    id: "comp-01",
    statutoryBody: "Lagos State Building Control Agency (LASBCA)",
    permitTitle: "Development Construction Permit #LASBCA/ET/2024/091",
    certificateNumber: "LAS-2024-0914-ET",
    status: "Valid & Current",
    expiryDate: "2027-04-10",
    daysRemaining: 562,
    relevance: "Permits structural superstructure erection on Horizon Towers site.",
  },
  {
    id: "comp-02",
    statutoryBody: "Council for Regulation of Engineering in Nigeria (COREN)",
    permitTitle: "Corporate Practicing Certificate (Civil & Structural)",
    certificateNumber: "COREN/FIRM/2026/0881",
    status: "Valid & Current",
    expiryDate: "2026-12-31",
    daysRemaining: 97,
    relevance: "Mandatory corporate registration for consulting and contracting in Nigeria.",
  },
  {
    id: "comp-03",
    statutoryBody: "Federal Inland Revenue Service (FIRS)",
    permitTitle: "Corporate Tax Clearance Certificate (TCC)",
    certificateNumber: "TCC-FIRS-2026-092284",
    status: "Valid & Current",
    expiryDate: "2026-12-31",
    daysRemaining: 97,
    relevance: "Required for state and federal tender prequalification and banking credit lines.",
  },
  {
    id: "comp-04",
    statutoryBody: "Federal Ministry of Environment",
    permitTitle: "Environmental Impact Assessment (EIA) Approval",
    certificateNumber: "FMENV/EIA/2024/LKG-011",
    status: "Valid & Current",
    expiryDate: "2029-08-01",
    daysRemaining: 1040,
    relevance: "Covers coastal drainage, soil stability, and acoustic threshold limits.",
  },
  {
    id: "comp-05",
    statutoryBody: "Nigeria Social Insurance Trust Fund (NSITF)",
    permitTitle: "Employees Compensation Scheme Compliance Certificate",
    certificateNumber: "NSITF-ECS-2026-38291",
    status: "Expiring Soon",
    expiryDate: "2026-11-01",
    daysRemaining: 37,
    relevance: "Statutory mandatory coverage for all site tradesmen, artisans, and supervisory staff.",
  },
];

export function DocumentsAdminView() {
  const { activeRole } = useApp();
  const [activeTab, setActiveTab] = useState<"documents" | "approvals" | "structure" | "policies" | "compliance">("documents");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<CorporateDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [documents, setDocuments] = useState<CorporateDocument[]>(INITIAL_DOCUMENTS);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);

  // New Document Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<DocumentCategory>("Company Documents");
  const [newDocNum, setNewDocNum] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAccess, setNewAccess] = useState<CorporateDocument["accessLevel"]>("Executive & Commercial");
  const [newDept, setNewDept] = useState("Commercial & QS");
  const [newExpiry, setNewExpiry] = useState("");

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.docNumber.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [documents, categoryFilter, searchQuery]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDocNum.trim()) return;

    const newDoc: CorporateDocument = {
      id: `doc-${Date.now()}`,
      docNumber: newDocNum.toUpperCase(),
      title: newTitle,
      category: newCategory,
      description: newDesc || "Uploaded via Document Control Hub",
      version: "v1.0",
      fileSize: "2.4 MB",
      fileType: "PDF",
      uploadedBy: `Corporate Admin (${activeRole})`,
      uploadedAt: new Date().toISOString().split("T")[0],
      expiryDate: newExpiry || undefined,
      flowStage: "Store",
      status: "Active",
      accessLevel: newAccess,
      department: newDept,
      historyCount: 1,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setShowUploadModal(false);
    setNewTitle("");
    setNewDocNum("");
    setNewDesc("");
    setNewExpiry("");
  };

  const handleApprove = (appId: string) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: "Approved" } : app))
    );
  };

  const handleReject = (appId: string) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: "Rejected" } : app))
    );
  };

  const flowSteps: DocumentFlowStage[] = [
    "Create/Receive",
    "Store",
    "Review",
    "Approve",
    "Use",
    "Update",
    "Archive",
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Stated Flow */}
      <div className="bg-[#0A2540] dark:bg-[#071324] border-2 border-[#0A2540] dark:border-white/10 rounded-2xl p-7 md:p-9 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-white/10 text-white rounded-lg border border-white/20 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5" />
                Flow 5.8 · Corporate Governance
              </span>
              <span className="text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                Documents &amp; Administration
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Corporate Document Control &amp; Administration
            </h1>
            <p className="text-sm md:text-base text-white/80 mt-2 max-w-3xl leading-relaxed">
              Company-wide document repositories, regulatory compliance, multi-tier approvals, organizational hierarchy, and verified policies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="min-h-[46px] px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#0A2540] rounded-xl text-sm font-black flex items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0A2540]" />
              <span>Upload &amp; Register Doc</span>
            </button>
          </div>
        </div>

        {/* Stated Flow Bar */}
        <div className="mt-8 pt-6 border-t-2 border-white/10">
          <div className="text-xs uppercase font-black tracking-wider text-white/60 mb-3 flex items-center gap-2">
            <span>The Administration Flow:</span>
            <span className="text-amber-400 font-mono">Create/Receive → Store → Review → Approve → Use → Update → Archive</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {flowSteps.map((step, idx) => {
              const isSelected = selectedDoc?.flowStage === step;
              return (
                <div
                  key={step}
                  className={`p-2.5 rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-amber-400 text-[#0A2540] border-amber-400 font-black shadow-md scale-105"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase opacity-75">Step 0{idx + 1}</div>
                  <div className="text-xs font-black truncate w-full">{step}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Top-Level Tab Switcher */}
      <div className="flex items-center gap-2 border-b-2 border-[#E5E5DE] dark:border-white/10 pb-1 overflow-x-auto">
        {[
          { id: "documents", label: "Documents & Records Control", icon: FileText, count: documents.length },
          { id: "approvals", label: "Company Approvals Hub", icon: FileCheck2, count: approvals.filter(a => a.status === "Pending Review").length },
          { id: "structure", label: "Company Structure", icon: Building2 },
          { id: "policies", label: "Policies & Procedures", icon: BookOpen, count: INITIAL_POLICIES.length },
          { id: "compliance", label: "Statutory Compliance", icon: ShieldCheck, count: INITIAL_COMPLIANCE.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-black whitespace-nowrap transition-all cursor-pointer border-2 ${
                isActive
                  ? "bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] border-[#0A2540] dark:border-amber-400 shadow-sm"
                  : "bg-white dark:bg-[#0D2137] text-[#0A2540]/70 dark:text-slate-300 border-[#E5E5DE] dark:border-white/10 hover:border-[#0A2540]/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-mono ${
                    isActive
                      ? "bg-white/20 dark:bg-[#0A2540]/20 text-white dark:text-[#0A2540]"
                      : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: DOCUMENTS & RECORDS CONTROL */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-black uppercase text-[#0A2540]/60 dark:text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {[
                "All",
                "Company Documents",
                "Contracts & Agreements",
                "Legal Documents",
                "Financial Documents",
                "Correspondence",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border ${
                    categoryFilter === cat
                      ? "bg-[#0A2540] text-white border-[#0A2540] dark:bg-white dark:text-[#0A2540] dark:border-white"
                      : "bg-[#FAF9F5] dark:bg-[#071324] text-[#0A2540]/70 dark:text-slate-300 border-[#E5E5DE] dark:border-white/10 hover:border-[#0A2540]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search doc number, title, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F5] dark:bg-[#071324] border-b-2 border-[#E5E5DE] dark:border-white/10 text-[11px] font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-slate-400">
                    <th className="p-4">Document Number &amp; Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Version</th>
                    <th className="p-4">Flow Stage</th>
                    <th className="p-4">Access Level</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5DE] dark:divide-white/10 text-xs font-semibold">
                  {filteredDocuments.map((doc) => {
                    const isSelected = selectedDoc?.id === doc.id;
                    return (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`transition-colors cursor-pointer hover:bg-amber-500/5 ${
                          isSelected ? "bg-amber-500/10 font-bold" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-white mt-0.5">
                              <FileText className="w-4 h-4 text-[#0A2540] dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="font-mono text-[11px] font-black text-[#0A2540]/60 dark:text-slate-400">
                                {doc.docNumber}
                              </div>
                              <div className="text-sm font-black text-[#0A2540] dark:text-white">
                                {doc.title}
                              </div>
                              <div className="text-[11px] text-[#0A2540]/60 dark:text-slate-400 mt-0.5 line-clamp-1">
                                {doc.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-slate-300">
                            {doc.category}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-[#0A2540] dark:text-white">
                          {doc.version}
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                            {doc.flowStage}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#0A2540]/80 dark:text-slate-300">
                            <Lock className="w-3 h-3 text-[#0A2540]/50 dark:text-slate-400" />
                            {doc.accessLevel}
                          </span>
                        </td>

                        <td className="p-4">
                          {doc.expiryDate ? (
                            <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                              {doc.expiryDate}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Perpetual</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDoc(doc);
                              }}
                              className="px-3 py-1.5 bg-[#FAF9F5] dark:bg-[#071324] hover:bg-[#F2F1EC] dark:hover:bg-white/10 border border-[#E5E5DE] dark:border-white/10 rounded-lg text-xs font-bold text-[#0A2540] dark:text-white flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Downloading official authenticated copy of ${doc.docNumber}...`);
                              }}
                              className="p-1.5 bg-[#FAF9F5] dark:bg-[#071324] hover:bg-[#F2F1EC] dark:hover:bg-white/10 border border-[#E5E5DE] dark:border-white/10 rounded-lg text-[#0A2540] dark:text-white"
                              title="Download document"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Document Detail Card */}
          {selectedDoc && (
            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#0A2540] dark:border-amber-400/40 rounded-2xl p-6 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[#E5E5DE] dark:border-white/10 gap-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#0A2540]/60 dark:text-slate-400">
                    <span>{selectedDoc.docNumber}</span>
                    <span>·</span>
                    <span>{selectedDoc.version}</span>
                    <span>·</span>
                    <span>{selectedDoc.fileSize} ({selectedDoc.fileType})</span>
                  </div>
                  <h3 className="text-xl font-black text-[#0A2540] dark:text-white mt-1">
                    {selectedDoc.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-black uppercase">
                    Status: {selectedDoc.status}
                  </span>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10">
                  <div className="text-[10px] uppercase font-black text-[#0A2540]/60 dark:text-slate-400">Lifecycle Flow Stage</div>
                  <div className="text-sm font-black text-amber-600 dark:text-amber-400 mt-1">{selectedDoc.flowStage}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10">
                  <div className="text-[10px] uppercase font-black text-[#0A2540]/60 dark:text-slate-400">Custodial Department</div>
                  <div className="text-sm font-black text-[#0A2540] dark:text-white mt-1">{selectedDoc.department}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10">
                  <div className="text-[10px] uppercase font-black text-[#0A2540]/60 dark:text-slate-400">Access Classification</div>
                  <div className="text-sm font-black text-[#0A2540] dark:text-white mt-1">{selectedDoc.accessLevel}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10">
                  <div className="text-[10px] uppercase font-black text-[#0A2540]/60 dark:text-slate-400">Uploaded By</div>
                  <div className="text-sm font-black text-[#0A2540] dark:text-white mt-1">{selectedDoc.uploadedBy}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-[#0A2540] dark:text-slate-200">
                <strong>Description &amp; Context:</strong> {selectedDoc.description}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB B: COMPANY APPROVALS HUB */}
      {activeTab === "approvals" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xl font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-500" />
              Company-Wide Request &amp; Approval Queue
            </h3>
            <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-1">
              Multi-tier governance protocol for capital expenditures, site variation orders, and subcontractor payment releases.
            </p>
          </div>

          <div className="grid gap-4">
            {approvals.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-slate-300">
                      {app.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Submitted: {app.submittedDate} by {app.submittedBy}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        app.priority === "Urgent"
                          ? "bg-rose-500 text-white"
                          : "bg-amber-400 text-[#0A2540]"
                      }`}
                    >
                      {app.priority}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-[#0A2540] dark:text-white">
                    {app.title}
                  </h4>
                  <p className="text-xs text-[#0A2540]/70 dark:text-slate-300">
                    {app.description}
                  </p>

                  {/* Multi-tier Approval Chain */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-black text-slate-400 uppercase">Approval Chain:</span>
                    {app.approvers.map((apr, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                          apr.signed
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                            : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {apr.signed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{apr.name} ({apr.role})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[200px]">
                  {app.amount !== undefined && (
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-black text-[#0A2540]/60 dark:text-slate-400">Total Commitment</div>
                      <div className="text-2xl font-black font-mono text-[#0A2540] dark:text-white">
                        {formatCurrency(app.amount)}
                      </div>
                    </div>
                  )}

                  {app.status === "Pending Review" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(app.id)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-black cursor-pointer"
                      >
                        Reject / Revise
                      </button>
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Authorize &amp; Sign</span>
                      </button>
                    </div>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-black uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Status: {app.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: COMPANY STRUCTURE */}
      {activeTab === "structure" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xl font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              Organizational &amp; Departmental Hierarchy
            </h3>
            <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-1">
              Operational reporting units, operational centers, department heads, and functional responsibilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-4 hover:border-[#0A2540]/40 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DE] dark:border-white/10">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-black bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-slate-300">
                    Dept: {dept.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {dept.staffCount} Staff
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-[#0A2540] dark:text-white">
                    {dept.name}
                  </h4>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                    HOD: {dept.headOfDept}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Location: {dept.location}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E5E5DE] dark:border-white/10 space-y-1.5">
                  <div className="text-[10px] font-black uppercase text-slate-400">Core Functions</div>
                  {dept.keyResponsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#0A2540]/80 dark:text-slate-300">
                      <ChevronRight className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB D: POLICIES & PROCEDURES */}
      {activeTab === "policies" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xl font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Standard Operating Procedures (SOPs) &amp; Company Rules
            </h3>
            <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-1">
              Authoritative governing guidelines for financial commitments, procurement gates, site safety, and subcontractor administration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {INITIAL_POLICIES.map((pol) => (
              <div
                key={pol.id}
                className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DE] dark:border-white/10">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {pol.code} · {pol.version}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    {pol.complianceRate}% Compliance
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                    {pol.category}
                  </div>
                  <h4 className="text-lg font-black text-[#0A2540] dark:text-white mt-0.5">
                    {pol.title}
                  </h4>
                  <p className="text-xs text-[#0A2540]/80 dark:text-slate-300 mt-2 leading-relaxed">
                    {pol.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E5DE] dark:border-white/10 flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Review Cycle: {pol.reviewCycle}</span>
                  <span>Effective: {pol.effectiveDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB E: STATUTORY COMPLIANCE */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xl font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Statutory, Regulatory &amp; Licensing Compliance
            </h3>
            <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-1">
              Continuous monitoring of mandatory governmental permits, professional practice licenses, and tax statuses.
            </p>
          </div>

          <div className="grid gap-4">
            {INITIAL_COMPLIANCE.map((comp) => (
              <div
                key={comp.id}
                className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase">
                      {comp.statutoryBody}
                    </span>
                    <span className="text-slate-400 font-mono text-xs">· Cert #{comp.certificateNumber}</span>
                  </div>
                  <h4 className="text-base font-black text-[#0A2540] dark:text-white">
                    {comp.permitTitle}
                  </h4>
                  <p className="text-xs text-[#0A2540]/70 dark:text-slate-300">
                    {comp.relevance}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase text-slate-400">Validity Expiry</div>
                    <div className="text-sm font-black font-mono text-[#0A2540] dark:text-white">
                      {comp.expiryDate}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-0.5">
                      {comp.daysRemaining} days remaining
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border ${
                      comp.status === "Valid & Current"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#0A2540] dark:border-amber-400/40 rounded-2xl w-full max-w-xl p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#E5E5DE] dark:border-white/10">
              <h3 className="text-xl font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                Upload &amp; Register Corporate Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#0A2540] dark:text-white mb-1.5 uppercase text-[10px] tracking-wider">
                  Document Reference Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DOC-CAC-2026-002"
                  value={newDocNum}
                  onChange={(e) => setNewDocNum(e.target.value)}
                  className="w-full p-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-[#0A2540] dark:text-white mb-1.5 uppercase text-[10px] tracking-wider">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Environmental Impact Assessment Renewal Approval"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0A2540] dark:text-white mb-1.5 uppercase text-[10px] tracking-wider">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                  >
                    <option value="Company Documents">Company Documents</option>
                    <option value="Contracts & Agreements">Contracts &amp; Agreements</option>
                    <option value="Legal Documents">Legal Documents</option>
                    <option value="Financial Documents">Financial Documents</option>
                    <option value="Correspondence">Correspondence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#0A2540] dark:text-white mb-1.5 uppercase text-[10px] tracking-wider">
                    Access Level
                  </label>
                  <select
                    value={newAccess}
                    onChange={(e) => setNewAccess(e.target.value as any)}
                    className="w-full p-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                  >
                    <option value="Company-Wide">Company-Wide</option>
                    <option value="Executive & Commercial">Executive &amp; Commercial</option>
                    <option value="Board & Legal">Board &amp; Legal</option>
                    <option value="Site Operations">Site Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0A2540] dark:text-white mb-1.5 uppercase text-[10px] tracking-wider">
                    Custodial Department
                  </label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-[#0A2540] dark:text-white mb-1.5 uppercase text-[10px] tracking-wider">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full p-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0A2540] dark:text-white mb-1.5 uppercase text-[10px] tracking-wider">
                  Description &amp; Purpose
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of document purpose and governing legal framework..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0A2540] text-xs font-black shadow-md cursor-pointer"
                >
                  Register Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
