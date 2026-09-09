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
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans">
      <div className="h-[64px] bg-white border-b-[3px] border-navy-800 flex items-center justify-between px-6">
        <Link href="/"><Logo size="sm" /></Link>
        <Link href="/" className="text-xs font-black uppercase tracking-widest border-[3px] border-navy-800 px-4 py-2 hover:bg-cream-100">← Back to Landing</Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 py-10">
        <div className="w-full max-w-[560px]">
          <div className="bg-white border-[3px] border-navy-800 shadow-brutal p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-800 border-[3px] border-navy-800 font-black text-white text-xl shadow-brutal-sm mb-3">CV</div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-navy-800">Create Workspace</h2>
              <p className="text-xs font-bold text-navy-800/60 mt-1">Setup your multi-tenant organization</p>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              {errorMsg && <div className="p-3 bg-red-500 border-[3px] border-navy-800 text-white text-xs font-black">{errorMsg}</div>}

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-navy-800 mb-1">Company Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-800" />
                  <input type="text" required placeholder="e.g. Julius Berger Nigeria Plc" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white border-[3px] border-navy-800 text-sm font-bold text-navy-800 placeholder:text-navy-800/40 focus:outline-none" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-navy-800 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-800" />
                    <input type="text" required placeholder="Engr. Babatunde" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-white border-[3px] border-navy-800 text-sm font-bold text-navy-800 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-navy-800 mb-1">Default Role</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-800" />
                    <select value={role} onChange={(e) => setRole(e.target.value as RoleName)}
                      className="w-full pl-10 pr-3 py-3 bg-white border-[3px] border-navy-800 text-sm font-black text-navy-800 focus:outline-none cursor-pointer">
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
                <label className="block text-xs font-black uppercase tracking-widest text-navy-800 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-800" />
                  <input type="email" required placeholder="babatunde@juliusberger.ng" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white border-[3px] border-navy-800 text-sm font-bold text-navy-800 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-navy-800 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-800" />
                  <input type="password" required minLength={8} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white border-[3px] border-navy-800 text-sm font-mono font-bold text-navy-800 focus:outline-none" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-mustard-400 text-navy-800 border-[3px] border-navy-800 font-black uppercase text-sm tracking-wide shadow-brutal hover:bg-mustard-500 active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all">
                {loading ? "Registering..." : "Create Workspace"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs font-bold">
              <span className="text-navy-800/60">Already have an account? </span>
              <Link href="/login" className="font-black text-navy-800 underline decoration-[3px] decoration-mustard-400">Sign In →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
