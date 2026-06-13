'use client';

import { useEffect, useState } from 'react';

export default function LeftPanel() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setRotation((r) => (r + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const barHeights = [85, 70, 90, 60, 95, 75, 55, 80];

  return (
    <div className="flex flex-col gap-4 p-3 h-full">
      {/* Globe/Radar */}
      <div className="relative w-full aspect-square max-w-[180px] mx-auto">
        <div className="absolute inset-0 border border-cyan-500/40 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.2)]" />
        <div className="absolute inset-2 border border-cyan-500/30 rounded-full" />
        <div className="absolute inset-4 border border-cyan-500/20 rounded-full" />

        {/* Grid lines on globe */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Horizontal lines */}
          <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="40" ry="30" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          {/* Vertical lines */}
          <ellipse cx="50" cy="50" rx="15" ry="40" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="30" ry="40" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          {/* Continents approximation */}
          <path
            d="M30 35 Q35 30 45 32 Q50 35 55 33 Q65 30 70 38 Q72 45 68 50 Q60 55 50 52 Q40 55 35 48 Q30 42 30 35"
            fill="none"
            stroke="rgba(0,212,255,0.5)"
            strokeWidth="1"
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}
          />
        </svg>

        {/* Glowing dot */}
        <div
          className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,212,255,0.8)]"
          style={{
            top: '30%',
            left: '60%',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />

        {/* Labels */}
        <div className="absolute -bottom-1 left-0 text-[9px] font-mono text-cyan-400/70">
          ◄04*PLANET
        </div>
        <div className="absolute -bottom-1 right-0 text-[9px] font-mono text-cyan-400/70">
          60%
        </div>
      </div>

      {/* Data Readout */}
      <div className="text-[9px] font-mono text-cyan-400/60 pl-1">
        DATA# 2.0665.10
      </div>

      {/* 3D Wireframe Cube */}
      <div className="relative w-20 h-20 mx-auto my-2">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Front face */}
          <polygon
            points="20,30 60,30 60,70 20,70"
            fill="none"
            stroke="rgba(0,212,255,0.5)"
            strokeWidth="1"
          />
          {/* Back face */}
          <polygon
            points="40,15 80,15 80,55 40,55"
            fill="none"
            stroke="rgba(0,212,255,0.3)"
            strokeWidth="1"
          />
          {/* Connecting lines */}
          <line x1="20" y1="30" x2="40" y2="15" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
          <line x1="60" y1="30" x2="80" y2="15" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
          <line x1="60" y1="70" x2="80" y2="55" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
          <line x1="20" y1="70" x2="40" y2="55" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
        </svg>
      </div>

      {/* Bar Chart */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-end justify-center gap-1 h-24 px-2">
          {barHeights.map((height, i) => (
            <div
              key={i}
              className="w-3 bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_6px_rgba(0,212,255,0.4)] transition-all duration-500"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between px-2 mt-1">
          <span className="text-[8px] font-mono text-cyan-400/60">DEC</span>
          <span className="text-[8px] font-mono text-cyan-400/60">JAN</span>
        </div>
      </div>

      {/* Sine Wave - Multiple interweaving waves */}
      <div className="h-20 relative overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
          {/* Wave 1 */}
          <path
            d="M0 30 C20 10 40 10 60 30 S100 50 120 30 S160 10 180 30 S220 50 240 30"
            fill="none"
            stroke="rgba(0,212,255,0.6)"
            strokeWidth="1.5"
            className="animate-wave"
          />
          {/* Wave 2 - offset */}
          <path
            d="M-20 30 C0 50 20 50 40 30 S80 10 100 30 S140 50 160 30 S200 10 220 30"
            fill="none"
            stroke="rgba(0,212,255,0.4)"
            strokeWidth="1"
            className="animate-wave-delayed"
          />
          {/* Wave 3 - smaller amplitude */}
          <path
            d="M0 30 C15 20 30 20 45 30 S75 40 90 30 S120 20 135 30 S165 40 180 30 S210 20 225 30"
            fill="none"
            stroke="rgba(0,212,255,0.3)"
            strokeWidth="0.8"
            style={{ strokeDasharray: '4 2' }}
          />
          {/* Wave 4 - crossing wave */}
          <path
            d="M0 30 C25 45 50 15 75 30 S125 45 150 30 S200 15 225 30"
            fill="none"
            stroke="rgba(0,212,255,0.25)"
            strokeWidth="0.8"
          />
        </svg>
      </div>
    </div>
  );
}
