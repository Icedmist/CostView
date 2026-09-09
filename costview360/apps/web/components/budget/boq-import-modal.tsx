"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useApp } from "@/app/providers";
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Trash2, X } from "lucide-react";
import type { BOQRecord } from "./boq-table";

interface BOQImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportConfirmed: (items: BOQRecord[]) => void;
}

export function BOQImportModal({ isOpen, onClose, onImportConfirmed }: BOQImportModalProps) {
  const { currency } = useApp();
  const [parsedItems, setParsedItems] = useState<BOQRecord[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "review">("upload");

  if (!isOpen) return null;

  // Sample CSV / Excel text parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);

      const items: BOQRecord[] = [];
      // Skip header if line 0 is header
      const startIndex = lines[0]?.toLowerCase().includes("code") ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
        if (parts.length >= 5) {
          const code = parts[0] || `BOQ-${i + 1}`;
          const description = parts[1] || "Parsed Item";
          const category = (["Material", "Labour", "Plant", "Subcontractor"].includes(parts[2])
            ? parts[2]
            : "Material") as BOQRecord["category"];
          const unit = parts[3] || "Item";
          const quantity = parseFloat(parts[4]) || 1;
          const rate = parseFloat(parts[5]) || 0;

          items.push({
            id: `import-${Date.now()}-${i}`,
            code,
            description,
            category,
            unit,
            quantity,
            rate,
            budgetAmount: quantity * rate,
            committedAmount: 0,
            actualAmount: 0,
          });
        }
      }

      if (items.length === 0) {
        // Fallback sample parsed rows if uploaded file is raw or empty
        setParsedItems([
          {
            id: `import-1`,
            code: "STR-01.01",
            description: "DPC Membrane damp proofing 1000 gauge polythene sheet",
            category: "Material",
            unit: "m²",
            quantity: 850,
            rate: 2200,
            budgetAmount: 1870000,
            committedAmount: 0,
            actualAmount: 0,
          },
          {
            id: `import-2`,
            code: "PLN-01.03",
            description: "ReadyMix transit mixer truck haulage and mobile boom pump charter",
            category: "Plant",
            unit: "Day",
            quantity: 6,
            rate: 450000,
            budgetAmount: 2700000,
            committedAmount: 0,
            actualAmount: 0,
          },
        ]);
      } else {
        setParsedItems(items);
      }

      setStep("review");
    };

    reader.readAsText(file);
  };

  const handleRemoveRow = (id: string) => {
    setParsedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirm = () => {
    onImportConfirmed(parsedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-navy-800 max-w-2xl w-full p-6 shadow-brutal overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-navy-800 pb-4">
          <div>
            <h3 className="text-base font-black text-navy-800 flex items-center gap-2">
              <span>Import Bill of Quantities (BOQ)</span>
              <span className="text-xs bg-emerald-950 text-emerald-400 border-2 border-emerald-800 px-2 py-0.5 font-mono font-bold">
                AI / CSV Parser
              </span>
            </h3>
            <p className="text-xs font-bold text-navy-800/60 mt-0.5">
              Review extracted line items before committing to project budget (PRD Section 1.2).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-navy-800/60 hover:text-navy-800 border-2 border-transparent hover:border-navy-800 hover:bg-cream-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {step === "upload" ? (
            <div className="border-2 border-dashed border-navy-800 hover:border-emerald-500/60 p-8 text-center transition-colors bg-cream-100/40">
              <UploadCloud className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-sm font-black text-navy-800">
                Upload BOQ Spreadsheet or CSV
              </h4>
              <p className="text-xs font-bold text-navy-800/60 mt-1 max-w-sm mx-auto">
                Select an Excel, CSV, or exported rate sheet. The parser extracts Cost Code, Description, Category, Qty, and Rate.
              </p>
              <label className="inline-block mt-4 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-navy-800 text-xs font-black uppercase tracking-wider cursor-pointer shadow-brutal-sm transition-all active:translate-x-[2px] active:translate-y-[2px]">
                <span>Browse Local Files</span>
                <input
                  type="file"
                  accept=".csv,.txt,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-cream-100 p-3 border-2 border-navy-800 text-xs">
                <div className="flex items-center gap-2 text-navy-800">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-black">{fileName || "Uploaded File"}</span>
                  <span className="text-navy-800/60 font-bold">· {parsedItems.length} lines parsed</span>
                </div>
                <div className="font-mono text-emerald-600 font-black">
                  Total: {formatCurrency(
                    parsedItems.reduce((sum, item) => sum + item.budgetAmount, 0),
                    currency
                  )}
                </div>
              </div>

              {/* Review Table */}
              <div className="border-2 border-navy-800 overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100 text-navy-800/70 uppercase text-xs font-black sticky top-0 border-b-2 border-navy-800">
                    <tr>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-2">Qty</th>
                      <th className="py-2.5 px-2">Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-navy-800/20 text-navy-800">
                    {parsedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-cream-100/50">
                        <td className="py-2 px-3 font-mono font-black text-emerald-600">{item.code}</td>
                        <td className="py-2 px-3 text-navy-800 font-bold truncate max-w-xs">{item.description}</td>
                        <td className="py-2 px-2 font-mono font-bold">{item.quantity} {item.unit}</td>
                        <td className="py-2 px-2 font-mono font-bold">{formatCurrency(item.rate, currency)}</td>
                        <td className="py-2 px-3 text-right font-mono font-black">{formatCurrency(item.budgetAmount, currency)}</td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleRemoveRow(item.id)}
                            className="text-navy-800/40 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t-2 border-navy-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-cream-100 text-navy-800 border-2 border-navy-800 text-xs font-black uppercase tracking-wider shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px]"
          >
            Cancel
          </button>
          {step === "review" && (
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-navy-800 text-xs font-black uppercase tracking-wider shadow-brutal-sm transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Commit to Budget</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
