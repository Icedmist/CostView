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
  Briefcase,
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
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans selection:bg-[#0A2540] selection:text-white relative overflow-x-hidden">
      {/* Radiant ambient atmospheric depth with bright navy and milk hues */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#0A2540]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-[#003366]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-[500px] h-[500px] bg-[#0A2540]/5 rounded-full blur-3xl" />
      </div>

      <MarketingNav />

      {/* HERO — Bright Navy & White/Milk Hero Canvas */}
      <section className="relative overflow-hidden border-b-2 border-[#E5E5DE] bg-white">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-28">
          <div className="grid xl:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 bg-[#FAF9F5] border-2 border-[#E5E5DE] text-[#0A2540] px-5 py-2 rounded-full text-sm font-black tracking-wide mb-8 shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A2540] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0A2540]" />
                </span>
                <span>Construction Cost Intelligence — v2.0</span>
              </div>

              <h1 className="text-[48px] sm:text-[60px] md:text-[72px] lg:text-[78px] font-black leading-[1.05] tracking-tight text-[#0A2540]">
                Analyse. Plan.<br />
                <span className="text-[#004080]">
                  Build Smarter.
                </span>
              </h1>

              <p className="mt-7 text-lg sm:text-xl font-normal leading-relaxed text-[#0A2540]/80 max-w-xl">
                The unified intelligent system of record for <span className="font-bold text-[#0A2540]">budget, procurement, site progress</span>, and contractor valuations. Eliminate spreadsheet drift — command every naira from BOQ master to final account with defensible audit trails.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group min-h-[52px] px-8 py-4 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-black text-base shadow-lg shadow-[#0A2540]/25 flex items-center gap-3 transition-all active:scale-[0.98]"
                >
                  Start Building Free <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/register"
                  className="min-h-[52px] px-8 py-4 bg-[#FAF9F5] hover:bg-white text-[#0A2540] border-2 border-[#E5E5DE] hover:border-[#0A2540] rounded-xl font-black text-base shadow-xs transition-all flex items-center"
                >
                  Create Workspace
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-5 text-sm font-bold text-[#0A2540]/70">
                <span className="flex items-center gap-2 text-[#0A2540]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> No credit card required
                </span>
                <span className="w-2 h-2 bg-[#E5E5DE] rounded-full" />
                <span className="text-[#0A2540]">₦ NGN Native</span>
                <span className="w-2 h-2 bg-[#E5E5DE] rounded-full" />
                <span className="text-[#0A2540]">8 Pre-Seeded RBAC Roles</span>
                <span className="w-2 h-2 bg-[#E5E5DE] rounded-full" />
                <span className="text-[#0A2540]">Audit Trail RLS</span>
              </div>

              <div className="mt-8 flex items-center gap-4 p-4 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl shadow-sm max-w-lg">
                <div className="flex -space-x-3">
                  {[
                    { label: "PM", bg: "bg-[#0A2540]" },
                    { label: "QS", bg: "bg-[#003366]" },
                    { label: "SE", bg: "bg-[#004080]" },
                    { label: "AC", bg: "bg-[#1A365D]" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`w-11 h-11 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-xs ${item.bg}`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-black text-[#0A2540]">Trusted by 120+ active site &amp; finance teams</div>
                  <div className="text-xs font-semibold text-[#0A2540]/60 mt-0.5">Victoria Island · Lekki · Eko Atlantic · Abuja</div>
                </div>
              </div>
            </div>

            {/* Interactive Preview Card — Scaled Ergonomics & Bright Navy Theme */}
            <div className="relative group">
              <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
                {/* Window Header */}
                <div className="h-14 bg-[#FAF9F5] border-b-2 border-[#E5E5DE] flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 bg-rose-400 rounded-full" />
                    <span className="w-3.5 h-3.5 bg-amber-400 rounded-full" />
                    <span className="w-3.5 h-3.5 bg-emerald-400 rounded-full" />
                    <span className="ml-3 text-xs font-mono font-black text-[#0A2540] tracking-wider hidden sm:inline">
                      COSTVIEW · HORIZON TOWERS
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                    </span>
                    Live System Active
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="p-6 md:p-8 bg-white space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-5 shadow-xs">
                      <div className="text-xs font-black text-[#0A2540]/60 uppercase tracking-wider">Approved Budget</div>
                      <div className="text-xl md:text-2xl font-black font-mono text-[#0A2540] mt-1.5">₦301.8M</div>
                      <div className="h-2 bg-[#0A2540] rounded-full mt-2.5" />
                    </div>
                    <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-5 shadow-xs">
                      <div className="text-xs font-black text-[#0A2540]/60 uppercase tracking-wider">Committed POs</div>
                      <div className="text-xl md:text-2xl font-black font-mono text-[#0A2540] mt-1.5">₦292.2M</div>
                      <div className="h-2 bg-[#004080] rounded-full mt-2.5" />
                    </div>
                    <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-5 shadow-xs">
                      <div className="text-xs font-black text-emerald-800 uppercase tracking-wider">Actual Certified</div>
                      <div className="text-xl md:text-2xl font-black font-mono text-emerald-800 mt-1.5">₦216.4M</div>
                      <div className="h-2 bg-emerald-600 rounded-full mt-2.5" />
                    </div>
                  </div>

                  {/* Monitor Section */}
                  <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-black text-[#0A2540]">BOQ Variance &amp; Gatekeeper Monitor</span>
                      <span className="text-xs font-mono font-black bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full">
                        ±5% THRESHOLD
                      </span>
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <span className="w-24 font-mono font-black text-[#0A2540]">CON-02.01</span>
                        <div className="flex-1 h-3 bg-white rounded-full overflow-hidden flex border border-[#E5E5DE]">
                          <div className="h-full bg-[#0A2540] w-[78%]" />
                          <div className="h-full bg-rose-500 w-[14%]" />
                        </div>
                        <span className="font-mono text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full">
                          OVER
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <span className="w-24 font-mono font-black text-[#0A2540]">STL-02.03</span>
                        <div className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-[#E5E5DE]">
                          <div className="h-full bg-[#0A2540] w-[92%]" />
                        </div>
                        <span className="font-mono text-xs font-black bg-blue-100 text-[#0A2540] border border-blue-300 px-2.5 py-0.5 rounded-full">
                          ON TRACK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Alerts */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-rose-50 border-2 border-rose-200 p-4 text-rose-900 font-bold text-sm rounded-xl flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>1 Invoice Discrepancy Locked</span>
                    </div>
                    <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] p-4 text-[#0A2540] font-bold text-sm rounded-xl flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#0A2540] shrink-0" />
                      <span>+₦4M Revision Pending QS Review</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badges */}
              <div className="absolute -bottom-4 -left-4 bg-white border-2 border-[#E5E5DE] px-5 py-2.5 rounded-xl shadow-lg text-sm font-black text-[#0A2540] hidden md:flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Immutable RLS Audit Trail
              </div>
              <div className="absolute -top-4 -right-4 bg-[#0A2540] text-white border-2 border-[#0A2540] px-5 py-2.5 rounded-xl shadow-lg text-sm font-black font-mono hidden md:block">
                ZERO SPREADSHEET DRIFT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR — High-Contrast Scaled Figures */}
      <section className="bg-[#FAF9F5] border-y-2 border-[#E5E5DE] py-14 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { k: "₦450M+", v: "Avg Budget Managed Per Project" },
            { k: "3-WAY", v: "PO ⇄ GRN ⇄ Invoice Match Engine" },
            { k: "8 ROLES", v: "Pre-Configured RBAC Permissions" },
            { k: "99.9%", v: "Audit Trail Compliance Coverage" },
          ].map((s) => (
            <div key={s.k} className="p-4">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black font-mono tracking-tight text-[#0A2540]">
                {s.k}
              </div>
              <div className="text-sm font-black text-[#0A2540]/70 mt-2 uppercase tracking-wider">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE CHALLENGE VS COSTVIEW SOLUTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 border border-rose-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              The Reality
            </div>
            <h2 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-[#0A2540] leading-tight">
              Spreadsheets Don&apos;t Scale on Construction Sites
            </h2>
            <p className="mt-5 text-base md:text-lg font-normal text-[#0A2540]/80 leading-relaxed">
              Every contractor and developer knows the friction: BOQ in Excel, purchase orders on WhatsApp, delivery receipts on loose slips, invoices buried in email threads. By month three, nobody knows the true financial status.
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
                  className="flex gap-4 bg-white border-2 border-[#E5E5DE] rounded-2xl p-5 shadow-xs hover:border-[#0A2540] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-[#0A2540]">{item.title}</h4>
                    <p className="text-sm text-[#0A2540]/70 mt-1 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="font-black text-xl text-[#0A2540] flex items-center gap-3">
                <HardHat className="w-6 h-6 text-[#0A2540]" /> What Site &amp; Finance Teams Actually Need
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  "One unified live figure for Approved vs Committed vs Actual spend",
                  "Every budget modification requires an explicit reason and timestamped approver",
                  "PO quantity and invoice rate must match physical GRN before payment unlocks",
                  "Storekeeper sees on-hand, reserved, and consumed stock in real time",
                  "QS and PM manage certified trade packages with 10% retention escrow",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3.5 text-base text-[#0A2540]/80 leading-relaxed font-semibold">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-[#FAF9F5] border-2 border-[#0A2540] text-[#0A2540] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#0A2540]" />
                    </span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2.5 font-black text-base text-[#0A2540]">
                <Eye className="w-5 h-5 text-[#0A2540]" /> The CostView Continuous Workflow
              </div>
              <p className="text-sm md:text-base text-[#0A2540]/80 mt-3 leading-relaxed font-semibold">
                From BOQ Master → Requisition → RFQ → PO → Goods Received Note (GRN) → 3-Way Match → Payment → Stock Ledger → Site Diary → Final Account. One connected chain. Zero spreadsheet drift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM MODULES — Bento Grid with Bright Navy Styling */}
      <section id="features" className="bg-white border-y-2 border-[#E5E5DE] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                Platform Architecture
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-[#0A2540] leading-tight">
                Every Cost. Every Site. <span className="text-[#004080]">One Command Center.</span>
              </h2>
            </div>
            <p className="max-w-md text-base text-[#0A2540]/70 font-semibold leading-relaxed">
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
                icon: Briefcase,
                title: "Contracts & Subcontractors",
                bullets: [
                  "Trade package scopes, agreements, and work orders",
                  "Automated 10% retention escrow calculation",
                  "Interim valuation claims and certified payouts",
                  "Site instructions register with photo documentation",
                ],
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl shadow-sm p-7 hover:border-[#0A2540] hover:shadow-lg transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mb-5 shadow-md">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-black text-lg text-[#0A2540]">{f.title}</h3>
                <ul className="mt-4 space-y-3 flex-1">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-[#0A2540]/80 font-bold">
                      <span className="mt-1.5 w-2 h-2 bg-[#0A2540] rounded-full shrink-0" />
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
          <div className="inline-flex items-center gap-2 bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            Role-Based Access Control
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-[#0A2540]">
            Tailored For Every Stakeholder
          </h2>
          <p className="mt-4 text-base text-[#0A2540]/70 font-semibold leading-relaxed">
            Strict RBAC ensures site engineers cannot approve baseline budgets, and quantity surveyors cannot falsify physical store deliveries. Demo accounts seeded below — password <span className="font-mono font-black bg-white text-[#0A2540] px-2.5 py-1 rounded border-2 border-[#E5E5DE]">DemoPass2026!</span>
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { role: "Admin", user: "admin@costview.ng", desc: "Full permissions & system governance", badge: "bg-purple-100 text-purple-800 border-purple-300" },
            { role: "Project Manager", user: "pm@costview.ng", desc: "Budgets, procurement & reports studio", badge: "bg-blue-100 text-[#0A2540] border-blue-300" },
            { role: "Quantity Surveyor", user: "qs@costview.ng", desc: "BOQ master, variations & valuations", badge: "bg-indigo-100 text-indigo-800 border-indigo-300" },
            { role: "Site Engineer", user: "site@costview.ng", desc: "Daily materials, labour & site diary", badge: "bg-amber-100 text-amber-900 border-amber-300" },
            { role: "Procurement Officer", user: "procure@costview.ng", desc: "RFQs, purchase orders & 3-way match", badge: "bg-sky-100 text-sky-800 border-sky-300" },
            { role: "Accountant", user: "acct@costview.ng", desc: "Invoices, payment releases & audit logs", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
            { role: "Storekeeper", user: "store@costview.ng", desc: "Inventory receipts, issues & transfers", badge: "bg-teal-100 text-teal-800 border-teal-300" },
            { role: "Architect", user: "arch@costview.ng", desc: "Drawing revisions, variations & snags", badge: "bg-rose-100 text-rose-800 border-rose-300" },
          ].map((p) => (
            <div
              key={p.role}
              className="bg-white border-2 border-[#E5E5DE] rounded-2xl shadow-xs p-6 hover:border-[#0A2540] hover:shadow-md transition-all"
            >
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${p.badge} mb-3`}>
                {p.role}
              </div>
              <div className="font-mono text-sm font-black text-[#0A2540] truncate">{p.user}</div>
              <div className="text-sm text-[#0A2540]/70 font-semibold mt-2 leading-relaxed">{p.desc}</div>
              <div className="mt-4 text-xs font-mono font-bold text-[#0A2540] bg-[#FAF9F5] border border-[#E5E5DE] px-3 py-1.5 rounded-lg">
                pwd: DemoPass2026!
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 min-h-[48px] px-8 py-3.5 bg-white hover:bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] rounded-xl font-black text-sm shadow-xs transition-all hover:border-[#0A2540]"
          >
            Launch Interactive Role Switcher →
          </Link>
        </div>
      </section>

      {/* EXCEL VS COSTVIEW COMPARISON */}
      <section className="bg-white border-y-2 border-[#E5E5DE] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-4xl font-black tracking-tight text-[#0A2540]">
              Legacy Spreadsheets vs CostView
            </h3>
            <p className="text-base text-[#0A2540]/70 font-semibold mt-3">Why modern construction projects transition to an integrated system of record.</p>
          </div>

          <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-[#FAF9F5] text-[#0A2540] font-black text-sm uppercase tracking-wider border-b-2 border-[#E5E5DE]">
              <div className="p-5">Operational Capability</div>
              <div className="p-5 text-center text-slate-500">Excel / WhatsApp / Paper</div>
              <div className="p-5 text-center bg-blue-50/80 text-[#0A2540]">CostView</div>
            </div>
            {[
              ["BOQ Variance Threshold Alerts", "Manual checks after month-end close", "Automated ±5% real-time flag"],
              ["PO ⇄ GRN ⇄ Invoice Three-Way Match", "Manual eyeball checks, error prone", "Automated payment gatekeeper"],
              ["Live Material Inventory Levels", "End-of-day guesswork & site visits", "Real-time on-hand / reserved gauges"],
              ["Immutable Audit Trail & Permissions", "Files overwritten or shared via email", "Postgres RLS with complete actor logs"],
              ["Role Segregation & Controls", "Full spreadsheet shared or hidden", "8 strict RBAC profile roles"],
              ["Contractor Valuation & Retention", "Messy separate spreadsheets", "Automated 10% escrow & certs"],
            ].map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-3 border-b border-[#E5E5DE] text-sm font-semibold hover:bg-[#FAF9F5] transition-colors"
              >
                <div className="p-5 font-black text-[#0A2540] border-r border-[#E5E5DE]">{row[0]}</div>
                <div className="p-5 text-center text-slate-500 border-r border-[#E5E5DE]">{row[1]}</div>
                <div className="p-5 text-center bg-blue-50/40 text-[#0A2540] font-black flex items-center justify-center gap-2">
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
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#0A2540] leading-tight">
              From Chaos to Complete Control in Three Steps
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
                  <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white font-mono font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#0A2540]">{s.title}</h3>
                    <p className="text-sm md:text-base text-[#0A2540]/80 font-semibold mt-1.5 leading-relaxed font-normal">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner Card */}
          <div className="bg-[#0A2540] p-8 md:p-14 text-white rounded-3xl relative overflow-hidden shadow-2xl border-2 border-[#0A2540]">
            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-white/15 text-white border border-white/20">
                <Sparkles className="w-4 h-4" /> Ready to transform your site execution?
              </span>
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Empower your team with verified numbers today.
              </h3>
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-lg font-normal">
                Join forward-thinking builders managing over ₦450M in project budgets with zero spreadsheet drift.
              </p>
              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="min-h-[52px] px-8 py-4 bg-white hover:bg-slate-100 text-[#0A2540] rounded-xl font-black text-base shadow-lg transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                >
                  Create Free Workspace <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="min-h-[52px] px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-xl font-black text-base backdrop-blur-sm transition-all flex items-center cursor-pointer"
                >
                  Explore Demo Project →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t-2 border-[#E5E5DE] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#0A2540] text-white flex items-center justify-center font-black text-sm shadow-xs">
              CV
            </div>
            <span className="font-black text-base text-[#0A2540]">CostView</span>
            <span className="text-sm text-[#0A2540]/60 font-semibold">· Construction Cost Intelligence</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#0A2540] font-bold">
            <Link href="/dashboard" className="hover:underline">Command Center</Link>
            <Link href="/account" className="hover:underline">My Account</Link>
            <Link href="/login" className="hover:underline">Sign In</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </div>
          <div className="text-sm text-[#0A2540]/60 font-semibold">
            © {new Date().getFullYear()} CostView. Built for Builders Everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}
