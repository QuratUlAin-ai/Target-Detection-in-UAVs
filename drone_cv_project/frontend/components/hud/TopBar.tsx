'use client';

import { useState, useEffect } from 'react';

interface TopBarProps {
  apiStatus: 'online' | 'offline' | 'checking';
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function TopBar({ apiStatus, selectedModel, onModelChange }: TopBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const models = [
    { id: 'drones', label: 'DRONES' },
    { id: 'target', label: 'TARGET' },
    { id: 'military', label: 'MILITARY' },
  ];

  return (
    <div className="h-16 border-b border-cyan-500/40 flex items-center justify-between px-4 relative">
      {/* Glowing border effect */}
      <div className="absolute inset-0 border-b border-cyan-400/30 shadow-[0_0_8px_rgba(0,212,255,0.3)]" />

      {/* Left: Media Controls */}
      <div className="flex items-center gap-2 z-10">
        <button className="w-8 h-8 border border-cyan-500/60 rounded flex items-center justify-center hover:bg-cyan-500/20 transition-all hover:shadow-[0_0_12px_rgba(0,212,255,0.5)]">
          <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-8 h-8 border border-cyan-500/60 rounded flex items-center justify-center hover:bg-cyan-500/20 transition-all ${isPlaying ? 'bg-cyan-500/30 shadow-[0_0_12px_rgba(0,212,255,0.5)]' : ''}`}
        >
          <svg className="w-3 h-3 text-cyan-400 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>
        <button className="w-8 h-8 border border-cyan-500/60 rounded flex items-center justify-center hover:bg-cyan-500/20 transition-all hover:shadow-[0_0_12px_rgba(0,212,255,0.5)]">
          <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,4 15,12 5,20" />
            <rect x="15" y="4" width="4" height="16" />
          </svg>
        </button>
        <button className="w-8 h-8 border border-cyan-500/60 rounded flex items-center justify-center hover:bg-cyan-500/20 transition-all hover:shadow-[0_0_12px_rgba(0,212,255,0.5)]">
          <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" />
          </svg>
        </button>
        <button className="w-8 h-8 border border-cyan-500/60 rounded flex items-center justify-center hover:bg-cyan-500/20 transition-all hover:shadow-[0_0_12px_rgba(0,212,255,0.5)]">
          <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>

        {/* Status indicator */}
        <div className="ml-4 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              apiStatus === 'online'
                ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]'
                : apiStatus === 'offline'
                ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'
                : 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse'
            }`}
          />
          <span className="text-cyan-400/70 text-xs font-mono uppercase">
            {apiStatus === 'online' ? 'CONNECTED' : apiStatus === 'offline' ? 'OFFLINE' : 'CHECKING'}
          </span>
        </div>
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <h1 className="text-cyan-400 font-mono text-sm tracking-[0.3em] font-bold animate-pulse-glow">
          DRONE TARGET DETECTION SYSTEM
        </h1>
      </div>

      {/* Right: Model Toggles & Signal */}
      <div className="flex items-center gap-4 z-10">
        {/* ON/OFF Labels */}
        <div className="flex gap-6 text-[10px] font-mono text-cyan-400/70">
          <span>ON</span>
          <span>OFF</span>
        </div>

        {/* Model Toggles */}
        <div className="flex gap-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`relative w-6 h-6 border transition-all ${
                selectedModel === model.id
                  ? 'border-cyan-400 bg-cyan-400/30 shadow-[0_0_10px_rgba(0,212,255,0.6)]'
                  : 'border-cyan-500/40 bg-transparent hover:border-cyan-400/60'
              }`}
            >
              {selectedModel === model.id && (
                <div className="absolute inset-1 bg-cyan-400/50" />
              )}
            </button>
          ))}
        </div>

        {/* Signal Strength Bars */}
        <div className="flex items-end gap-0.5 h-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-1.5 bg-cyan-400/70 transition-all ${
                i <= 4 ? 'shadow-[0_0_4px_rgba(0,212,255,0.5)]' : 'opacity-30'
              }`}
              style={{ height: `${i * 4 + 4}px` }}
            />
          ))}
        </div>

        {/* ID Readout */}
        <div className="font-mono text-[10px] text-cyan-400/60">
          <span className="text-cyan-300">◄</span> N:1818283828
        </div>
      </div>
    </div>
  );
}
