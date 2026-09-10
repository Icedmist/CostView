"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import {
  Boxes,
  ArrowRightLeft,
  MinusCircle,
  Plus,
  AlertCircle,
  CheckCircle2,
  Package,
} from "lucide-react";

interface StockItem {
  id: string;
  sku: string;
  name: string;
  unit: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyConsumed: number;
  minReorderLevel: number;
  location: string;
}

const SAMPLE_STOCK: StockItem[] = [
  {
    id: "stk-1",
    sku: "MAT-CEM-01",
    name: "Dangote Portland Cement 42.5R (50kg bags)",
    unit: "Bags",
    qtyOnHand: 840,
    qtyReserved: 200,
    qtyConsumed: 1200,
    minReorderLevel: 300,
    location: "Main Store A",
  },
  {
    id: "stk-2",
    sku: "MAT-STL-16",
    name: "16mm High-Yield TMT Steel Rebar (12m rods)",
    unit: "Tons",
    qtyOnHand: 22,
    qtyReserved: 15,
    qtyConsumed: 45,
    minReorderLevel: 10,
    location: "Rebar Yard",
  },
  {
    id: "stk-3",
    sku: "MAT-BLK-225",
    name: "225mm Hollow Sandcrete Blocks",
    unit: "Pcs",
    qtyOnHand: 450,
    qtyReserved: 400,
    qtyConsumed: 4200,
    minReorderLevel: 800, // Trigger low stock!
    location: "Block Stacking Area 2",
  },
  {
    id: "stk-4",
    sku: "MAT-AGG-20",
    name: "20mm Crushed Granite Aggregate",
    unit: "Tons",
    qtyOnHand: 180,
    qtyReserved: 60,
    qtyConsumed: 320,
    minReorderLevel: 50,
    location: "Bulk Materials Bunker",
  },
];

export function MaterialsStockView() {
  const [stock, setStock] = useState<StockItem[]>(SAMPLE_STOCK);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isConsumptionModalOpen, setIsConsumptionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // Form states
  const [transferQty, setTransferQty] = useState<number>(50);
  const [transferToSite, setTransferToSite] = useState("Eko Atlantic Tower 2");
  const [consumptionQty, setConsumptionQty] = useState<number>(20);
  const [consumptionLocation, setConsumptionLocation] = useState("Block B Floor 2");

  const handleRecordConsumption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setStock((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            qtyOnHand: Math.max(0, item.qtyOnHand - consumptionQty),
            qtyConsumed: item.qtyConsumed + consumptionQty,
          };
        }
        return item;
      })
    );
    setIsConsumptionModalOpen(false);
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setStock((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            qtyOnHand: Math.max(0, item.qtyOnHand - transferQty),
            qtyReserved: item.qtyReserved + transferQty,
          };
        }
        return item;
      })
    );
    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="bg-white/90 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-50 text-[#0067c0] border border-blue-200 rounded font-mono">
              Live Stock Gauges
            </span>
            <span className="text-[#1b1b1b]/60 text-xs">· Site Store Operations</span>
          </div>
          <h2 className="text-lg font-bold text-[#1b1b1b] tracking-tight">
            Materials Inventory & Stock Control
          </h2>
          <p className="text-xs text-[#1b1b1b]/60 mt-0.5">
            Real-time on-hand, reserved, and consumed inventory tied to procurement GRNs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedItem(stock[0]);
              setIsTransferModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f5f5f5] text-[#1b1b1b] border border-[#e5e5e5] rounded-md text-xs font-medium shadow-xs transition-all"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#1b1b1b]" />
            <span>Create Transfer</span>
          </button>
          <button
            onClick={() => {
              setSelectedItem(stock[0]);
              setIsConsumptionModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-md text-xs font-semibold shadow-xs transition-all"
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Record Site Consumption</span>
          </button>
        </div>
      </div>

      {/* Live Stock Gauges Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stock.map((item) => {
          const isLow = item.qtyOnHand <= item.minReorderLevel;
          const available = Math.max(0, item.qtyOnHand - item.qtyReserved);
          const totalCirculation = item.qtyOnHand + item.qtyConsumed;
          const percentUsed = Math.round((item.qtyConsumed / (totalCirculation || 1)) * 100);

          return (
            <div
              key={item.id}
              className={`bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-card relative transition-all ${
                isLow ? "bg-amber-50" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#1b1b1b]/60">
                  {item.sku}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-bold border border-[#e5e5e5] rounded-xl ${
                    isLow
                      ? "bg-amber-50 text-amber-700 border border-amber-200 rounded-md"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md"
                  }`}
                >
                  {isLow ? "Low Stock Alert" : "Healthy"}
                </span>
              </div>

              <h3 className="text-xs font-bold text-[#1b1b1b] mt-2 line-clamp-2 h-8">
                {item.name}
              </h3>

              {/* Gauges */}
              <div className="mt-3 pt-3 border-t border-[#e5e5e5] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#1b1b1b] font-mono">
                  <span>Available:</span>
                  <span className="font-bold text-[#1b1b1b]">
                    {Math.max(0, item.qtyOnHand - item.qtyReserved)} {item.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#1b1b1b]/60 text-xs font-mono">
                  <span>Reserved:</span>
                  <span>
                    {item.qtyReserved} {item.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#1b1b1b]/60 text-xs font-mono">
                  <span>Consumed:</span>
                  <span>
                    {item.qtyConsumed} {item.unit} ({percentUsed}%)
                  </span>
                </div>

                {/* Progress Bar (Straight brutalist edges) */}
                <div className="w-full bg-[#f5f5f5] h-2 mt-2 overflow-hidden border border-[#e5e5e5]">
                  <div
                    className={`h-full ${isLow ? "bg-amber-500" : "bg-emerald-600"}`}
                    style={{ width: `${Math.min(100, percentUsed)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#1b1b1b]/60 pt-1">
                  <span>Store: {item.location}</span>
                  <span>Min: {item.minReorderLevel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Consumption Modal */}
      {isConsumptionModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfbfb] border border-[#e5e5e5] rounded-xl max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">Record Material Issue / Consumption</h3>
            <p className="text-xs text-[#1b1b1b]/70 mt-0.5 font-medium">{selectedItem.name}</p>

            <form onSubmit={handleRecordConsumption} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1">Issue Quantity ({selectedItem.unit})</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedItem.qtyOnHand}
                  value={consumptionQty}
                  onChange={(e) => setConsumptionQty(Number(e.target.value))}
                  className="w-full bg-white border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs text-[#1b1b1b] font-mono focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1">Issued to Work Location / Grid</label>
                <input
                  type="text"
                  required
                  value={consumptionLocation}
                  onChange={(e) => setConsumptionLocation(e.target.value)}
                  className="w-full bg-white border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs text-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConsumptionModalOpen(false)}
                  className="px-3 py-1.5 bg-[#fbfbfb] hover:bg-[#f5f5f5] border border-[#e5e5e5] rounded-xl text-[#1b1b1b] text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-[#e5e5e5] rounded-xl shadow-xs text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Transfer Modal */}
      {isTransferModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fbfbfb] border border-[#e5e5e5] rounded-xl max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">Create Inter-Site Material Transfer</h3>
            <p className="text-xs text-[#1b1b1b]/70 mt-0.5 font-medium">{selectedItem.name}</p>

            <form onSubmit={handleCreateTransfer} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1">Destination Project / Store</label>
                <input
                  type="text"
                  required
                  value={transferToSite}
                  onChange={(e) => setTransferToSite(e.target.value)}
                  className="w-full bg-white border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs text-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1">Transfer Quantity ({selectedItem.unit})</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedItem.qtyOnHand}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full bg-white border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs text-[#1b1b1b] font-mono focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-3 py-1.5 bg-[#fbfbfb] hover:bg-[#f5f5f5] border border-[#e5e5e5] rounded-xl text-[#1b1b1b] text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-[#e5e5e5] rounded-xl shadow-xs text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
