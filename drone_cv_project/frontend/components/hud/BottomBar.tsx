'use client';

import { useEffect, useState } from 'react';

interface BottomBarProps {
  processingTime: number | null;
  isLoading: boolean;
  errorMessage?: string | null;
}

export default function BottomBar({
  processingTime,
  isLoading,
  errorMessage,
}: BottomBarProps) {
  const [blipAngle, setBlipAngle] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setBlipAngle((a) => (a + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-20 border-t border-cyan-500/40 flex items-center justify-between px-4 relative">
      <div className="absolute inset-0 border-t border-cyan-400/30 shadow-[0_0_8px_rgba(0,212,255,0.3)]" />

      {/* Left: Radar Blip */}
      <div className="relative w-16 h-16 z-10">
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 bg-[#0a1628]/80">
          {/* Grid lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-cyan-500/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-px bg-cyan-500/20" />
          </div>
          {/* Concentric circles */}
          <div className="absolute inset-[25%] rounded-full border border-cyan-500/15" />
          <div className="absolute inset-[50%] rounded-full border border-cyan-500/10" />

          {/* Sweep line */}
          <div
            className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent origin-left shadow-[0_0_10px_rgba(0,212,255,0.8)]"
            style={{ transform: `rotate(${blipAngle}deg)` }}
          />

          {/* Blip dots */}
          <div
            className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.8)]"
            style={{ top: '30%', left: '60%' }}
          />
          <div
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
            style={{ top: '55%', left: '35%' }}
          />
        </div>
      </div>

      {/* Center: Status Indicators */}
      <div className="flex items-center gap-4 z-10">
        {/* Small status boxes */}
        <div className="flex gap-1">
          {['SYS', 'NET', 'GPU', 'MEM'].map((label, i) => (
            <div
              key={label}
              className={`px-2 py-1 border text-[8px] font-mono ${
                i < 3
                  ? 'border-cyan-400/50 text-cyan-400 bg-cyan-400/10'
                  : 'border-cyan-500/30 text-cyan-500/50'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-40 h-2 border border-cyan-500/40 bg-[#0a1628] overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-all duration-500 ${
              isLoading ? 'animate-progress' : ''
            }`}
            style={{ width: isLoading ? '100%' : processingTime ? '100%' : '0%' }}
          />
        </div>

        {/* Status / processing time */}
        <div
          className={`max-w-xs truncate font-mono text-[10px] ${
            errorMessage ? 'text-red-400' : 'text-cyan-400/70'
          }`}
          title={errorMessage ?? undefined}
        >
          {errorMessage
            ? errorMessage
            : processingTime !== null
              ? `${(processingTime * 1000).toFixed(0)}ms`
              : isLoading
                ? 'DETECTING...'
                : '---'}
        </div>
      </div>

      {/* Right: Targeting Brackets */}
      <div className="relative w-16 h-16 z-10">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Corner brackets */}
          <path d="M4 16 L4 4 L16 4" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="2" />
          <path d="M48 4 L60 4 L60 16" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="2" />
          <path d="M60 48 L60 60 L48 60" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="2" />
          <path d="M16 60 L4 60 L4 48" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="2" />

          {/* Center crosshair */}
          <line x1="32" y1="24" x2="32" y2="40" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
          <line x1="24" y1="32" x2="40" y2="32" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
        </svg>

        {/* Small number readouts */}
        <div className="absolute top-1 right-1 text-[7px] font-mono text-cyan-400/50">X:128</div>
        <div className="absolute bottom-1 right-1 text-[7px] font-mono text-cyan-400/50">Y:256</div>
      </div>
    </div>
  );
}
