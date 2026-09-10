"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/nav";
import {
  ArrowRight,
  CheckCircle2,
  Calculator,
  ShoppingCart,
  Boxes,
  Users,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  Building2,
  Sparkles,
  AlertTriangle,
  HardHat,
  Eye,
  FileCheck,
  ChevronDown,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#0067c0] selection:text-white relative overflow-x-hidden">
      {/* Radiant ambient atmospheric depth */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-indigo-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/15 via-sky-200/20 to-blue-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl" />
      </div>

      <MarketingNav />

      {/* HERO — Luminous Radiant Glass Canvas */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,103,192,0.12),rgba(255,255,255,0))]">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-24">
          <div className="grid xl:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-xl text-sky-800 border border-sky-200/80 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6 shadow-xs hover:border-sky-300 transition-all">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0067c0]" />
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#0067c0]" />
                <span>Construction Cost Intelligence — v2.0</span>
              </div>
              <h1 className="text-[44px] md:text-[60px] lg:text-[68px] font-extrabold leading-[1.04] tracking-tight text-slate-900">
                Analyse. Plan.<br />
                <span className="bg-gradient-to-r from-[#0067c0] via-[#0284c7] to-[#38bdf8] bg-clip-text text-transparent">
                  Build Smarter.
                </span>
              </h1>
              <p className="mt-6 text-base md:text-lg font-normal leading-relaxed text-slate-600 max-w-xl">
                The unified intelligent system of record for <span className="font-semibold text-slate-900">budget, procurement, site progress</span>, and project margins. Eliminate spreadsheet drift — command every naira from BOQ master to final account with audit trails the QS can defend.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group px-7 py-3.5 bg-gradient-to-r from-[#0067c0] to-[#0284c7] hover:from-[#005ba1] hover:to-[#0275b0] text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all active:scale-[0.98] hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Start Building Free <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/register"
                  className="px-7 py-3.5 bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 rounded-xl font-semibold text-sm shadow-xs backdrop-blur-md transition-all hover:border-slate-300 hover:shadow-card"
                >
                  Create Workspace
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No credit card required
                </span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <span>₦ NGN Native</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <span>8 Pre-Seeded RBAC Roles</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <span>Audit Trail RLS</span>
              </div>
              <div className="mt-6 flex items-center gap-4 p-3.5 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-pearl max-w-lg hover:border-sky-200 transition-all">
                <div className="flex -space-x-2">
                  {["PM", "QS", "SE", "AC"].map((initial, i) => (
                    <div
                      key={initial}
                      className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs ${
                        i === 0
                          ? "bg-gradient-to-br from-[#0067c0] to-[#0284c7]"
                          : i === 1
                          ? "bg-gradient-to-br from-sky-500 to-cyan-600"
                          : i === 2
                          ? "bg-gradient-to-br from-indigo-500 to-slate-700"
                          : "bg-gradient-to-br from-emerald-500 to-teal-600"
                      }`}
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Trusted by 120+ active site &amp; commercial teams</div>
                  <div className="text-[11px] text-slate-500">Victoria Island · Lekki · Eko Atlantic · Abuja</div>
                </div>
              </div>
            </div>

            {/* Interactive Crystalline Preview Card */}
            <div className="relative group">
              <div className="bg-white/95 backdrop-blur-2xl border border-sky-100 rounded-3xl shadow-pearl overflow-hidden transition-all duration-300 group-hover:shadow-glass-hover group-hover:-translate-y-0.5">
                <div className="h-11 bg-slate-50/90 border-b border-slate-200/70 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-rose-400 rounded-full" />
                    <span className="w-3 h-3 bg-amber-400 rounded-full" />
                    <span className="w-3 h-3 bg-emerald-400 rounded-full" />
                    <span className="ml-3 text-xs font-mono font-medium text-slate-500 tracking-wider hidden sm:inline">
                      COSTVIEW 360 · HORIZON TOWERS
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Live System Active
                  </span>
                </div>
                <div className="p-6 bg-gradient-to-b from-white/95 to-slate-50/70 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-card">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Approved Budget</div>
                      <div className="text-lg font-bold font-mono text-slate-900 mt-1">₦301.8M</div>
                      <div className="h-1.5 bg-[#0067c0] rounded-full mt-2" />
                    </div>
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50/80 border border-sky-200/80 rounded-2xl p-4 shadow-card">
                      <div className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider">Committed POs</div>
                      <div className="text-lg font-bold font-mono text-slate-900 mt-1">₦292.2M</div>
                      <div className="h-1.5 bg-[#0067c0] rounded-full mt-2" />
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-card">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actual Certified</div>
                      <div className="text-lg font-bold font-mono text-slate-900 mt-1">₦216.4M</div>
                      <div className="h-1.5 bg-emerald-500 rounded-full mt-2" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-800">BOQ Variance &amp; Gatekeeper Monitor</span>
                      <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                        ±5% THRESHOLD
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <span className="w-20 font-mono text-slate-800">CON-02.01</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-[#0067c0] w-[78%]" />
                          <div className="h-full bg-amber-400 w-[12%]" />
                        </div>
                        <span className="font-mono text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                          OVER
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <span className="w-20 font-mono text-slate-800">STL-02.03</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0067c0] w-[92%]" />
                        </div>
                        <span className="font-mono text-[10px] bg-blue-50 text-[#0067c0] border border-blue-200 px-2 py-0.5 rounded-full">
                          ON TRACK
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-rose-50/80 border border-rose-200/80 p-3 text-rose-700 font-semibold text-xs rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>1 Invoice Discrepancy Locked</span>
                    </div>
                    <div className="bg-blue-50/80 border border-blue-200/80 p-3 text-[#0067c0] font-semibold text-xs rounded-xl flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>+₦4M Revision Pending QS Approval</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-md border border-slate-200/80 px-4 py-2 rounded-xl shadow-pearl text-xs font-semibold text-slate-800 hidden md:flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Immutable RLS Audit Trail
              </div>
              <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md border border-sky-200/80 px-4 py-2 rounded-xl shadow-pearl text-xs font-bold text-[#0067c0] font-mono hidden md:block">
                ZERO SPREADSHEET DRIFT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR — Bright Luminous Acrylic Strip */}
      <section className="bg-white/80 backdrop-blur-xl border-y border-slate-200/80 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { k: "₦450M+", v: "Avg Budget Managed Per Project" },
            { k: "3-WAY", v: "PO ⇄ GRN ⇄ Invoice Match Engine" },
            { k: "8 ROLES", v: "Pre-Configured RBAC Permissions" },
            { k: "99.9%", v: "Audit Trail Compliance Coverage" },
          ].map((s) => (
            <div key={s.k} className="p-4">
              <div className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-[#0067c0] to-[#0284c7] bg-clip-text text-transparent">
                {s.k}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE CHALLENGE VS COSTVIEW SOLUTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 px-3.5 py-1 rounded-full text-xs font-semibold">
              The Reality
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Spreadsheets <span className="bg-gradient-to-r from-[#0067c0] to-[#0284c7] bg-clip-text text-transparent">Don&apos;t Scale</span> on Construction Sites
            </h2>
            <p className="mt-4 text-base font-normal text-slate-600 leading-relaxed">
              Every contractor and developer knows the friction: BOQ in Excel, purchase orders on WhatsApp, delivery receipts on loose slips, invoices buried in email threads. By month three, nobody knows the true margin.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  title: "₦4.35M Overpayment on One Delivery",
                  desc: "A supplier invoiced for 30 Tons, delivered only 27. Without automated three-way matching, accounting pays for phantom materials.",
                },
                {
                  title: "±15% BOQ Drift by Mid-Project",
                  desc: "Unrecorded variations lead to unapproved cost creep. When the client disputes claims, the QS lacks defensible audit trails.",
                },
                {
                  title: "Blind Inventory & Material Stockouts",
                  desc: "Cement bags and rebar counted by eye. Unexpected stockouts halt concrete pours, triggering costly subcontractor standing-time claims.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 shadow-card hover:border-blue-200 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-card p-6 md:p-8">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2.5">
                <HardHat className="w-5 h-5 text-[#0067c0]" /> What Site &amp; Commercial Teams Actually Need
              </h3>
              <ul className="mt-5 space-y-3.5">
                {[
                  "One unified live figure for Approved vs Committed vs Actual spend",
                  "Every budget modification requires an explicit reason and timestamped approver",
                  "PO quantity and invoice rate must match physical GRN before payment unlocks",
                  "Storekeeper sees on-hand, reserved, and consumed stock in real time",
                  "PM monitors true commercial margin (e.g., 35% target vs 28% actual) rather than raw spend",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0067c0] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 backdrop-blur-xl border border-blue-200/80 rounded-2xl shadow-card p-6 md:p-8">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0067c0]">
                <Eye className="w-4 h-4" /> The CostView Continuous Workflow
              </div>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                From BOQ Master → Requisition → RFQ → PO → Goods Received Note (GRN) → 3-Way Match → Payment → Stock Ledger → Site Diary → Final Account. One connected chain. Zero spreadsheet drift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM MODULES — Bento Grid */}
      <section id="features" className="bg-white/80 backdrop-blur-xl border-y border-slate-200/80 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0067c0] border border-blue-200/80 px-3.5 py-1 rounded-full text-xs font-semibold">
                Platform Architecture
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Every Cost. Every Site. <span className="text-[#0067c0]">One Command Center.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600 leading-relaxed">
              Purpose-built for demanding construction reality — Naira-native, offline-tolerant, and role-enforced from initial tender to final account.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calculator,
                title: "BOQ & Budget Control",
                bullets: [
                  "CSV import with hierarchical cost codes",
                  "Automated ±5% variance threshold monitoring",
                  "Revision delta requires documented justification",
                  "Final account QS adjustments without blocking work",
                ],
              },
              {
                icon: ShoppingCart,
                title: "Procurement & 3-Way Match",
                bullets: [
                  "Requisition to RFQ to Purchase Order workflow",
                  "Multi-supplier quote comparisons side-by-side",
                  "GRN vs Invoice quantity locking mechanism",
                  "Variance detection auto-holds disbursements",
                ],
              },
              {
                icon: Boxes,
                title: "Materials & Inventory",
                bullets: [
                  "Live on-hand, reserved, and consumed stock levels",
                  "Low-threshold automatic reorder notifications",
                  "Inter-site material transfers with gate-pass validation",
                  "Consumption logs tied directly to BOQ work items",
                ],
              },
              {
                icon: Users,
                title: "Labour & Muster Roll",
                bullets: [
                  "Daily headcount and shift roster management",
                  "Subcontractor trade and gang attendance tracking",
                  "Overtime multipliers and payroll export capability",
                  "Productivity ratios measured per BOQ item",
                ],
              },
              {
                icon: TrendingUp,
                title: "Site Diary & Snags",
                bullets: [
                  "Weather-stamped daily shift execution records",
                  "Active crew headcounts and equipment logs",
                  "Snag and NCR logging with photo evidence",
                  "Closed-loop remediation tracking and approvals",
                ],
              },
              {
                icon: Building2,
                title: "Commercial Mode",
                bullets: [
                  "GDV vs Total Development Cost tracking",
                  "Real-time 35% margin sensitivity calculator",
                  "Bank debt drawdown and interest calculations",
                  "Off-plan sales ledger and receivables schedule",
                ],
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-card p-6 hover:shadow-glass-hover hover:border-blue-300 hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0067c0] to-[#0284c7] text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{f.title}</h3>
                <ul className="mt-4 space-y-2 flex-1">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <span className="mt-1 w-1.5 h-1.5 bg-[#0067c0] rounded-full shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 PERSONAS — RBAC */}
      <section id="personas" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0067c0] border border-blue-200/80 px-3.5 py-1 rounded-full text-xs font-semibold">
            Role-Based Access Control
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Tailored For <span className="text-[#0067c0]">Every Stakeholder</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Strict RBAC ensures site engineers cannot approve commercial budgets, and quantity surveyors cannot falsify physical store deliveries. Demo accounts seeded below — password <span className="font-mono font-bold bg-blue-50 text-[#0067c0] px-2 py-0.5 rounded border border-blue-200">DemoPass2026!</span>
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { role: "Admin", user: "admin@costview.ng", desc: "Full permissions & system governance", badge: "bg-purple-50 text-purple-700 border-purple-200" },
            { role: "Project Manager", user: "pm@costview.ng", desc: "Budgets, procurement & reports studio", badge: "bg-blue-50 text-[#0067c0] border-blue-200" },
            { role: "Quantity Surveyor", user: "qs@costview.ng", desc: "BOQ master, variations & valuations", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
            { role: "Site Engineer", user: "site@costview.ng", desc: "Daily materials, labour & site diary", badge: "bg-amber-50 text-amber-700 border-amber-200" },
            { role: "Procurement Officer", user: "procure@costview.ng", desc: "RFQs, purchase orders & 3-way match", badge: "bg-sky-50 text-sky-700 border-sky-200" },
            { role: "Accountant", user: "acct@costview.ng", desc: "Invoices, payment releases & audit logs", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { role: "Storekeeper", user: "store@costview.ng", desc: "Inventory receipts, issues & transfers", badge: "bg-teal-50 text-teal-700 border-teal-200" },
            { role: "Architect", user: "arch@costview.ng", desc: "Drawing revisions, variations & snags", badge: "bg-rose-50 text-rose-700 border-rose-200" },
          ].map((p) => (
            <div
              key={p.role}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-card p-5 hover:border-blue-300 hover:shadow-glass transition-all"
            >
              <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${p.badge} mb-3`}>
                {p.role}
              </div>
              <div className="font-mono text-xs font-bold text-slate-900 truncate">{p.user}</div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</div>
              <div className="mt-3 text-[11px] font-mono font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                pwd: DemoPass2026!
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-semibold text-xs shadow-card transition-all"
          >
            Launch Interactive Role Switcher →
          </Link>
        </div>
      </section>

      {/* EXCEL VS COSTVIEW COMPARISON */}
      <section className="bg-white/80 backdrop-blur-xl border-y border-slate-200/80 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Legacy Spreadsheets vs CostView 360
            </h3>
            <p className="text-sm text-slate-500 mt-2">Why modern construction projects transition to an integrated system of record.</p>
          </div>

          <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-glass overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50/90 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200/80">
              <div className="p-4">Operational Capability</div>
              <div className="p-4 text-center text-slate-500">Excel / WhatsApp / Paper</div>
              <div className="p-4 text-center bg-blue-50/80 text-[#0067c0]">CostView 360</div>
            </div>
            {[
              ["BOQ Variance Threshold Alerts", "Manual checks after month-end close", "Automated ±5% real-time flag"],
              ["PO ⇄ GRN ⇄ Invoice Three-Way Match", "Manual eyeball checks, error prone", "Automated payment gatekeeper"],
              ["Live Material Inventory Levels", "End-of-day guesswork & site visits", "Real-time on-hand / reserved gauges"],
              ["Immutable Audit Trail & Permissions", "Files overwritten or shared via email", "Postgres RLS with complete actor logs"],
              ["Role Segregation & Controls", "Full spreadsheet shared or hidden", "8 strict RBAC profile roles"],
              ["Commercial Margin Forecasting", "Separate disconnected spreadsheets", "Continuous 35% margin tracker"],
            ].map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-3 border-b border-slate-100 text-xs font-medium hover:bg-slate-50/50 transition-colors"
              >
                <div className="p-4 font-semibold text-slate-800 border-r border-slate-100">{row[0]}</div>
                <div className="p-4 text-center text-slate-500 border-r border-slate-100">{row[1]}</div>
                <div className="p-4 text-center bg-blue-50/40 text-[#0067c0] font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0067c0]" /> {row[2]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              From Chaos to Complete Control in <span className="text-[#0067c0]">Three Steps</span>
            </h2>
            <div className="mt-8 space-y-6">
              {[
                {
                  step: "01",
                  title: "Import BOQ & Lock Baseline",
                  desc: "Upload existing Excel or CSV bills. Validate codes, quantities, and rates. Once approved, the budget baseline is locked so any future delta requires documented justification.",
                },
                {
                  step: "02",
                  title: "Enforce Continuous Three-Way Matching",
                  desc: "Purchase orders automatically enforce quantity ceilings from the BOQ. When goods arrive on site, GRN receipts verify items. Discrepancies lock payment automatically.",
                },
                {
                  step: "03",
                  title: "Deliver Transparent Close-Outs",
                  desc: "Generate certified interim valuations, reconcile variations without contractor disputes, and protect project margin to final account sign-off.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/80 text-[#0067c0] font-mono font-extrabold text-base flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{s.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="smooth-pearl-hero p-8 md:p-12 text-slate-900 rounded-3xl relative overflow-hidden shadow-pearl border border-sky-200/80">
            <div className="pointer-events-none absolute -right-16 -bottom-16 w-72 h-72 bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-float" />
            <div className="pointer-events-none absolute -left-10 -top-10 w-56 h-56 bg-gradient-to-br from-indigo-300/20 to-sky-200/20 rounded-full blur-2xl" />
            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-100/80 text-[#0067c0] border border-sky-200/80 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#0067c0]" /> Ready to transform your site execution?
              </span>
              <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-slate-900">
                Empower your construction team with <span className="bg-gradient-to-r from-[#0067c0] via-[#0284c7] to-[#38bdf8] bg-clip-text text-transparent">verified numbers</span> today.
              </h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-lg">
                Join forward-thinking builders managing over ₦450M in project budgets with zero spreadsheet drift.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3.5 bg-gradient-to-r from-[#0067c0] to-[#0284c7] hover:from-[#005ba1] hover:to-[#0275b0] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/25 transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  Create Free Workspace <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-xl font-semibold text-sm shadow-xs backdrop-blur-sm transition-all hover:border-slate-300"
                >
                  Explore Demo Project →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0067c0] text-white flex items-center justify-center font-bold text-sm">
              CV
            </div>
            <span className="font-bold text-slate-900">CostView 360</span>
            <span className="text-xs text-slate-500">· Construction Cost Intelligence</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
            <Link href="/features" className="hover:text-[#0067c0]">Features</Link>
            <Link href="/how-it-works" className="hover:text-[#0067c0]">How It Works</Link>
            <Link href="/pricing" className="hover:text-[#0067c0]">Pricing</Link>
            <Link href="/about" className="hover:text-[#0067c0]">About</Link>
            <Link href="/contact" className="hover:text-[#0067c0]">Contact</Link>
          </div>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} CostView. Built for Builders Everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}
