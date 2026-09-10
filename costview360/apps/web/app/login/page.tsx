"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/logo";
import { Lock, Mail, ArrowRight } from "lucide-react";

const DEMO_ACCOUNTS = [
  { label: "Admin", sub: "Full Access", email: "admin@costview.ng", role: "Admin" },
  { label: "PM", sub: "Manager", email: "pm@costview.ng", role: "Project Manager" },
  { label: "QS", sub: "Valuations", email: "qs@costview.ng", role: "Quantity Surveyor" },
  { label: "Arch", sub: "Architect", email: "arch@costview.ng", role: "Architect" },
  { label: "Site Eng", sub: "Deliveries", email: "site@costview.ng", role: "Site Engineer" },
  { label: "Procure", sub: "RFQ/PO", email: "procure@costview.ng", role: "Procurement Officer" },
  { label: "Acct", sub: "Finance", email: "acct@costview.ng", role: "Accountant" },
  { label: "Store", sub: "Stock", email: "store@costview.ng", role: "Storekeeper" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: "DemoPass2026!",
    });
    if (error) {
      // Fallback for placeholder Supabase — still allow navigation to dashboard for preview
      if (error.message.includes("Invalid API key") || error.message.includes("fetch")) {
        localStorage.setItem("costview_demo_role", demoEmail);
        router.push("/dashboard");
        return;
      }
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003a70] via-[#005ba1] to-[#0284c7] flex flex-col font-sans relative overflow-hidden">
      <div className="h-[64px] bg-white/10 backdrop-blur-xl border-b border-white/15 flex items-center justify-between px-6 z-10">
        <Link href="/"><Logo size="sm" /></Link>
        <Link href="/" className="text-xs font-semibold text-white/90 hover:text-white border border-white/25 hover:border-white/50 px-4 py-1.5 rounded-xl backdrop-blur-sm transition-all">← Back to Landing</Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[540px]">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0067c0] rounded-xl text-white font-bold text-lg shadow-sm mb-3">CV</div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
              <p className="text-xs text-slate-500 mt-1">Sign in to your CostView 360 workspace</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              {errorMsg && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">{errorMsg}</div>}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" required placeholder="name@firm.ng" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-900 placeholder:text-[#8b8b8b] focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0] transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-lg text-sm font-mono text-slate-900 placeholder:text-[#8b8b8b] focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0] transition-all" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">Demo password for all accounts: <span className="font-mono font-semibold text-[#0067c0] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">DemoPass2026!</span></p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-lg font-semibold text-sm shadow-md transition-all active:scale-[0.98]">
                {loading ? "Signing in..." : "Sign in to Workspace"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Quick Test Access — 1 Click (8 roles)</span><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-medium">Sandbox Ready</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEMO_ACCOUNTS.map((b) => (
                  <button key={b.email} type="button" onClick={() => handleDemoLogin(b.email)} disabled={loading}
                    className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-lg text-left hover:bg-blue-50 hover:border-[#0067c0] hover:shadow-xs rounded-xl transition-all disabled:opacity-50 group">
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-[#0067c0]">{b.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{b.sub}</div>
                    <div className="text-[9px] font-mono text-[#8b8b8b] truncate">{b.email}</div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#8b8b8b] mt-2 text-center">Click any card to sign in instantly — no typing needed</p>
            </div>

            <div className="mt-6 text-center text-xs">
              <span className="text-slate-500">New company? </span>
              <Link href="/register" className="font-semibold text-[#0067c0] hover:underline">Register Workspace →</Link>
            </div>
          </div>
          <div className="mt-4 text-center text-[11px] font-mono text-white/50 tracking-wider">© 2026 CostView 360 · Fluent Glassmorphism Edition</div>
        </div>
      </div>
    </div>
  );
}
