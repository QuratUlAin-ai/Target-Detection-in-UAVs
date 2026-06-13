'use client';

import { Detection } from '@/lib/api';

interface RightPanelProps {
  detections: Detection[];
  confidence: number;
  onConfidenceChange: (value: number) => void;
}

function formatCorners(corners: number[][] | undefined): string {
  if (!corners?.length) return '—';
  return corners
    .map((pt) => `[${pt.map((n) => Number(n).toFixed(0)).join(',')}]`)
    .join(' ');
}

export default function RightPanel({ detections, confidence, onConfidenceChange }: RightPanelProps) {
  const sliderValues = [65, 45, 80, 30];
  const items = detections ?? [];

  return (
    <div className="flex flex-col gap-3 p-3 h-full text-cyan-400">
      {/* Detection Results */}
      <div className="border border-cyan-500/30 p-2 h-32 overflow-y-auto font-mono text-[9px] bg-[#0a1628]/50 shadow-[inset_0_0_10px_rgba(0,212,255,0.1)]">
        <div className="text-cyan-300/70 mb-1">// DETECTION RESULTS</div>
        {items.length > 0 ? (
          items.map((det, i) => (
            <div key={i} className="text-cyan-400/80 mb-1">
              <div className="text-cyan-300">{`[${i}] ${(det.class_name ?? 'unknown').toUpperCase()}`}</div>
              <div className="pl-2 text-cyan-400/60">
                {`CONF: ${((det.confidence ?? 0) * 100).toFixed(1)}%`}
              </div>
              <div className="pl-2 text-cyan-400/50">
                {`OBB: ${formatCorners(det.corners)}`}
              </div>
            </div>
          ))
        ) : (
          <div className="text-cyan-400/40">NO DETECTIONS</div>
        )}
      </div>

      {/* Arc Gauge */}
      <div className="relative w-full aspect-square max-w-[140px] mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(0,212,255,0.2)"
            strokeWidth="8"
            strokeDasharray="200 83"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(0,212,255,0.6)"
            strokeWidth="8"
            strokeDasharray={`${items.length * 33} 283`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]"
          />
          {/* Inner circle */}
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />

          {/* Tick marks */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="8"
              x2="50"
              y2="12"
              stroke="rgba(0,212,255,0.4)"
              strokeWidth="1"
              transform={`rotate(${i * 15} 50 50)`}
            />
          ))}

          {/* SAT label */}
          <text x="50" y="40" textAnchor="middle" className="fill-cyan-400/60 text-[8px] font-mono">
            SAT
          </text>
          {/* Center number */}
          <text x="50" y="55" textAnchor="middle" className="fill-cyan-300 text-[14px] font-mono font-bold">
            {`0${items.length}/6`}
          </text>
        </svg>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-4 gap-1 px-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square border transition-all ${
              i < items.length
                ? 'border-cyan-400 bg-cyan-400/40 shadow-[0_0_8px_rgba(0,212,255,0.5)]'
                : 'border-cyan-500/30 bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Vertical Sliders */}
      <div className="flex justify-center gap-3 flex-1 items-center">
        {sliderValues.map((val, i) => (
          <div key={i} className="flex flex-col items-center h-32">
            {/* Up arrow */}
            <div className="text-cyan-400/60 text-[8px]">▲</div>
            {/* Slider track */}
            <div className="relative w-2 flex-1 bg-cyan-900/50 border border-cyan-500/30 my-1">
              <div
                className={`absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 to-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.5)] transition-all ${
                  i === 0 ? '' : ''
                }`}
                style={{ height: i === 0 ? `${confidence}%` : `${val}%` }}
              />
              {/* Slider handle */}
              <div
                className="absolute w-4 h-1 bg-cyan-300 -left-1 shadow-[0_0_6px_rgba(0,212,255,0.8)]"
                style={{ bottom: i === 0 ? `${confidence}%` : `${val}%` }}
              />
            </div>
            {/* Down arrow */}
            <div className="text-cyan-400/60 text-[8px]">▼</div>
          </div>
        ))}
      </div>

      {/* Confidence slider control (first slider) */}
      <input
        type="range"
        min="10"
        max="100"
        value={confidence}
        onChange={(e) => onConfidenceChange(Number(e.target.value))}
        className="w-full h-1 bg-cyan-900/50 appearance-none cursor-pointer accent-cyan-400"
      />
      <div className="text-center text-[9px] font-mono text-cyan-400/60">
        CONFIDENCE: {confidence}%
      </div>

      {/* Large number readout */}
      <div className="text-center font-mono text-cyan-300 text-lg tracking-wider">
        2.71628818228
      </div>
    </div>
  );
}
