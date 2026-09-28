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

const INITIAL_BOQ: BOQItem[] = [];

export function AppDataProvider({ children, projectId }: { children: React.ReactNode; projectId?: string }) {
  const [boqItems, setBoqItems] = useState<BOQItem[]>(INITIAL_BOQ);
  const [procurementCount, setProcurementCount] = useState(0);
  const [stockRefreshKey, setStockRefreshKey] = useState(0);
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);

  // Load live BOQ from Supabase on mount and project change
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        let query = supabase.from("boq_items").select("*").order("code");
        if (projectId) {
          query = query.eq("project_id", projectId);
        }
        const { data } = await query;
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
        } else {
          setBoqItems([]);
        }
      } catch (e) {
        console.warn("AppData BOQ live fetch failed", e);
      }
    })();
  }, [projectId]);

  const addBOQItem = (item: BOQItem) => {
    setBoqItems((prev) => [item, ...prev]);
    setProcurementCount((n) => n + 1);
    setReportsRefreshKey((k) => k + 1);
    (async () => {
      try {
        if (!projectId) return;
        const supabase = createClient();
        await supabase.from("boq_items").insert({
          project_id: projectId,
          code: item.code,
          description: item.description,
          category: item.category,
          unit: item.unit,
          quantity: item.quantity,
          rate: item.rate,
          budget_amount: item.budgetAmount,
          committed_amount: item.committedAmount,
          actual_amount: item.actualAmount,
        });
      } catch (e) {
        console.warn("Async BOQ add to Supabase failed", e);
      }
    })();
  };
  const updateBOQItem = (id: string, patch: Partial<BOQItem>) => {
    setBoqItems((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    setReportsRefreshKey((k) => k + 1);
    (async () => {
      try {
        const supabase = createClient();
        const updatePayload: any = {};
        if (patch.rate !== undefined) updatePayload.rate = patch.rate;
        if (patch.quantity !== undefined) updatePayload.quantity = patch.quantity;
        if (patch.budgetAmount !== undefined) updatePayload.budget_amount = patch.budgetAmount;
        if (patch.committedAmount !== undefined) updatePayload.committed_amount = patch.committedAmount;
        if (patch.actualAmount !== undefined) updatePayload.actual_amount = patch.actualAmount;
        if (Object.keys(updatePayload).length > 0) {
          await supabase.from("boq_items").update(updatePayload).eq("id", id);
        }
      } catch (e) {
        console.warn("Async BOQ update to Supabase failed", e);
      }
    })();
  };
  const deleteBOQItem = (id: string) => {
    setBoqItems((prev) => prev.filter((b) => b.id !== id));
    setReportsRefreshKey((k) => k + 1);
    (async () => {
      try {
        const supabase = createClient();
        await supabase.from("boq_items").delete().eq("id", id);
      } catch (e) {
        console.warn("Async BOQ delete from Supabase failed", e);
      }
    })();
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
