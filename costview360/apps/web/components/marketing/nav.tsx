"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/logo";
import { ArrowUpRight, Menu, X, LogOut } from "lucide-react";

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
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[68px] flex items-center justify-between gap-4">
        <Link href="/" className="transition-transform hover:opacity-95"><Logo size="md" /></Link>
        <div className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600">
          <Link href="/features" className="px-3.5 py-1.5 rounded-xl hover:text-[#0067c0] hover:bg-slate-100/80 transition-all">Features</Link>
          <Link href="/how-it-works" className="px-3.5 py-1.5 rounded-xl hover:text-[#0067c0] hover:bg-slate-100/80 transition-all">How it Works</Link>
          <Link href="/pricing" className="px-3.5 py-1.5 rounded-xl hover:text-[#0067c0] hover:bg-slate-100/80 transition-all">Pricing</Link>
          <Link href="/about" className="px-3.5 py-1.5 rounded-xl hover:text-[#0067c0] hover:bg-slate-100/80 transition-all">About</Link>
          <Link href="/contact" className="px-3.5 py-1.5 rounded-xl hover:text-[#0067c0] hover:bg-slate-100/80 transition-all">Contact</Link>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9 bg-slate-100/80 rounded-xl animate-pulse" />
          ) : user ? (
            <>
              <span className="text-xs text-slate-500 hidden xl:inline max-w-[160px] truncate font-mono">{user.email}</span>
              <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-[#0067c0] to-[#0284c7] hover:from-[#005ba1] hover:to-[#0275b0] text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]">Dashboard</Link>
              <button onClick={handleLogout} className="px-3 py-2 bg-white/90 border border-slate-200/80 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all">
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-slate-700 hover:text-[#0067c0] font-semibold text-xs transition-colors">Sign In</Link>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0067c0] to-[#0284c7] hover:from-[#005ba1] hover:to-[#0275b0] text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]">Launch App <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            </>
          )}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 border border-slate-200/80 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl p-4 space-y-2">
          <Link href="/features" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2 rounded-xl hover:bg-slate-100/80 font-medium text-sm text-slate-800">Features</Link>
          <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2 rounded-xl hover:bg-slate-100/80 font-medium text-sm text-slate-800">How it Works</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2 rounded-xl hover:bg-slate-100/80 font-medium text-sm text-slate-800">Pricing</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2 rounded-xl hover:bg-slate-100/80 font-medium text-sm text-slate-800">About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3.5 py-2 rounded-xl hover:bg-slate-100/80 font-medium text-sm text-slate-800">Contact</Link>
          {user ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="px-3.5 py-1 text-xs font-mono text-slate-500 truncate">{user.email}</div>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 bg-gradient-to-r from-[#0067c0] to-[#0284c7] text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-600/20">Dashboard</Link>
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="w-full px-4 py-2 bg-white border border-slate-200/80 rounded-xl font-medium text-xs text-slate-600 flex items-center justify-center gap-2"> <LogOut className="w-4 h-4" /> Log out</button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 bg-gradient-to-r from-[#0067c0] to-[#0284c7] text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-600/20">Launch App →</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2 bg-white border border-slate-200/80 rounded-xl font-semibold text-xs text-slate-700">Sign In</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
