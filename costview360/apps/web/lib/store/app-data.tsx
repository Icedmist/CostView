"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type BOQItem = {
  id: string;
  code: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  rate: number;
  budgetAmount: number;
  committedAmount: number;
  actualAmount: number;
};

type AppDataContextType = {
  boqItems: BOQItem[];
  addBOQItem: (item: BOQItem) => void;
  updateBOQItem: (id: string, patch: Partial<BOQItem>) => void;
  deleteBOQItem: (id: string) => void;
  procurementCount: number;
  setProcurementCount: (n: number) => void;
  stockRefreshKey: number;
  bumpStock: () => void;
  reportsRefreshKey: number;
  bumpReports: () => void;
};

const AppDataContext = createContext<AppDataContextType | null>(null);

const INITIAL_BOQ: BOQItem[] = [
  { id: "boq-1", code: "SUB-01.01", description: "Excavation and earthwork disposal offsite", category: "Plant", unit: "m³", quantity: 1250, rate: 18500, budgetAmount: 23125000, committedAmount: 21500000, actualAmount: 19800000 },
  { id: "boq-2", code: "CON-02.01", description: "Grade 30 reinforced concrete for foundation raft & plinth beams", category: "Material", unit: "m³", quantity: 480, rate: 195000, budgetAmount: 93600000, committedAmount: 94000000, actualAmount: 62000000 },
  { id: "boq-3", code: "STL-02.03", description: "High-yield deformed reinforcement bars (12mm, 16mm, 20mm)", category: "Material", unit: "Tons", quantity: 65, rate: 1450000, budgetAmount: 94250000, committedAmount: 94250000, actualAmount: 85000000 },
  { id: "boq-4", code: "BLK-03.01", description: "225mm vibrated hollow sandcrete blockwork in cement mortar (1:4)", category: "Material", unit: "m²", quantity: 3200, rate: 11200, budgetAmount: 35840000, committedAmount: 33000000, actualAmount: 24500000 },
  { id: "boq-5", code: "LAB-01.02", description: "Structural steel fixing and formwork carpenters gang attendance", category: "Labour", unit: "Man-days", quantity: 600, rate: 12500, budgetAmount: 7500000, committedAmount: 7500000, actualAmount: 5100000 },
  { id: "boq-6", code: "MEP-04.01", description: "First fix electrical conduit pipes & heavy-duty distribution boards", category: "Subcontractor", unit: "Item", quantity: 1, rate: 45000000, budgetAmount: 45000000, committedAmount: 42000000, actualAmount: 20000000 },
];

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [boqItems, setBoqItems] = useState<BOQItem[]>(INITIAL_BOQ);
  const [procurementCount, setProcurementCount] = useState(6);
  const [stockRefreshKey, setStockRefreshKey] = useState(0);
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);

  // Load live BOQ from Supabase on mount and share
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("boq_items").select("*").order("code");
        if (data && data.length > 0) {
          const mapped: BOQItem[] = data.map((d: any) => ({
            id: d.id,
            code: d.code || d.item_code,
            description: d.description,
            category: d.category,
            unit: d.unit,
            quantity: Number(d.quantity),
            rate: Number(d.rate),
            budgetAmount: Number(d.budget_amount),
            committedAmount: Number(d.committed_amount || 0),
            actualAmount: Number(d.actual_amount || 0),
          }));
          setBoqItems(mapped);
          setReportsRefreshKey((k) => k + 1);
        }
      } catch (e) {
        console.warn("AppData BOQ live fetch failed, using seed", e);
      }
    })();
  }, []);

  const addBOQItem = (item: BOQItem) => {
    setBoqItems((prev) => [item, ...prev]);
    setProcurementCount((n) => n + 1);
    setReportsRefreshKey((k) => k + 1);
  };
  const updateBOQItem = (id: string, patch: Partial<BOQItem>) => {
    setBoqItems((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    setReportsRefreshKey((k) => k + 1);
  };
  const deleteBOQItem = (id: string) => {
    setBoqItems((prev) => prev.filter((b) => b.id !== id));
    setReportsRefreshKey((k) => k + 1);
  };
  const bumpStock = () => setStockRefreshKey((k) => k + 1);
  const bumpReports = () => setReportsRefreshKey((k) => k + 1);

  return (
    <AppDataContext.Provider value={{ boqItems, addBOQItem, updateBOQItem, deleteBOQItem, procurementCount, setProcurementCount, stockRefreshKey, bumpStock, reportsRefreshKey, bumpReports }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
