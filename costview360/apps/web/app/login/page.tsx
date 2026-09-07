"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleDemoLogin = (demoEmail: string, role: string) => {
    setEmail(demoEmail);
    setPassword("DemoPass2026!");
    // Directly go to dashboard in sandbox mode
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 font-black text-zinc-950 text-xl shadow-lg mb-3">
          360
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          CostView <span className="text-emerald-400 font-normal text-sm px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 font-mono">ENTERPRISE</span>
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Analyse · Plan · Build Smarter — Construction Cost Intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-6 shadow-xl border border-zinc-800 sm:rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@firm.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none transition-colors"
            >
              {loading ? "Signing in..." : "Sign in to Workspace"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Reviewers */}
          <div className="mt-6 pt-5 border-t border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick Test Access (1-Click)</span>
              <span className="text-emerald-400 text-[10px]">Sandbox Ready</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("pm@costview.ng", "Project Manager")}
                className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left transition-colors"
              >
                <div className="text-xs font-bold text-zinc-200">PM</div>
                <div className="text-[10px] text-zinc-500 truncate">Manager</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("qs@costview.ng", "Quantity Surveyor")}
                className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left transition-colors"
              >
                <div className="text-xs font-bold text-zinc-200">QS</div>
                <div className="text-[10px] text-zinc-500 truncate">Valuations</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("site@costview.ng", "Site Engineer")}
                className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left transition-colors"
              >
                <div className="text-xs font-bold text-zinc-200">Site Eng</div>
                <div className="text-[10px] text-zinc-500 truncate">Deliveries</div>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-zinc-400">
            New company?{" "}
            <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Register a Workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
