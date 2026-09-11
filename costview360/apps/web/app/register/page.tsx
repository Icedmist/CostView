"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/logo";
import { Lock, Mail, Building, User, ArrowRight, Shield } from "lucide-react";
import type { RoleName } from "@/lib/supabase/database.types";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleName>("Project Manager");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, company_name: companyName, default_role: role } },
    });
    if (error) {
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

      <div className="flex-1 flex items-center justify-center p-6 py-10">
        <div className="w-full max-w-[540px]">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0067c0] rounded-xl text-white font-bold text-lg shadow-sm mb-3">CV</div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Workspace</h2>
              <p className="text-xs text-slate-500 mt-1">Setup your multi-tenant organization in CostView 360</p>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              {errorMsg && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">{errorMsg}</div>}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">Company Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" required placeholder="e.g. Julius Berger Nigeria Plc" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-900 placeholder:text-[#8b8b8b] focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0] transition-all" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" required placeholder="Engr. Babatunde" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-900 placeholder:text-[#8b8b8b] focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">Default Role</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select value={role} onChange={(e) => setRole(e.target.value as RoleName)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0] transition-all cursor-pointer">
                      <option value="Admin">Admin</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Quantity Surveyor">Quantity Surveyor</option>
                      <option value="Architect">Architect</option>
                      <option value="Site Engineer">Site Engineer</option>
                      <option value="Procurement Officer">Procurement Officer</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Storekeeper">Storekeeper</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" required placeholder="babatunde@juliusberger.ng" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-900 placeholder:text-[#8b8b8b] focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0] transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="password" required minLength={8} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-lg text-sm font-mono text-slate-900 placeholder:text-[#8b8b8b] focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0] transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-lg font-semibold text-sm shadow-md transition-all active:scale-[0.98]">
                {loading ? "Registering..." : "Create Workspace"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs">
              <span className="text-slate-500">Already have an account? </span>
              <Link href="/login" className="font-semibold text-[#0067c0] hover:underline">Sign In →</Link>
            </div>
          </div>
          <div className="mt-4 text-center text-[11px] font-mono text-white/50 tracking-wider">© 2026 CostView 360 · Fluent Glassmorphism Edition</div>
        </div>
      </div>
    </div>
  );
}
