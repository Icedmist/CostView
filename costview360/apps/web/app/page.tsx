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
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0A1931] selection:text-white relative overflow-x-hidden">
      {/* Radiant ambient atmospheric depth with deep navy and warm amber hues */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#0A1931]/10 via-[#1E3A5F]/10 to-[#D4A017]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-gradient-to-br from-[#1E3A5F]/10 via-slate-200/40 to-amber-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#0A1931]/10 to-[#0F2137]/10 rounded-full blur-3xl" />
      </div>

      <MarketingNav />

      {/* HERO — Deep Navy & Warm Amber Hero Canvas */}
      <section className="relative overflow-hidden border-b border-slate-300/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(10,25,49,0.08),rgba(255,255,255,0))]">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-28">
          <div className="grid xl:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 bg-white border-2 border-slate-300 text-[#0A1931] px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-8 shadow-xs hover:border-[#0A1931] transition-all">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A017] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4A017]" />
                </span>
                <Sparkles className="w-4 h-4 text-[#D4A017]" />
                <span>Construction Cost Intelligence — v2.0</span>
              </div>

              <h1 className="text-[46px] sm:text-[58px] md:text-[70px] lg:text-[76px] font-extrabold leading-[1.05] tracking-tight text-[#0A1931]">
                Analyse. Plan.<br />
                <span className="bg-gradient-to-r from-[#0A1931] via-[#1E3A5F] to-[#D4A017] bg-clip-text text-transparent">
                  Build Smarter.
                </span>
              </h1>

              <p className="mt-7 text-lg sm:text-xl font-normal leading-relaxed text-slate-700 max-w-xl">
                The unified intelligent system of record for <span className="font-bold text-[#0A1931]">budget, procurement, site progress</span>, and project margins. Eliminate spreadsheet drift — command every naira from BOQ master to final account with audit trails the QS can defend.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group min-h-[52px] px-8 py-4 bg-[#0A1931] hover:bg-[#0F2137] text-white rounded-xl font-bold text-base shadow-lg shadow-slate-900/25 flex items-center gap-3 transition-all active:scale-[0.98] hover:shadow-xl"
                >
                  Start Building Free <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-[#D4A017]" />
                </Link>
                <Link
                  href="/register"
                  className="min-h-[52px] px-8 py-4 bg-white hover:bg-slate-50 text-[#0A1931] border-2 border-slate-300 rounded-xl font-bold text-base shadow-xs transition-all hover:border-[#0A1931] flex items-center"
                >
                  Create Workspace
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-600">
                <span className="flex items-center gap-2 text-[#0A1931]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> No credit card required
                </span>
                <span className="w-2 h-2 bg-slate-300 rounded-full" />
                <span className="text-[#0A1931]">₦ NGN Native</span>
                <span className="w-2 h-2 bg-slate-300 rounded-full" />
                <span className="text-[#0A1931]">8 Pre-Seeded RBAC Roles</span>
                <span className="w-2 h-2 bg-slate-300 rounded-full" />
                <span className="text-[#0A1931]">Audit Trail RLS</span>
              </div>

              <div className="mt-8 flex items-center gap-4 p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm max-w-lg hover:border-slate-400 transition-all">
                <div className="flex -space-x-3">
                  {[
                    { label: "PM", bg: "bg-[#0A1931]" },
                    { label: "QS", bg: "bg-[#1E3A5F]" },
                    { label: "SE", bg: "bg-[#D4A017]" },
                    { label: "AC", bg: "bg-emerald-700" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`w-11 h-11 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-xs ${item.bg}`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0A1931]">Trusted by 120+ active site &amp; commercial teams</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">Victoria Island · Lekki · Eko Atlantic · Abuja</div>
                </div>
              </div>
            </div>

            {/* Interactive Preview Card — Scaled Ergonomics & Deep Navy Theme */}
            <div className="relative group">
              <div className="bg-white border-2 border-slate-300 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl">
                {/* Window Header */}
                <div className="h-13 bg-slate-100 border-b border-slate-300 flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 bg-rose-400 rounded-full" />
                    <span className="w-3.5 h-3.5 bg-amber-400 rounded-full" />
                    <span className="w-3.5 h-3.5 bg-emerald-400 rounded-full" />
                    <span className="ml-3 text-xs font-mono font-bold text-[#0A1931] tracking-wider hidden sm:inline">
                      COSTVIEW 360 · HORIZON TOWERS
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                    </span>
                    Live System Active
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="p-6 md:p-8 bg-slate-50/60 space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Budget</div>
                      <div className="text-xl md:text-2xl font-black font-mono text-[#0A1931] mt-1.5">₦301.8M</div>
                      <div className="h-2 bg-[#0A1931] rounded-full mt-2.5" />
                    </div>
                    <div className="bg-white border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs">
                      <div className="text-xs font-bold text-[#D4A017] uppercase tracking-wider">Committed POs</div>
                      <div className="text-xl md:text-2xl font-black font-mono text-[#0A1931] mt-1.5">₦292.2M</div>
                      <div className="h-2 bg-[#D4A017] rounded-full mt-2.5" />
                    </div>
                    <div className="bg-white border-2 border-emerald-300/80 rounded-2xl p-5 shadow-xs">
                      <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Actual Certified</div>
                      <div className="text-xl md:text-2xl font-black font-mono text-emerald-800 mt-1.5">₦216.4M</div>
                      <div className="h-2 bg-emerald-600 rounded-full mt-2.5" />
                    </div>
                  </div>

                  {/* Monitor Section */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-[#0A1931]">BOQ Variance &amp; Gatekeeper Monitor</span>
                      <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full">
                        ±5% THRESHOLD
                      </span>
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <span className="w-24 font-mono font-bold text-slate-800">CON-02.01</span>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                          <div className="h-full bg-[#0A1931] w-[78%]" />
                          <div className="h-full bg-amber-400 w-[14%]" />
                        </div>
                        <span className="font-mono text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full">
                          OVER
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <span className="w-24 font-mono font-bold text-slate-800">STL-02.03</span>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-[#0A1931] w-[92%]" />
                        </div>
                        <span className="font-mono text-xs font-bold bg-blue-100 text-[#0A1931] border border-blue-300 px-2.5 py-0.5 rounded-full">
                          ON TRACK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Alerts */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-rose-50 border-2 border-rose-200 p-4 text-rose-800 font-bold text-sm rounded-xl flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>1 Invoice Discrepancy Locked</span>
                    </div>
                    <div className="bg-amber-50 border-2 border-amber-200 p-4 text-amber-900 font-bold text-sm rounded-xl flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#D4A017] shrink-0" />
                      <span>+₦4M Revision Pending QS Approval</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badges */}
              <div className="absolute -bottom-4 -left-4 bg-white border-2 border-slate-300 px-5 py-2.5 rounded-xl shadow-lg text-sm font-bold text-[#0A1931] hidden md:flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Immutable RLS Audit Trail
              </div>
              <div className="absolute -top-4 -right-4 bg-white border-2 border-[#0A1931] px-5 py-2.5 rounded-xl shadow-lg text-sm font-extrabold text-[#0A1931] font-mono hidden md:block">
                ZERO SPREADSHEET DRIFT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR — High-Contrast Scaled Figures */}
      <section className="bg-white border-y-2 border-slate-200 py-12 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { k: "₦450M+", v: "Avg Budget Managed Per Project" },
            { k: "3-WAY", v: "PO ⇄ GRN ⇄ Invoice Match Engine" },
            { k: "8 ROLES", v: "Pre-Configured RBAC Permissions" },
            { k: "99.9%", v: "Audit Trail Compliance Coverage" },
          ].map((s) => (
            <div key={s.k} className="p-4">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black font-mono tracking-tight text-[#0A1931]">
                {s.k}
              </div>
              <div className="text-sm font-bold text-slate-600 mt-2 uppercase tracking-wider">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE CHALLENGE VS COSTVIEW SOLUTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 border border-rose-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              The Reality
            </div>
            <h2 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight text-[#0A1931] leading-tight">
              Spreadsheets <span className="bg-gradient-to-r from-rose-600 to-[#D4A017] bg-clip-text text-transparent">Don&apos;t Scale</span> on Construction Sites
            </h2>
            <p className="mt-5 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
              Every contractor and developer knows the friction: BOQ in Excel, purchase orders on WhatsApp, delivery receipts on loose slips, invoices buried in email threads. By month three, nobody knows the true margin.
            </p>
            <div className="mt-10 space-y-5">
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
                  className="flex gap-4 bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#0A1931] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#0A1931]">{item.title}</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="font-bold text-xl text-[#0A1931] flex items-center gap-3">
                <HardHat className="w-6 h-6 text-[#D4A017]" /> What Site &amp; Commercial Teams Actually Need
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  "One unified live figure for Approved vs Committed vs Actual spend",
                  "Every budget modification requires an explicit reason and timestamped approver",
                  "PO quantity and invoice rate must match physical GRN before payment unlocks",
                  "Storekeeper sees on-hand, reserved, and consumed stock in real time",
                  "PM monitors true commercial margin (e.g., 35% target vs 28% actual) rather than raw spend",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3.5 text-base text-slate-700 leading-relaxed">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-blue-50 border border-[#0A1931] text-[#0A1931] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#0A1931]" />
                    </span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2.5 font-bold text-base text-[#0A1931]">
                <Eye className="w-5 h-5 text-[#D4A017]" /> The CostView Continuous Workflow
              </div>
              <p className="text-sm md:text-base text-slate-700 mt-3 leading-relaxed font-normal">
                From BOQ Master → Requisition → RFQ → PO → Goods Received Note (GRN) → 3-Way Match → Payment → Stock Ledger → Site Diary → Final Account. One connected chain. Zero spreadsheet drift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM MODULES — Bento Grid with Deep Navy Styling */}
      <section id="features" className="bg-white border-y-2 border-slate-200 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-100 text-[#0A1931] border border-slate-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Platform Architecture
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-[#0A1931] leading-tight">
                Every Cost. Every Site. <span className="text-[#D4A017]">One Command Center.</span>
              </h2>
            </div>
            <p className="max-w-md text-base text-slate-600 leading-relaxed">
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
                className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-7 hover:border-[#0A1931] hover:shadow-lg transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0A1931] text-white flex items-center justify-center mb-5 shadow-md">
                  <f.icon className="w-7 h-7 text-[#D4A017]" />
                </div>
                <h3 className="font-bold text-lg text-[#0A1931]">{f.title}</h3>
                <ul className="mt-4 space-y-3 flex-1">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                      <span className="mt-1.5 w-2 h-2 bg-[#0A1931] rounded-full shrink-0" />
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
      <section id="personas" className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-[#0A1931] border border-slate-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Role-Based Access Control
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-[#0A1931]">
            Tailored For <span className="text-[#D4A017]">Every Stakeholder</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Strict RBAC ensures site engineers cannot approve commercial budgets, and quantity surveyors cannot falsify physical store deliveries. Demo accounts seeded below — password <span className="font-mono font-bold bg-slate-100 text-[#0A1931] px-2.5 py-1 rounded border border-slate-300">DemoPass2026!</span>
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { role: "Admin", user: "admin@costview.ng", desc: "Full permissions & system governance", badge: "bg-purple-100 text-purple-800 border-purple-300" },
            { role: "Project Manager", user: "pm@costview.ng", desc: "Budgets, procurement & reports studio", badge: "bg-blue-100 text-[#0A1931] border-blue-300" },
            { role: "Quantity Surveyor", user: "qs@costview.ng", desc: "BOQ master, variations & valuations", badge: "bg-indigo-100 text-indigo-800 border-indigo-300" },
            { role: "Site Engineer", user: "site@costview.ng", desc: "Daily materials, labour & site diary", badge: "bg-amber-100 text-amber-900 border-amber-300" },
            { role: "Procurement Officer", user: "procure@costview.ng", desc: "RFQs, purchase orders & 3-way match", badge: "bg-sky-100 text-sky-800 border-sky-300" },
            { role: "Accountant", user: "acct@costview.ng", desc: "Invoices, payment releases & audit logs", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
            { role: "Storekeeper", user: "store@costview.ng", desc: "Inventory receipts, issues & transfers", badge: "bg-teal-100 text-teal-800 border-teal-300" },
            { role: "Architect", user: "arch@costview.ng", desc: "Drawing revisions, variations & snags", badge: "bg-rose-100 text-rose-800 border-rose-300" },
          ].map((p) => (
            <div
              key={p.role}
              className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs p-6 hover:border-[#0A1931] hover:shadow-md transition-all"
            >
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${p.badge} mb-3`}>
                {p.role}
              </div>
              <div className="font-mono text-sm font-bold text-[#0A1931] truncate">{p.user}</div>
              <div className="text-sm text-slate-600 mt-2 leading-relaxed">{p.desc}</div>
              <div className="mt-4 text-xs font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                pwd: DemoPass2026!
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 min-h-[48px] px-8 py-3.5 bg-white hover:bg-slate-100 text-[#0A1931] border-2 border-slate-300 rounded-xl font-bold text-sm shadow-xs transition-all hover:border-[#0A1931]"
          >
            Launch Interactive Role Switcher →
          </Link>
        </div>
      </section>

      {/* EXCEL VS COSTVIEW COMPARISON */}
      <section className="bg-white border-y-2 border-slate-200 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#0A1931]">
              Legacy Spreadsheets vs CostView 360
            </h3>
            <p className="text-base text-slate-600 mt-3">Why modern construction projects transition to an integrated system of record.</p>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-100 text-[#0A1931] font-bold text-sm uppercase tracking-wider border-b-2 border-slate-300">
              <div className="p-5">Operational Capability</div>
              <div className="p-5 text-center text-slate-500">Excel / WhatsApp / Paper</div>
              <div className="p-5 text-center bg-blue-50/80 text-[#0A1931]">CostView 360</div>
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
                className="grid grid-cols-3 border-b border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                <div className="p-5 font-bold text-[#0A1931] border-r border-slate-200">{row[0]}</div>
                <div className="p-5 text-center text-slate-500 border-r border-slate-200">{row[1]}</div>
                <div className="p-5 text-center bg-blue-50/40 text-[#0A1931] font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {row[2]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0A1931] leading-tight">
              From Chaos to Complete Control in <span className="text-[#D4A017]">Three Steps</span>
            </h2>
            <div className="mt-10 space-y-7">
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
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-[#0A1931] text-[#0A1931] font-mono font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#0A1931]">{s.title}</h3>
                    <p className="text-sm md:text-base text-slate-600 mt-1.5 leading-relaxed font-normal">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner Card */}
          <div className="bg-gradient-to-br from-[#0A1931] via-[#0F2137] to-[#1E3A5F] p-8 md:p-14 text-white rounded-3xl relative overflow-hidden shadow-2xl border-2 border-slate-700">
            <div className="pointer-events-none absolute -right-16 -bottom-16 w-72 h-72 bg-gradient-to-br from-[#D4A017]/20 via-[#1E3A5F]/20 to-transparent rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -top-10 w-56 h-56 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl" />
            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/40">
                <Sparkles className="w-4 h-4 text-[#D4A017]" /> Ready to transform your site execution?
              </span>
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Empower your team with <span className="text-[#D4A017]">verified numbers</span> today.
              </h3>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-lg">
                Join forward-thinking builders managing over ₦450M in project budgets with zero spreadsheet drift.
              </p>
              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="min-h-[52px] px-8 py-4 bg-[#D4A017] hover:bg-[#b88910] text-[#0A1931] rounded-xl font-extrabold text-base shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  Create Free Workspace <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="min-h-[52px] px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-xl font-bold text-base backdrop-blur-sm transition-all flex items-center"
                >
                  Explore Demo Project →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t-2 border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#0A1931] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              CV
            </div>
            <span className="font-bold text-base text-[#0A1931]">CostView 360</span>
            <span className="text-sm text-slate-500">· Construction Cost Intelligence</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700 font-semibold">
            <Link href="/dashboard" className="hover:text-[#0A1931]">Command Center</Link>
            <Link href="/account" className="hover:text-[#0A1931]">My Account</Link>
            <Link href="/login" className="hover:text-[#0A1931]">Sign In</Link>
            <Link href="/register" className="hover:text-[#0A1931]">Register</Link>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} CostView. Built for Builders Everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}
