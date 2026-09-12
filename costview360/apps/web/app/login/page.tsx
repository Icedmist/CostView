"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Lock, Mail, CheckCircle2 } from "lucide-react";
import type { RoleName } from "@/lib/supabase/database.types";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@costview.ng", role: "Admin" as RoleName, sub: "Full system governance" },
  { label: "Project Manager", email: "pm@costview.ng", role: "Project Manager" as RoleName, sub: "Budgets & procurement" },
  { label: "Quantity Surveyor", email: "qs@costview.ng", role: "Quantity Surveyor" as RoleName, sub: "BOQ & variations" },
  { label: "Site Engineer", email: "site@costview.ng", role: "Site Engineer" as RoleName, sub: "Materials & labour" },
  { label: "Procurement Officer", email: "procure@costview.ng", role: "Procurement Officer" as RoleName, sub: "RFQs & 3-way match" },
  { label: "Accountant", email: "acct@costview.ng", role: "Accountant" as RoleName, sub: "Invoices & payouts" },
  { label: "Storekeeper", email: "store@costview.ng", role: "Storekeeper" as RoleName, sub: "Stock receipts & issues" },
  { label: "Architect", email: "arch@costview.ng", role: "Architect" as RoleName, sub: "Drawings & snags" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDemoEmail, setActiveDemoEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("costview_tab_active", "1");
        sessionStorage.setItem("costview_last_active", Date.now().toString());
        localStorage.setItem("costview_last_active", Date.now().toString());
      }
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleDemoLogin = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setActiveDemoEmail(account.email);
    setEmail(account.email);
    setPassword("DemoPass2026!");
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: "DemoPass2026!",
    });

    if (error) {
      if (typeof window !== "undefined") {
        localStorage.setItem("costview_demo_role", account.role);
        localStorage.setItem("costview_demo_email", account.email);
        localStorage.setItem("costview_last_active", Date.now().toString());
        sessionStorage.setItem("costview_tab_active", "1");
        sessionStorage.setItem("costview_last_active", Date.now().toString());
        document.cookie = `costview_demo_role=${account.role}; path=/; max-age=604800; SameSite=Lax`;
      }
      router.push("/dashboard");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("costview_demo_role", account.role);
      localStorage.setItem("costview_demo_email", account.email);
      localStorage.setItem("costview_last_active", Date.now().toString());
      sessionStorage.setItem("costview_tab_active", "1");
      sessionStorage.setItem("costview_last_active", Date.now().toString());
      document.cookie = `costview_demo_role=${account.role}; path=/; max-age=604800; SameSite=Lax`;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans text-[#0A2540]">
      {/* Top Brand Header */}
      <div className="p-6 flex items-center justify-between border-b-2 border-[#E5E5DE] bg-white">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0A2540] rounded-xl text-white font-black flex items-center justify-center text-sm shadow-md">
            CV
          </div>
          <span className="font-black text-xl text-[#0A2540]">CostView</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-black uppercase tracking-wider text-[#0A2540] hover:bg-[#FAF9F5] border-2 border-[#E5E5DE] px-4 py-2 rounded-xl transition-all"
        >
          ← Back to Landing
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-[580px]">
          <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0A2540] rounded-2xl text-white font-black text-xl shadow-md mb-4">
                CV
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#0A2540] tracking-tight">
                Welcome to CostView
              </h2>
              <p className="text-sm font-semibold text-[#0A2540]/60 mt-1">
                Sign in to command your construction costs
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {errorMsg && (
                <div className="p-4 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540] mb-2">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                  <input
                    type="email"
                    required
                    placeholder="name@firm.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 h-12 bg-white border-2 border-[#E5E5DE] rounded-xl text-base font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 h-12 bg-white border-2 border-[#E5E5DE] rounded-xl text-base font-mono font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                  />
                </div>
                <p className="text-xs text-[#0A2540]/60 font-semibold mt-2">
                  Demo password for all accounts:{" "}
                  <span className="font-mono font-black text-[#0A2540] bg-[#FAF9F5] border border-[#E5E5DE] px-2 py-0.5 rounded">
                    DemoPass2026!
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[50px] mt-2 flex items-center justify-center gap-2.5 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-black text-base shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign in to Workspace"}{" "}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Quick Test Demo Role Cards */}
            <div className="mt-8 pt-6 border-t-2 border-[#E5E5DE]">
              <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/70 mb-3.5 flex items-center justify-between">
                <span>Quick Test Access — 1 Click (8 roles)</span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-black">
                  Sandbox Ready
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {DEMO_ACCOUNTS.map((b) => {
                  const isCurrent = activeDemoEmail === b.email;
                  return (
                    <button
                      key={b.email}
                      type="button"
                      onClick={() => handleDemoLogin(b)}
                      disabled={loading}
                      className={`p-3 border-2 rounded-xl text-left transition-all disabled:opacity-50 group relative cursor-pointer ${
                        isCurrent
                          ? "bg-[#0A2540] text-white border-[#0A2540] shadow-md"
                          : "bg-[#FAF9F5] hover:bg-white text-[#0A2540] border-[#E5E5DE] hover:border-[#0A2540]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`text-xs font-black truncate ${isCurrent ? "text-white" : "text-[#0A2540]"}`}>
                          {b.label}
                        </div>
                        {isCurrent && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                      <div className={`text-[10px] font-semibold truncate mt-0.5 ${isCurrent ? "text-white/70" : "text-[#0A2540]/60"}`}>
                        {b.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#0A2540]/60 font-semibold mt-3 text-center">
                Click any card to sign in instantly — no typing needed
              </p>
            </div>

            <div className="mt-8 text-center text-sm font-semibold">
              <span className="text-[#0A2540]/60">New contractor or firm? </span>
              <Link href="/register" className="font-black text-[#0A2540] hover:underline">
                Register Workspace →
              </Link>
            </div>
          </div>
          <div className="mt-5 text-center text-xs font-bold text-[#0A2540]/40 uppercase tracking-widest">
            © 2026 CostView · Construction Cost Intelligence
          </div>
        </div>
      </div>
    </div>
  );
}
