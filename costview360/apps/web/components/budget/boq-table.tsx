"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Edit3,
  Trash2,
  FileCheck,
  AlertCircle,
  Download,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldAlert,
  Clock,
  Layers,
  Check,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import { BOQImportModal } from "./boq-import-modal";

export interface BOQRecord {
  id: string;
  code: string;
  description: string;
  category: "Material" | "Labour" | "Plant" | "Subcontractor";
  unit: string;
  quantity: number;
  rate: number;
  budgetAmount: number;
  committedAmount: number;
  actualAmount: number;
  varianceNote?: string;
}

export interface RiskAlert {
  id: string;
  itemCode: string;
  description: string;
  variancePercentage: number;
  severity: "High" | "Medium" | "Low";
  isHandled: boolean;
  handledBy?: string;
  handledAt?: string;
}

export interface BudgetRevision {
  id: string;
  boqItemId: string;
  boqItemCode: string;
  deltaAmount: number;
  reason: string;
  requestedBy: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

const INITIAL_BOQ: BOQRecord[] = [
  {
    id: "boq-1",
    code: "SUB-01.01",
    description: "Excavation and earthwork disposal offsite",
    category: "Plant",
    unit: "m³",
    quantity: 1250,
    rate: 18500,
    budgetAmount: 23125000,
    committedAmount: 21500000,
    actualAmount: 19800000,
  },
  {
    id: "boq-2",
    code: "CON-02.01",
    description: "Grade 30 reinforced concrete for foundation raft & plinth beams",
    category: "Material",
    unit: "m³",
    quantity: 480,
    rate: 195000,
    budgetAmount: 93600000,
    committedAmount: 94000000,
    actualAmount: 62000000,
  },
  {
    id: "boq-3",
    code: "STL-02.03",
    description: "High-yield deformed reinforcement bars (12mm, 16mm, 20mm)",
    category: "Material",
    unit: "Tons",
    quantity: 65,
    rate: 1450000,
    budgetAmount: 94250000,
    committedAmount: 94250000,
    actualAmount: 85000000,
  },
  {
    id: "boq-4",
    code: "BLK-03.01",
    description: "225mm vibrated hollow sandcrete blockwork in cement mortar (1:4)",
    category: "Material",
    unit: "m²",
    quantity: 3200,
    rate: 11200,
    budgetAmount: 35840000,
    committedAmount: 33000000,
    actualAmount: 24500000,
  },
  {
    id: "boq-5",
    code: "LAB-01.02",
    description: "Structural steel fixing and formwork carpenters gang attendance",
    category: "Labour",
    unit: "Man-days",
    quantity: 600,
    rate: 12500,
    budgetAmount: 7500000,
    committedAmount: 7500000,
    actualAmount: 5100000,
  },
  {
    id: "boq-6",
    code: "MEP-04.01",
    description: "First fix electrical conduit pipes & heavy-duty distribution boards",
    category: "Subcontractor",
    unit: "Item",
    quantity: 1,
    rate: 45000000,
    budgetAmount: 45000000,
    committedAmount: 42000000,
    actualAmount: 20000000,
  },
];

const INITIAL_RISKS: RiskAlert[] = [
  {
    id: "risk-1",
    itemCode: "CON-02.01",
    description: "Concrete market rate surging due to diesel delivery surcharge (+5.8%).",
    variancePercentage: 5.8,
    severity: "High",
    isHandled: false,
  },
  {
    id: "risk-2",
    itemCode: "STL-02.03",
    description: "Foreign exchange volatility on imported billet rebar quotes (+4.2%).",
    variancePercentage: 4.2,
    severity: "Medium",
    isHandled: false,
  },
  {
    id: "risk-3",
    itemCode: "BLK-03.01",
    description: "Blockwork breakages during unloading on Grid Line C exceeds 3% allowance.",
    variancePercentage: 3.1,
    severity: "Low",
    isHandled: true,
    handledBy: "Engr. Tayo (Site Eng)",
    handledAt: "2026-09-06 14:20",
  },
];

const INITIAL_REVISIONS: BudgetRevision[] = [
  {
    id: "rev-1",
    boqItemId: "boq-2",
    boqItemCode: "CON-02.01",
    deltaAmount: 4000000,
    reason: "Escalation in ReadyMix batching plant tariff signed by Consultant QS.",
    requestedBy: "Mrs. Nkechi (QS)",
    status: "Pending",
    createdAt: "2026-09-07 11:42",
  },
  {
    id: "rev-2",
    boqItemId: "boq-6",
    boqItemCode: "MEP-04.01",
    deltaAmount: 3500000,
    reason: "Approved Variation VO-2026-001 relocation of water treatment annex.",
    requestedBy: "Architect David",
    status: "Approved",
    createdAt: "2026-09-05 09:15",
  },
];

export function BOQTable({
  initialSubTab = "master",
  onTabChange,
}: {
  initialSubTab?: string;
  onTabChange?: (tab: string) => void;
} = {}) {
  const { currency, activeRole } = useApp();
  const normalizedInitial =
    initialSubTab === "boq" ? "master" : (initialSubTab as any) || "master";
  const [activeSubTab, setActiveSubTab] = useState<"master" | "risks" | "revisions" | "finalAccount">(
    normalizedInitial === "import" ? "master" : (["master", "risks", "revisions", "finalAccount"].includes(normalizedInitial) ? normalizedInitial : "master")
  );

  useEffect(() => {
    if (initialSubTab) {
      if (initialSubTab === "import") {
        setIsImportModalOpen(true);
        setActiveSubTab("master");
      } else if (initialSubTab === "boq") {
        setActiveSubTab("master");
      } else if (["master", "risks", "revisions", "finalAccount"].includes(initialSubTab)) {
        setActiveSubTab(initialSubTab as any);
      }
    }
  }, [initialSubTab]);

  const handleSubTabChange = (tab: "master" | "risks" | "revisions" | "finalAccount") => {
    setActiveSubTab(tab);
    if (onTabChange) onTabChange(tab === "master" ? "boq" : tab);
  };

  const [items, setItems] = useState<BOQRecord[]>(INITIAL_BOQ);
  const [risks, setRisks] = useState<RiskAlert[]>(INITIAL_RISKS);
  const [revisions, setRevisions] = useState<BudgetRevision[]>(INITIAL_REVISIONS);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [thresholdPercent] = useState<number>(5.0); // PRD recommendation: ±5% threshold

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isVarianceNoteOpen, setIsVarianceNoteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BOQRecord | null>(null);

  // Forms
  const [editingItem, setEditingItem] = useState<BOQRecord | null>(null);
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<BOQRecord["category"]>("Material");
  const [newUnit, setNewUnit] = useState("m²");
  const [newQty, setNewQty] = useState<number>(100);
  const [newRate, setNewRate] = useState<number>(5000);

  const [revisionDelta, setRevisionDelta] = useState<number>(0);
  const [revisionReason, setRevisionReason] = useState("");
  const [varianceNoteText, setVarianceNoteText] = useState("");

  // Live Supabase integration
  useEffect(() => {
    async function fetchBOQItems() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("boq_items")
          .select("*")
          .order("item_code", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: BOQRecord[] = data.map((d: any) => ({
            id: d.id,
            code: d.item_code,
            description: d.description,
            category: (d.category as BOQRecord["category"]) || "Material",
            unit: d.unit,
            quantity: Number(d.quantity),
            rate: Number(d.rate),
            budgetAmount: Number(d.budget_amount),
            committedAmount: Number(d.committed_amount || 0),
            actualAmount: Number(d.actual_amount || 0),
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.warn("Using offline/fallback BOQ seed dataset.", err);
      }
    }
    fetchBOQItems();
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  // 1. Create item (PRD Missing Checklist #1)
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: BOQRecord = {
      id: `boq-${Date.now()}`,
      code: newCode,
      description: newDesc,
      category: newCategory,
      unit: newUnit,
      quantity: Number(newQty),
      rate: Number(newRate),
      budgetAmount: Number(newQty) * Number(newRate),
      committedAmount: 0,
      actualAmount: 0,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);

    // Persist to Supabase if connected
    try {
      const supabase = createClient();
      await supabase.from("boq_items").insert({
        project_id: "22222222-2222-2222-2222-222222222222",
        item_code: newCode,
        description: newDesc,
        category: newCategory,
        unit: newUnit,
        quantity: Number(newQty),
        rate: Number(newRate),
        budget_amount: Number(newQty) * Number(newRate),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Edit item (PRD Missing Checklist #1)
  const handleOpenEdit = (item: BOQRecord) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setItems((prev) =>
      prev.map((it) => (it.id === editingItem.id ? editingItem : it))
    );
    setIsEditModalOpen(false);
  };

  // 3. Delete item (PRD Missing Checklist #1)
  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this BOQ item from the project budget?")) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  // 4. Mark Risk Alert as Handled (PRD Missing Checklist #2)
  const handleToggleRiskHandled = (id: string) => {
    setRisks((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const handled = !r.isHandled;
          return {
            ...r,
            isHandled: handled,
            handledBy: handled ? activeRole : undefined,
            handledAt: handled ? new Date().toISOString().replace("T", " ").substring(0, 16) : undefined,
          };
        }
        return r;
      })
    );
  };

  // 5. Submit Revision (PRD Missing Checklist #3)
  const handleOpenRevision = (item: BOQRecord) => {
    setSelectedItem(item);
    setRevisionReason("");
    setRevisionDelta(0);
    setIsRevisionModalOpen(true);
  };

  const handleApplyRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newRev: BudgetRevision = {
      id: `rev-${Date.now()}`,
      boqItemId: selectedItem.id,
      boqItemCode: selectedItem.code,
      deltaAmount: revisionDelta,
      reason: revisionReason,
      requestedBy: activeRole,
      status: "Pending",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setRevisions((prev) => [newRev, ...prev]);
    setIsRevisionModalOpen(false);
  };

  // 6. Approve / Reject Revision (PRD Missing Checklist #3)
  const handleUpdateRevisionStatus = (id: string, newStatus: "Approved" | "Rejected") => {
    setRevisions((prev) =>
      prev.map((rev) => {
        if (rev.id === id) {
          if (newStatus === "Approved") {
            // Apply delta automatically to approved budget!
            setItems((boqPrev) =>
              boqPrev.map((b) =>
                b.id === rev.boqItemId
                  ? { ...b, budgetAmount: b.budgetAmount + rev.deltaAmount }
                  : b
              )
            );
          }
          return { ...rev, status: newStatus };
        }
        return rev;
      })
    );
  };

  // 7. Save Variance Note in Final Account (PRD Missing Checklist #4)
  const handleOpenVarianceNote = (item: BOQRecord) => {
    setSelectedItem(item);
    setVarianceNoteText(item.varianceNote || "");
    setIsVarianceNoteOpen(true);
  };

  const handleSaveVarianceNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedItem.id ? { ...it, varianceNote: varianceNoteText } : it
      )
    );
    setIsVarianceNoteOpen(false);
  };

  return (
    <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl shadow-sm overflow-hidden">

      {/* TAB 1: BOQ MASTER */}
      {activeSubTab === "master" && (
        <>
          {/* Table Toolbar */}
          <div className="p-4 border-b-2 border-[#E5E5DE] bg-white flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 md:max-w-xs">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/60" />
                <input
                  type="text"
                  placeholder="Search code or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3.5 h-11 bg-white border-2 border-[#E5E5DE] rounded-xl text-sm font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                />
              </div>

              <div className="flex items-center gap-2 bg-white border-2 border-[#E5E5DE] rounded-xl px-3.5 h-11 shadow-xs">
                <Filter className="w-4 h-4 text-[#0A2540]/60" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-sm font-bold text-[#0A2540] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-white">All Categories</option>
                  <option value="Material" className="bg-white">Materials</option>
                  <option value="Labour" className="bg-white">Labour</option>
                  <option value="Plant" className="bg-white">Plant &amp; Machinery</option>
                  <option value="Subcontractor" className="bg-white">Subcontractor</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#0A2540] bg-[#FAF9F5] border-2 border-[#E5E5DE] px-3.5 h-11 rounded-xl shadow-xs">
                <span className="uppercase tracking-wider text-[#0A2540]/60 text-[10px]">Threshold:</span>
                <span className="text-emerald-700 font-mono font-black">±{thresholdPercent}%</span>
              </div>
              <button
                type="button"
                onClick={() => onTabChange?.("estimator")}
                title="Launch AI Parametric Feasibility Estimator"
                className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300 rounded-xl px-4 h-11 text-xs font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>AI Estimator</span>
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 bg-[#FAF9F5] hover:bg-[#F2F1EC] text-[#0A2540] border-2 border-[#E5E5DE] rounded-xl px-4 h-11 text-xs font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0A2540] rotate-180" />
                <span>Import BOQ / CSV</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl px-5 h-11 text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add BOQ Item</span>
              </button>
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#E5E5DE] bg-[#FAF9F5] text-[#0A2540] font-black uppercase text-xs tracking-wider">
                  <th className="py-4 px-4">Cost Code</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-3">Category</th>
                  <th className="py-4 px-3">Unit</th>
                  <th className="py-4 px-3 text-right">Qty</th>
                  <th className="py-4 px-3 text-right">Rate</th>
                  <th className="py-4 px-4 text-right">Approved Budget</th>
                  <th className="py-4 px-4 text-right">Committed (POs)</th>
                  <th className="py-4 px-4 text-right">Variance</th>
                  <th className="py-4 px-3 text-center">Status</th>
                  <th className="py-4 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5DE] text-slate-900">
                {filteredItems.map((item) => {
                  const variance = item.budgetAmount - item.committedAmount;
                  const varianceRatio = item.budgetAmount > 0 ? (item.committedAmount - item.budgetAmount) / item.budgetAmount : 0;
                  
                  // PRD Question 1: ±5% threshold indicator
                  const isOverBudget = item.committedAmount > item.budgetAmount;
                  const isThresholdExceeded = Math.abs(varianceRatio) > (thresholdPercent / 100);
                  
                  let statusColor = "bg-emerald-50 text-emerald-800 border-emerald-300";
                  let statusLabel = "On Track";

                  if (isOverBudget && isThresholdExceeded) {
                    statusColor = "bg-rose-50 text-rose-800 border-rose-300 font-bold";
                    statusLabel = "Over Threshold";
                  } else if (isOverBudget) {
                    statusColor = "bg-amber-50 text-amber-900 border-amber-300 font-bold";
                    statusLabel = "Over Budget";
                  } else if (item.committedAmount > 0) {
                    statusColor = "bg-blue-50 text-[#0A2540] border-blue-200 font-bold";
                    statusLabel = "Committed";
                  }

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FAF9F5] transition-colors group text-sm"
                    >
                      <td className="py-4 px-4 font-mono font-black text-[#0A2540] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{item.code}</span>
                          {isThresholdExceeded && (
                            <AlertCircle className="w-4 h-4 text-rose-600 inline shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800 max-w-sm">
                        {item.description}
                      </td>
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#E5E5DE] bg-white text-[#0A2540]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-[#0A2540]/80 font-bold">{item.unit}</td>
                      <td className="py-4 px-3 text-right font-mono font-black text-[#0A2540]">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="py-4 px-3 text-right font-mono font-black text-[#0A2540]">
                        {formatCurrency(item.rate, currency)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-black text-[#0A2540] whitespace-nowrap">
                        {formatCurrency(item.budgetAmount, currency)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-black text-[#0A2540] whitespace-nowrap">
                        {formatCurrency(item.committedAmount, currency)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono whitespace-nowrap">
                        <span className={`font-black ${variance < 0 ? "text-rose-600" : "text-emerald-700"}`}>
                          {formatCurrency(variance, currency)}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenRevision(item)}
                            title="Request Revision"
                            className="p-2 text-[#0A2540]/70 hover:text-[#0A2540] hover:bg-[#FAF9F5] border border-transparent hover:border-[#E5E5DE] rounded-lg transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Item Details"
                            className="p-2 text-[#0A2540]/70 hover:text-[#0A2540] hover:bg-[#FAF9F5] border border-transparent hover:border-[#E5E5DE] rounded-lg transition-all"
                          >
                            <FileCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            title="Delete Item"
                            className="p-2 text-[#0A2540]/70 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 2: COST CONTROL & RISK ALERTS (PRD Item 2) */}
      {activeSubTab === "risks" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Cost Control Exceptions & Trending Risks</span>
              </h3>
              <p className="text-xs font-bold text-slate-900/60 mt-0.5">
                System flagged cost rate escalations and site breakages beyond ±5% allowance.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-900/60 font-mono">
              {risks.filter((r) => r.isHandled).length} Handled / {risks.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className={`p-4 border border-slate-200/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  risk.isHandled
                    ? "bg-white opacity-60"
                    : "bg-white shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border mt-0.5 ${
                    risk.severity === "High"
                      ? "bg-rose-50 text-rose-600 border-rose-200"
                      : risk.severity === "Medium"
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : "bg-[#FAF9F5] text-[#0A2540] border-[#E5E5DE]"
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-slate-900 text-xs">{risk.itemCode}</span>
                      <span className="text-slate-900/40">·</span>
                      <span className="text-xs uppercase font-bold bg-[#FAF9F5] text-[#0A2540] border border-[#E5E5DE] px-2 py-0.5 rounded">
                        +{risk.variancePercentage}% Variance
                      </span>
                    </div>
                    <p className="text-xs text-slate-900 font-bold">{risk.description}</p>
                    {risk.isHandled && (
                      <p className="text-xs text-slate-900/60 font-medium mt-1">
                        Handled by <strong className="text-slate-900">{risk.handledBy}</strong> on {risk.handledAt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleToggleRiskHandled(risk.id)}
                    className={`px-4 py-2 text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all border border-slate-200/80 shadow-xs active:scale-[0.98] ${
                      risk.isHandled
                        ? "bg-white hover:bg-white text-slate-900"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {risk.isHandled ? (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Re-open Risk</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as Handled</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUDGET REVISIONS REGISTER (PRD Item 3) */}
      {activeSubTab === "revisions" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Budget Revisions & Approval Trail</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Approved revisions automatically update the approved budget baseline (PRD Section 1.5).
              </p>
            </div>
            <button
              onClick={() => {
                if (items.length > 0) handleOpenRevision(items[0]);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Revision</span>
            </button>
          </div>

          <div className="divide-y-[3px] divide-navy-800/20">
            {revisions.map((rev) => (
              <div key={rev.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/40 px-3 transition-colors border-b-2 border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-emerald-600 text-xs">{rev.boqItemCode}</span>
                    <span className="text-slate-900/40">·</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {rev.deltaAmount >= 0 ? "+" : ""}{formatCurrency(rev.deltaAmount, currency)}
                    </span>
                    <span className="text-slate-900/40">·</span>
                    <span className={`px-2.5 py-0.5 text-xs font-bold tracking-wide border ${
                      rev.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : rev.status === "Rejected"
                        ? "bg-red-100 text-red-900 border-slate-200/80"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {rev.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-900 font-bold">{rev.reason}</p>
                  <p className="text-xs text-slate-900/60 font-medium mt-1">
                    Requested by: {rev.requestedBy} · {rev.createdAt}
                  </p>
                </div>

                {rev.status === "Pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateRevisionStatus(rev.id, "Approved")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.98] flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Delta</span>
                    </button>
                    <button
                      onClick={() => handleUpdateRevisionStatus(rev.id, "Rejected")}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.98] flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FINAL ACCOUNT RECONCILIATION (PRD Item 4) */}
      {activeSubTab === "finalAccount" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Final Account Reconciliation & Audit Notes</span>
              </h3>
              <p className="text-xs font-bold text-slate-900/60 mt-0.5">
                Every line reconciles automatically. Flagged variances allow QS notes without blocking close-out (PRD Section 1.6).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-white text-slate-900 font-bold tracking-wide text-xs tracking-wider">
                  <th className="py-3 px-4">Cost Code</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Original Budget</th>
                  <th className="py-3 px-4 text-right">Actual Spent</th>
                  <th className="py-3 px-4 text-right">Closing Variance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">QS Audit Note</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-navy-800/10 text-slate-900">
                {items.map((item) => {
                  const closingVariance = item.budgetAmount - item.actualAmount;
                  return (
                    <tr key={item.id} className="hover:bg-white/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">{item.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{item.description}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">{formatCurrency(item.budgetAmount, currency)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(item.actualAmount, currency)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={closingVariance < 0 ? "text-red-600 font-bold" : "text-emerald-700 font-bold"}>
                          {closingVariance >= 0 ? "+" : ""}{formatCurrency(closingVariance, currency)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-1 text-xs font-bold tracking-wide bg-emerald-100 text-emerald-900 border border-slate-200/80">
                          Reconciled
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-900/70 font-medium italic">
                        {item.varianceNote ? item.varianceNote : "— No QS note attached —"}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleOpenVarianceNote(item)}
                          className="px-3 py-1.5 bg-white hover:bg-white text-slate-900 border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.98] flex items-center gap-1 mx-auto"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                          <span>Note</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {isRevisionModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Rate/Budget Revision Request</h3>
                <p className="text-xs text-slate-900/60 font-mono font-bold mt-0.5">{selectedItem.code} · {selectedItem.description}</p>
              </div>
            </div>

            <form onSubmit={handleApplyRevision} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900/70 mb-1 uppercase tracking-wider">Current Approved Budget</label>
                <input
                  type="text"
                  disabled
                  value={formatCurrency(selectedItem.budgetAmount, currency)}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">
                  Budget Adjustment Delta (₦)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000000 or -2000000"
                  value={revisionDelta}
                  onChange={(e) => setRevisionDelta(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">
                  Revision Justification / Reason (Audit Requirement)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Market price escalation for steel bars approved by Consultant QS..."
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-white text-slate-900 border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.98]"
                >
                  Submit Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Add New BOQ Line Item</h3>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Cost Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ELEC-01.01"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as BOQRecord["category"])}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-900 uppercase focus:outline-none focus:shadow-xs"
                  >
                    <option value="Material">Material</option>
                    <option value="Labour">Labour</option>
                    <option value="Plant">Plant</option>
                    <option value="Subcontractor">Subcontractor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  required
                  placeholder="Detailed work description"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="m², m³, ton"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    required
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Rate (₦)</label>
                  <input
                    type="number"
                    required
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:shadow-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900/70 uppercase">Total Budget:</span>
                <span className="text-emerald-600 font-bold font-mono">
                  {formatCurrency(newQty * newRate, currency)}
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-white text-slate-900 border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.98]"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal (PRD Missing Checklist #1) */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Edit BOQ Item: {editingItem.code}</h3>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingItem.quantity}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      setEditingItem({
                        ...editingItem,
                        quantity: q,
                        budgetAmount: q * editingItem.rate,
                      });
                    }}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Rate (₦)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.rate}
                    onChange={(e) => {
                      const r = Number(e.target.value);
                      setEditingItem({
                        ...editingItem,
                        rate: r,
                        budgetAmount: editingItem.quantity * r,
                      });
                    }}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-white text-slate-900 border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Variance Note Modal (PRD Missing Checklist #4) */}
      {isVarianceNoteOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">QS Variance Note · {selectedItem.code}</h3>
            </div>
            <p className="text-xs font-bold text-slate-900/60 mt-2">
              Attach an audit explanation for this variance (wastage, theft, rate concession). This does not impede reconciliation status.
            </p>

            <form onSubmit={handleSaveVarianceNote} className="mt-4 space-y-3">
              <div>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Rate concession negotiated with supplier due to bulk cement purchase..."
                  value={varianceNoteText}
                  onChange={(e) => setVarianceNoteText(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsVarianceNoteOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-white text-slate-900 border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.98]"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <BOQImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportConfirmed={(importedItems) => {
          setItems((prev) => [...importedItems, ...prev]);
        }}
      />
    </div>
  );
}
