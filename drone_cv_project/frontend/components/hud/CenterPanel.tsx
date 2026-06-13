'use client';

interface CenterPanelProps {
  imagePreview: string | null;
  annotatedImage: string | null;
  isLoading: boolean;
  onImageUpload: (file: File) => void;
  onRunDetection: () => void;
}

export default function CenterPanel({
  imagePreview,
  annotatedImage,
  isLoading,
  onImageUpload,
  onRunDetection,
}: CenterPanelProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    e.target.value = '';
  };

  const displayImage = annotatedImage || imagePreview;

  return (
    <div className="flex flex-col items-center justify-center h-full py-4 relative">
      {/* Main Radar Circle — transparent file input on top (hidden inputs block .click()) */}
      <label className="relative block w-[90%] max-w-[500px] aspect-square cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0"
          aria-label="Upload image"
        />
        {/* Outer rotating ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-cyan-500/40 ${
            isLoading ? 'animate-spin-fast' : 'animate-spin-slow'
          }`}
        >
          {/* Tick marks */}
          {Array.from({ length: 72 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-2 bg-cyan-400/60"
              style={{
                top: '0',
                left: '50%',
                transformOrigin: '50% 250px',
                transform: `translateX(-50%) rotate(${i * 5}deg)`,
              }}
            />
          ))}
        </div>

        {/* Concentric rings */}
        <div className="absolute inset-[5%] rounded-full border border-cyan-500/30 shadow-[0_0_20px_rgba(0,212,255,0.15)]" />
        <div className="absolute inset-[15%] rounded-full border border-cyan-500/25" />
        <div className="absolute inset-[25%] rounded-full border border-cyan-500/20" />
        <div className="absolute inset-[35%] rounded-full border border-cyan-500/15" />

        {/* Corner targeting brackets */}
        <svg className="absolute inset-[10%] w-[80%] h-[80%]" viewBox="0 0 100 100">
          {/* Top-left */}
          <path d="M5 20 L5 5 L20 5" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
          {/* Top-right */}
          <path d="M80 5 L95 5 L95 20" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
          {/* Bottom-left */}
          <path d="M5 80 L5 95 L20 95" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
          {/* Bottom-right */}
          <path d="M80 95 L95 95 L95 80" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="1" />
          {/* Crosshair */}
          <line x1="50" y1="45" x2="50" y2="55" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" />
          <line x1="45" y1="50" x2="55" y2="50" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" />
        </svg>

        {/* Dot nodes around perimeter */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.8)]"
            style={{
              top: `${50 - 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
              left: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Center content area */}
        <div className="absolute inset-[20%] rounded-full overflow-hidden flex items-center justify-center bg-[#0a1628]/50">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Detection target"
              className="w-full h-full object-contain"
            />
          ) : (
            /* Drone Wireframe SVG */
            <svg className="w-[80%] h-[80%] opacity-70" viewBox="0 0 200 150">
              {/* Central body */}
              <ellipse
                cx="100"
                cy="75"
                rx="25"
                ry="15"
                fill="none"
                stroke="rgba(0,212,255,0.7)"
                strokeWidth="1.5"
              />
              <ellipse
                cx="100"
                cy="75"
                rx="15"
                ry="8"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />

              {/* Arms */}
              <line x1="80" y1="65" x2="45" y2="35" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" />
              <line x1="120" y1="65" x2="155" y2="35" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" />
              <line x1="80" y1="85" x2="45" y2="115" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" />
              <line x1="120" y1="85" x2="155" y2="115" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" />

              {/* Rotors */}
              <circle cx="45" cy="35" r="18" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
              <circle cx="155" cy="35" r="18" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
              <circle cx="45" cy="115" r="18" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
              <circle cx="155" cy="115" r="18" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />

              {/* Rotor blades (white highlights) */}
              <line x1="30" y1="35" x2="60" y2="35" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="45" y1="20" x2="45" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="140" y1="35" x2="170" y2="35" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="155" y1="20" x2="155" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="30" y1="115" x2="60" y2="115" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="45" y1="100" x2="45" y2="130" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="140" y1="115" x2="170" y2="115" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="155" y1="100" x2="155" y2="130" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

              {/* Landing gear */}
              <line x1="85" y1="85" x2="80" y2="100" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
              <line x1="115" y1="85" x2="120" y2="100" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
              <line x1="75" y1="100" x2="85" y2="100" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" />
              <line x1="115" y1="100" x2="125" y2="100" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" />

              {/* Camera/sensor */}
              <circle cx="100" cy="80" r="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            </svg>
          )}
        </div>

        {/* Number display */}
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 font-mono text-cyan-300 text-xl font-bold tracking-wider">
          129
        </div>

        {/* Upload hint on hover */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-full bg-cyan-500/10 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="font-mono text-cyan-300 text-sm">CLICK TO UPLOAD</span>
        </div>
      </label>

      {/* OK Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRunDetection();
        }}
        disabled={!imagePreview || isLoading}
        className={`mt-4 px-8 py-2 border-2 border-cyan-500/60 rounded font-mono text-cyan-400 text-lg tracking-widest transition-all ${
          imagePreview && !isLoading
            ? 'hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] cursor-pointer'
            : 'opacity-50 cursor-not-allowed'
        } ${isLoading ? 'animate-pulse' : ''}`}
      >
        {isLoading ? 'PROCESSING...' : 'RUN AGAIN'}
      </button>
    </div>
  );
}
