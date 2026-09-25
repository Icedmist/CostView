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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          company_name: companyName,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("costview_tab_active", "1");
        sessionStorage.setItem("costview_last_active", Date.now().toString());
        localStorage.setItem("costview_last_active", Date.now().toString());
        localStorage.setItem("costview_demo_role", role);
        document.cookie = `costview_demo_role=${role}; path=/; max-age=604800; SameSite=Lax`;
      }
      router.push("/dashboard");
      router.refresh();
    }
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
        <div className="w-full max-w-[580px]">
          <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0A2540] rounded-2xl text-white font-black text-xl shadow-md mb-4">
                CV
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#0A2540] tracking-tight">
                Create Workspace
              </h2>
              <p className="text-sm font-semibold text-[#0A2540]/60 mt-1">
                Setup your construction organization in CostView
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              {errorMsg && (
                <div className="p-4 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540] mb-2">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julius Berger Nigeria Plc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-11 pr-4 h-12 bg-white border-2 border-[#E5E5DE] rounded-xl text-base font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                    <input
                      type="text"
                      required
                      placeholder="Engr. Babatunde"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 h-12 bg-white border-2 border-[#E5E5DE] rounded-xl text-base font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540] mb-2">
                    Default Role
                  </label>
                  <div className="relative">
                    <Shield className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as RoleName)}
                      className="w-full pl-11 pr-4 h-12 bg-white border-2 border-[#E5E5DE] rounded-xl text-base font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] transition-all cursor-pointer"
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

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540] mb-2">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
                  <input
                    type="email"
                    required
                    placeholder="babatunde@juliusberger.ng"
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
                    minLength={8}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 h-12 bg-white border-2 border-[#E5E5DE] rounded-xl text-base font-mono font-semibold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[50px] mt-2 flex items-center justify-center gap-2.5 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-black text-base shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? "Registering..." : "Create Workspace"}{" "}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-semibold">
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
