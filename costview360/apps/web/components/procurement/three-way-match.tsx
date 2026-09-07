"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, AlertTriangle, Lock, Unlock, FileText, ArrowRight } from "lucide-react";

interface ThreeWayMatchRecord {
  id: string;
  poNumber: string;
  supplierName: string;
  itemDescription: string;
  poQty: number;
  poRate: number;
  poTotal: number;
  grnNumber: string;
  grnQtyReceived: number;
  invoiceNumber: string;
  invoiceQtyBilled: number;
  invoiceRateBilled: number;
  invoiceTotal: number;
  matchStatus: "Matched" | "Discrepancy" | "Paid";
  discrepancyReason?: string;
  paymentLocked: boolean;
}

const SAMPLE_MATCHES: ThreeWayMatchRecord[] = [
  {
    id: "match-1",
    poNumber: "PO-2026-088",
    supplierName: "Dangote Cement Plc",
    itemDescription: "Ordinary Portland Cement 42.5R (50kg bags)",
    poQty: 600,
    poRate: 9800,
    poTotal: 5880000,
    grnNumber: "GRN-0941",
    grnQtyReceived: 600,
    invoiceNumber: "INV-DANG-9920",
    invoiceQtyBilled: 600,
    invoiceRateBilled: 9800,
    invoiceTotal: 5880000,
    matchStatus: "Matched",
    paymentLocked: false,
  },
  {
    id: "match-2",
    poNumber: "PO-2026-092",
    supplierName: "Pulkit Steels & Alloys Ltd",
    itemDescription: "16mm High Tensile TMT Rebar (Tons)",
    poQty: 30,
    poRate: 1450000,
    poTotal: 43500000,
    grnNumber: "GRN-0955",
    grnQtyReceived: 27, // 3 tons short!
    invoiceNumber: "INV-PULK-4102",
    invoiceQtyBilled: 30, // Billed full 30 tons
    invoiceRateBilled: 1450000,
    invoiceTotal: 43500000,
    matchStatus: "Discrepancy",
    discrepancyReason: "Short delivery: 27 Tons received vs 30 Tons invoiced (₦4,350,000 variance)",
    paymentLocked: true,
  },
  {
    id: "match-3",
    poNumber: "PO-2026-095",
    supplierName: "Lafarge ReadyMix Nigeria",
    itemDescription: "Grade 30 ReadyMix Concrete (m³)",
    poQty: 120,
    poRate: 195000,
    poTotal: 23400000,
    grnNumber: "GRN-0960",
    grnQtyReceived: 120,
    invoiceNumber: "INV-LAF-8819",
    invoiceQtyBilled: 120,
    invoiceRateBilled: 195000,
    invoiceTotal: 23400000,
    matchStatus: "Paid",
    paymentLocked: false,
  },
];

export function ThreeWayMatchView() {
  const { currency } = useApp();
  const [records, setRecords] = useState<ThreeWayMatchRecord[]>(SAMPLE_MATCHES);

  const handleResolveDiscrepancy = (id: string) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          return {
            ...rec,
            matchStatus: "Matched",
            paymentLocked: false,
            invoiceQtyBilled: rec.grnQtyReceived,
            invoiceTotal: rec.grnQtyReceived * rec.poRate,
            discrepancyReason: undefined,
          };
        }
        return rec;
      })
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Three-Way Financial Match Engine</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              PO ⇄ GRN ⇄ Invoice
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Automated quantity and unit rate cross-validation per PRD v2.0 Section 3.2.
          </p>
        </div>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {records.map((rec) => (
          <div key={rec.id} className="p-4 hover:bg-zinc-800/30 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    {rec.poNumber}
                  </span>
                  <span className="text-zinc-500">·</span>
                  <span className="font-semibold text-white text-xs">{rec.supplierName}</span>
                  <span className="text-zinc-500">·</span>
                  <span className="text-xs text-zinc-400">{rec.itemDescription}</span>
                </div>

                {/* 3 Steps Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                  {/* Step 1: PO */}
                  <div>
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      1. Purchase Order
                    </div>
                    <div className="text-xs font-mono text-zinc-200">
                      Qty: <span className="font-bold text-white">{rec.poQty}</span> @ {formatCurrency(rec.poRate, currency)}
                    </div>
                    <div className="text-xs font-mono font-semibold text-zinc-300 mt-0.5">
                      Total: {formatCurrency(rec.poTotal, currency)}
                    </div>
                  </div>

                  {/* Step 2: GRN */}
                  <div>
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      2. Delivery ({rec.grnNumber})
                    </div>
                    <div className="text-xs font-mono text-zinc-200">
                      Received: <span className={`font-bold ${rec.grnQtyReceived !== rec.poQty ? "text-amber-400" : "text-emerald-400"}`}>
                        {rec.grnQtyReceived}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {rec.grnQtyReceived === rec.poQty ? "100% Fulfilled" : `${rec.poQty - rec.grnQtyReceived} Units Pending`}
                    </div>
                  </div>

                  {/* Step 3: Invoice */}
                  <div>
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      3. Supplier Invoice ({rec.invoiceNumber})
                    </div>
                    <div className="text-xs font-mono text-zinc-200">
                      Billed: <span className="font-bold text-white">{rec.invoiceQtyBilled}</span> @ {formatCurrency(rec.invoiceRateBilled, currency)}
                    </div>
                    <div className="text-xs font-mono font-semibold text-zinc-300 mt-0.5">
                      Total: {formatCurrency(rec.invoiceTotal, currency)}
                    </div>
                  </div>
                </div>

                {/* Discrepancy Alert */}
                {rec.discrepancyReason && (
                  <div className="mt-2 flex items-center gap-2 p-2 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{rec.discrepancyReason}</span>
                  </div>
                )}
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-3 lg:self-center">
                {rec.paymentLocked ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold">
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                    <span>Payment Locked</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{rec.matchStatus}</span>
                  </div>
                )}

                {rec.paymentLocked && (
                  <button
                    onClick={() => handleResolveDiscrepancy(rec.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Adjust Credit & Unlock</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
