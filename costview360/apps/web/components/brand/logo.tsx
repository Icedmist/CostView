"use client";
import React from "react";

export function Logo({
  size = "md",
  variant = "navy",
  showWordmark = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "navy" | "white";
  showWordmark?: boolean;
}) {
  const blockSize =
    size === "sm"
      ? "w-9 h-9 text-sm rounded-xl"
      : size === "lg"
      ? "w-13 h-13 text-xl rounded-2xl"
      : size === "xl"
      ? "w-16 h-16 text-2xl rounded-2xl"
      : "w-11 h-11 text-base rounded-xl";
  const wordSize =
    size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : size === "xl" ? "text-3xl" : "text-xl";

  const variants: Record<string, string> = {
    navy: "bg-[#0A2540] text-white shadow-md border border-[#0A2540]/30",
    white: "bg-white text-[#0A2540] border-2 border-[#0A2540] shadow-sm",
  };

  return (
    <div className="flex items-center gap-3.5 group">
      <div
        className={`${blockSize} ${variants[variant] || variants.navy} flex items-center justify-center font-black tracking-tight shrink-0 leading-none select-none transition-transform group-hover:scale-105`}
      >
        <span>CV</span>
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <div className={`${wordSize} font-black tracking-tight text-[#0A2540]`}>
            <span>CostView</span>
          </div>
          <div className="text-xs font-bold tracking-wider text-[#0A2540]/70 uppercase mt-0.5">
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
      className={`w-11 h-11 bg-[#0A2540] text-white rounded-xl flex items-center justify-center font-black text-base shadow-md border border-[#0A2540]/30 ${className}`}
    >
      <span>CV</span>
    </div>
  );
}
