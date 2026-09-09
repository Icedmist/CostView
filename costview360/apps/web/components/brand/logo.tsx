"use client";
import React from "react";

export function Logo({ size = "md", variant = "navy", showWordmark = true }: { size?: "sm" | "md" | "lg" | "xl"; variant?: "navy" | "mustard" | "white"; showWordmark?: boolean }) {
  const blockSize = size === "sm" ? "w-8 h-8 text-[11px]" : size === "lg" ? "w-14 h-14 text-xl" : size === "xl" ? "w-16 h-16 text-2xl" : "w-10 h-10 text-sm";
  const wordSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : size === "xl" ? "text-3xl" : "text-[15px]";

  const variants: Record<string, string> = {
    navy: "bg-navy-800 border-navy-800 text-white",
    mustard: "bg-mustard-400 border-navy-800 text-navy-800",
    white: "bg-white border-navy-800 text-navy-800",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${blockSize} ${variants[variant]} border-[3px] flex items-center justify-center font-black tracking-tighter shadow-brutal-sm shrink-0 leading-none select-none`}>
        <span className="font-display">CV</span>
      </div>
      {showWordmark && (
        <div className="leading-none">
          <div className={`${wordSize} font-black tracking-tighter text-navy-800 leading-none flex items-baseline gap-1`}>
            CostView<span className="bg-mustard-400 border-[2px] border-navy-800 px-1.5 py-0.5 text-[9px] font-black tracking-widest uppercase leading-none">PRO</span>
          </div>
          <div className="text-[10px] font-bold tracking-[0.18em] text-navy-800/60 uppercase font-mono -mt-[1px]">Analyse · Plan · Build</div>
        </div>
      )}
    </div>
  );
}

export function LogoBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`w-10 h-10 bg-navy-800 border-[3px] border-navy-800 flex items-center justify-center font-black text-white text-sm shadow-brutal-sm ${className}`}>
      <span className="font-display tracking-tighter">CV</span>
    </div>
  );
}
