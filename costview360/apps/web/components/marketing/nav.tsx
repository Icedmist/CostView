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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="transition-transform hover:opacity-95">
          <Logo size="md" />
        </Link>
        <div className="hidden lg:flex items-center gap-2 font-bold text-sm text-slate-700">
          <Link
            href="/features"
            className="px-4 py-2 rounded-xl hover:text-[#0A1931] hover:bg-slate-100 transition-all"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="px-4 py-2 rounded-xl hover:text-[#0A1931] hover:bg-slate-100 transition-all"
          >
            How it Works
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-xl hover:text-[#0A1931] hover:bg-slate-100 transition-all"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 rounded-xl hover:text-[#0A1931] hover:bg-slate-100 transition-all"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl hover:text-[#0A1931] hover:bg-slate-100 transition-all"
          >
            Contact
          </Link>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {loading ? (
            <div className="w-28 h-10 bg-slate-100 rounded-xl animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
              >
                <User className="w-3.5 h-3.5 text-[#0A1931]" />
                <span>My Account</span>
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-[#0A1931] hover:bg-[#142C4E] text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 text-slate-800 hover:text-[#0A1931] font-bold text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A1931] hover:bg-[#142C4E] text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Launch App <ArrowUpRight className="w-4 h-4 text-[#D4A017]" />
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-10 h-10 border border-slate-300 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2">
          <Link
            href="/features"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 rounded-xl hover:bg-slate-100 font-bold text-sm text-slate-800"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 rounded-xl hover:bg-slate-100 font-bold text-sm text-slate-800"
          >
            How it Works
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 rounded-xl hover:bg-slate-100 font-bold text-sm text-slate-800"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 rounded-xl hover:bg-slate-100 font-bold text-sm text-slate-800"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 rounded-xl hover:bg-slate-100 font-bold text-sm text-slate-800"
          >
            Contact
          </Link>
          {user ? (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="px-4 py-1 text-xs font-mono text-slate-500 truncate">{user.email}</div>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-2.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold text-sm"
              >
                My Account
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-2.5 bg-[#0A1931] text-white rounded-xl font-bold text-sm shadow-md"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-700 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-3 bg-[#0A1931] text-white rounded-xl font-bold text-sm shadow-md"
              >
                Launch App →
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-800"
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
