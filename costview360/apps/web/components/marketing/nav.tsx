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
    <header className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all">
      <nav className="bg-[#FAF9F5]/90 dark:bg-[#071324]/90 backdrop-blur-xl border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl md:rounded-full px-4 sm:px-6 h-[68px] sm:h-[74px] flex items-center justify-between gap-3 sm:gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] transition-all">
        <Link href="/" className="transition-transform hover:opacity-95 shrink-0">
          <Logo size="md" />
        </Link>
        <div className="hidden lg:flex items-center gap-1 font-extrabold text-sm xl:text-base text-[#0A2540]/80 dark:text-white/80">
          <Link
            href="/features"
            className="px-3.5 py-2 rounded-xl hover:text-[#0A2540] dark:hover:text-white hover:bg-white dark:hover:bg-[#0A1931] transition-all"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="px-3.5 py-2 rounded-xl hover:text-[#0A2540] dark:hover:text-white hover:bg-white dark:hover:bg-[#0A1931] transition-all"
          >
            How it Works
          </Link>
          <Link
            href="/pricing"
            className="px-3.5 py-2 rounded-xl hover:text-[#0A2540] dark:hover:text-white hover:bg-white dark:hover:bg-[#0A1931] transition-all"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="px-3.5 py-2 rounded-xl hover:text-[#0A2540] dark:hover:text-white hover:bg-white dark:hover:bg-[#0A1931] transition-all"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="px-3.5 py-2 rounded-xl hover:text-[#0A2540] dark:hover:text-white hover:bg-white dark:hover:bg-[#0A1931] transition-all"
          >
            Contact
          </Link>
        </div>
        <div className="hidden sm:flex items-center gap-2.5">
          {loading ? (
            <div className="w-28 h-10 bg-slate-200/60 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/account"
                className="min-h-[42px] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0A1931] hover:bg-slate-50 dark:hover:bg-[#0F2137] text-[#0A2540] dark:text-white text-sm font-black transition-all border-2 border-[#E5E5DE] dark:border-[#1E3A5F] shadow-xs"
              >
                <User className="w-4 h-4 text-[#0A2540] dark:text-white" />
                <span>My Account</span>
              </Link>
              <Link
                href="/dashboard"
                className="min-h-[42px] px-5 py-2 bg-[#0A2540] dark:bg-[#FFD23F] hover:bg-[#003366] dark:hover:bg-[#E8B838] text-white dark:text-[#0A1931] rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="min-h-[42px] px-3.5 py-2 bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] hover:bg-slate-50 dark:hover:bg-[#0F2137] text-slate-700 dark:text-slate-200 rounded-xl text-sm font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-[#0A2540] dark:text-white hover:text-[#003366] dark:hover:text-[#FFD23F] font-black text-sm sm:text-base transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="min-h-[42px] inline-flex items-center gap-2 px-5 py-2 bg-[#0A2540] dark:bg-[#FFD23F] hover:bg-[#003366] dark:hover:bg-[#E8B838] text-white dark:text-[#0A1931] rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Launch App <ArrowUpRight className="w-4 h-4 text-white dark:text-[#0A1931]" />
              </Link>
            </>
          )}
        </div>
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
            className="w-10 h-10 border-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931] rounded-xl flex items-center justify-center text-[#0A2540] dark:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#0F2137] transition-colors cursor-pointer shadow-xs"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="lg:hidden mt-2.5 rounded-2xl border-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-[#FAF9F5]/98 dark:bg-[#071324]/98 backdrop-blur-xl p-5 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            href="/features"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-[#0A1931] font-black text-base text-[#0A2540] dark:text-white border border-transparent hover:border-[#E5E5DE] dark:hover:border-[#1E3A5F] transition-all"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-[#0A1931] font-black text-base text-[#0A2540] dark:text-white border border-transparent hover:border-[#E5E5DE] dark:hover:border-[#1E3A5F] transition-all"
          >
            How it Works
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-[#0A1931] font-black text-base text-[#0A2540] dark:text-white border border-transparent hover:border-[#E5E5DE] dark:hover:border-[#1E3A5F] transition-all"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-[#0A1931] font-black text-base text-[#0A2540] dark:text-white border border-transparent hover:border-[#E5E5DE] dark:hover:border-[#1E3A5F] transition-all"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-[#0A1931] font-black text-base text-[#0A2540] dark:text-white border border-transparent hover:border-[#E5E5DE] dark:hover:border-[#1E3A5F] transition-all"
          >
            Contact
          </Link>
          {user ? (
            <div className="pt-4 border-t-2 border-[#E5E5DE] dark:border-[#1E3A5F] space-y-3">
              <div className="px-4 py-1.5 text-xs font-mono font-bold text-[#0A2540]/70 dark:text-white/70 truncate bg-white dark:bg-[#0A1931] rounded-lg border border-[#E5E5DE] dark:border-[#1E3A5F]">
                {user.email}
              </div>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white rounded-xl font-black text-base shadow-xs"
              >
                My Account
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] rounded-xl font-black text-base shadow-md"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full py-3 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900 rounded-xl font-black text-sm text-rose-700 dark:text-rose-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t-2 border-[#E5E5DE] dark:border-[#1E3A5F] space-y-3">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3.5 bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] rounded-xl font-black text-base shadow-md"
              >
                Launch App →
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl font-black text-base text-[#0A2540] dark:text-white shadow-xs"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
