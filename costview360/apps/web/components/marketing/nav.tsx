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
    <nav className="sticky top-0 z-50 bg-white border-b-[3px] border-navy-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[76px] flex items-center justify-between gap-4">
        <Link href="/"><Logo size="md" /></Link>
        <div className="hidden lg:flex items-center gap-6 font-black uppercase text-sm tracking-widest">
          <Link href="/features" className="hover:underline decoration-[4px] underline-offset-4">Features</Link>
          <Link href="/how-it-works" className="hover:underline decoration-[4px] underline-offset-4">How it Works</Link>
          <Link href="/pricing" className="hover:underline decoration-[4px] underline-offset-4">Pricing</Link>
          <Link href="/about" className="hover:underline decoration-[4px] underline-offset-4">About</Link>
          <Link href="/contact" className="hover:underline decoration-[4px] underline-offset-4">Contact</Link>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-10 bg-cream-100 border-2 border-navy-800 animate-pulse" />
          ) : user ? (
            <>
              <span className="text-xs font-bold text-navy-800/60 hidden xl:inline max-w-[160px] truncate">{user.email}</span>
              <Link href="/dashboard" className="px-5 py-3 bg-navy-800 text-white border-[3px] border-navy-800 font-black uppercase text-sm shadow-brutal-sm">Dashboard</Link>
              <button onClick={handleLogout} className="px-4 py-3 bg-white border-[3px] border-navy-800 font-black uppercase text-sm flex items-center gap-2 hover:bg-cream-100">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-5 py-3 bg-white border-[3px] border-navy-800 font-black uppercase text-sm tracking-wide hover:bg-[#FFF8D6] shadow-brutal-sm">Sign In</Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD23F] border-[3px] border-navy-800 font-black uppercase text-sm tracking-wide shadow-brutal-sm hover:bg-[#FFC11E]">Launch App <ArrowUpRight className="w-5 h-5" /></Link>
            </>
          )}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-11 h-11 bg-navy-800 border-[3px] border-navy-800 flex items-center justify-center text-white">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t-[3px] border-navy-800 bg-white p-4 space-y-3">
          <Link href="/features" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">Features</Link>
          <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">How it Works</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">Pricing</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">Contact</Link>
          {user ? (
            <>
              <div className="px-4 py-2 bg-cream-100 border-2 border-navy-800 text-xs font-mono font-bold truncate">{user.email}</div>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-3 bg-navy-800 text-white border-[3px] border-navy-800 font-black uppercase text-sm">Dashboard</Link>
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="w-full px-4 py-3 bg-white border-[3px] border-navy-800 font-black uppercase text-sm flex items-center justify-center gap-2"> <LogOut className="w-4 h-4" /> Log out</button>
            </>
          ) : (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-3 bg-[#FFD23F] border-[3px] border-navy-800 font-black uppercase text-sm">Launch App →</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-3 bg-navy-800 text-white border-[3px] border-navy-800 font-black uppercase text-sm">Sign In</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
