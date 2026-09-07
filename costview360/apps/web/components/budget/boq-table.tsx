"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Edit3,
  FileCheck,
  AlertCircle,
  Download,
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

export function BOQTable() {
  const { currency, activeRole } = useApp();
  const [items, setItems] = useState<BOQRecord[]>(INITIAL_BOQ);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal states
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BOQRecord | null>(null);
  const [revisionReason, setRevisionReason] = useState("");
  const [revisionDelta, setRevisionDelta] = useState<number>(0);

  // New item form
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<BOQRecord["category"]>("Material");
  const [newUnit, setNewUnit] = useState("m²");
  const [newQty, setNewQty] = useState<number>(100);
  const [newRate, setNewRate] = useState<number>(5000);

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

  const handleOpenRevision = (item: BOQRecord) => {
    setSelectedItem(item);
    setRevisionReason("");
    setRevisionDelta(0);
    setIsRevisionModalOpen(true);
  };

  const handleApplyRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          const newBudget = item.budgetAmount + revisionDelta;
          return {
            ...item,
            budgetAmount: newBudget,
          };
        }
        return item;
      })
    );
    setIsRevisionModalOpen(false);
  };

  const handleCreateItem = (e: React.FormEvent) => {
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
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Categories</option>
              <option value="Material" className="bg-zinc-900">Materials</option>
              <option value="Labour" className="bg-zinc-900">Labour</option>
              <option value="Plant" className="bg-zinc-900">Plant & Machinery</option>
              <option value="Subcontractor" className="bg-zinc-900">Subcontractor</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400 rotate-180" />
            <span>Import BOQ / CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add BOQ Item</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Cost Code</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Unit</th>
              <th className="py-3 px-3 text-right">Qty</th>
              <th className="py-3 px-3 text-right">Rate</th>
              <th className="py-3 px-4 text-right">Approved Budget</th>
              <th className="py-3 px-4 text-right">Committed (POs)</th>
              <th className="py-3 px-4 text-right">Variance</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
            {filteredItems.map((item) => {
              const variance = item.budgetAmount - item.committedAmount;
              const isOverBudget = variance < 0;

              return (
                <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-zinc-100 max-w-xs">
                    {item.description}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      item.category === "Material"
                        ? "bg-blue-950/70 text-blue-300 border-blue-800/40"
                        : item.category === "Labour"
                        ? "bg-amber-950/70 text-amber-300 border-amber-800/40"
                        : item.category === "Plant"
                        ? "bg-purple-950/70 text-purple-300 border-purple-800/40"
                        : "bg-emerald-950/70 text-emerald-300 border-emerald-800/40"
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{item.unit}</td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-200">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-300">
                    {formatCurrency(item.rate, currency)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white whitespace-nowrap">
                    {formatCurrency(item.budgetAmount, currency)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-zinc-300 whitespace-nowrap">
                    {formatCurrency(item.committedAmount, currency)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono whitespace-nowrap">
                    <span className={`font-semibold ${isOverBudget ? "text-red-400" : "text-emerald-400"}`}>
                      {formatCurrency(variance, currency)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleOpenRevision(item)}
                      title="Request Budget/Rate Revision"
                      className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Revision Modal */}
      {isRevisionModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Rate/Budget Revision Request</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{selectedItem.code} · {selectedItem.description}</p>
              </div>
            </div>

            <form onSubmit={handleApplyRevision} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Current Approved Budget</label>
                <input
                  type="text"
                  disabled
                  value={formatCurrency(selectedItem.budgetAmount, currency)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Budget Adjustment Delta (₦)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000000 or -2000000"
                  value={revisionDelta}
                  onChange={(e) => setRevisionDelta(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Revision Justification / Reason (Audit Requirement)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Market price escalation for steel bars approved by Consultant QS..."
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">Add New BOQ Line Item</h3>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1">Cost Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ELEC-01.01"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as BOQRecord["category"])}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Material">Material</option>
                    <option value="Labour">Labour</option>
                    <option value="Plant">Plant</option>
                    <option value="Subcontractor">Subcontractor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="Detailed work description"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="m², m³, ton"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1">Rate (₦)</label>
                  <input
                    type="number"
                    required
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Budget Amount:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {formatCurrency(newQty * newRate, currency)}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Create Item
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

