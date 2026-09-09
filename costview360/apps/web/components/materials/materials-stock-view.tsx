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
      <div className="bg-white border-[3px] border-navy-800 shadow-brutal p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60 font-mono">
              Live Stock Gauges
            </span>
            <span className="text-navy-800/40 text-xs">· Site Store Operations</span>
          </div>
          <h2 className="text-lg font-bold text-navy-800 tracking-tight">
            Materials Inventory & Stock Control
          </h2>
          <p className="text-xs text-navy-800/60 mt-0.5">
            Real-time on-hand, reserved, and consumed inventory tied to procurement GRNs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedItem(stock[0]);
              setIsTransferModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 hover:bg-cream-100 text-navy-800 border-[2px] border-navy-800 text-xs font-semibold border border-navy-800 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>Create Transfer</span>
          </button>
          <button
            onClick={() => {
              setSelectedItem(stock[0]);
              setIsConsumptionModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border-[2px] border-navy-800 text-xs font-semibold shadow-sm transition-colors"
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
              className={`bg-white border border-[3px] border-navy-800 p-4 shadow-sm relative overflow-hidden transition-all ${
                isLow ? "border-amber-700/80 bg-amber-950/10" : "border-navy-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-navy-800/60">
                  {item.sku}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold border ${
                    isLow
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}
                >
                  {isLow ? "Low Stock Alert" : "Healthy"}
                </span>
              </div>

              <h3 className="text-xs font-bold text-white mt-2 line-clamp-2 h-8">
                {item.name}
              </h3>

              {/* Gauges */}
              <div className="mt-3 pt-3 border-t border-navy-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-navy-800 font-mono">
                  <span>Available:</span>
                  <span className="font-bold text-navy-800">
                    {available} {item.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-navy-800/60 text-sm font-mono">
                  <span>Reserved:</span>
                  <span>
                    {item.qtyReserved} {item.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-navy-800/60 text-sm font-mono">
                  <span>Consumed:</span>
                  <span>
                    {item.qtyConsumed} {item.unit} ({percentUsed}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-cream-100 rounded-full h-1.5 mt-2 overflow-hidden border border-navy-800">
                  <div
                    className={`h-full ${isLow ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min(100, percentUsed)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-navy-800/40 pt-1">
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-navy-800 border-navy-800 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-navy-800">Record Material Issue / Consumption</h3>
            <p className="text-xs text-navy-800/60 mt-0.5">{selectedItem.name}</p>

            <form onSubmit={handleRecordConsumption} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Issue Quantity ({selectedItem.unit})</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedItem.qtyOnHand}
                  value={consumptionQty}
                  onChange={(e) => setConsumptionQty(Number(e.target.value))}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-navy-800 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Issued to Work Location / Grid</label>
                <input
                  type="text"
                  required
                  value={consumptionLocation}
                  onChange={(e) => setConsumptionLocation(e.target.value)}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConsumptionModalOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-navy-800 border-navy-800 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-navy-800">Create Inter-Site Material Transfer</h3>
            <p className="text-xs text-navy-800/60 mt-0.5">{selectedItem.name}</p>

            <form onSubmit={handleCreateTransfer} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Destination Project / Store</label>
                <input
                  type="text"
                  required
                  value={transferToSite}
                  onChange={(e) => setTransferToSite(e.target.value)}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Transfer Quantity ({selectedItem.unit})</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedItem.qtyOnHand}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-navy-800 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
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
