"use client";
import React from "react";
import Image from "next/image";

export function Logo({
  size = "md",
  variant = "white",
  showWordmark = true,
  showSubtitle = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "navy" | "white";
  showWordmark?: boolean;
  showSubtitle?: boolean;
}) {
  const sizeMap = {
    sm: { box: "w-9 h-9 rounded-xl p-1", img: 28, word: "text-lg" },
    md: { box: "w-11 h-11 rounded-xl p-1.5", img: 36, word: "text-xl" },
    lg: { box: "w-13 h-13 rounded-2xl p-2", img: 44, word: "text-2xl" },
    xl: { box: "w-16 h-16 rounded-2xl p-2.5", img: 56, word: "text-3xl" },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3.5 group select-none">
      <div
        className={`${current.box} bg-white flex items-center justify-center shrink-0 shadow-sm border border-[#0A2540]/15 transition-transform group-hover:scale-105`}
      >
        <Image
          src="/logo-mark.png"
          alt="CostView Logo"
          width={current.img}
          height={current.img}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <div className={`${current.word} font-black tracking-tight text-[#0A2540]`}>
            <span>CostView</span>
          </div>
          {showSubtitle && (
            <div className="text-xs font-bold tracking-wider text-[#0A2540]/70 uppercase mt-0.5">
              Construction Cost Intelligence
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function LogoBlock({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    sm: "w-9 h-9 rounded-xl p-1",
    md: "w-11 h-11 rounded-xl p-1.5",
    lg: "w-13 h-13 rounded-2xl p-2",
    xl: "w-16 h-16 rounded-2xl p-2.5",
  };
  const imgSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  };
  return (
    <div
      className={`${sizeMap[size] || sizeMap.md} bg-white rounded-xl flex items-center justify-center shadow-sm border border-[#0A2540]/15 select-none transition-transform group-hover:scale-105 ${className}`}
    >
      <Image
        src="/logo-mark.png"
        alt="CostView Logo"
        width={imgSizes[size] || 36}
        height={imgSizes[size] || 36}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}

export function LogoFull({
  width = 180,
  height = 60,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt="CostView"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );
}

