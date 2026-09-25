"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  Truck,
  Wrench,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Fuel,
  Activity,
  Archive,
  RefreshCw,
  X,
  FileSpreadsheet,
} from "lucide-react";

export interface AssetRecord {
  id: string;
  code: string;
  name: string;
  category: "Earthmoving" | "Power Generation" | "Concrete & Batching" | "Haulage & Transport" | "Survey & Testing";
  serialNumber: string;
  acquisitionDate: string;
  acquisitionCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: "Straight-Line" | "Reducing Balance";
  depreciationRatePct?: number;
  currentHours: number;
  fuelRatePerHourLtrs: number;
  allocatedProject: string;
  allocatedSection: string;
  custodian: string;
  status: "Active" | "Maintenance" | "Idle" | "Disposed";
  lastServicedDate: string;
  nextServiceHours: number;
}

const INITIAL_ASSETS: AssetRecord[] = [
  {
    id: "ast-01",
    code: "PL-CAT-320",
    name: "Caterpillar 320D Hydraulic Crawler Excavator",
    category: "Earthmoving",
    serialNumber: "CAT320D-NG-88912",
    acquisitionDate: "2024-03-15",
    acquisitionCost: 185000000,
    salvageValue: 25000000,
    usefulLifeYears: 7,
    depreciationMethod: "Straight-Line",
    currentHours: 3420,
    fuelRatePerHourLtrs: 22,
    allocatedProject: "Horizon Commercial Towers",
    allocatedSection: "Basement Excavation & Shoring",
    custodian: "Engr. Tayo (Site Engineer)",
    status: "Active",
    lastServicedDate: "2026-08-10",
    nextServiceHours: 3600,
  },
  {
    id: "ast-02",
    code: "PL-PERK-150",
    name: "Perkins 150kVA Heavy-Duty Soundproof Generator",
    category: "Power Generation",
    serialNumber: "PK150-LKG-4410",
    acquisitionDate: "2024-06-01",
    acquisitionCost: 38500000,
    salvageValue: 5000000,
    usefulLifeYears: 5,
    depreciationMethod: "Straight-Line",
    currentHours: 4890,
    fuelRatePerHourLtrs: 18,
    allocatedProject: "Horizon Commercial Towers",
    allocatedSection: "Primary Site Workstation Power",
    custodian: "Musa Storekeeper",
    status: "Active",
    lastServicedDate: "2026-09-02",
    nextServiceHours: 5000,
  },
  {
    id: "ast-03",
    code: "PL-WING-500",
    name: "Winget 500L Reversing Drum Concrete Mixer",
    category: "Concrete & Batching",
    serialNumber: "WG500-REV-0912",
    acquisitionDate: "2025-01-10",
    acquisitionCost: 19800000,
    salvageValue: 2000000,
    usefulLifeYears: 5,
    depreciationMethod: "Straight-Line",
    currentHours: 1840,
    fuelRatePerHourLtrs: 8,
    allocatedProject: "Horizon Commercial Towers",
    allocatedSection: "Ground Floor Slab & Columns",
    custodian: "Engr. Tayo (Site Engineer)",
    status: "Active",
    lastServicedDate: "2026-07-28",
    nextServiceHours: 2000,
  },
  {
    id: "ast-04",
    code: "PL-MACK-01",
    name: "Mack Granite 20-Tonne Tipper Dump Truck",
    category: "Haulage & Transport",
    serialNumber: "MK-GRAN-20T-004",
    acquisitionDate: "2023-11-20",
    acquisitionCost: 54000000,
    salvageValue: 8000000,
    usefulLifeYears: 6,
    depreciationMethod: "Straight-Line",
    currentHours: 6100,
    fuelRatePerHourLtrs: 28,
    allocatedProject: "Horizon Commercial Towers",
    allocatedSection: "Granite Aggregate Haulage",
    custodian: "Chidi Procurement",
    status: "Maintenance",
    lastServicedDate: "2026-09-18",
    nextServiceHours: 6200,
  },
  {
    id: "ast-05",
    code: "PL-LEICA-01",
    name: "Leica FlexLine TS07 Total Station Survey Kit",
    category: "Survey & Testing",
    serialNumber: "LCA-TS07-9921",
    acquisitionDate: "2025-04-12",
    acquisitionCost: 12500000,
    salvageValue: 1500000,
    usefulLifeYears: 4,
    depreciationMethod: "Straight-Line",
    currentHours: 720,
    fuelRatePerHourLtrs: 0,
    allocatedProject: "Horizon Commercial Towers",
    allocatedSection: "Superstructure Grid & Plumb Alignment",
    custodian: "Mrs. Nkechi (QS)",
    status: "Active",
    lastServicedDate: "2026-06-15",
    nextServiceHours: 1200,
  },
];

export function AssetManagementView() {
  const { currency, activeRole } = useApp();
  const [assets, setAssets] = useState<AssetRecord[]>(INITIAL_ASSETS);
  const [activeTab, setActiveTab] = useState<"fleet" | "depreciation" | "maintenance" | "calculator">("fleet");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Asset Form State
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<AssetRecord["category"]>("Earthmoving");
  const [formCost, setFormCost] = useState("");
  const [formSalvage, setFormSalvage] = useState("");
  const [formUsefulLife, setFormUsefulLife] = useState("5");
  const [formMethod, setFormMethod] = useState<"Straight-Line" | "Reducing Balance">("Straight-Line");
  const [formSection, setFormSection] = useState("");

  // Interactive Calculator State
  const [calcCost, setCalcCost] = useState(50000000);
  const [calcSalvage, setCalcSalvage] = useState(5000000);
  const [calcLife, setCalcLife] = useState(5);
  const [calcMethod, setCalcMethod] = useState<"Straight-Line" | "Reducing Balance">("Straight-Line");

  // Calculate Asset Financials
  const calculateDepreciation = (asset: AssetRecord) => {
    const acquisitionDate = new Date(asset.acquisitionDate);
    const currentDate = new Date();
    const monthsElapsed = Math.max(
      1,
      (currentDate.getFullYear() - acquisitionDate.getFullYear()) * 12 +
        (currentDate.getMonth() - acquisitionDate.getMonth())
    );
    const totalLifeMonths = asset.usefulLifeYears * 12;

    if (asset.depreciationMethod === "Straight-Line") {
      const depreciableAmount = Math.max(0, asset.acquisitionCost - asset.salvageValue);
      const monthlyDepreciation = depreciableAmount / totalLifeMonths;
      const accumulatedDepreciation = Math.min(
        depreciableAmount,
        monthlyDepreciation * monthsElapsed
      );
      const netBookValue = Math.max(
        asset.salvageValue,
        asset.acquisitionCost - accumulatedDepreciation
      );
      const annualDepreciation = monthlyDepreciation * 12;
      const hourlyRecoveryRate = annualDepreciation / 2000; // Standard 2,000 construction operating hours per year

      return {
        monthlyDepreciation,
        annualDepreciation,
        accumulatedDepreciation,
        netBookValue,
        monthsElapsed,
        hourlyRecoveryRate,
      };
    } else {
      // Reducing Balance 20%
      const rate = 0.2;
      const yearsElapsed = monthsElapsed / 12;
      const netBookValue = Math.max(
        asset.salvageValue,
        asset.acquisitionCost * Math.pow(1 - rate, yearsElapsed)
      );
      const accumulatedDepreciation = asset.acquisitionCost - netBookValue;
      const annualDepreciation = netBookValue * rate;
      const monthlyDepreciation = annualDepreciation / 12;
      const hourlyRecoveryRate = annualDepreciation / 2000;

      return {
        monthlyDepreciation,
        annualDepreciation,
        accumulatedDepreciation,
        netBookValue,
        monthsElapsed,
        hourlyRecoveryRate,
      };
    }
  };

  // Fleet Totals
  const fleetSummary = useMemo(() => {
    let totalAcquisition = 0;
    let totalAccumulatedDep = 0;
    let totalNBV = 0;
    let totalMonthlyCharge = 0;

    assets.forEach((ast) => {
      const dep = calculateDepreciation(ast);
      totalAcquisition += ast.acquisitionCost;
      totalAccumulatedDep += dep.accumulatedDepreciation;
      totalNBV += dep.netBookValue;
      totalMonthlyCharge += dep.monthlyDepreciation;
    });

    return { totalAcquisition, totalAccumulatedDep, totalNBV, totalMonthlyCharge };
  }, [assets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((ast) => {
      const matchesSearch =
        ast.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ast.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ast.allocatedSection.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || ast.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || ast.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, searchQuery, categoryFilter, statusFilter]);

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formName || !formCost) return;

    const newAst: AssetRecord = {
      id: "ast-" + Date.now().toString(36),
      code: formCode.toUpperCase(),
      name: formName,
      category: formCategory,
      serialNumber: "SN-" + Math.floor(100000 + Math.random() * 900000),
      acquisitionDate: new Date().toISOString().split("T")[0],
      acquisitionCost: parseFloat(formCost.replace(/,/g, "")) || 10000000,
      salvageValue: parseFloat(formSalvage.replace(/,/g, "")) || 1000000,
      usefulLifeYears: parseInt(formUsefulLife, 10) || 5,
      depreciationMethod: formMethod,
      currentHours: 0,
      fuelRatePerHourLtrs: 15,
      allocatedProject: "Horizon Commercial Towers",
      allocatedSection: formSection || "General Site Allocation",
      custodian: activeRole,
      status: "Active",
      lastServicedDate: new Date().toISOString().split("T")[0],
      nextServiceHours: 250,
    };

    setAssets((prev) => [newAst, ...prev]);
    setIsRegisterModalOpen(false);
    setFormCode("");
    setFormName("");
    setFormCost("");
    setFormSalvage("");
    setFormSection("");
  };

  return (
    <div className="space-y-6">
      {/* Sequence Stated Header */}
      <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="px-3 py-1 bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] rounded-lg text-xs font-black uppercase tracking-wider">
              Flow 2.7 · Plant &amp; Equipment Lifecycle
            </span>
            <span className="text-xs font-bold text-[#0A2540]/60 dark:text-slate-400">
              · Sequence: <strong className="text-[#0A2540] dark:text-amber-300">Acquire → Register → Allocate → Use → Maintain → Monitor → Retire/Dispose</strong>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight">
            Plant, Equipment &amp; Asset Depreciation Engine
          </h1>
          <p className="text-sm text-[#0A2540]/70 dark:text-slate-300 mt-1 max-w-2xl font-normal">
            Track site machinery, heavy plant utilization, run-hour maintenance triggers, and live straight-line / reducing balance depreciation recoveries charged to BOQ packages.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="min-h-[46px] px-6 py-3 bg-[#0A2540] hover:bg-[#003366] dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-[#0A2540] rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Plant Asset</span>
        </button>
      </div>

      {/* Financial Health & Valuation Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60 dark:text-slate-400">
            Total Plant Acquisition Cost
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-2">
            {formatCurrency(fleetSummary.totalAcquisition, currency)}
          </div>
          <div className="text-xs font-bold text-[#0A2540]/70 dark:text-slate-400 mt-1">
            {assets.length} Registered Machines &amp; Tools
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Accumulated Depreciation
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-rose-700 dark:text-rose-400 mt-2">
            -{formatCurrency(fleetSummary.totalAccumulatedDep, currency)}
          </div>
          <div className="text-xs font-bold text-rose-800 dark:text-rose-300 mt-1">
            {Math.round((fleetSummary.totalAccumulatedDep / (fleetSummary.totalAcquisition || 1)) * 100)}% Depreciated To-Date
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Net Book Value (Current Asset Base)
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-2">
            {formatCurrency(fleetSummary.totalNBV, currency)}
          </div>
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1">
            Audit Balance Sheet Valuation
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60 dark:text-slate-400">
            Monthly Cost Recovery (BOQ Charge)
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-[#0A2540] dark:text-amber-400 mt-2">
            {formatCurrency(fleetSummary.totalMonthlyCharge, currency)}
          </div>
          <div className="text-xs font-bold text-[#0A2540]/70 dark:text-slate-400 mt-1">
            Allocated into Project Plant Ledger
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[#E5E5DE] dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("fleet")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "fleet"
              ? "bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] shadow-xs"
              : "text-[#0A2540]/70 dark:text-slate-300 hover:bg-[#FAF9F5] dark:hover:bg-white/5"
          }`}
        >
          Fleet &amp; Equipment Register ({assets.length})
        </button>
        <button
          onClick={() => setActiveTab("depreciation")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "depreciation"
              ? "bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] shadow-xs"
              : "text-[#0A2540]/70 dark:text-slate-300 hover:bg-[#FAF9F5] dark:hover:bg-white/5"
          }`}
        >
          Depreciation Schedules &amp; NBV
        </button>
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "maintenance"
              ? "bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] shadow-xs"
              : "text-[#0A2540]/70 dark:text-slate-300 hover:bg-[#FAF9F5] dark:hover:bg-white/5"
          }`}
        >
          Maintenance &amp; Service Triggers
        </button>
        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "calculator"
              ? "bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] shadow-xs"
              : "text-[#0A2540]/70 dark:text-slate-300 hover:bg-[#FAF9F5] dark:hover:bg-white/5"
          }`}
        >
          Interactive Depreciation Simulator
        </button>
      </div>

      {/* TAB 1: FLEET & ASSET REGISTER */}
      {activeTab === "fleet" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/40 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search asset code, name, serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white placeholder:text-[#0A2540]/40 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0A2540] dark:focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-11 px-3 bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Earthmoving">Earthmoving</option>
                <option value="Power Generation">Power Generation</option>
                <option value="Concrete & Batching">Concrete &amp; Batching</option>
                <option value="Haulage & Transport">Haulage &amp; Transport</option>
                <option value="Survey & Testing">Survey &amp; Testing</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-3 bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active on Site</option>
                <option value="Maintenance">In Workshop</option>
                <option value="Idle">Idle Yard</option>
                <option value="Disposed">Retired / Disposed</option>
              </select>
            </div>
          </div>

          {/* Asset Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredAssets.map((ast) => {
              const dep = calculateDepreciation(ast);
              const isMaintenance = ast.status === "Maintenance";

              return (
                <div
                  key={ast.id}
                  className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs hover:border-[#0A2540] dark:hover:border-amber-400 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-white bg-[#0A2540] dark:bg-amber-400 dark:text-[#0A2540] px-2.5 py-0.5 rounded-md">
                          {ast.code}
                        </span>
                        <span className="text-[11px] font-bold text-[#0A2540]/60 dark:text-slate-400">
                          {ast.category}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#0A2540] dark:text-white mt-1.5">
                        {ast.name}
                      </h3>
                      <div className="text-xs font-mono text-[#0A2540]/60 dark:text-slate-400 mt-0.5">
                        SN: {ast.serialNumber} · Custodian: {ast.custodian}
                      </div>
                    </div>

                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full border shrink-0 ${
                        ast.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : isMaintenance
                          ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                          : "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {ast.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-[#FAF9F5] dark:bg-[#071324] rounded-xl border border-[#E5E5DE] dark:border-white/10 text-xs">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#0A2540]/60 dark:text-slate-400">
                        Acquisition Cost
                      </div>
                      <div className="font-mono font-black text-[#0A2540] dark:text-white mt-0.5">
                        {formatCurrency(ast.acquisitionCost, currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Current NBV
                      </div>
                      <div className="font-mono font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {formatCurrency(dep.netBookValue, currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#0A2540]/60 dark:text-slate-400">
                        Total Run Hours
                      </div>
                      <div className="font-mono font-black text-[#0A2540] dark:text-white mt-0.5">
                        {ast.currentHours.toLocaleString()} hrs
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#0A2540]/70 dark:text-slate-300 pt-1">
                    <div>
                      <strong>Location:</strong> {ast.allocatedSection}
                    </div>
                    <div className="font-mono text-xs font-bold text-[#0A2540] dark:text-amber-400">
                      Recovery: ₦{Math.round(dep.hourlyRecoveryRate).toLocaleString()}/hr
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DEPRECIATION SCHEDULES */}
      {activeTab === "depreciation" && (
        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#E5E5DE] dark:border-white/10">
            <div>
              <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                Straight-Line &amp; Reducing Balance Depreciation Ledger
              </h3>
              <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-0.5">
                Audit breakdown of asset useful life, monthly depreciation charge, and remaining book equity.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 rounded-lg">
                GAAP &amp; IFRS Compliant
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#E5E5DE] dark:border-white/10 bg-[#FAF9F5] dark:bg-[#071324] text-[#0A2540] dark:text-white uppercase font-black tracking-wider">
                  <th className="p-3">Asset Code &amp; Name</th>
                  <th className="p-3">Method</th>
                  <th className="p-3 text-right">Cost (₦)</th>
                  <th className="p-3 text-right">Salvage (₦)</th>
                  <th className="p-3 text-center">Life</th>
                  <th className="p-3 text-right">Monthly Dep (₦)</th>
                  <th className="p-3 text-right">Accumulated (₦)</th>
                  <th className="p-3 text-right">Net Book Value (₦)</th>
                  <th className="p-3 text-center">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5DE] dark:divide-white/10 font-bold text-slate-800 dark:text-slate-200">
                {assets.map((ast) => {
                  const dep = calculateDepreciation(ast);
                  const remainingMonths = Math.max(0, ast.usefulLifeYears * 12 - dep.monthsElapsed);

                  return (
                    <tr key={ast.id} className="hover:bg-[#FAF9F5]/70 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="font-black text-[#0A2540] dark:text-white font-mono">{ast.code}</div>
                        <div className="text-[11px] text-[#0A2540]/70 dark:text-slate-400 truncate max-w-xs">{ast.name}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 text-[10px] font-mono font-black">
                          {ast.depreciationMethod}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-[#0A2540] dark:text-white">
                        {ast.acquisitionCost.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-[#0A2540]/60 dark:text-slate-400">
                        {ast.salvageValue.toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-mono">{ast.usefulLifeYears} yrs</td>
                      <td className="p-3 text-right font-mono text-rose-700 dark:text-rose-400">
                        {Math.round(dep.monthlyDepreciation).toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-rose-700 dark:text-rose-400">
                        {Math.round(dep.accumulatedDepreciation).toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-700 dark:text-emerald-400 font-black">
                        {Math.round(dep.netBookValue).toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-mono">
                        {Math.floor(remainingMonths / 12)}y {remainingMonths % 12}m
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE & SERVICE TRIGGERS */}
      {activeTab === "maintenance" && (
        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#E5E5DE] dark:border-white/10">
            <div>
              <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                Equipment Maintenance &amp; Run-Hour Triggers
              </h3>
              <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-0.5">
                Automatic servicing alerts based on cumulative engine run-hours to prevent costly downtime on critical site pour days.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {assets.map((ast) => {
              const hoursUntilService = ast.nextServiceHours - ast.currentHours;
              const isUrgent = hoursUntilService <= 150;

              return (
                <div
                  key={ast.id}
                  className="p-5 rounded-xl border-2 border-[#E5E5DE] dark:border-white/10 bg-[#FAF9F5] dark:bg-[#071324] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-[#0A2540] dark:text-amber-400" />
                      <span className="font-mono font-black text-sm text-[#0A2540] dark:text-white">{ast.code}</span>
                    </div>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isUrgent
                          ? "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {isUrgent ? "Service Due Soon" : "Operating Normal"}
                    </span>
                  </div>

                  <div className="text-sm font-black text-[#0A2540] dark:text-white">{ast.name}</div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <div className="text-[10px] text-[#0A2540]/60 dark:text-slate-400 font-bold uppercase">Current Hours</div>
                      <div className="font-mono font-black text-[#0A2540] dark:text-white">{ast.currentHours} hrs</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#0A2540]/60 dark:text-slate-400 font-bold uppercase">Next Service At</div>
                      <div className="font-mono font-black text-[#0A2540] dark:text-white">{ast.nextServiceHours} hrs</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#0A2540]/60 dark:text-slate-400 font-bold uppercase">Hours Buffer</div>
                      <div className={`font-mono font-black ${isUrgent ? "text-rose-600" : "text-emerald-600"}`}>
                        {hoursUntilService} hrs left
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E5DE] dark:border-white/10 flex items-center justify-between text-xs text-[#0A2540]/70 dark:text-slate-300">
                    <span>Last Serviced: {ast.lastServicedDate}</span>
                    <button
                      onClick={() => alert(`Service log opened for ${ast.code}`)}
                      className="text-xs font-black text-[#0A2540] dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Log Service Work →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE SIMULATOR */}
      {activeTab === "calculator" && (
        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b-2 border-[#E5E5DE] dark:border-white/10">
            <h3 className="text-xl font-black text-[#0A2540] dark:text-white">
              Interactive Capital Asset Depreciation Simulator
            </h3>
            <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-1">
              Test straight-line versus reducing balance schedules before procuring plant machinery or committing site equipment leases.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-4 bg-[#FAF9F5] dark:bg-[#071324] p-5 rounded-2xl border-2 border-[#E5E5DE] dark:border-white/10">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1.5">
                  Asset Acquisition Cost (₦ NGN)
                </label>
                <input
                  type="number"
                  value={calcCost}
                  onChange={(e) => setCalcCost(Number(e.target.value))}
                  className="w-full h-11 px-4 bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-sm font-black font-mono text-[#0A2540] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1.5">
                  Residual / Salvage Value (₦ NGN)
                </label>
                <input
                  type="number"
                  value={calcSalvage}
                  onChange={(e) => setCalcSalvage(Number(e.target.value))}
                  className="w-full h-11 px-4 bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-sm font-black font-mono text-[#0A2540] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1.5">
                  Useful Life (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={calcLife}
                  onChange={(e) => setCalcLife(Number(e.target.value))}
                  className="w-full h-11 px-4 bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-sm font-black font-mono text-[#0A2540] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1.5">
                  Depreciation Accounting Method
                </label>
                <select
                  value={calcMethod}
                  onChange={(e) => setCalcMethod(e.target.value as any)}
                  className="w-full h-11 px-4 bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-sm font-extrabold text-[#0A2540] dark:text-white"
                >
                  <option value="Straight-Line">Straight-Line Method (Uniform)</option>
                  <option value="Reducing Balance">Reducing Balance Method (20% p.a.)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 p-5 rounded-2xl">
                  <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60 dark:text-slate-400">
                    Annual Depreciation
                  </div>
                  <div className="text-2xl font-black font-mono text-rose-700 dark:text-rose-400 mt-1.5">
                    {formatCurrency((calcCost - calcSalvage) / calcLife, currency)}
                  </div>
                </div>

                <div className="bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 p-5 rounded-2xl">
                  <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60 dark:text-slate-400">
                    Monthly Recovery Charge
                  </div>
                  <div className="text-2xl font-black font-mono text-[#0A2540] dark:text-white mt-1.5">
                    {formatCurrency((calcCost - calcSalvage) / (calcLife * 12), currency)}
                  </div>
                </div>

                <div className="bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 p-5 rounded-2xl">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Hourly Cost Rate
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1.5">
                    ₦{Math.round((calcCost - calcSalvage) / (calcLife * 2000)).toLocaleString()}/hr
                  </div>
                </div>
              </div>

              {/* Year by Year Projection */}
              <div className="border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-[#FAF9F5] dark:bg-[#071324] border-b-2 border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-white font-black">
                      <th className="p-3">Year</th>
                      <th className="p-3 text-right">Opening NBV</th>
                      <th className="p-3 text-right">Depreciation Charge</th>
                      <th className="p-3 text-right">Closing NBV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5DE] dark:divide-white/10">
                    {Array.from({ length: calcLife }).map((_, i) => {
                      const year = i + 1;
                      const annual = (calcCost - calcSalvage) / calcLife;
                      const opening = calcCost - annual * (year - 1);
                      const closing = Math.max(calcSalvage, opening - annual);

                      return (
                        <tr key={year} className="hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="p-3 font-black text-[#0A2540] dark:text-white">Year {year}</td>
                          <td className="p-3 text-right">{Math.round(opening).toLocaleString()}</td>
                          <td className="p-3 text-right text-rose-700 dark:text-rose-400">-{Math.round(annual).toLocaleString()}</td>
                          <td className="p-3 text-right font-black text-emerald-700 dark:text-emerald-400">{Math.round(closing).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER ASSET MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#E5E5DE] dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-white flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0A2540] dark:text-white">Register Plant Machinery</h3>
                  <p className="text-xs text-[#0A2540]/60 dark:text-slate-400">Acquire → Register step in asset lifecycle</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-9 h-9 rounded-xl border-2 border-[#E5E5DE] dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterAsset} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1">
                    Asset Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PL-CAT-320"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full h-11 px-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-11 px-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black"
                  >
                    <option value="Earthmoving">Earthmoving</option>
                    <option value="Power Generation">Power Generation</option>
                    <option value="Concrete & Batching">Concrete &amp; Batching</option>
                    <option value="Haulage & Transport">Haulage &amp; Transport</option>
                    <option value="Survey & Testing">Survey &amp; Testing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1">
                  Machinery / Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Komatsu PC200-8 Excavator"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-11 px-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1">
                    Acquisition Cost (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 75000000"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    className="w-full h-11 px-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1">
                    Salvage Value (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 10000000"
                    value={formSalvage}
                    onChange={(e) => setFormSalvage(e.target.value)}
                    className="w-full h-11 px-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1">
                    Useful Life (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formUsefulLife}
                    onChange={(e) => setFormUsefulLife(e.target.value)}
                    className="w-full h-11 px-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1">
                    Depreciation Method
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full h-11 px-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black"
                  >
                    <option value="Straight-Line">Straight-Line</option>
                    <option value="Reducing Balance">Reducing Balance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-300 mb-1">
                  Site Section / BOQ Workpackage Allocation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Substructure Raft Foundation"
                  value={formSection}
                  onChange={(e) => setFormSection(e.target.value)}
                  className="w-full h-11 px-3 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5DE] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-[#E5E5DE] text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  Register Asset &amp; Start Depreciation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
