"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/logo";
import { ArrowUpRight, Menu, X, LogOut, User } from "lucide-react";

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("costview_demo_role");
    localStorage.removeItem("costview_demo_email");
    localStorage.removeItem("costview_last_active");
    document.cookie = "costview_demo_role=; path=/; max-age=0";
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-xl border-b-2 border-[#E5E5DE] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[76px] flex items-center justify-between gap-4">
        <Link href="/" className="transition-transform hover:opacity-95">
          <Logo size="md" />
        </Link>
        <div className="hidden lg:flex items-center gap-1.5 font-extrabold text-base text-[#0A2540]/80">
          <Link
            href="/features"
            className="px-4 py-2.5 rounded-xl hover:text-[#0A2540] hover:bg-white transition-all"
          >
            Features
          </Link>
          <Link
            href="/reports"
            className="px-4 py-2.5 rounded-xl hover:text-[#0A2540] hover:bg-white transition-all"
          >
            Reports
          </Link>
          <Link
            href="/how-it-works"
            className="px-4 py-2.5 rounded-xl hover:text-[#0A2540] hover:bg-white transition-all"
          >
            How it Works
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-2.5 rounded-xl hover:text-[#0A2540] hover:bg-white transition-all"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="px-4 py-2.5 rounded-xl hover:text-[#0A2540] hover:bg-white transition-all"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2.5 rounded-xl hover:text-[#0A2540] hover:bg-white transition-all"
          >
            Contact
          </Link>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {loading ? (
            <div className="w-28 h-11 bg-slate-200/60 rounded-xl animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/account"
                className="min-h-[46px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0A2540] text-sm font-black transition-all border-2 border-[#E5E5DE] shadow-xs"
              >
                <User className="w-4 h-4 text-[#0A2540]" />
                <span>My Account</span>
              </Link>
              <Link
                href="/dashboard"
                className="min-h-[46px] px-6 py-2.5 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="min-h-[46px] px-4 py-2.5 bg-white border-2 border-[#E5E5DE] hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 text-[#0A2540] hover:text-[#003366] font-black text-base transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Launch App <ArrowUpRight className="w-4 h-4 text-white" />
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-11 h-11 border-2 border-[#E5E5DE] bg-white rounded-xl flex items-center justify-center text-[#0A2540] hover:bg-[#FAF9F5] transition-colors cursor-pointer shadow-xs"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t-2 border-[#E5E5DE] bg-[#FAF9F5] p-5 space-y-2.5 shadow-xl animate-in fade-in duration-150">
          <Link
            href="/features"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white font-black text-base text-[#0A2540] border border-transparent hover:border-[#E5E5DE] transition-all"
          >
            Features
          </Link>
          <Link
            href="/reports"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white font-black text-base text-[#0A2540] border border-transparent hover:border-[#E5E5DE] transition-all"
          >
            Reports Studio
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white font-black text-base text-[#0A2540] border border-transparent hover:border-[#E5E5DE] transition-all"
          >
            How it Works
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white font-black text-base text-[#0A2540] border border-transparent hover:border-[#E5E5DE] transition-all"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white font-black text-base text-[#0A2540] border border-transparent hover:border-[#E5E5DE] transition-all"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white font-black text-base text-[#0A2540] border border-transparent hover:border-[#E5E5DE] transition-all"
          >
            Contact
          </Link>
          {user ? (
            <div className="pt-4 border-t-2 border-[#E5E5DE] space-y-3">
              <div className="px-4 py-1.5 text-xs font-mono font-bold text-[#0A2540]/70 truncate bg-white rounded-lg border border-[#E5E5DE]">
                {user.email}
              </div>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 bg-white border-2 border-[#E5E5DE] text-[#0A2540] rounded-xl font-black text-base shadow-xs"
              >
                My Account
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 bg-[#0A2540] text-white rounded-xl font-black text-base shadow-md"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full py-3 bg-rose-50 border-2 border-rose-200 rounded-xl font-black text-sm text-rose-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t-2 border-[#E5E5DE] space-y-3">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3.5 bg-[#0A2540] text-white rounded-xl font-black text-base shadow-md"
              >
                Launch App →
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 bg-white border-2 border-[#E5E5DE] rounded-xl font-black text-base text-[#0A2540] shadow-xs"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
