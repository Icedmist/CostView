"use client";
import React from "react";

export function Logo({
  size = "md",
  variant = "navy",
  showWordmark = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "navy" | "mustard" | "white";
  showWordmark?: boolean;
}) {
  const blockSize =
    size === "sm"
      ? "w-8 h-8 text-xs rounded-lg"
      : size === "lg"
      ? "w-12 h-12 text-lg rounded-2xl"
      : size === "xl"
      ? "w-14 h-14 text-xl rounded-2xl"
      : "w-10 h-10 text-sm rounded-xl";
  const wordSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : size === "xl" ? "text-3xl" : "text-lg";

  const variants: Record<string, string> = {
    navy: "bg-gradient-to-br from-[#0A1931] via-[#0F2137] to-[#1E3A5F] text-white shadow-md border border-white/20",
    mustard: "bg-[#D4A017] text-[#0A1931] shadow-sm border border-amber-300 font-black",
    white: "bg-white text-[#0A1931] border border-slate-300 shadow-sm",
  };

  return (
    <div className="flex items-center gap-3 group">
      <div
        className={`${blockSize} ${variants[variant]} flex items-center justify-center font-black tracking-tight shrink-0 leading-none select-none transition-transform group-hover:scale-105`}
      >
        <span>CV</span>
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <div className={`${wordSize} font-black tracking-tight text-[#0A1931] flex items-baseline`}>
            <span>CostView</span>
            <span className="font-extrabold text-[#D4A017] ml-1 tracking-normal">360</span>
          </div>
          <div className="text-xs font-bold tracking-wider text-slate-500 uppercase mt-0.5">
            Construction Cost Intelligence
          </div>
        </div>
      )}
    </div>
  );
}

export function LogoBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-10 h-10 bg-gradient-to-br from-[#0A1931] via-[#0F2137] to-[#1E3A5F] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md border border-white/20 ${className}`}
    >
      <span>CV</span>
    </div>
  );
}
