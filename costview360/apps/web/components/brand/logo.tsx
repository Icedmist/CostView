"use client";
import React from "react";

export function Logo({ size = "md", variant = "navy", showWordmark = true }: { size?: "sm" | "md" | "lg" | "xl"; variant?: "navy" | "mustard" | "white"; showWordmark?: boolean }) {
  const blockSize = size === "sm" ? "w-8 h-8 text-[11px] rounded-md" : size === "lg" ? "w-12 h-12 text-lg rounded-xl" : size === "xl" ? "w-14 h-14 text-xl rounded-xl" : "w-9 h-9 text-sm rounded-lg";
  const wordSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : size === "xl" ? "text-3xl" : "text-[16px]";

  const variants: Record<string, string> = {
    navy: "bg-gradient-to-br from-[#0067c0] to-[#004b85] text-white shadow-sm border border-white/20",
    mustard: "bg-accent text-white shadow-sm border border-accent/20",
    white: "bg-white text-accent border border-border shadow-sm",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${blockSize} ${variants[variant]} flex items-center justify-center font-bold tracking-tight shrink-0 leading-none select-none shadow-[0_2px_8px_rgba(0,103,192,0.25)]`}>
        <span>CV</span>
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <div className={`${wordSize} font-bold tracking-tight text-[#1b1b1b] flex items-baseline`}>
            <span>CostView</span>
            <span className="font-normal text-[#5c5c5c] ml-1 tracking-wide">360</span>
          </div>
          <div className="text-[10.5px] font-semibold tracking-[0.5px] text-[#5c5c5c] uppercase">Construction Cost Intelligence</div>
        </div>
      )}
    </div>
  );
}

export function LogoBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`w-9 h-9 bg-gradient-to-br from-[#0067c0] to-[#004b85] text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-[0_2px_8px_rgba(0,103,192,0.2)] border border-white/20 ${className}`}>
      <span>CV</span>
    </div>
  );
}
