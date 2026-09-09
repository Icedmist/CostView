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
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans">
      <div className="h-[64px] bg-white border-b-[3px] border-navy-800 flex items-center justify-between px-6">
        <Link href="/"><Logo size="sm" /></Link>
        <Link href="/" className="text-xs font-black uppercase tracking-widest border-[3px] border-navy-800 px-4 py-2 hover:bg-cream-100">← Back to Landing</Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[560px]">
          <div className="bg-white border-[3px] border-navy-800 shadow-brutal p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-mustard-400 border-[3px] border-navy-800 font-black text-navy-800 text-xl shadow-brutal-sm mb-3">CV</div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-navy-800">Welcome Back</h2>
              <p className="text-xs font-bold text-navy-800/60 mt-1">Sign in to your CostView workspace</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              {errorMsg && <div className="p-3 bg-red-500 border-[3px] border-navy-800 text-white text-xs font-black">{errorMsg}</div>}

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-navy-800 mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-800" />
                  <input type="email" required placeholder="name@firm.ng" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white border-[3px] border-navy-800 text-sm font-bold text-navy-800 placeholder:text-navy-800/40 focus:outline-none focus:shadow-brutal-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-navy-800 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-800" />
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white border-[3px] border-navy-800 text-sm font-mono font-bold text-navy-800 placeholder:text-navy-800/40 focus:outline-none focus:shadow-brutal-sm" />
                </div>
                <p className="text-[11px] font-bold text-navy-800/50 mt-1">Demo password for all accounts: <span className="font-mono font-black text-navy-800 bg-mustard-400 px-1 border border-navy-800">DemoPass2026!</span></p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-navy-800 text-white border-[3px] border-navy-800 font-black uppercase text-sm tracking-wide shadow-brutal hover:bg-navy-700 active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all">
                {loading ? "Signing in..." : "Sign in to Workspace"} <ArrowRight className="w-4 h-4 text-mustard-400" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t-[3px] border-navy-800">
              <div className="text-[11px] font-black uppercase tracking-widest text-navy-800 mb-3 flex items-center justify-between">
                <span>Quick Test Access — 1 Click (8 roles)</span><span className="bg-mustard-400 border border-navy-800 px-2 py-1">Sandbox Ready</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEMO_ACCOUNTS.map((b) => (
                  <button key={b.email} type="button" onClick={() => handleDemoLogin(b.email)} disabled={loading}
                    className="p-3 bg-cream-100 border-[3px] border-navy-800 text-left hover:bg-mustard-400 hover:shadow-brutal-sm transition-all disabled:opacity-50">
                    <div className="text-xs font-black text-navy-800">{b.label}</div>
                    <div className="text-[10px] font-bold text-navy-800/60 truncate">{b.sub}</div>
                    <div className="text-[9px] font-mono text-navy-800/40 truncate">{b.email}</div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold text-navy-800/50 mt-2 text-center">Click any card to sign in instantly — no typing needed</p>
            </div>

            <div className="mt-6 text-center text-xs font-bold">
              <span className="text-navy-800/60">New company? </span>
              <Link href="/register" className="font-black text-navy-800 underline decoration-[3px] decoration-mustard-400">Register Workspace →</Link>
            </div>
          </div>
          <div className="mt-4 text-center text-[10px] font-mono font-bold text-navy-800/40 uppercase tracking-widest">© 2026 CostView · Navy Brutalist Edition · All demo logins seeded</div>
        </div>
      </div>
    </div>
  );
}
