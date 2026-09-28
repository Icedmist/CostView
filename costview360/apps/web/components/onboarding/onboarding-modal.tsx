"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Calculator,
  ShoppingCart,
  HardHat,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Users,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (section: string, subSection?: string) => void;
}

export function OnboardingModal({ isOpen, onClose, onNavigate }: OnboardingModalProps) {
  const [step, setStep] = useState(1);

  // Auto-mark onboarding complete when dismissed
  const handleComplete = () => {
    try {
      localStorage.setItem("costview_onboarding_completed", "true");
    } catch (e) {
      // ignore in incognito/storage disabled
    }
    onClose();
  };

  const handleFinishAndNavigate = (section: string, subSection?: string) => {
    handleComplete();
    if (onNavigate) {
      onNavigate(section, subSection);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="p-5 md:p-6 bg-[#FAF9F5] dark:bg-[#071324] border-b-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                  Welcome to CostView
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                  Step {step} of 4
                </span>
              </div>
              <p className="text-xs text-[#0A2540]/70 dark:text-slate-300 font-semibold mt-0.5">
                Quick onboarding guide to simple construction cost control
              </p>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-9 h-9 rounded-xl border border-[#E5E5DE] dark:border-[#1E3A5F] hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-[#0A2540] dark:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#E5E5DE] dark:bg-slate-800 h-1.5">
          <div
            className="bg-[#0A2540] dark:bg-[#FFD23F] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Overview */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  Unified System of Record
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight mt-3">
                  One Source of Truth for Your Project
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
                  CostView replaces disconnected paper diaries, messy spreadsheets, and unrecorded variations with a clear 5-module workflow built for builders.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-start gap-3">
                  <Calculator className="w-5 h-5 text-[#0A2540] dark:text-[#FFD23F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-[#0A2540] dark:text-white">1. Cost Plan</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      BOQ master registers, rate revisions, and ±5% variance alerts.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-start gap-3">
                  <ShoppingCart className="w-5 h-5 text-[#0A2540] dark:text-[#FFD23F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-[#0A2540] dark:text-white">2. Buy &amp; Supply</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      3-Way Match gate (PO vs GRN vs Invoice) to prevent overbilling.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-start gap-3">
                  <HardHat className="w-5 h-5 text-[#0A2540] dark:text-[#FFD23F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-[#0A2540] dark:text-white">3. Site Hub</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Social feed for daily shift logs, expenses, photos &amp; @mentions.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-[#0A2540] dark:text-[#FFD23F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-[#0A2540] dark:text-white">4. Contracts</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Subcontractor claims, certified valuations &amp; 10% retention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Cost Plan & Procurement */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Financial Controls
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight mt-3">
                  Budgeting &amp; 3-Way Match Gate
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
                  Set firm expenditure baselines before breaking ground, and automatically halt payments whenever vendor invoices exceed physical delivery counts.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-black text-sm">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-[#0A2540] dark:text-white">
                      Baseline Bill of Quantities (BOQ)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Upload or enter contract rates and quantities. Track budget vs actual cost in real time.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-black text-sm">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-[#0A2540] dark:text-white">
                      Three-Way Match Verification
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Orders are cross-checked: Purchase Order Rate = Goods Received Count = Invoice Billed Sum. Zero discrepancy leaks.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-black text-sm">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-[#0A2540] dark:text-white">
                      Materials &amp; Stock Inventory
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Real-time warehouse stock ledger tracking bags of cement, steel rebar, and diesel deliveries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Site Hub */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  New Collaborative Feature
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight mt-3">
                  The Project Site Hub
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
                  A social collaboration feed for your field engineers, quantity surveyors, and project directors to share progress, log site spending, and tag teammates.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏗️</span>
                  <div>
                    <h4 className="text-sm font-black text-[#0A2540] dark:text-white">Daily Progress &amp; Photo Proof</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Upload photos of slab castings, masonry, and MEP runs with instant timestamps.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h4 className="text-sm font-black text-[#0A2540] dark:text-white">"What Was Spent" Tracking</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Directly record petty cash, material purchases, and daily artisan wages with currency totals.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <h4 className="text-sm font-black text-[#0A2540] dark:text-white">Team Mentions &amp; Sign-Offs</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Tag colleagues with <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded text-amber-900 dark:text-amber-200">@Engineer</code> or <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded text-amber-900 dark:text-amber-200">@QS</code> for swift approvals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Ready to Build */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight">
                  You&apos;re All Set!
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
                  Start tracking costs with complete clarity. Choose where you want to begin:
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => handleFinishAndNavigate("Site", "hub")}
                  className="p-4 rounded-2xl bg-white dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] hover:border-[#0A2540] dark:hover:border-[#FFD23F] text-left transition-all group cursor-pointer shadow-xs"
                >
                  <HardHat className="w-6 h-6 text-[#0A2540] dark:text-[#FFD23F] mb-2" />
                  <div className="text-sm font-black text-[#0A2540] dark:text-white group-hover:underline">
                    Visit Site Hub →
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Post site progress &amp; expenses
                  </div>
                </button>

                <button
                  onClick={() => handleFinishAndNavigate("Cost Plan", "boq")}
                  className="p-4 rounded-2xl bg-white dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] hover:border-[#0A2540] dark:hover:border-[#FFD23F] text-left transition-all group cursor-pointer shadow-xs"
                >
                  <Calculator className="w-6 h-6 text-[#0A2540] dark:text-[#FFD23F] mb-2" />
                  <div className="text-sm font-black text-[#0A2540] dark:text-white group-hover:underline">
                    Open BOQ Master →
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Manage project line items
                  </div>
                </button>

                <button
                  onClick={() => handleFinishAndNavigate("Oversight", "my-work")}
                  className="p-4 rounded-2xl bg-white dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] hover:border-[#0A2540] dark:hover:border-[#FFD23F] text-left transition-all group cursor-pointer shadow-xs"
                >
                  <TrendingUp className="w-6 h-6 text-[#0A2540] dark:text-[#FFD23F] mb-2" />
                  <div className="text-sm font-black text-[#0A2540] dark:text-white group-hover:underline">
                    Executive KPIs →
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    View budget vs actuals
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 md:p-6 bg-[#FAF9F5] dark:bg-[#071324] border-t-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-center justify-between gap-3 shrink-0">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2.5 rounded-xl border-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931] hover:bg-slate-100 dark:hover:bg-[#0F2137] text-xs md:text-sm font-bold text-[#0A2540] dark:text-white flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="text-xs md:text-sm font-bold text-[#0A2540]/60 dark:text-slate-400 hover:text-[#0A2540] dark:hover:text-white cursor-pointer px-2"
              >
                Skip Tour
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#003366] dark:bg-[#FFD23F] dark:text-[#0A1931] text-white text-xs md:text-sm font-black flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-black flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
              >
                <span>Finish &amp; Start</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
