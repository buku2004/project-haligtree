"use client";
import React from "react";

interface Props {
  value: number; // 0–100
  label: string; // e.g. "Fear", "Greed"
}

export default function FgGauge({ value, label }: Props) {
  // clamp value between 0 and 100
  const safeValue = Math.max(0, Math.min(100, value));
  // convert to angle (0° on left → 180° on right)
  const angle = (safeValue / 100) * 180;

  const getColor = (v: number) => {
    if (v < 25) return "#ef4444"; // red
    if (v < 50) return "#f59e0b"; // orange-yellow
    if (v < 75) return "#84cc16"; // light green
    return "#22c55e"; // green
  };

  return (
    <div className="flex flex-col items-center justify-center">

      <div className="relative w-48 h-24">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Gradient for the arc */}
          <defs>
            <linearGradient id="fgGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Gauge arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#fgGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Indicator dot */}
          {(() => {
            const radius = 40;
            const cx = 50 - radius * Math.cos((angle * Math.PI) / 180);
            const cy = 50 - radius * Math.sin((angle * Math.PI) / 180);
            return <circle cx={cx} cy={cy} r="3.5" fill="black" />;
          })()}
        </svg>
      </div>

      <div className="text-3xl font-bold">{safeValue}</div>
      <div
        className="text-sm font-bold"
        style={{ color: getColor(safeValue) }}
      >
        {label}
      </div>
    </div>
  );
}
