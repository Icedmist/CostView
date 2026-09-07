"use client";
import { useState } from "react";

// Phase 1 nav — Site Operations modules only. Commercial mode's pages are
// placeholders in the prototype and land in Phase 3 (see PRD Section 9).
const SITE_OPS_NAV = [
  "Home", "Budget", "Procurement", "Materials", "Labour",
  "Progress", "Subcontractors", "Variations", "Reports", "Admin", "Settings",
];

export default function Home() {
  const [mode, setMode] = useState<"site" | "commercial">("site");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <nav style={{ width: 260, borderRight: "1px solid #e5e5e5", padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>
          CostView<span style={{ fontWeight: 300, color: "#5c5c5c" }}>360</span>
        </div>
        <div style={{ display: "flex", background: "#e8e8e8", borderRadius: 8, padding: 3, marginBottom: 16 }}>
          <button onClick={() => setMode("site")} style={{ flex: 1, background: mode === "site" ? "#fff" : "transparent" }}>
            Site Operations
          </button>
          <button onClick={() => setMode("commercial")} style={{ flex: 1, background: mode === "commercial" ? "#fff" : "transparent" }}>
            Commercial
          </button>
        </div>
        {mode === "site" ? (
          <ul>{SITE_OPS_NAV.map((item) => <li key={item}>{item}</li>)}</ul>
        ) : (
          <p style={{ fontSize: 13, color: "#5c5c5c" }}>Commercial mode ships in Phase 3.</p>
        )}
      </nav>
      <main style={{ flex: 1, padding: 24 }}>
        <h1>Welcome back</h1>
        <p>Project dashboard goes here.</p>
      </main>
    </div>
  );
}
