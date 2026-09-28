"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useApp } from "@/app/providers";
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Trash2, X, Download } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent = "code,description,category,unit,quantity,rate\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "boq_items_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Sample CSV / Excel text parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

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
        setError("No valid BOQ item rows found in the uploaded file. Please make sure the CSV has columns: Code, Description, Category, Unit, Quantity, Rate.");
        setParsedItems([]);
        return;
      }

      setError(null);
      setParsedItems(items);
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl max-w-2xl w-full p-6 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Import Bill of Quantities (BOQ)</span>
              <span className="text-xs bg-blue-50 text-[#0067c0] border border-blue-200 rounded px-2 py-0.5 font-mono font-medium">
                AI / CSV Parser
              </span>
            </h3>
            <p className="text-xs font-bold text-slate-900/60 mt-0.5">
              Review extracted line items before committing to project budget (PRD Section 1.2).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-900/60 hover:text-slate-900 border border-transparent hover:border-slate-200/80 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === "upload" ? (
            <div className="border border-dashed border-slate-200/80 hover:border-[#0067c0] rounded-xl p-8 text-center transition-colors bg-white">
              <UploadCloud className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900">
                Upload BOQ Spreadsheet or CSV
              </h4>
              <p className="text-xs font-bold text-slate-900/60 mt-1 max-w-sm mx-auto">
                Select an Excel, CSV, or exported rate sheet. The parser extracts Cost Code, Description, Category, Qty, and Rate.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <label className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-bold tracking-wide cursor-pointer shadow-xs rounded-xl transition-all active:scale-[0.98]">
                  <span>Browse Local Files</span>
                  <input
                    type="file"
                    accept=".csv,.txt,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Blank CSV Template</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2 text-slate-900">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{fileName || "Uploaded File"}</span>
                  <span className="text-slate-900/60 font-bold">· {parsedItems.length} lines parsed</span>
                </div>
                <div className="font-mono text-emerald-600 font-bold">
                  Total: {formatCurrency(
                    parsedItems.reduce((sum, item) => sum + item.budgetAmount, 0),
                    currency
                  )}
                </div>
              </div>

              {/* Review Table */}
              <div className="border border-slate-200/80 overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white text-slate-900/70 uppercase text-xs font-bold sticky top-0 border-b border-slate-200/80">
                    <tr>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-2">Qty</th>
                      <th className="py-2.5 px-2">Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-navy-800/20 text-slate-900">
                    {parsedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f5f5f5]">
                        <td className="py-2 px-3 font-mono font-bold text-emerald-600">{item.code}</td>
                        <td className="py-2 px-3 text-slate-900 font-bold truncate max-w-xs">{item.description}</td>
                        <td className="py-2 px-2 font-mono font-bold">{item.quantity} {item.unit}</td>
                        <td className="py-2 px-2 font-mono font-bold">{formatCurrency(item.rate, currency)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">{formatCurrency(item.budgetAmount, currency)}</td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleRemoveRow(item.id)}
                            className="text-slate-900/40 hover:text-red-500 p-1"
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
        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <div>
            {step === "review" && (
              <button
                type="button"
                onClick={() => {
                  setStep("upload");
                  setParsedItems([]);
                  setFileName(null);
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold tracking-wide rounded-xl active:scale-[0.98] cursor-pointer"
              >
                ← Upload Different File
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-white text-slate-900 border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs rounded-xl active:scale-[0.98] cursor-pointer"
            >
              Cancel
            </button>
            {step === "review" && parsedItems.length > 0 && (
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-bold tracking-wide shadow-xs rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Commit to Budget</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
