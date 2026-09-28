"use client";

import React, { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { useAppData } from "@/lib/store/app-data";
import { useApp } from "@/app/providers";
import {
  Sparkles,
  Calculator,
  Building2,
  MapPin,
  Layers,
  Clock,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  Sliders,
  DollarSign,
  Info,
  ArrowLeft,
  Loader2,
  Plus,
} from "lucide-react";

interface ConstructionType {
  id: string;
  name: string;
  category: "Residential" | "Commercial" | "Industrial" | "Healthcare" | "Custom";
  defaultGFA: number;
  defaultFloors: number;
  baseRatePerSqm: number; // in NGN
  durationMonths: number;
  description: string;
}

const CONSTRUCTION_TYPES: ConstructionType[] = [
  {
    id: "residential-multi",
    name: "Multi-Family Residential Apartments",
    category: "Residential",
    defaultGFA: 2200,
    defaultFloors: 6,
    baseRatePerSqm: 510000,
    durationMonths: 16,
    description: "Suspended beam & slab frame, dual lifts, dedicated generator house, and perimeter drainage.",
  },
  {
    id: "residential-duplex",
    name: "Detached Villa / Residential Duplex",
    category: "Residential",
    defaultGFA: 450,
    defaultFloors: 2,
    baseRatePerSqm: 420000,
    durationMonths: 9,
    description: "High-end residential structure with reinforced raft, masonry enclosure, and premium domestic services.",
  },
  {
    id: "commercial-office",
    name: "Commercial Office Complex",
    category: "Commercial",
    defaultGFA: 4800,
    defaultFloors: 8,
    baseRatePerSqm: 680000,
    durationMonths: 22,
    description: "Grade A office space, curtain walling, VRV HVAC, dual escalators, and basement parking.",
  },
  {
    id: "industrial-warehouse",
    name: "Industrial Logistics Warehouse",
    category: "Industrial",
    defaultGFA: 3200,
    defaultFloors: 1,
    baseRatePerSqm: 290000,
    durationMonths: 8,
    description: "Portal steel frame, heavy-duty laser-screed floor slab, insulated sandwich roofing, loading docks.",
  },
  {
    id: "healthcare-clinic",
    name: "Healthcare Clinic / Medical Centre",
    category: "Healthcare",
    defaultGFA: 1500,
    defaultFloors: 3,
    baseRatePerSqm: 620000,
    durationMonths: 14,
    description: "Medical-grade MEP, sterile wall cladding, clean-room ventilation, and back-up power redundant systems.",
  },
];

const LOCATIONS = [
  { id: "lagos-island", name: "Lagos Island (Ikoyi, V.I., Lekki Phase 1)", factor: 1.25, soilDesc: "High water table, piling or heavy raft required" },
  { id: "lagos-mainland", name: "Lagos Mainland (Ikeja, Yaba, Surulere)", factor: 1.10, soilDesc: "Moderate bearing capacity, raft or reinforced pad" },
  { id: "abuja-cbd", name: "Abuja FCT (Central District, Maitama)", factor: 1.18, soilDesc: "Firm rocky terrain, strip/pad footings, higher plant freight" },
  { id: "rivers-ph", name: "Port Harcourt / Rivers (Trans-Amadi)", factor: 1.22, soilDesc: "Marsh/coastal silt, ground improvement & piling likely" },
  { id: "ibadan-oyo", name: "Ibadan / Oyo (Monetized logistics corridor)", factor: 0.95, soilDesc: "Competent laterite, standard footing foundation" },
  { id: "enugu-se", name: "Enugu / South-East Corridor", factor: 0.98, soilDesc: "Stable lateritic clay, standard strip foundation" },
  { id: "kano-north", name: "Kano / Northern Commercial Zone", factor: 0.96, soilDesc: "Dry sandy laterite, shallow strip foundations" },
];

const FINISH_TIERS = [
  { id: "standard", name: "Commercial Standard", factor: 1.0, desc: "Vitrified tiles, emulsion paint, quality local joinery, standard sanitary ware" },
  { id: "premium", name: "Premium Commercial", factor: 1.22, desc: "Porcelain slabs, POP recessed lighting, acoustic ceilings, Hansgrohe/equivalent fittings" },
  { id: "luxury", name: "High-End Luxury / Expat", factor: 1.48, desc: "Imported Italian marble, smart automation, double-glazed acoustic curtain wall, designer fixtures" },
];

const FOUNDATION_TYPES = [
  { id: "strip", name: "Normal Firm Soil (Strip / Pad Footing)", factor: 1.0 },
  { id: "raft", name: "Soft Clay / Sand (Reinforced Raft Slab)", factor: 1.15 },
  { id: "piles", name: "Swamp / Deep Foundation (Precast / Bored Piles)", factor: 1.35 },
];

export function AICostEstimator({
  onGenerateBOQ,
  onBack,
}: {
  onGenerateBOQ?: () => void;
  onBack?: () => void;
}) {
  const { addBOQItem } = useAppData();
  const { currency, currentProject } = useApp();

  const [projectTitle, setProjectTitle] = useState(currentProject.name || "Commercial Project");
  const [selectedType, setSelectedType] = useState<string>("residential-multi");
  const [gfa, setGfa] = useState<number>(2200);
  const [storeys, setStoreys] = useState<number>(6);
  const [locationId, setLocationId] = useState<string>("lagos-island");
  const [finishTier, setFinishTier] = useState<string>("premium");
  const [foundationType, setFoundationType] = useState<string>("raft");
  const [contingencyPct, setContingencyPct] = useState<number>(7.5);
  const [inflationBufferPct, setInflationBufferPct] = useState<number>(12.0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Apply construction type default
  const handleTypeSelect = (t: ConstructionType) => {
    setSelectedType(t.id);
    setGfa(t.defaultGFA);
    setStoreys(t.defaultFloors);
  };

  const currentType = useMemo(() => {
    return CONSTRUCTION_TYPES.find((t) => t.id === selectedType) || CONSTRUCTION_TYPES[0];
  }, [selectedType]);

  const location = useMemo(() => {
    return LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];
  }, [locationId]);

  const finish = useMemo(() => {
    return FINISH_TIERS.find((f) => f.id === finishTier) || FINISH_TIERS[0];
  }, [finishTier]);

  const foundation = useMemo(() => {
    return FOUNDATION_TYPES.find((f) => f.id === foundationType) || FOUNDATION_TYPES[0];
  }, [foundationType]);

  // Dynamic cost calculation engine
  const calculations = useMemo(() => {
    const baseRate = currentType.baseRatePerSqm;
    // Composite rate per sqm
    const compositeRate = baseRate * location.factor * finish.factor * foundation.factor;
    const baseTargetBudget = compositeRate * gfa;

    const contingencyAmount = baseTargetBudget * (contingencyPct / 100);
    const inflationBuffer = baseTargetBudget * (inflationBufferPct / 100);

    const targetTotal = Math.round(baseTargetBudget + contingencyAmount + inflationBuffer);
    const minTotal = Math.round(targetTotal * 0.92);
    const maxTotal = Math.round(targetTotal * 1.12);

    const ratePerSqm = Math.round(targetTotal / (gfa || 1));

    // Construction duration estimate
    const baseMonths = currentType.durationMonths;
    const scaleFactor = Math.sqrt(gfa / currentType.defaultGFA);
    const estimatedMonths = Math.max(3, Math.round(baseMonths * scaleFactor));

    // Elemental Breakdown (CESMM4 / NRM2 standard construction packages)
    const elements = [
      {
        code: "EST-SUB-01",
        name: "Substructure & Ground Foundation",
        category: "Substructure",
        pct: 18,
        cost: Math.round(targetTotal * 0.18),
        details: `${foundation.name} with reinforced concrete, excavation & tanking`,
      },
      {
        code: "EST-STR-02",
        name: "Reinforced Concrete Frame & Superstructure",
        category: "Concrete",
        pct: 30,
        cost: Math.round(targetTotal * 0.30),
        details: `Columns, shear walls, lift cores, and suspended slabs (${storeys} storeys)`,
      },
      {
        code: "EST-ENV-03",
        name: "External Envelope & Blockwork Masonry",
        category: "Masonry",
        pct: 13,
        cost: Math.round(targetTotal * 0.13),
        details: "Sand-cement 225mm vibrated blocks, parapet coping, and external plastering",
      },
      {
        code: "EST-MEP-04",
        name: "Mechanical, Electrical & Public Health (MEP)",
        category: "MEP",
        pct: 17,
        cost: Math.round(targetTotal * 0.17),
        details: "Conduits, cable trays, piping, water supply, sewage treatment, earthing",
      },
      {
        code: "EST-FIN-05",
        name: "Internal Architectural Finishes & Glazing",
        category: "Finishes",
        pct: 14,
        cost: Math.round(targetTotal * 0.14),
        details: `${finish.name} specification (tiling, screeding, joinery, doors & windows)`,
      },
      {
        code: "EST-EXT-06",
        name: "External Works, Drainage & Landscaping",
        category: "External Works",
        pct: 8,
        cost: Math.round(targetTotal * 0.08),
        details: "Interlocking paving stones, perimeter security fence, gate house, drainage",
      },
    ];

    // Estimated Raw Material Quantities Benchmark
    const cementBags = Math.round(gfa * 5.2);
    const rebarTonnes = Math.round(gfa * 0.082);
    const sandTrips = Math.round(gfa * 0.18);
    const graniteTrips = Math.round(gfa * 0.22);

    return {
      minTotal,
      targetTotal,
      maxTotal,
      ratePerSqm,
      estimatedMonths,
      elements,
      cementBags,
      rebarTonnes,
      sandTrips,
      graniteTrips,
      contingencyAmount,
      inflationBuffer,
    };
  }, [currentType, gfa, storeys, location, finish, foundation, contingencyPct, inflationBufferPct]);

  const handleExportProForma = () => {
    window.print();
  };

  // REAL ACTION: Populate actual Master BOQ items and navigate
  const handleApplyDraftBOQ = async () => {
    setIsGenerating(true);
    setSuccessNotice(null);

    try {
      // Create real BOQ item objects and insert into store
      for (const el of calculations.elements) {
        const newItem = {
          id: `est-${Date.now()}-${el.code.toLowerCase()}`,
          code: el.code,
          description: `${el.name} (${projectTitle}) — ${el.details}`,
          category: el.category,
          unit: "m²",
          quantity: gfa,
          rate: Math.round(el.cost / (gfa || 1)),
          budgetAmount: el.cost,
          committedAmount: 0,
          actualAmount: 0,
        };
        addBOQItem(newItem);
      }

      setSuccessNotice(
        `Generated ${calculations.elements.length} real elemental packages totaling ${formatCurrency(
          calculations.targetTotal,
          currency
        )} to your BOQ Master! Redirecting...`
      );

      setTimeout(() => {
        setIsGenerating(false);
        if (onGenerateBOQ) {
          onGenerateBOQ();
        }
      }, 900);
    } catch (err) {
      console.error("Error applying estimated BOQ items:", err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header Banner */}
      <div className="bg-[#0A2540] dark:bg-[#071324] rounded-3xl p-6 md:p-9 text-white shadow-xl border-2 border-[#0A2540] dark:border-[#1E3A5F] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-amber-400 text-[#0A2540] rounded-lg shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-[#0A2540]" /> AI Parametric Estimator
              </span>
              <span className="text-white/70 text-xs font-bold">
                · Live Feasibility &amp; Budget Generator
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Instant Feasibility Forecaster &amp; BOQ Generator
            </h1>
            <p className="text-sm md:text-base text-white/80 mt-2 max-w-2xl font-normal leading-relaxed">
              Calculate defensible cost estimates, delivery schedules, and raw material benchmarks for Nigerian construction projects, then commit them directly to your live BOQ Master.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="min-h-[46px] px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border-2 border-white/20 rounded-xl text-sm font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Master BOQ</span>
              </button>
            )}
            <button
              onClick={handleExportProForma}
              className="min-h-[46px] px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 rounded-xl text-sm font-black flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Feasibility Sheet</span>
            </button>
            <button
              onClick={handleApplyDraftBOQ}
              disabled={isGenerating}
              className="min-h-[46px] px-6 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Items...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Generate &amp; Add to Master BOQ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {successNotice && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-sm font-bold">{successNotice}</div>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-xs font-black underline uppercase text-white hover:text-emerald-200"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Construction Archetype Selection */}
      <div className="space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-white/70 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#0A2540] dark:text-[#FFD23F]" /> Construction Archetype
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {CONSTRUCTION_TYPES.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTypeSelect(t)}
                className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] border-[#0A2540] dark:border-[#FFD23F] shadow-md scale-[1.01]"
                    : "bg-white dark:bg-[#0A1931] text-slate-800 dark:text-white border-[#E5E5DE] dark:border-[#1E3A5F] hover:border-[#0A2540]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 dark:bg-[#0A1931]/20 text-white dark:text-[#0A1931]"
                        : "bg-slate-100 dark:bg-[#071324] text-slate-700 dark:text-white/70"
                    }`}
                  >
                    {t.category}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-[#0A1931]" />}
                </div>
                <div className="font-extrabold text-sm mt-2 leading-snug">{t.name}</div>
                <div
                  className={`mt-3 pt-2.5 border-t text-xs font-mono font-bold flex justify-between ${
                    isSelected
                      ? "border-white/15 dark:border-[#0A1931]/20 text-white/90 dark:text-[#0A1931]/90"
                      : "border-slate-100 dark:border-[#1E3A5F] text-slate-600 dark:text-white/60"
                  }`}
                >
                  <span>{t.defaultGFA} m²</span>
                  <span>{t.durationMonths} mo</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Parameters & Output Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Scope & Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-3xl p-6 md:p-7 shadow-sm space-y-6">
          <div className="pb-4 border-b-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-center justify-between">
            <h3 className="text-lg font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0A2540] dark:text-[#FFD23F]" /> Project Parameters
            </h3>
            <span className="text-xs font-bold text-slate-500 dark:text-white/50">Dynamic Recalculation</span>
          </div>

          {/* Project Title Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-extrabold text-[#0A2540] dark:text-white">Project Title / Scope</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Lekki Commercial Plaza"
              className="w-full h-11 px-3.5 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl text-sm font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
            />
          </div>

          {/* GFA Slider & Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-extrabold text-[#0A2540] dark:text-white">
              <label>Gross Floor Area (GFA)</label>
              <div className="flex items-center gap-1 font-mono text-base font-black bg-[#FAF9F5] dark:bg-[#071324] px-3 py-1 rounded-lg border border-[#E5E5DE] dark:border-[#1E3A5F]">
                <span>{gfa.toLocaleString()}</span>
                <span className="text-xs text-slate-500">m²</span>
              </div>
            </div>
            <input
              type="range"
              min={150}
              max={15000}
              step={50}
              value={gfa}
              onChange={(e) => setGfa(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-[#1E3A5F] rounded-lg appearance-none cursor-pointer accent-[#0A2540] dark:accent-[#FFD23F]"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>150 m²</span>
              <span>15,000 m²</span>
            </div>
          </div>

          {/* Storeys / Floors */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-extrabold text-[#0A2540] dark:text-white">
              <label>Number of Floors</label>
              <span className="font-mono text-sm font-black bg-[#FAF9F5] dark:bg-[#071324] px-3 py-1 rounded-lg border border-[#E5E5DE] dark:border-[#1E3A5F]">
                {storeys} {storeys === 1 ? "Level" : "Levels"}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 4, 6, 8, 12].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setStoreys(lvl)}
                  className={`py-2 rounded-xl text-xs font-black font-mono border-2 transition-all ${
                    storeys === lvl
                      ? "bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] border-[#0A2540] dark:border-[#FFD23F]"
                      : "bg-[#FAF9F5] dark:bg-[#071324] text-slate-700 dark:text-white border-[#E5E5DE] dark:border-[#1E3A5F] hover:border-slate-400"
                  }`}
                >
                  {lvl}F
                </button>
              ))}
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-[#0A2540] dark:text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600" /> Geographic Location
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl text-sm font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="dark:bg-[#0A1931]">
                  {loc.name} ({loc.factor >= 1 ? `+${Math.round((loc.factor - 1) * 100)}%` : `-${Math.round((1 - loc.factor) * 100)}%`} factor)
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 font-medium">{location.soilDesc}</p>
          </div>

          {/* Specification Grade */}
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-[#0A2540] dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" /> Architectural Finish Tier
            </label>
            <div className="space-y-2">
              {FINISH_TIERS.map((tier) => (
                <label
                  key={tier.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    finishTier === tier.id
                      ? "bg-blue-50/70 dark:bg-[#0F2137] border-[#0A2540] dark:border-[#FFD23F] text-[#0A2540] dark:text-white"
                      : "bg-[#FAF9F5] dark:bg-[#071324] border-[#E5E5DE] dark:border-[#1E3A5F] text-slate-700 dark:text-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="finishTier"
                    checked={finishTier === tier.id}
                    onChange={() => setFinishTier(tier.id)}
                    className="mt-1 accent-[#0A2540] dark:accent-[#FFD23F]"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-sm text-[#0A2540] dark:text-white">{tier.name}</div>
                    <div className="text-slate-500 dark:text-white/60 mt-0.5">{tier.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Substructure Type */}
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-[#0A2540] dark:text-white">Substructure Foundation</label>
            <select
              value={foundationType}
              onChange={(e) => setFoundationType(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
            >
              {FOUNDATION_TYPES.map((f) => (
                <option key={f.id} value={f.id} className="dark:bg-[#0A1931]">
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Risk & Inflation Sliders */}
          <div className="pt-4 border-t-2 border-[#E5E5DE] dark:border-[#1E3A5F] space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/70">
                <span>Contingency Reserve:</span>
                <span className="font-mono text-[#0A2540] dark:text-[#FFD23F] font-black">{contingencyPct}%</span>
              </div>
              <input
                type="range"
                min={3}
                max={15}
                step={0.5}
                value={contingencyPct}
                onChange={(e) => setContingencyPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-[#1E3A5F] rounded-lg appearance-none cursor-pointer accent-[#0A2540] dark:accent-[#FFD23F]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/70">
                <span>Material Volatility Buffer:</span>
                <span className="font-mono text-amber-700 dark:text-amber-400 font-black">+{inflationBufferPct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                step={1}
                value={inflationBufferPct}
                onChange={(e) => setInflationBufferPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-[#1E3A5F] rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Real-time Calculated Outputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* KPI Output Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-5 shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-white/60">Estimated Target Budget</div>
              <div className="text-2xl md:text-3xl font-black font-mono text-[#0A2540] dark:text-[#FFD23F] mt-2">
                {formatCurrency(calculations.targetTotal, currency)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-white/50 font-medium mt-1">
                Range: {formatCurrency(calculations.minTotal, currency)} - {formatCurrency(calculations.maxTotal, currency)}
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-5 shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-white/60">Unit Construction Rate</div>
              <div className="text-2xl md:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-2">
                {formatCurrency(calculations.ratePerSqm, currency)}
              </div>
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold mt-1">Per square metre (GFA)</div>
            </div>

            <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-5 shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-white/60">Estimated Duration</div>
              <div className="text-2xl md:text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-2">
                {calculations.estimatedMonths} Months
              </div>
              <div className="text-[11px] text-slate-500 dark:text-white/50 font-medium mt-1">Groundbreak to Handover</div>
            </div>
          </div>

          {/* Elemental Breakdown Table */}
          <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-3xl p-6 md:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#E5E5DE] dark:border-[#1E3A5F]">
              <div>
                <h3 className="text-lg font-black text-[#0A2540] dark:text-white">Elemental Package Distribution</h3>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">Ready to be committed directly into your active BOQ Master</p>
              </div>
              <span className="text-xs font-mono font-black px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                100% Allocated
              </span>
            </div>

            <div className="space-y-3">
              {calculations.elements.map((el) => (
                <div
                  key={el.code}
                  className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] hover:bg-slate-50 dark:hover:bg-[#0F2137] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black px-2 py-0.5 bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] rounded">
                        {el.code}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{el.name}</span>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-white/60">{el.pct}%</span>
                      <span className="font-mono font-black text-sm text-[#0A2540] dark:text-[#FFD23F]">
                        {formatCurrency(el.cost, currency)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-[#1E3A5F] h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-[#0A2540] dark:bg-[#FFD23F] h-full rounded-full" style={{ width: `${el.pct * 3}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/60 mt-2">{el.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Material Quantities Benchmark */}
          <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-3xl p-6 md:p-7 shadow-sm space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#0A2540] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Key Material Quantities Benchmark
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Rule-of-thumb consumption estimates for procurement planning before structural bar bending schedules (BBS).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-center">
                <div className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase">Cement (50kg)</div>
                <div className="text-xl font-black font-mono text-[#0A2540] dark:text-[#FFD23F] mt-1">
                  {calculations.cementBags.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">~{Math.round(calculations.cementBags / 600)} trailers</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-center">
                <div className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase">TMT High-Yield Rebar</div>
                <div className="text-xl font-black font-mono text-[#0A2540] dark:text-[#FFD23F] mt-1">
                  {calculations.rebarTonnes.toLocaleString()} T
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Y12 - Y25 structural</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-center">
                <div className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase">Sharp Sand</div>
                <div className="text-xl font-black font-mono text-[#0A2540] dark:text-[#FFD23F] mt-1">
                  {calculations.sandTrips.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">20-Tonne tipper trips</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-center">
                <div className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase">Granite Aggregates</div>
                <div className="text-xl font-black font-mono text-[#0A2540] dark:text-[#FFD23F] mt-1">
                  {calculations.graniteTrips.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">30-Tonne trailer loads</div>
              </div>
            </div>
          </div>

          {/* Risk Advisory Card */}
          <div className="p-5 rounded-2xl bg-amber-50/90 dark:bg-[#071324] border-2 border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-200 space-y-2.5">
            <div className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Commercial Risk Advisory for {location.name}
            </div>
            <ul className="text-xs space-y-1.5 text-amber-900 dark:text-amber-300 leading-relaxed list-disc list-inside">
              <li>
                <strong>Geotechnical Prerequisite:</strong> Soil conditions in {location.name} require standard cone penetration test (CPT) and borehole soil mechanics reports before executing foundation concrete.
              </li>
              <li>
                <strong>Material Inflation Buffer:</strong> A {formatCurrency(calculations.inflationBuffer, currency)} volatility allowance is provisioned to hedge against cement price spikes and foreign exchange fluctuation on imported MEP plant.
              </li>
              <li>
                <strong>Procurement Gating:</strong> All physical deliveries should be routed through CostView&apos;s automated 3-Way Match gate to enforce quoted unit rates.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
