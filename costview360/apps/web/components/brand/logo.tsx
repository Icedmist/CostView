"use client";
import React from "react";

export function Logo({ size = "md", variant = "navy", showWordmark = true }: { size?: "sm" | "md" | "lg" | "xl"; variant?: "navy" | "mustard" | "white"; showWordmark?: boolean }) {
  const blockSize = size === "sm" ? "w-8 h-8 text-[11px] rounded-lg" : size === "lg" ? "w-12 h-12 text-lg rounded-2xl" : size === "xl" ? "w-14 h-14 text-xl rounded-2xl" : "w-9 h-9 text-sm rounded-xl";
  const wordSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : size === "xl" ? "text-3xl" : "text-[16px]";

  const variants: Record<string, string> = {
    navy: "bg-gradient-to-br from-[#0067c0] via-[#0284c7] to-[#38bdf8] text-white shadow-md shadow-blue-500/25 border border-white/40",
    mustard: "bg-gradient-to-br from-[#0067c0] to-[#0284c7] text-white shadow-sm border border-white/20",
    white: "bg-white text-[#0067c0] border border-slate-200 shadow-sm",
  };

  return (
    <div className="flex items-center gap-2.5 group">
      <div className={`${blockSize} ${variants[variant]} flex items-center justify-center font-extrabold tracking-tight shrink-0 leading-none select-none transition-transform group-hover:scale-105`}>
        <span>CV</span>
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <div className={`${wordSize} font-bold tracking-tight text-slate-900 flex items-baseline`}>
            <span>CostView</span>
            <span className="font-extrabold bg-gradient-to-r from-[#0067c0] to-[#0284c7] bg-clip-text text-transparent ml-1 tracking-normal">360</span>
          </div>
          <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Construction Cost Intelligence</div>
        </div>
      )}
    </div>
  );
}

export function LogoBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`w-9 h-9 bg-gradient-to-br from-[#0067c0] via-[#0284c7] to-[#38bdf8] text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-[0_2px_12px_rgba(0,103,192,0.25)] border border-white/30 ${className}`}>
      <span>CV</span>
    </div>
  );
}
