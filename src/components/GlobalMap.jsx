import React from 'react';
import { Crosshair, Map, Navigation, Layers } from 'lucide-react';

// Predefined neon glow pins matching screenshot placement
const DEFAULT_PINS = [
  { id: 'na', label: 'North America', x: 16, y: 23, lat: 37.7749, lng: -122.4194 },
  { id: 'sa', label: 'South America', x: 21, y: 38, lat: -14.2350, lng: -51.9253 },
  { id: 'eu', label: 'Europe', x: 29.5, y: 19.5, lat: 48.8566, lng: 2.3522 },
  { id: 'af', label: 'Africa', x: 29.8, y: 34, lat: 0.0236, lng: 37.9062 },
  { id: 'as', label: 'Asia', x: 39, y: 23.5, lat: 35.6762, lng: 139.6503 },
  { id: 'au', label: 'Australia', x: 42.7, y: 41.5, lat: -25.2744, lng: 133.7751 },
];

export default function GlobalMap({
  selectedLocation,
  onSelectCoordinates,
  onToggleInteractiveMap,
  activeImage
}) {
  // Handle click on the stylized map to set approximate coordinates
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Approximate mapping from 2D Mercator bounds
    const lng = (xRatio * 360) - 180;
    const lat = 90 - (yRatio * 180);

    onSelectCoordinates(parseFloat(lat.toFixed(4)), parseFloat(lng.toFixed(4)));
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] md:h-[390px] bg-[#0c1527] border border-[#1a294b] rounded-xl overflow-hidden shadow-xl flex flex-col justify-between select-none group">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0284c7] text-white text-xs font-semibold shadow-md shadow-sky-500/20">
          <Map className="w-3.5 h-3.5" />
          <span>Global Map</span>
        </div>

        <button
          onClick={onToggleInteractiveMap}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#132140]/90 hover:bg-[#1a2c54] border border-[#233863] text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm"
          title="Switch to interactive zoomable street/satellite map"
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>Interactive Map</span>
        </button>
      </div>

      {/* World Map SVG Canvas */}
      <div
        onClick={handleMapClick}
        className="w-full h-full relative cursor-crosshair flex items-center justify-center p-2 sm:p-4 overflow-hidden"
      >
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full max-h-full object-contain pointer-events-none opacity-85"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#112040" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0c1527" stopOpacity="0" />
            </radialGradient>
            <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Background subtle grid lines */}
          <line x1="50" y1="250" x2="950" y2="250" stroke="#162547" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="500" y1="40" x2="500" y2="460" stroke="#162547" strokeDasharray="4 4" strokeWidth="1" />

          {/* Simplified continents paths with dark stylized aesthetics */}
          {/* North America */}
          <path
            d="M 120,80 Q 150,70 190,75 Q 230,80 250,110 Q 230,135 220,160 Q 240,180 210,210 Q 185,225 170,250 Q 150,220 140,180 Q 110,165 95,130 Q 90,95 120,80 Z M 210,60 Q 240,55 250,70 Q 240,85 215,80 Z"
            fill="#1c2d52"
            stroke="#263d6e"
            strokeWidth="1.5"
          />
          {/* Central America & Caribbean */}
          <path
            d="M 175,255 Q 190,265 205,285 Q 215,290 225,300 Q 215,305 200,295 Q 185,275 175,255 Z"
            fill="#1c2d52"
            stroke="#263d6e"
            strokeWidth="1.5"
          />
          {/* South America */}
          <path
            d="M 215,295 Q 260,290 295,320 Q 305,360 280,410 Q 250,450 230,465 Q 220,440 225,390 Q 210,345 205,315 Z"
            fill="#1c2d52"
            stroke="#263d6e"
            strokeWidth="1.5"
          />
          {/* Europe */}
          <path
            d="M 450,90 Q 490,85 520,105 Q 540,120 525,145 Q 490,165 470,165 Q 445,150 440,125 Q 430,110 450,90 Z M 430,95 Q 445,95 440,110 Q 425,110 430,95 Z"
            fill="#1c2d52"
            stroke="#263d6e"
            strokeWidth="1.5"
          />
          {/* Africa */}
          <path
            d="M 450,175 Q 510,170 545,210 Q 560,260 540,320 Q 520,380 480,400 Q 450,370 445,300 Q 420,250 430,205 Z"
            fill="#1c2d52"
            stroke="#263d6e"
            strokeWidth="1.5"
          />
          {/* Asia */}
          <path
            d="M 530,90 Q 640,65 760,85 Q 850,120 830,175 Q 800,210 740,225 Q 710,260 670,270 Q 620,240 580,215 Q 550,160 530,90 Z"
            fill="#1c2d52"
            stroke="#263d6e"
            strokeWidth="1.5"
          />
          {/* South East Asia & Japan */}
          <path
            d="M 720,260 Q 750,255 770,285 Q 760,310 730,300 Z M 790,150 Q 810,140 820,165 Q 805,185 790,170 Z"
            fill="#1c2d52"
            stroke="#263d6e"
            strokeWidth="1.5"
          />
          {/* Australia */}
            <path
              d="M 750,335 Q 825,320 860,350 Q 865,395 830,425 Q 780,440 755,405 Q 740,365 750,335 Z"
              fill="#1c2d52"
              stroke="#263d6e"
              strokeWidth="1.5"
            />
        </svg>

        {/* Glowing Cyan Pins matching screenshot */}
        {DEFAULT_PINS.map((pin) => (
          <div
            key={pin.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectCoordinates(pin.lat, pin.lng);
            }}
            style={{
              left: `${pin.x * 2.1}%`,
              top: `${pin.y * 1.95}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-full cursor-pointer z-10 group/pin transform transition-transform hover:scale-125"
            title={`${pin.label} (${pin.lat}, ${pin.lng})`}
          >
            {/* Outer radar ping wave */}
            <div className="absolute inset-0 w-8 h-8 -left-1.5 -top-1.5 rounded-full bg-[#38bdf8]/40 animate-ping-slow pointer-events-none" />

            {/* Glowing teardrop pin */}
            <div className="relative flex flex-col items-center">
              <svg className="w-5 h-7 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.85)]" viewBox="0 0 24 32">
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z"
                  fill="url(#pinGrad)"
                />
                <circle cx="12" cy="11" r="4.5" fill="#ffffff" />
              </svg>
            </div>
          </div>
        ))}

        {/* Selected location marker if active and outside presets */}
        {selectedLocation && (
          <div
            style={{
              // Approximate placement on map
              left: `${((selectedLocation.lng + 180) / 360) * 100}%`,
              top: `${((90 - selectedLocation.lat) / 180) * 100}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-full cursor-pointer z-20 pointer-events-none"
          >
            <div className="w-10 h-10 -left-2 -top-2 absolute rounded-full bg-amber-400/30 animate-ping" />
            <div className="flex flex-col items-center">
              <svg className="w-6 h-8 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" viewBox="0 0 24 32">
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z"
                  fill="#f59e0b"
                />
                <circle cx="12" cy="11" r="4.5" fill="#ffffff" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Bottom-left overlay box matching screenshot */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-3.5 bg-[#0b1326]/85 backdrop-blur-md border border-[#1f3159] p-3 sm:p-3.5 rounded-xl shadow-lg max-w-[320px]">
          <div className="w-10 h-10 rounded-lg bg-[#142347] border border-[#233b6e] flex items-center justify-center flex-shrink-0 text-[#38bdf8]">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Add geotags to your photos
            </h4>
            <p className="text-xs text-[#8899b5] mt-0.5 leading-relaxed">
              Location data makes your images more meaningful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
