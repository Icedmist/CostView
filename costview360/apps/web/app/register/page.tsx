"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/logo";
import { ArrowRight, Lock, Mail, Building, User, Shield } from "lucide-react";
import type { RoleName } from "@/lib/supabase/database.types";

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<RoleName>("Admin");
  const [projectName, setProjectName] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role: role,
          company_name: companyName.trim(),
          project_name: projectName.trim(),
          project_code: projectCode.trim().toUpperCase(),
          project_location: projectLocation.trim(),
          project_budget: projectBudget ? Number(projectBudget) : 0,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (!data?.session) {
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("costview_tab_active", "1");
      sessionStorage.setItem("costview_last_active", Date.now().toString());
      localStorage.setItem("costview_last_active", Date.now().toString());
      localStorage.setItem("costview_demo_role", role);
      document.cookie = `costview_demo_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans text-[#0A2540]">
      {/* Top Brand Header */}
      <div className="p-6 flex items-center justify-between border-b-2 border-[#E5E5DE] bg-white">
        <Link href="/" className="flex items-center">
          <Logo size="md" showSubtitle={false} />
        </Link>
        <Link
          href="/"
          className="text-xs font-black uppercase tracking-wider text-[#0A2540] hover:bg-[#FAF9F5] border-2 border-[#E5E5DE] px-4 py-2 rounded-xl transition-all"
        >
          ← Back to Landing
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-[560px]">
          <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl shadow-xl p-5 sm:p-7">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0A2540] rounded-xl text-white font-black text-lg shadow-sm mb-3">
                CV
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight">
                Create Workspace &amp; Project
              </h2>
              <p className="text-xs font-semibold text-[#0A2540]/60 mt-0.5">
                Setup your construction organization and first project in CostView
              </p>
            </div>

            <form className="space-y-3.5" onSubmit={handleRegister}>
              {errorMsg && (
                <div className="p-3 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Organization & User Info */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540] mb-1">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julius Berger Nigeria Plc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 h-10 bg-white border-2 border-[#E5E5DE] rounded-xl text-sm font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                    <input
                      type="text"
                      required
                      placeholder="Engr. Babatunde"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 h-10 bg-white border-2 border-[#E5E5DE] rounded-xl text-sm font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540] mb-1">
                    Default Role
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as RoleName)}
                      className="w-full pl-9 pr-3 h-10 bg-white border-2 border-[#E5E5DE] rounded-xl text-xs sm:text-sm font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] transition-all cursor-pointer"
                    >
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

              {/* Initial Project Details (User Inputted) */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border-2 border-[#E5E5DE] space-y-2.5">
                <div className="text-xs font-black text-[#0A2540] uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> Initial Project Details (Custom)
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#0A2540]/80 mb-0.5">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Horizon Towers Residential Complex"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 h-9 bg-white border border-[#E5E5DE] rounded-lg text-xs sm:text-sm font-bold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#0A2540]/80 mb-0.5">
                      Project Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HT-01"
                      value={projectCode}
                      onChange={(e) => setProjectCode(e.target.value)}
                      className="w-full px-3 h-9 bg-white border border-[#E5E5DE] rounded-lg text-xs font-mono font-black text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#0A2540]/80 mb-0.5">
                      Site Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Victoria Island, Lagos"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      className="w-full px-3 h-9 bg-white border border-[#E5E5DE] rounded-lg text-xs font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#0A2540]/80 mb-0.5">
                    Initial Baseline Budget (₦ NGN, Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 301800000"
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value)}
                    className="w-full px-3 h-9 bg-white border border-[#E5E5DE] rounded-lg text-xs font-mono font-bold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540] mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                    <input
                      type="email"
                      required
                      placeholder="babatunde@juliusberger.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 h-10 bg-white border-2 border-[#E5E5DE] rounded-xl text-xs sm:text-sm font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="At least 8 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 h-10 bg-white border-2 border-[#E5E5DE] rounded-xl text-xs sm:text-sm font-mono font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-1 flex items-center justify-center gap-2 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {loading ? "Registering..." : "Launch Workspace & Project"}{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 text-center text-xs font-semibold">
              <span className="text-[#0A2540]/60">Already have an account? </span>
              <Link href="/login" className="font-black text-[#0A2540] hover:underline">
                Sign In →
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
