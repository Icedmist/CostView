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
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between gap-4">
        <Link href="/"><Logo size="md" /></Link>
        <div className="hidden lg:flex items-center gap-6 font-semibold text-sm text-[#5c5c5c]">
          <Link href="/features" className="hover:text-[#0067c0] transition-colors">Features</Link>
          <Link href="/how-it-works" className="hover:text-[#0067c0] transition-colors">How it Works</Link>
          <Link href="/pricing" className="hover:text-[#0067c0] transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-[#0067c0] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#0067c0] transition-colors">Contact</Link>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9 bg-slate-100 rounded-md animate-pulse" />
          ) : user ? (
            <>
              <span className="text-xs text-[#5c5c5c] hidden xl:inline max-w-[160px] truncate">{user.email}</span>
              <Link href="/dashboard" className="px-4 py-2 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-md font-semibold text-xs uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]">Dashboard</Link>
              <button onClick={handleLogout} className="px-3 py-2 bg-white border border-[#e5e5e5] hover:bg-[#f5f5f5] text-[#5c5c5c] rounded-md text-xs font-medium shadow-xs flex items-center gap-1.5 transition-all">
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-[#1b1b1b] hover:text-[#0067c0] font-semibold text-xs uppercase tracking-wider transition-colors">Sign In</Link>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-md font-semibold text-xs uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]">Launch App <ArrowUpRight className="w-4 h-4" /></Link>
            </>
          )}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 border border-[#e5e5e5] rounded-md flex items-center justify-center text-[#1b1b1b] hover:bg-[#f5f5f5]">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#e5e5e5] bg-white/95 backdrop-blur-xl p-4 space-y-2">
          <Link href="/features" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md hover:bg-[#f5f5f5] font-semibold text-sm text-[#1b1b1b]">Features</Link>
          <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md hover:bg-[#f5f5f5] font-semibold text-sm text-[#1b1b1b]">How it Works</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md hover:bg-[#f5f5f5] font-semibold text-sm text-[#1b1b1b]">Pricing</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md hover:bg-[#f5f5f5] font-semibold text-sm text-[#1b1b1b]">About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md hover:bg-[#f5f5f5] font-semibold text-sm text-[#1b1b1b]">Contact</Link>
          {user ? (
            <>
              <div className="px-3 py-1.5 text-xs font-mono text-[#5c5c5c] truncate">{user.email}</div>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 bg-[#0067c0] text-white rounded-md font-semibold text-xs uppercase tracking-wider">Dashboard</Link>
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="w-full px-4 py-2 bg-white border border-[#e5e5e5] rounded-md font-medium text-xs text-[#5c5c5c] flex items-center justify-center gap-2"> <LogOut className="w-4 h-4" /> Log out</button>
            </>
          ) : (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 bg-[#0067c0] text-white rounded-md font-semibold text-xs uppercase tracking-wider">Launch App →</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2 bg-white border border-[#e5e5e5] rounded-md font-medium text-xs text-[#1b1b1b]">Sign In</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
