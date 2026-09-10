"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const INACTIVITY_MS = 2 * 60 * 60 * 1000; // 2 hours

export function useSessionExpiry() {
  const router = useRouter();
  const supabase = createClient();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Tab-close expiry: sessionStorage is per-tab, localStorage is persisted
    // If new tab (no sessionStorage flag) but previous session exists, expire
    if (typeof window !== "undefined") {
      const lastActive = Number(localStorage.getItem("costview_last_active") || "0");
      // Only sign out if user has been inactive for longer than the inactivity window
      if (lastActive > 0 && Date.now() - lastActive > INACTIVITY_MS) {
        supabase.auth.signOut().then(() => {
          localStorage.removeItem("costview_demo_role");
          sessionStorage.clear();
          router.push("/login");
          router.refresh();
        });
        return;
      }
      sessionStorage.setItem("costview_tab_active", "1");
      sessionStorage.setItem("costview_last_active", Date.now().toString());
      localStorage.setItem("costview_last_active", Date.now().toString());
    }

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("costview_last_active", Date.now().toString());
        localStorage.setItem("costview_last_active", Date.now().toString());
      }
      timerRef.current = setTimeout(async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("costview_demo_role");
        sessionStorage.clear();
        router.push("/login");
        router.refresh();
      }, INACTIVITY_MS);
    };

    // Activity events
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));

    // Initial timer
    resetTimer();

    // Check on visibility change (tab hidden for long)
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        const last = Number(localStorage.getItem("costview_last_active") || "0");
        if (Date.now() - last > INACTIVITY_MS) {
          supabase.auth.signOut().then(() => {
            router.push("/login");
            router.refresh();
          });
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router]);
}
